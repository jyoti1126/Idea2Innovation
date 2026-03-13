import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Play, X, Upload } from 'lucide-react';
import toast from 'react-hot-toast';
import { getCourseDetailApi, addLessonApi } from '@/api/learningApi';
import { getYouTubeId } from '@/utils/helpers';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import AdminPasswordModal from '@/components/common/AdminPasswordModal';

const CourseDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [adminModal, setAdminModal] = useState(false);
  const [addLessonModal, setAddLessonModal] = useState(false);
  const [videoModal, setVideoModal] = useState<string | null>(null);
  const [lessonForm, setLessonForm] = useState({ title: '', description: '', youtubeUrl: '', thumbnail: null as File | null });
  const [urlValid, setUrlValid] = useState<boolean | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const res = await getCourseDetailApi(id);
        setCourse(res.data.course || res.data);
      } catch { toast.error('Failed to load course'); } finally { setLoading(false); }
    })();
  }, [id]);

  const handleUrlBlur = () => {
    setUrlValid(!!getYouTubeId(lessonForm.youtubeUrl));
  };

  const handleAddLesson = async () => {
    if (!lessonForm.title || !lessonForm.youtubeUrl) { toast.error('Title and YouTube URL required'); return; }
    if (!getYouTubeId(lessonForm.youtubeUrl)) { toast.error('Invalid YouTube URL'); return; }
    setSubmitting(true);
    const fd = new FormData();
    fd.append('title', lessonForm.title);
    fd.append('description', lessonForm.description);
    fd.append('youtubeUrl', lessonForm.youtubeUrl);
    if (lessonForm.thumbnail) fd.append('thumbnail', lessonForm.thumbnail);
    try {
      await addLessonApi(id!, fd, 'admin@123');
      toast.success('Lesson added!');
      setAddLessonModal(false);
      const res = await getCourseDetailApi(id!);
      setCourse(res.data.course || res.data);
      setLessonForm({ title: '', description: '', youtubeUrl: '', thumbnail: null });
    } catch { toast.error('Failed to add lesson'); } finally { setSubmitting(false); }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><LoadingSpinner /></div>;
  if (!course) return null;

  const lessons = course.lessons || [];

  return (
    <div className="fade-up max-w-4xl mx-auto">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-[#6B7280] font-body text-sm mb-4 hover:text-brand">
        <ArrowLeft size={16} /> Back
      </button>

      {/* Banner */}
      <div className="relative rounded-xl overflow-hidden mb-6">
        <div className="h-48 bg-gradient-to-br from-brand to-accent">
          {course.thumbnail && <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
          <h1 className="font-heading text-2xl font-bold text-white">{course.title}</h1>
        </div>
      </div>

      {/* Lessons */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-heading text-lg font-bold text-[#1E1B4B]">Lessons ({lessons.length})</h2>
        <button onClick={() => setAdminModal(true)} className="w-8 h-8 rounded-full bg-brand-subtle text-brand flex items-center justify-center hover:bg-brand hover:text-white transition-colors">
          <Plus size={16} />
        </button>
      </div>

      <div className="space-y-4">
        {lessons.map((lesson: any) => {
          const videoId = getYouTubeId(lesson.youtubeUrl);
          const thumb = lesson.thumbnail || (videoId ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` : null);
          return (
            <div key={lesson._id} className="bg-card rounded-xl shadow-card border border-[#EDE9FE] overflow-hidden flex gap-4 p-4 hover:shadow-cardHover transition-shadow cursor-pointer" onClick={() => videoId && setVideoModal(videoId)}>
              <div className="relative w-[180px] h-[100px] rounded-lg overflow-hidden shrink-0 bg-gradient-to-br from-brand to-accent">
                {thumb && <img src={thumb} alt={lesson.title} className="w-full h-full object-cover" />}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-black/50 flex items-center justify-center"><Play size={18} className="text-white ml-0.5" /></div>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-body font-semibold text-[15px] text-[#1E1B4B]">{lesson.title}</h3>
                {lesson.description && <p className="text-[13px] text-[#6B7280] font-body line-clamp-2 mt-1">{lesson.description}</p>}
                <button className="text-brand text-sm font-body font-medium mt-2 hover:underline" onClick={e => { e.stopPropagation(); videoId && setVideoModal(videoId); }}>Watch ▶</button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Video Modal */}
      {videoModal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={() => setVideoModal(null)}>
          <div className="w-full max-w-3xl" onClick={e => e.stopPropagation()}>
            <button onClick={() => setVideoModal(null)} className="absolute top-4 right-4 text-white"><X size={24} /></button>
            <div className="aspect-video rounded-xl overflow-hidden">
              <iframe
                src={`https://www.youtube.com/embed/${videoModal}?autoplay=1`}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}

      <AdminPasswordModal isOpen={adminModal} onClose={() => setAdminModal(false)} onSuccess={() => { setAdminModal(false); setAddLessonModal(true); }} />

      {/* Add Lesson Modal */}
      {addLessonModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-2xl p-6 w-full max-w-md shadow-cardHover">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading font-bold text-lg">Add Lesson</h3>
              <button onClick={() => setAddLessonModal(false)}><X size={20} className="text-[#6B7280]" /></button>
            </div>
            <div className="space-y-4">
              <input value={lessonForm.title} onChange={e => setLessonForm({ ...lessonForm, title: e.target.value })} placeholder="Lesson Title *" className="w-full border border-[#EDE9FE] rounded-lg px-4 py-3 font-body focus:outline-none focus:border-brand" />
              <textarea value={lessonForm.description} onChange={e => setLessonForm({ ...lessonForm, description: e.target.value })} placeholder="Description" rows={2} className="w-full border border-[#EDE9FE] rounded-lg px-4 py-3 font-body resize-none focus:outline-none focus:border-brand" />
              <div>
                <input value={lessonForm.youtubeUrl} onChange={e => { setLessonForm({ ...lessonForm, youtubeUrl: e.target.value }); setUrlValid(null); }} onBlur={handleUrlBlur} placeholder="YouTube URL *" className="w-full border border-[#EDE9FE] rounded-lg px-4 py-3 font-body focus:outline-none focus:border-brand" />
                {urlValid === true && <p className="text-xs text-success mt-1 font-body">✓ Valid YouTube URL</p>}
                {urlValid === false && <p className="text-xs text-danger mt-1 font-body">✗ Invalid URL</p>}
                {urlValid && getYouTubeId(lessonForm.youtubeUrl) && (
                  <img src={`https://img.youtube.com/vi/${getYouTubeId(lessonForm.youtubeUrl)}/mqdefault.jpg`} alt="preview" className="mt-2 rounded-lg h-20 object-cover" />
                )}
              </div>
              <div className="border-2 border-dashed border-[#EDE9FE] rounded-xl p-4 text-center">
                <Upload size={20} className="mx-auto text-[#6B7280] mb-1" />
                <p className="text-sm text-[#6B7280] font-body">Thumbnail (optional)</p>
                <input type="file" accept="image/*" onChange={e => setLessonForm({ ...lessonForm, thumbnail: e.target.files?.[0] || null })} />
              </div>
              <button onClick={handleAddLesson} disabled={submitting} className="w-full bg-gradient-to-r from-brand to-accent text-white rounded-lg py-3 font-body font-semibold hover:shadow-button transition-shadow">
                {submitting ? 'Adding...' : 'Add Lesson'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseDetailPage;
