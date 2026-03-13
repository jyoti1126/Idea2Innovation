import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, PlayCircle, BookOpen, Upload, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { getCoursesApi, getBooksApi, addCourseApi, addBookApi } from '@/api/learningApi';
import { isDemoMode, mockGetCoursesApi, mockGetBooksApi } from '@/api/mockApi';
import SkeletonCard from '@/components/common/SkeletonCard';
import AdminPasswordModal from '@/components/common/AdminPasswordModal';

const LearningHubPage = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState<'video' | 'book'>('video');
  const [courses, setCourses] = useState<any[]>([]);
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [adminModal, setAdminModal] = useState(false);
  const [addCourseModal, setAddCourseModal] = useState(false);
  const [addBookModal, setAddBookModal] = useState(false);
  const [courseForm, setCourseForm] = useState({ title: '', description: '', thumbnail: null as File | null });
  const [bookForm, setBookForm] = useState({ title: '', cover: null as File | null, pdf: null as File | null });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const [c, b] = isDemoMode() ? await Promise.all([mockGetCoursesApi(), mockGetBooksApi()]) : await Promise.all([getCoursesApi(), getBooksApi()]);
        setCourses(c.data.courses || c.data || []);
        setBooks(b.data.books || b.data || []);
      } catch {} finally { setLoading(false); }
    })();
  }, []);

  const handleAdminSuccess = () => {
    setAdminModal(false);
    if (tab === 'video') setAddCourseModal(true);
    else setAddBookModal(true);
  };

  const handleAddCourse = async () => {
    if (!courseForm.title) { toast.error('Title required'); return; }
    setSubmitting(true);
    const fd = new FormData();
    fd.append('title', courseForm.title);
    fd.append('description', courseForm.description);
    if (courseForm.thumbnail) fd.append('thumbnail', courseForm.thumbnail);
    try {
      await addCourseApi(fd, 'admin@123');
      toast.success('Course created!');
      setAddCourseModal(false);
      const res = await getCoursesApi();
      setCourses(res.data.courses || res.data || []);
    } catch { toast.error('Failed to create course'); } finally { setSubmitting(false); }
  };

  const handleAddBook = async () => {
    if (!bookForm.title || !bookForm.pdf) { toast.error('Title and PDF required'); return; }
    setSubmitting(true);
    const fd = new FormData();
    fd.append('title', bookForm.title);
    if (bookForm.cover) fd.append('cover', bookForm.cover);
    if (bookForm.pdf) fd.append('pdf', bookForm.pdf);
    try {
      await addBookApi(fd, 'admin@123');
      toast.success('Book uploaded!');
      setAddBookModal(false);
      const res = await getBooksApi();
      setBooks(res.data.books || res.data || []);
    } catch { toast.error('Failed to upload book'); } finally { setSubmitting(false); }
  };

  return (
    <div className="fade-up max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="font-heading text-2xl md:text-3xl font-bold text-[#1E1B4B]">Learning Hub 📚</h1>
        <p className="text-[#6B7280] font-body text-sm mt-1">Learn from the best. Build like the best.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {[{ key: 'video' as const, label: '🎬 Video Learning' }, { key: 'book' as const, label: '📖 Book Learning' }].map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`px-5 py-2.5 rounded-full text-sm font-body font-medium transition-all ${tab === t.key ? 'bg-card text-brand shadow-card font-semibold' : 'text-[#6B7280] hover:bg-surface'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Video Tab */}
      {tab === 'video' && (
        loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} lines={3} />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map(c => (
              <div key={c._id} onClick={() => navigate(`/learning-hub/course/${c._id}`)}
                className="bg-card rounded-xl shadow-card border border-[#EDE9FE] overflow-hidden cursor-pointer hover:shadow-cardHover hover:scale-[1.02] transition-all duration-300">
                <div className="aspect-video bg-gradient-to-br from-brand to-accent flex items-center justify-center">
                  {c.thumbnail ? <img src={c.thumbnail} alt={c.title} className="w-full h-full object-cover" /> : <BookOpen size={40} className="text-white/60" />}
                </div>
                <div className="p-4">
                  <h3 className="font-heading text-base font-bold text-[#1E1B4B] line-clamp-2">{c.title}</h3>
                  {c.description && <p className="text-[13px] text-[#6B7280] font-body line-clamp-2 mt-1">{c.description}</p>}
                  <div className="flex items-center gap-1 mt-2 text-[13px] text-[#6B7280] font-body">
                    <PlayCircle size={14} /> {c.lessons?.length || 0} lessons
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {/* Book Tab */}
      {tab === 'book' && (
        loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} lines={2} />)}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {books.map(b => (
              <div key={b._id} onClick={() => navigate(`/learning-hub/book/${b._id}`)}
                className="cursor-pointer hover:scale-[1.03] transition-transform duration-300">
                <div className="aspect-[2/3] rounded-xl shadow-card overflow-hidden">
                  {b.coverImage ? <img src={b.coverImage} alt={b.title} className="w-full h-full object-cover" /> : (
                    <div className="w-full h-full bg-gradient-to-br from-brand to-accent flex items-center justify-center"><BookOpen size={40} className="text-white/60" /></div>
                  )}
                </div>
                <p className="font-heading text-sm font-bold text-[#1E1B4B] text-center line-clamp-2 mt-2">{b.title}</p>
              </div>
            ))}
          </div>
        )
      )}

      {/* FAB */}
      <button onClick={() => setAdminModal(true)} title={tab === 'video' ? 'Add Course' : 'Add Book'}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-r from-brand to-accent text-white shadow-button hover:shadow-cardHover flex items-center justify-center z-40">
        <Plus size={24} />
      </button>

      <AdminPasswordModal isOpen={adminModal} onClose={() => setAdminModal(false)} onSuccess={handleAdminSuccess} />

      {/* Add Course Modal */}
      {addCourseModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-2xl p-6 w-full max-w-md shadow-cardHover">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading font-bold text-lg">Add New Course</h3>
              <button onClick={() => setAddCourseModal(false)}><X size={20} className="text-[#6B7280]" /></button>
            </div>
            <div className="space-y-4">
              <input value={courseForm.title} onChange={e => setCourseForm({ ...courseForm, title: e.target.value })} placeholder="Course Title *" className="w-full border border-[#EDE9FE] rounded-lg px-4 py-3 font-body focus:outline-none focus:border-brand" />
              <textarea value={courseForm.description} onChange={e => setCourseForm({ ...courseForm, description: e.target.value })} placeholder="Description" rows={3} className="w-full border border-[#EDE9FE] rounded-lg px-4 py-3 font-body resize-none focus:outline-none focus:border-brand" />
              <div className="border-2 border-dashed border-[#EDE9FE] rounded-xl p-6 text-center">
                <Upload size={24} className="mx-auto text-[#6B7280] mb-2" />
                <p className="text-sm text-[#6B7280] font-body">Click to upload thumbnail</p>
                <input type="file" accept="image/*" onChange={e => setCourseForm({ ...courseForm, thumbnail: e.target.files?.[0] || null })} className="absolute inset-0 opacity-0 cursor-pointer" style={{ position: 'relative' }} />
                {courseForm.thumbnail && <p className="text-xs text-brand mt-1">{courseForm.thumbnail.name}</p>}
              </div>
              <button onClick={handleAddCourse} disabled={submitting} className="w-full bg-gradient-to-r from-brand to-accent text-white rounded-lg py-3 font-body font-semibold hover:shadow-button transition-shadow">
                {submitting ? 'Creating...' : 'Create Course'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Book Modal */}
      {addBookModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-2xl p-6 w-full max-w-md shadow-cardHover">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading font-bold text-lg">Upload Book</h3>
              <button onClick={() => setAddBookModal(false)}><X size={20} className="text-[#6B7280]" /></button>
            </div>
            <div className="space-y-4">
              <input value={bookForm.title} onChange={e => setBookForm({ ...bookForm, title: e.target.value })} placeholder="Book Title *" className="w-full border border-[#EDE9FE] rounded-lg px-4 py-3 font-body focus:outline-none focus:border-brand" />
              <div className="border-2 border-dashed border-[#EDE9FE] rounded-xl p-4 text-center">
                <p className="text-sm text-[#6B7280] font-body mb-1">Book Cover Image</p>
                <input type="file" accept="image/*" onChange={e => setBookForm({ ...bookForm, cover: e.target.files?.[0] || null })} />
              </div>
              <div className="border-2 border-dashed border-[#EDE9FE] rounded-xl p-4 text-center">
                <p className="text-sm text-[#6B7280] font-body mb-1">PDF File *</p>
                <input type="file" accept=".pdf" onChange={e => setBookForm({ ...bookForm, pdf: e.target.files?.[0] || null })} />
                {bookForm.pdf && <p className="text-xs text-brand mt-1">{bookForm.pdf.name}</p>}
              </div>
              <button onClick={handleAddBook} disabled={submitting} className="w-full bg-gradient-to-r from-brand to-accent text-white rounded-lg py-3 font-body font-semibold hover:shadow-button transition-shadow">
                {submitting ? 'Uploading...' : 'Upload Book'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LearningHubPage;
