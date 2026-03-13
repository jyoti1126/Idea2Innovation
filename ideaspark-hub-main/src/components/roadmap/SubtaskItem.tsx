import { useState } from 'react';
import { StickyNote } from 'lucide-react';
import { formatDate } from '@/utils/helpers';
import ConfirmModal from '@/components/common/ConfirmModal';
import StickyNotePanel from './StickyNotePanel';

interface Props {
  subtask: any;
  roadmapId: string;
  moduleColor: string;
  onComplete: (roadmapId: string, subtaskId: string, isCompleted: boolean) => Promise<void>;
  onNoteSave: (roadmapId: string, subtaskId: string, note: string) => Promise<void>;
}

const SubtaskItem = ({ subtask, roadmapId, moduleColor, onComplete, onNoteSave }: Props) => {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [noteOpen, setNoteOpen] = useState(false);
  const [completing, setCompleting] = useState(false);

  const handleConfirm = async () => {
    setCompleting(true);
    await onComplete(roadmapId, subtask._id || subtask.subtaskId, true);
    setCompleting(false);
    setConfirmOpen(false);
  };

  return (
    <>
      <div className={`flex items-start gap-3 p-3 rounded-lg ${subtask.isCompleted ? 'shimmer-complete' : 'hover:bg-surface'}`}>
        {/* Checkbox */}
        <button
          onClick={() => !subtask.isCompleted && setConfirmOpen(true)}
          className="w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors"
          style={{ borderColor: moduleColor, background: subtask.isCompleted ? moduleColor : 'white' }}
        >
          {subtask.isCompleted && (
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6L5 9L10 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          )}
        </button>

        <div className="flex-1 min-w-0">
          <p className={`text-sm font-body font-medium text-[#1E1B4B] ${subtask.isCompleted ? 'line-through opacity-70' : ''}`}>{subtask.title}</p>
          {subtask.description && <p className="text-xs text-[#6B7280] font-body mt-0.5">{subtask.description}</p>}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button onClick={() => setNoteOpen(true)} className="text-[#6B7280] hover:text-brand transition-colors">
            <StickyNote size={16} />
          </button>
          {subtask.isCompleted && subtask.completedAt && (
            <span className="text-[11px] text-[#6B7280] font-body">Done {formatDate(subtask.completedAt)}</span>
          )}
        </div>
      </div>

      <ConfirmModal isOpen={confirmOpen} onClose={() => setConfirmOpen(false)} onConfirm={handleConfirm} isLoading={completing}
        title="Mark as Complete" message={`Have you completed "${subtask.title}"?`} />

      {noteOpen && (
        <StickyNotePanel subtask={subtask} roadmapId={roadmapId} onSave={onNoteSave} onClose={() => setNoteOpen(false)} />
      )}
    </>
  );
};

export default SubtaskItem;
