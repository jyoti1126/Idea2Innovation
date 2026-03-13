import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronUp, Trash2 } from 'lucide-react';
import { RadialBarChart, RadialBar, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { getActivityApi } from '@/api/dashboardApi';
import { isDemoMode, mockGetActivityApi } from '@/api/mockApi';
import { getLast7Days } from '@/utils/helpers';
import LoadingSpinner from '@/components/common/LoadingSpinner';

interface Props {
  idea: any;
  index: number;
  onDelete: (id: string) => void;
}

const IdeaAccordionCard = ({ idea, index, onDelete }: Props) => {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);
  const [activity, setActivity] = useState<any[] | null>(null);
  const [loadingActivity, setLoadingActivity] = useState(false);

  const progress = idea.progress || 0;
  const progressColor = progress > 70 ? '#059669' : progress > 30 ? '#D97706' : '#DC2626';

  const handleExpand = async () => {
    const willExpand = !expanded;
    setExpanded(willExpand);
    if (willExpand && !activity) {
      setLoadingActivity(true);
      try {
        const res = isDemoMode() ? await mockGetActivityApi() : await getActivityApi(idea._id);
        const last7 = getLast7Days();
        const activityMap = new Map((res.data?.activity || []).map((a: any) => [a.date, a.count]));
        setActivity(last7.map(d => ({ label: d.label, count: (activityMap.get(d.date) as number) || 0 })));
      } catch {
        setActivity(getLast7Days().map(d => ({ label: d.label, count: 0 })));
      } finally {
        setLoadingActivity(false);
      }
    }
  };

  const radialData = [{ value: progress, fill: '#4F46E5' }];

  return (
    <div className="bg-card rounded-xl shadow-card border border-[#EDE9FE] overflow-hidden">
      <button onClick={handleExpand} className="w-full flex items-center gap-3 p-4 hover:bg-surface transition-colors text-left">
        <span className="bg-brand text-white text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap">Idea {index}</span>
        <span className="flex-1 font-body font-medium text-[#1E1B4B] truncate">{idea.title}</span>
        <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: progressColor + '20', color: progressColor }}>
          {progress}% done
        </span>
        {expanded ? <ChevronUp size={18} className="text-[#6B7280]" /> : <ChevronDown size={18} className="text-[#6B7280]" />}
      </button>

      <div className="overflow-hidden transition-all duration-300 ease-in-out" style={{ maxHeight: expanded ? '600px' : '0' }}>
        <div className="p-4 pt-0 border-t border-[#EDE9FE]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
            {/* Radial chart */}
            <div className="flex flex-col items-center">
              <div className="relative" style={{ width: 200, height: 200 }}>
                <ResponsiveContainer>
                  <RadialBarChart cx="50%" cy="50%" innerRadius="70%" outerRadius="90%" startAngle={90} endAngle={-270} data={radialData} barSize={12}>
                    <RadialBar background={{ fill: '#EDE9FE' }} dataKey="value" cornerRadius={6} />
                  </RadialBarChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="font-heading text-3xl font-bold text-brand">{progress}%</span>
                  <span className="text-xs text-[#6B7280] font-body">Complete</span>
                </div>
              </div>
              <p className="text-sm text-[#6B7280] font-body mt-1">Execution Progress</p>
            </div>

            {/* Activity chart */}
            <div>
              <p className="text-sm font-semibold text-[#1E1B4B] font-body mb-2">Last 7 Days Activity</p>
              {loadingActivity ? (
                <div className="flex items-center justify-center h-[180px]"><LoadingSpinner size="sm" /></div>
              ) : activity ? (
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={activity}>
                    <XAxis dataKey="label" tick={{ fontSize: 12, fill: '#6B7280' }} axisLine={false} tickLine={false} />
                    <YAxis hide />
                    <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #EDE9FE', fontSize: 12 }} />
                    <Bar dataKey="count" fill="#7C3AED" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : null}
            </div>
          </div>

          <div className="flex items-center gap-3 mt-2">
            <button onClick={() => navigate(`/roadmap-generator?ideaId=${idea._id}`)} className="border border-brand text-brand rounded-lg px-4 py-2 text-sm font-body font-medium hover:bg-brand-subtle transition-colors">
              View Roadmap →
            </button>
            <button onClick={() => onDelete(idea._id)} className="border border-danger text-danger rounded-lg px-4 py-2 text-sm font-body font-medium hover:bg-red-50 transition-colors flex items-center gap-1">
              <Trash2 size={14} /> Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IdeaAccordionCard;
