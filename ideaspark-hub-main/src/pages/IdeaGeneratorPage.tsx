import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, Users, AlertCircle, Wallet, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import { generateIdeasApi, acceptIdeaApi } from '@/api/ideasApi';
import { isDemoMode, mockGenerateIdeasApi, mockAcceptIdeaApi } from '@/api/mockApi';
import IdeaCard from '@/components/ideas/IdeaCard';
import LoadingSpinner from '@/components/common/LoadingSpinner';

const loadingMessages = [
  '🤔 Analyzing your profile...',
  '🔍 Scanning market opportunities...',
  '💡 Generating ideas...',
];

const budgetOptions = ['Under ₹5,000', '₹5,000 – ₹50,000', '₹50,000 – ₹5,00,000', 'No Budget Limit'];
const timeOptions = ['1–2 hrs/day', '4–6 hrs/day', 'Full-time'];

const IdeaGeneratorPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ skill: '', targetAudience: '', problem: '', budget: '', timeCommitment: '' });
  const [loading, setLoading] = useState(false);
  const [msgIndex, setMsgIndex] = useState(0);
  const [ideas, setIdeas] = useState<any[]>([]);
  const [ignoredIds, setIgnoredIds] = useState<Set<number>>(new Set());

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.skill || !form.targetAudience || !form.problem || !form.budget || !form.timeCommitment) {
      toast.error('Please fill in all fields');
      return;
    }
    setLoading(true);
    setIdeas([]);
    setIgnoredIds(new Set());
    const interval = setInterval(() => setMsgIndex(i => (i + 1) % loadingMessages.length), 2000);
    try {
      const res = isDemoMode() ? await mockGenerateIdeasApi() : await generateIdeasApi(form);
      setIdeas(res.data.ideas || []);
    } catch {
      toast.error('Generation failed. Please try again.');
    } finally {
      clearInterval(interval);
      setLoading(false);
      setMsgIndex(0);
    }
  };

  const handleAccept = async (idea: any) => {
    try {
      const payload = {
        title: idea.title,
        description: idea.description,
        targetAudience: idea.targetAudience,
        problem: idea.problem || form.problem,
        feasibilityScore: idea.feasibilityScore,
        marketPotential: idea.marketDemand || idea.marketPotential,
        competitionLevel: idea.competitionLevel,
      };
      const res = isDemoMode() ? await mockAcceptIdeaApi(payload) : await acceptIdeaApi(payload);
      toast.success('Idea saved! Taking you to roadmap builder...');
      setTimeout(() => navigate(`/roadmap-generator?ideaId=${res.data.idea?._id || res.data._id}&prefill=true`), 1500);
    } catch {
      toast.error('Failed to save idea. Try again.');
    }
  };

  return (
    <div className="fade-up max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="font-heading text-2xl md:text-3xl font-bold text-[#1E1B4B]">Idea Validation Lab 🧪</h1>
        <p className="text-[#6B7280] font-body text-sm mt-1">Tell us about yourself. Our AI will generate startup ideas built for you.</p>
        <div className="h-1 w-24 bg-gradient-to-r from-brand to-accent rounded-full mt-3" />
      </div>

      <div className="bg-card rounded-2xl p-6 md:p-8 shadow-card border border-[#EDE9FE] max-w-2xl mx-auto">
        <div className="flex items-center gap-2 mb-5">
          <h2 className="font-heading text-lg font-bold text-[#1E1B4B]">Answer 5 Questions</h2>
          <span className="text-xs bg-brand-subtle text-brand px-2 py-0.5 rounded-full font-semibold">AI-Powered</span>
        </div>

        <form onSubmit={handleGenerate} className="space-y-5">
          <div>
            <label className="flex items-center gap-1.5 font-body text-sm font-medium text-[#1E1B4B] mb-1"><Zap size={16} className="text-brand" /> Your Skill or Passion</label>
            <textarea rows={3} maxLength={200} value={form.skill} onChange={e => setForm({ ...form, skill: e.target.value })} placeholder="e.g. I love coding, design, teaching, cooking..." className="w-full border border-[#EDE9FE] rounded-lg px-4 py-3 focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand-subtle font-body text-sm resize-none" />
            <p className="text-right text-xs text-[#6B7280]">{form.skill.length}/200</p>
          </div>

          <div>
            <label className="flex items-center gap-1.5 font-body text-sm font-medium text-[#1E1B4B] mb-1"><Users size={16} className="text-brand" /> Who do you want to serve?</label>
            <input value={form.targetAudience} onChange={e => setForm({ ...form, targetAudience: e.target.value })} placeholder="e.g. Students, working professionals, small businesses..." className="w-full border border-[#EDE9FE] rounded-lg px-4 py-3 focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand-subtle font-body text-sm" />
          </div>

          <div>
            <label className="flex items-center gap-1.5 font-body text-sm font-medium text-[#1E1B4B] mb-1"><AlertCircle size={16} className="text-brand" /> What problem have you noticed?</label>
            <textarea rows={3} maxLength={300} value={form.problem} onChange={e => setForm({ ...form, problem: e.target.value })} placeholder="e.g. Students can't create professional resumes easily..." className="w-full border border-[#EDE9FE] rounded-lg px-4 py-3 focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand-subtle font-body text-sm resize-none" />
            <p className="text-right text-xs text-[#6B7280]">{form.problem.length}/300</p>
          </div>

          <div>
            <label className="flex items-center gap-1.5 font-body text-sm font-medium text-[#1E1B4B] mb-1"><Wallet size={16} className="text-brand" /> Available Budget</label>
            <select value={form.budget} onChange={e => setForm({ ...form, budget: e.target.value })} className="w-full border border-[#EDE9FE] rounded-lg px-4 py-3 focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand-subtle font-body text-sm bg-card appearance-none">
              <option value="">Select budget range</option>
              {budgetOptions.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>

          <div>
            <label className="flex items-center gap-1.5 font-body text-sm font-medium text-[#1E1B4B] mb-2"><Clock size={16} className="text-brand" /> Time you can commit daily</label>
            <div className="flex gap-2 flex-wrap">
              {timeOptions.map(t => (
                <button key={t} type="button" onClick={() => setForm({ ...form, timeCommitment: t })}
                  className={`px-4 py-2.5 rounded-lg text-sm font-body font-medium border transition-all ${form.timeCommitment === t ? 'bg-brand text-white border-brand shadow-button' : 'border-[#EDE9FE] text-[#6B7280] hover:border-brand'}`}>
                  {t}
                </button>
              ))}
            </div>
          </div>

          <button type="submit" disabled={loading}
            className="w-full h-14 bg-gradient-to-r from-brand to-accent text-white rounded-lg font-body font-semibold text-base hover:shadow-button transition-shadow flex items-center justify-center gap-2">
            {loading ? <LoadingSpinner size="sm" /> : 'Generate My Ideas ✨'}
          </button>
          {loading && (
            <p className="text-center text-sm text-[#6B7280] font-body animate-pulse">{loadingMessages[msgIndex]}</p>
          )}
        </form>
      </div>

      {ideas.length > 0 && (
        <div className="mt-10 fade-up">
          <div className="flex items-center gap-2 mb-5">
            <h2 className="font-heading text-xl font-bold text-[#1E1B4B]">Here are your startup ideas 💡</h2>
            <span className="text-xs bg-accent-subtle text-accent px-2 py-0.5 rounded-full font-semibold">Powered by Claude AI</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {ideas.map((idea, i) => (
              <IdeaCard key={i} idea={idea} isIgnored={ignoredIds.has(i)}
                onIgnore={() => setIgnoredIds(s => new Set(s).add(i))}
                onAccept={() => handleAccept(idea)} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default IdeaGeneratorPage;
