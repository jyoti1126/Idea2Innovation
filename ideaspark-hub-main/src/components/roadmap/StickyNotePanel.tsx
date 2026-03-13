import { useState, useRef, useCallback } from 'react';
import { StickyNote, ChevronDown, X } from 'lucide-react';

interface Props {
  subtask: any;
  roadmapId: string;
  onSave: (roadmapId: string, subtaskId: string, note: string) => Promise<void>;
  onClose: () => void;
}

const StickyNotePanel = ({ subtask, roadmapId, onSave, onClose }: Props) => {
  const [note, setNote] = useState(subtask.note || '');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  const handleChange = useCallback((val: string) => {
    setNote(val);
    setSaveStatus('idle');
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(async () => {
      setSaveStatus('saving');
      await onSave(roadmapId, subtask._id || subtask.subtaskId, val);
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }, 1500);
  }, [roadmapId, subtask, onSave]);

  return (
    <div className="fixed bottom-0 right-0 z-50 slide-in-right" style={{ width: 340, maxHeight: '70vh', background: '#FEFCE8', borderTop: '2px solid #FCD34D', borderLeft: '2px solid #FCD34D', borderTopLeftRadius: 16 }}>
      <div className="flex items-center justify-between px-4 py-3 bg-[#FEF9C3] border-b border-[#FCD34D]">
        <div className="flex items-center gap-2 min-w-0">
          <StickyNote size={16} className="text-amber-600 shrink-0" />
          <span className="font-body font-semibold text-sm text-[#1E1B4B]">Notes</span>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={onClose} className="text-[#6B7280] hover:text-[#1E1B4B]"><ChevronDown size={16} /></button>
          <button onClick={onClose} className="text-[#6B7280] hover:text-[#1E1B4B]"><X size={16} /></button>
        </div>
      </div>
      <p className="px-4 pt-2 text-xs text-[#6B7280] font-body truncate">{subtask.title}</p>
      <textarea
        value={note}
        onChange={e => handleChange(e.target.value)}
        placeholder="Write your learnings, next steps, observations..."
        className="w-full min-h-[200px] bg-transparent px-4 py-3 font-body text-sm text-[#1E1B4B] resize-none focus:outline-none"
      />
      <div className="px-4 pb-3">
        {saveStatus === 'saving' && <span className="text-xs text-amber-600 font-body">Saving...</span>}
        {saveStatus === 'saved' && <span className="text-xs text-success font-body">✓ Saved</span>}
      </div>
    </div>
  );
};

export default StickyNotePanel;
