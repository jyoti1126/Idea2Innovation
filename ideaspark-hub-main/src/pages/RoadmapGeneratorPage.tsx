import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { generateRoadmapApi, getRoadmapApi, completeSubtaskApi, saveSubtaskNoteApi } from '@/api/roadmapApi';
import { getMyIdeasApi } from '@/api/ideasApi';
import { isDemoMode, mockGenerateRoadmapApi, mockGetRoadmapApi, mockCompleteSubtaskApi, mockSaveSubtaskNoteApi, mockGetMyIdeasApi } from '@/api/mockApi';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import RoadmapView from '@/components/roadmap/RoadmapView';

const genMessages = [
  '🧠 Analyzing your idea...',
  '📊 Evaluating market potential...',
  '🗺️ Designing your roadmap...',
  '⚡ Generating milestones...',
  '✨ Almost done...',
];

const RoadmapGeneratorPage = () => {
  const [searchParams] = useSearchParams();
  const ideaId = searchParams.get('ideaId');

  const [state, setState] = useState<'A' | 'B' | 'C'>('A');
  const [roadmap, setRoadmap] = useState<any>(null);
  const [idea, setIdea] = useState<any>(null);
  const [form, setForm] = useState({ ideaTitle: '', targetAudience: '', problem: '', description: '' });
  const [generating, setGenerating] = useState(false);
  const [genMsg, setGenMsg] = useState(0);
  const [loading, setLoading] = useState(!!ideaId);

  useEffect(() => {
    if (!ideaId) { setState('A'); return; }
    (async () => {
      try {
        const res = isDemoMode() ? await mockGetRoadmapApi() : await getRoadmapApi(ideaId);
        setRoadmap(res.data);
        setState('C');
      } catch {
        // No roadmap, try to get idea details
        try {
          const ideasRes = isDemoMode() ? await mockGetMyIdeasApi() : await getMyIdeasApi();
          const found = (ideasRes.data.ideas || ideasRes.data || []).find((i: any) => i._id === ideaId);
          if (found) {
            setIdea(found);
            setForm({ ideaTitle: found.title, targetAudience: found.targetAudience || '', problem: found.problem || '', description: found.description || '' });
            setState('B');
          } else { setState('A'); }
        } catch { setState('A'); }
      } finally { setLoading(false); }
    })();
  }, [ideaId]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.ideaTitle || !form.description) { toast.error('Please fill required fields'); return; }
    setGenerating(true);
    const interval = setInterval(() => setGenMsg(i => (i + 1) % genMessages.length), 3000);
    try {
      const res = isDemoMode() ? await mockGenerateRoadmapApi() : await generateRoadmapApi({ ideaId: ideaId || undefined, ideaTitle: form.ideaTitle, targetAudience: form.targetAudience, problem: form.problem, description: form.description });
      setRoadmap(res.data.roadmap || res.data);
      setState('C');
    } catch { toast.error('Generation failed. Please try again.'); } finally {
      clearInterval(interval);
      setGenerating(false);
      setGenMsg(0);
    }
  };

  const handleSubtaskComplete = useCallback(async (roadmapId: string, subtaskId: string, isCompleted: boolean) => {
    try {
      isDemoMode() ? await mockCompleteSubtaskApi() : await completeSubtaskApi(roadmapId, subtaskId, isCompleted);
      const res = isDemoMode() ? await mockGetRoadmapApi() : await getRoadmapApi(ideaId || roadmapId);
      setRoadmap(res.data);
    } catch { toast.error('Failed to update subtask'); }
  }, [ideaId]);

  const handleNoteSave = useCallback(async (roadmapId: string, subtaskId: string, note: string) => {
    try {
      isDemoMode() ? await mockSaveSubtaskNoteApi() : await saveSubtaskNoteApi(roadmapId, subtaskId, note);
    } catch { toast.error('Failed to save note'); }
  }, []);

  if (loading) return <div className="flex items-center justify-center h-64"><LoadingSpinner /></div>;

  // Generating overlay
  if (generating) {
    return (
      <div className="fixed inset-0 z-50 bg-surface/90 backdrop-blur-sm flex items-center justify-center">
        <div className="bg-card rounded-2xl p-8 shadow-cardHover text-center max-w-sm">
          <LoadingSpinner size="lg" />
          <p className="font-body text-sm text-[#6B7280] mt-4 animate-pulse">{genMessages[genMsg]}</p>
        </div>
      </div>
    );
  }

  if (state === 'C' && roadmap) {
    return <RoadmapView roadmap={roadmap} onSubtaskComplete={handleSubtaskComplete} onNoteSave={handleNoteSave} />;
  }

  // State A or B
  return (
    <div className="fade-up max-w-2xl mx-auto">
      {/* Rocket illustration */}
      <div className="flex flex-col items-center mb-8 text-center">
        <svg width="120" height="120" viewBox="0 0 120 120" className="mb-4">
          <ellipse cx="60" cy="65" rx="18" ry="35" fill="#4F46E5" />
          <polygon points="60,15 48,50 72,50" fill="#7C3AED" />
          <polygon points="38,70 28,90 48,75" fill="#818CF8" />
          <polygon points="82,70 92,90 72,75" fill="#818CF8" />
          <ellipse cx="60" cy="100" rx="10" ry="6" fill="#F59E0B" opacity="0.8" />
          <ellipse cx="60" cy="104" rx="6" ry="4" fill="#EF4444" opacity="0.6" />
        </svg>
        <h1 className="font-heading text-2xl font-bold text-[#1E1B4B]">Build Your Execution Roadmap</h1>
        <p className="text-[#6B7280] font-body text-sm mt-2 max-w-md">
          Enter your startup idea and we'll generate a complete step-by-step roadmap to take it from idea to launch.
        </p>
      </div>

      {state === 'B' && idea && (
        <div className="bg-blue-50 rounded-xl p-3 mb-4 flex items-center gap-2 text-sm font-body text-blue-700">
          <span>ℹ️</span> Generating roadmap for: <strong>{idea.title}</strong>
        </div>
      )}

      <div className="bg-card rounded-2xl p-6 md:p-8 shadow-card border border-[#EDE9FE]">
        <form onSubmit={handleGenerate} className="space-y-4">
          <div>
            <label className="block font-body text-sm font-medium text-[#1E1B4B] mb-1">Startup Idea</label>
            <textarea rows={4} value={form.description || form.ideaTitle} onChange={e => setForm({ ...form, description: e.target.value, ideaTitle: e.target.value.slice(0, 80) })} placeholder="Describe your startup idea..." className="w-full border border-[#EDE9FE] rounded-lg px-4 py-3 focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand-subtle font-body text-sm resize-none" />
          </div>
          <div>
            <label className="block font-body text-sm font-medium text-[#1E1B4B] mb-1">Target Audience</label>
            <input value={form.targetAudience} onChange={e => setForm({ ...form, targetAudience: e.target.value })} placeholder="Who is this for?" className="w-full border border-[#EDE9FE] rounded-lg px-4 py-3 focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand-subtle font-body text-sm" />
          </div>
          <div>
            <label className="block font-body text-sm font-medium text-[#1E1B4B] mb-1">Core Problem</label>
            <input value={form.problem} onChange={e => setForm({ ...form, problem: e.target.value })} placeholder="What problem does it solve?" className="w-full border border-[#EDE9FE] rounded-lg px-4 py-3 focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand-subtle font-body text-sm" />
          </div>
          <button type="submit" className="w-full h-14 bg-gradient-to-r from-brand to-accent text-white rounded-lg font-body font-semibold hover:shadow-button transition-shadow">
            Generate Roadmap 🗺️
          </button>
        </form>
      </div>
    </div>
  );
};

export default RoadmapGeneratorPage;
