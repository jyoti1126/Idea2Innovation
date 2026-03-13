import { useState } from 'react';
import ModuleNode from './ModuleNode';

interface Props {
  roadmap: any;
  onSubtaskComplete: (roadmapId: string, subtaskId: string, isCompleted: boolean) => Promise<void>;
  onNoteSave: (roadmapId: string, subtaskId: string, note: string) => Promise<void>;
}

const RoadmapView = ({ roadmap, onSubtaskComplete, onNoteSave }: Props) => {
  const [expandedModule, setExpandedModule] = useState<number>(0);

  const modules = roadmap.modules || [];
  const totalSubtasks = modules.reduce((s: number, m: any) => s + (m.subtasks?.length || 0), 0);
  const completedSubtasks = modules.reduce((s: number, m: any) => s + (m.subtasks?.filter((st: any) => st.isCompleted).length || 0), 0);
  const progress = totalSubtasks > 0 ? Math.round((completedSubtasks / totalSubtasks) * 100) : 0;

  return (
    <div className="fade-up max-w-4xl mx-auto">
      <p className="text-sm text-[#6B7280] font-body mb-1">Roadmap Generator &gt; <span className="text-brand font-semibold">{roadmap.ideaTitle}</span></p>
      <h1 className="font-heading text-2xl font-bold text-[#1E1B4B] mb-4">Execution Roadmap</h1>

      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-body font-medium text-[#1E1B4B]">Overall Progress: {progress}%</span>
          <span className="text-xs text-[#6B7280] font-body">{completedSubtasks} of {totalSubtasks} tasks completed</span>
        </div>
        <div className="w-full h-2.5 bg-[#EDE9FE] rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-brand to-accent rounded-full transition-all duration-600" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Timeline */}
      <div className="relative pl-7">
        <div className="absolute left-[27px] top-0 bottom-0 w-[3px] bg-[#EDE9FE] rounded-full" />
        {modules.map((mod: any, i: number) => (
          <ModuleNode
            key={mod._id || i}
            module={mod}
            moduleIndex={i}
            roadmapId={roadmap._id}
            onSubtaskComplete={onSubtaskComplete}
            onNoteSave={onNoteSave}
            isExpanded={expandedModule === i}
            onToggle={() => setExpandedModule(expandedModule === i ? -1 : i)}
          />
        ))}
      </div>
    </div>
  );
};

export default RoadmapView;
