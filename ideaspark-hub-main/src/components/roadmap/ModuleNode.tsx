import { CheckCircle, ChevronDown, ChevronUp } from 'lucide-react';
import SubtaskItem from './SubtaskItem';

const moduleColors = ['#4F46E5', '#7C3AED', '#059669', '#D97706', '#DC2626', '#0891B2', '#7C3AED'];

interface Props {
  module: any;
  moduleIndex: number;
  roadmapId: string;
  onSubtaskComplete: (roadmapId: string, subtaskId: string, isCompleted: boolean) => Promise<void>;
  onNoteSave: (roadmapId: string, subtaskId: string, note: string) => Promise<void>;
  isExpanded: boolean;
  onToggle: () => void;
}

const ModuleNode = ({ module, moduleIndex, roadmapId, onSubtaskComplete, onNoteSave, isExpanded, onToggle }: Props) => {
  const color = module.moduleColor || moduleColors[moduleIndex % moduleColors.length];
  const subtasks = module.subtasks || [];
  const completed = subtasks.filter((s: any) => s.isCompleted).length;
  const allDone = subtasks.length > 0 && completed === subtasks.length;

  return (
    <div className="flex gap-4 mb-6 relative">
      {/* Circle */}
      <div className="w-14 h-14 rounded-full flex items-center justify-center text-white font-heading font-bold text-lg shrink-0 z-10"
        style={{ background: color, boxShadow: `0 4px 12px ${color}40` }}>
        {allDone ? <CheckCircle size={24} /> : moduleIndex + 1}
      </div>

      {/* Card */}
      <div className="flex-1 bg-card rounded-xl shadow-card border border-[#EDE9FE] overflow-hidden">
        <button onClick={onToggle} className="w-full flex items-center gap-3 p-4 hover:bg-surface transition-colors text-left">
          {allDone && <div className="w-1 h-full absolute left-0 top-0 bg-success rounded-r" />}
          <span className="flex-1 font-heading text-base font-bold text-[#1E1B4B]">{module.title}</span>
          <span className="text-xs bg-surface text-[#6B7280] px-2 py-0.5 rounded-full">{completed}/{subtasks.length} tasks</span>
          {allDone && <span className="text-xs text-success font-semibold">✅ Completed</span>}
          {isExpanded ? <ChevronUp size={18} className="text-[#6B7280]" /> : <ChevronDown size={18} className="text-[#6B7280]" />}
        </button>

        <div className="overflow-hidden transition-all duration-400 ease-in-out" style={{ maxHeight: isExpanded ? '2000px' : '0' }}>
          <div className="p-4 pt-0 space-y-2">
            {subtasks.map((st: any) => (
              <SubtaskItem key={st._id || st.subtaskId} subtask={st} roadmapId={roadmapId} moduleColor={color} onComplete={onSubtaskComplete} onNoteSave={onNoteSave} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModuleNode;
