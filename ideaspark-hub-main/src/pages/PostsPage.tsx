import { useState, useEffect } from 'react';
import { Plus, X, Upload, Calendar, Bookmark, Heart, Newspaper, ChevronDown, ChevronUp } from 'lucide-react';
import toast from 'react-hot-toast';
import { getPostsApi, addPostApi } from '@/api/postsApi';
import { isDemoMode, mockGetPostsApi } from '@/api/mockApi';
import { formatDate } from '@/utils/helpers';
import SkeletonCard from '@/components/common/SkeletonCard';
import AdminPasswordModal from '@/components/common/AdminPasswordModal';
import EmptyState from '@/components/common/EmptyState';

const PostsPage = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [adminModal, setAdminModal] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const [form, setForm] = useState({ title: '', content: '', image: null as File | null });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [expandedPosts, setExpandedPosts] = useState<Set<string>>(new Set());
  const [bookmarked, setBookmarked] = useState<Set<string>>(new Set());
  const [likes, setLikes] = useState<Record<string, number>>({});

  useEffect(() => {
    (async () => {
      try {
        const res = isDemoMode() ? await mockGetPostsApi() : await getPostsApi();
        setPosts(res.data.posts || res.data || []);
      } catch {} finally { setLoading(false); }
    })();
  }, []);

  const handleImageSelect = (file: File | null) => {
    setForm({ ...form, image: file });
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target?.result as string);
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const handleAdd = async () => {
    if (!form.title || !form.content) { toast.error('Title and content required'); return; }
    setSubmitting(true);
    const fd = new FormData();
    fd.append('title', form.title);
    fd.append('content', form.content);
    if (form.image) fd.append('image', form.image);
    try {
      await addPostApi(fd, 'admin@123');
      toast.success('Post published!');
      setAddModal(false);
      setForm({ title: '', content: '', image: null });
      setImagePreview(null);
      const res = await getPostsApi();
      setPosts(res.data.posts || res.data || []);
    } catch { toast.error('Failed to publish post'); } finally { setSubmitting(false); }
  };

  const toggleExpand = (id: string) => {
    setExpandedPosts(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleBookmark = (id: string) => {
    setBookmarked(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleLike = (id: string) => {
    setLikes(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  return (
    <div className="fade-up max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="font-heading text-2xl md:text-3xl font-bold text-[#1E1B4B]">Daily Inspiration & Resources 📰</h1>
        <p className="text-[#6B7280] font-body text-sm mt-1">Curated content to fuel your entrepreneurial journey</p>
      </div>

      {loading ? (
        <div className="space-y-6">
          {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} lines={4} showAvatar />)}
        </div>
      ) : posts.length === 0 ? (
        <EmptyState icon={Newspaper} title="No posts yet" description="Check back later for inspiration!" />
      ) : (
        <div className="space-y-6">
          {posts.map((p, index) => {
            const isExpanded = expandedPosts.has(p._id);
            const isLong = p.content && p.content.length > 200;
            return (
              <div
                key={p._id}
                className="bg-card rounded-2xl shadow-card border border-[#EDE9FE] overflow-hidden fade-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Image */}
                {p.image ? (
                  <img src={p.image} alt={p.title} className="w-full h-60 object-cover" />
                ) : (
                  <div className="w-full h-60 bg-gradient-to-br from-brand to-accent flex items-center justify-center">
                    <Newspaper size={48} className="text-white/30" />
                  </div>
                )}

                {/* Body */}
                <div className="p-5">
                  <div className="flex items-start justify-between gap-2">
                    <h2 className="font-heading text-lg font-bold text-[#1E1B4B] flex-1">{p.title}</h2>
                    <span className="text-xs text-[#6B7280] font-body bg-surface px-2 py-1 rounded-full whitespace-nowrap flex items-center gap-1">
                      <Calendar size={10} /> {p.createdAt ? formatDate(p.createdAt) : 'Recently'}
                    </span>
                  </div>

                  <p className={`font-body text-sm text-[#6B7280] mt-2 leading-relaxed whitespace-pre-wrap ${!isExpanded && isLong ? 'line-clamp-4' : ''}`}>
                    {p.content}
                  </p>

                  {isLong && (
                    <button onClick={() => toggleExpand(p._id)} className="text-brand text-sm font-body font-medium mt-1 flex items-center gap-0.5 hover:underline">
                      {isExpanded ? <>Show Less <ChevronUp size={14} /></> : <>Read More <ChevronDown size={14} /></>}
                    </button>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-4 mt-4 pt-3 border-t border-[#EDE9FE]">
                    <button onClick={() => toggleLike(p._id)} className="flex items-center gap-1.5 text-[#6B7280] hover:text-danger transition-colors">
                      <Heart size={18} fill={likes[p._id] ? '#DC2626' : 'none'} className={likes[p._id] ? 'text-danger' : ''} />
                      <span className="text-xs font-body">{likes[p._id] || 0}</span>
                    </button>
                    <button onClick={() => toggleBookmark(p._id)} className="flex items-center gap-1.5 text-[#6B7280] hover:text-brand transition-colors">
                      <Bookmark size={18} fill={bookmarked.has(p._id) ? '#4F46E5' : 'none'} className={bookmarked.has(p._id) ? 'text-brand' : ''} />
                      <span className="text-xs font-body">{bookmarked.has(p._id) ? 'Saved' : 'Save'}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* FAB */}
      <button onClick={() => setAdminModal(true)} title="Add Post"
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-r from-brand to-accent text-white shadow-button hover:shadow-cardHover flex items-center justify-center z-40 transition-shadow">
        <Plus size={24} />
      </button>

      <AdminPasswordModal isOpen={adminModal} onClose={() => setAdminModal(false)} onSuccess={() => { setAdminModal(false); setAddModal(true); }} />

      {/* Add Post Modal */}
      {addModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-2xl p-6 w-full max-w-md shadow-cardHover max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading font-bold text-lg">New Post</h3>
              <button onClick={() => { setAddModal(false); setImagePreview(null); }}><X size={20} className="text-[#6B7280]" /></button>
            </div>
            <div className="space-y-4">
              <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Post Title *" className="w-full border border-[#EDE9FE] rounded-lg px-4 py-3 font-body focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand-subtle" />
              <textarea value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} placeholder="Write your post content... *" rows={5} className="w-full border border-[#EDE9FE] rounded-lg px-4 py-3 font-body resize-none focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand-subtle" />
              <div className="border-2 border-dashed border-[#EDE9FE] rounded-xl p-6 text-center hover:border-brand transition-colors cursor-pointer relative">
                <Upload size={24} className="mx-auto text-[#6B7280] mb-2" />
                <p className="text-sm text-[#6B7280] font-body">Click to upload post image</p>
                <p className="text-xs text-[#6B7280] font-body mt-1">PNG, JPG, WEBP up to 5MB</p>
                <input type="file" accept="image/*" onChange={e => handleImageSelect(e.target.files?.[0] || null)} className="absolute inset-0 opacity-0 cursor-pointer" />
                {imagePreview && (
                  <img src={imagePreview} alt="Preview" className="mt-3 rounded-lg w-full aspect-video object-cover" />
                )}
              </div>
              <button onClick={handleAdd} disabled={submitting} className="w-full bg-gradient-to-r from-brand to-accent text-white rounded-lg py-3 font-body font-semibold hover:shadow-button transition-shadow flex items-center justify-center gap-2">
                {submitting ? 'Publishing...' : 'Publish Post'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostsPage;
