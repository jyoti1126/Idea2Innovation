import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lightbulb, Rocket } from 'lucide-react';
import { getDashboardApi } from '@/api/dashboardApi';
import { deleteIdeaApi } from '@/api/ideasApi';
import { isDemoMode, mockGetDashboardApi, mockDeleteIdeaApi } from '@/api/mockApi';
import SkeletonCard from '@/components/common/SkeletonCard';
import EmptyState from '@/components/common/EmptyState';
import IdeaAccordionCard from '@/components/dashboard/IdeaAccordionCard';
import toast from 'react-hot-toast';

const DashboardPage = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      let res;
      if (isDemoMode()) {
        res = await mockGetDashboardApi();
      } else {
        try {
          res = await getDashboardApi();
        } catch (backendErr: any) {
          if (!backendErr.response) {
            // Backend unreachable — switch to demo mode
            localStorage.setItem('demoMode', 'true');
            res = await mockGetDashboardApi();
          } else {
            throw backendErr;
          }
        }
      }
      setData(res.data);
    } catch {
      toast.error('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDashboard(); }, []);

  const handleDelete = async (id: string) => {
    try {
      isDemoMode() ? await mockDeleteIdeaApi() : await deleteIdeaApi(id);
      toast.success('Idea deleted');
      fetchDashboard();
    } catch {
      toast.error('Failed to delete idea');
    }
  };

  if (loading) {
    return (
      <div className="fade-up space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SkeletonCard lines={2} /><SkeletonCard lines={2} />
        </div>
        <div className="space-y-4">
          <SkeletonCard lines={3} /><SkeletonCard lines={3} /><SkeletonCard lines={3} />
        </div>
      </div>
    );
  }

  const ideas = data?.ideas || [];
  const totalIdeas = data?.totalIdeas || 0;
  const activeRoadmaps = data?.activeRoadmaps || 0;

  return (
    <div className="fade-up space-y-6 max-w-5xl">
      <h1 className="font-heading text-2xl font-bold text-[#1E1B4B]">My Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-card rounded-xl p-5 shadow-card border border-[#EDE9FE] flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-brand-subtle flex items-center justify-center">
            <Lightbulb size={24} className="text-brand" />
          </div>
          <div>
            <p className="font-heading text-3xl font-bold text-brand">{totalIdeas}</p>
            <p className="text-sm text-[#6B7280] font-body">Total Ideas Saved</p>
          </div>
        </div>
        <div className="bg-card rounded-xl p-5 shadow-card border border-[#EDE9FE] flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-accent-subtle flex items-center justify-center">
            <Rocket size={24} className="text-accent" />
          </div>
          <div>
            <p className="font-heading text-3xl font-bold text-accent">{activeRoadmaps}</p>
            <p className="text-sm text-[#6B7280] font-body">Active Roadmaps</p>
          </div>
        </div>
      </div>

      {/* Welcome banner */}
      {ideas.length === 0 && (
        <div className="bg-gradient-to-r from-brand-subtle to-accent-subtle rounded-2xl p-6 border border-[#EDE9FE]">
          <p className="font-heading text-lg font-bold text-[#1E1B4B] mb-2">Welcome to Idea2Execution! 🎉</p>
          <p className="text-[#6B7280] font-body text-sm mb-4">Start by generating your first idea.</p>
          <button onClick={() => navigate('/idea-generator')} className="bg-gradient-to-r from-brand to-accent text-white rounded-lg px-5 py-2.5 font-body font-semibold hover:shadow-button transition-shadow">
            Go to Idea Generator
          </button>
        </div>
      )}

      {/* Ideas */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <h2 className="font-heading text-xl font-bold text-[#1E1B4B]">Your Ideas</h2>
          {ideas.length > 0 && (
            <span className="bg-brand-subtle text-brand text-xs font-semibold px-2 py-0.5 rounded-full">{ideas.length}</span>
          )}
        </div>

        {ideas.length === 0 ? (
          <EmptyState
            icon={Lightbulb}
            title="No ideas yet"
            description="Generate your first startup idea to get started"
            actionLabel="Generate Ideas"
            onAction={() => navigate('/idea-generator')}
          />
        ) : (
          <div className="space-y-3">
            {ideas.map((idea: any, i: number) => (
              <IdeaAccordionCard key={idea._id} idea={idea} index={i + 1} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
