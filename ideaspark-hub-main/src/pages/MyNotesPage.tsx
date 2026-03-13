import { useState, useEffect, useRef, useCallback } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import { Bold, Italic, Underline as UnderlineIcon, Strikethrough, List, ListOrdered, AlignLeft, AlignCenter, AlignRight, Eraser, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import { getNotesApi, updateNoteApi, addSectionApi } from '@/api/notesApi';
import { isDemoMode, mockGetNotesApi, mockUpdateNoteApi, mockAddSectionApi } from '@/api/mockApi';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import EmptyState from '@/components/common/EmptyState';
import { NotebookPen } from 'lucide-react';

const defaultSections = [
  { icon: '💡', label: 'Idea' },
  { icon: '👥', label: 'Customer Aspect' },
  { icon: '📊', label: 'Market Research' },
  { icon: '🔨', label: 'Product Building' },
  { icon: '📣', label: 'Marketing' },
  { icon: '🚀', label: 'Launching' },
];

const MyNotesPage = () => {
  const [sections, setSections] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [addingSection, setAddingSection] = useState(false);
  const [newSectionTitle, setNewSectionTitle] = useState('');
  const saveTimer = useRef<ReturnType<typeof setTimeout>>();

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
    ],
    content: '',
    onUpdate: ({ editor: ed }) => {
      if (!selectedId) return;
      setSaveStatus('idle');
      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(async () => {
        setSaveStatus('saving');
        try {
          isDemoMode() ? await mockUpdateNoteApi() : await updateNoteApi(selectedId, ed.getHTML());
          setSaveStatus('saved');
          setTimeout(() => setSaveStatus('idle'), 2000);
        } catch { toast.error('Failed to save'); setSaveStatus('idle'); }
      }, 2000);
    },
  });

  useEffect(() => {
    (async () => {
      try {
        const res = isDemoMode() ? await mockGetNotesApi() : await getNotesApi();
        setSections(res.data.sections || res.data || []);
      } catch { /* empty sections */ } finally { setLoading(false); }
    })();
  }, []);

  const selectSection = useCallback((section: any) => {
    setSelectedId(section._id);
    editor?.commands.setContent(section.content || '');
  }, [editor]);

  const handleAddSection = async () => {
    if (!newSectionTitle.trim()) return;
    try {
      const res = isDemoMode() ? await mockAddSectionApi(newSectionTitle.trim()) : await addSectionApi(newSectionTitle.trim());
      setSections(prev => [...prev, res.data.section || res.data]);
      setNewSectionTitle('');
      setAddingSection(false);
    } catch { toast.error('Failed to add section'); }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><LoadingSpinner /></div>;

  const ToolbarBtn = ({ active, onClick, children, title }: { active?: boolean; onClick: () => void; children: React.ReactNode; title: string }) => (
    <button title={title} onClick={onClick}
      className={`w-8 h-8 rounded flex items-center justify-center transition-colors ${active ? 'bg-brand-subtle text-brand' : 'text-[#6B7280] hover:bg-surface'}`}>
      {children}
    </button>
  );

  const displaySections = sections.length > 0 ? sections : defaultSections.map((s, i) => ({ _id: `default-${i}`, title: `${s.icon} ${s.label}`, content: '' }));

  return (
    <div className="fade-up flex h-[calc(100vh-100px)] gap-0 rounded-xl overflow-hidden shadow-card border border-[#EDE9FE]">
      {/* Left Panel */}
      <div className="w-64 bg-card border-r border-[#EDE9FE] flex flex-col shrink-0">
        <div className="p-4 border-b border-[#EDE9FE]">
          <h2 className="font-heading text-base font-bold text-[#1E1B4B]">My Notes 📝</h2>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {displaySections.map((s: any) => (
            <button key={s._id} onClick={() => selectSection(s)}
              className={`w-full text-left rounded-lg p-3 text-sm font-body transition-colors ${selectedId === s._id ? 'bg-brand-subtle text-brand font-semibold border-l-4 border-brand pl-2' : 'text-[#6B7280] hover:bg-surface'}`}>
              {s.title || s.sectionTitle}
              {s.content && <span className="ml-1 text-[10px] text-success">Saved ✓</span>}
            </button>
          ))}
        </div>
        <div className="p-2 border-t border-[#EDE9FE]">
          {addingSection ? (
            <div className="flex gap-1">
              <input value={newSectionTitle} onChange={e => setNewSectionTitle(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAddSection()} placeholder="Section title..." className="flex-1 text-sm border border-[#EDE9FE] rounded-lg px-2 py-1.5 font-body focus:outline-none focus:border-brand" autoFocus />
              <button onClick={handleAddSection} className="text-brand text-sm font-semibold px-2">Add</button>
            </div>
          ) : (
            <button onClick={() => setAddingSection(true)} className="w-full border border-dashed border-[#EDE9FE] text-[#6B7280] rounded-lg py-2 text-sm font-body hover:border-brand hover:text-brand transition-colors flex items-center justify-center gap-1">
              <Plus size={14} /> Add Section
            </button>
          )}
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex flex-col bg-surface">
        {!selectedId ? (
          <div className="flex-1 flex items-center justify-center">
            <EmptyState icon={NotebookPen} title="Select a section" description="Choose a section from the left panel to start writing" />
          </div>
        ) : (
          <>
            {/* Toolbar */}
            <div className="bg-card border-b border-[#EDE9FE] p-2 flex items-center gap-1 flex-wrap sticky top-0 z-10">
              <ToolbarBtn title="Bold" active={editor?.isActive('bold')} onClick={() => editor?.chain().focus().toggleBold().run()}><Bold size={16} /></ToolbarBtn>
              <ToolbarBtn title="Italic" active={editor?.isActive('italic')} onClick={() => editor?.chain().focus().toggleItalic().run()}><Italic size={16} /></ToolbarBtn>
              <ToolbarBtn title="Underline" active={editor?.isActive('underline')} onClick={() => editor?.chain().focus().toggleUnderline().run()}><UnderlineIcon size={16} /></ToolbarBtn>
              <ToolbarBtn title="Strikethrough" active={editor?.isActive('strike')} onClick={() => editor?.chain().focus().toggleStrike().run()}><Strikethrough size={16} /></ToolbarBtn>
              <div className="w-px h-6 bg-[#EDE9FE] mx-1" />
              <ToolbarBtn title="Bullet List" active={editor?.isActive('bulletList')} onClick={() => editor?.chain().focus().toggleBulletList().run()}><List size={16} /></ToolbarBtn>
              <ToolbarBtn title="Numbered List" active={editor?.isActive('orderedList')} onClick={() => editor?.chain().focus().toggleOrderedList().run()}><ListOrdered size={16} /></ToolbarBtn>
              <div className="w-px h-6 bg-[#EDE9FE] mx-1" />
              <ToolbarBtn title="Align Left" active={editor?.isActive({ textAlign: 'left' })} onClick={() => editor?.chain().focus().setTextAlign('left').run()}><AlignLeft size={16} /></ToolbarBtn>
              <ToolbarBtn title="Align Center" active={editor?.isActive({ textAlign: 'center' })} onClick={() => editor?.chain().focus().setTextAlign('center').run()}><AlignCenter size={16} /></ToolbarBtn>
              <ToolbarBtn title="Align Right" active={editor?.isActive({ textAlign: 'right' })} onClick={() => editor?.chain().focus().setTextAlign('right').run()}><AlignRight size={16} /></ToolbarBtn>
              <div className="w-px h-6 bg-[#EDE9FE] mx-1" />
              <ToolbarBtn title="Clear Formatting" onClick={() => editor?.chain().focus().clearNodes().unsetAllMarks().run()}><Eraser size={16} /></ToolbarBtn>

              <div className="ml-auto text-xs font-body">
                {saveStatus === 'saving' && <span className="text-warning">● Saving...</span>}
                {saveStatus === 'saved' && <span className="text-success">✓ Saved</span>}
              </div>
            </div>

            {/* Editor */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="bg-card rounded-xl shadow-card border border-[#EDE9FE] p-6 min-h-[500px]">
                <EditorContent editor={editor} className="prose prose-sm max-w-none font-body focus:outline-none [&_.ProseMirror]:outline-none [&_.ProseMirror]:min-h-[400px]" />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MyNotesPage;
