import { useState, useMemo } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { User, Mail, AtSign, Lock, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { signupApi } from '@/api/authApi';
import { useAuth } from '@/context/AuthContext';
import { isValidEmail } from '@/utils/helpers';
import LoadingSpinner from '@/components/common/LoadingSpinner';

const SignupPage = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const passwordStrength = useMemo(() => {
    const p = form.password;
    if (p.length >= 8 && /\d/.test(p) && /[!@#$%^&*]/.test(p)) return 4;
    if (p.length >= 8 && /\d/.test(p)) return 3;
    if (p.length >= 6) return 2;
    if (p.length > 0) return 1;
    return 0;
  }, [form.password]);

  const strengthColors = ['', '#DC2626', '#D97706', '#EAB308', '#059669'];
  const strengthLabels = ['', 'Weak', 'Fair', 'Good', 'Strong'];

  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.username || !form.password) {
      toast.error('Please fill in all fields');
      return;
    }
    if (!isValidEmail(form.email)) { toast.error('Invalid email format'); return; }
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      const { data } = await signupApi(form);
      login({ user: data.user, accessToken: data.accessToken, refreshToken: data.refreshToken });
      navigate('/dashboard');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full border border-[#EDE9FE] rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand-subtle font-body";

  return (
    <div className="min-h-screen flex" style={{ background: 'linear-gradient(135deg, #EEF2FF 0%, #F5F3FF 50%, #FDF4FF 100%)' }}>
      {/* Left Panel */}
      <div className="hidden md:flex w-1/2 bg-gradient-to-br from-brand to-accent relative overflow-hidden items-center justify-center p-12">
        <div className="absolute top-[-80px] right-[-80px] w-[300px] h-[300px] rounded-full bg-white/10" />
        <div className="absolute bottom-[-120px] left-[-60px] w-[400px] h-[400px] rounded-full bg-white/5" />
        <div className="relative z-10 text-white max-w-md">
          <h1 className="font-heading text-4xl font-bold mb-3">IDEA<span className="text-purple-200">2</span>IMPACT</h1>
          <p className="text-white/80 italic font-body text-lg mb-8">From Idea to Entrepreneurial Impact</p>
          <div className="space-y-4">
            {['AI-Powered Idea Validation', 'Step-by-Step Execution Roadmap', 'Curated Learning Resources'].map((t) => (
              <div key={t} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-sm">✓</div>
                <span className="font-body">{t}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-card rounded-2xl shadow-cardHover p-8 md:p-10">
          <h2 className="font-heading text-2xl font-bold text-[#1E1B4B] mb-1">Create your account</h2>
          <p className="text-[#6B7280] font-body text-sm mb-6">Join thousands of young entrepreneurs</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-body text-sm font-medium text-[#1E1B4B] mb-1">Full Name</label>
              <div className="relative">
                <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]" />
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="John Doe" className={inputClass} />
              </div>
            </div>
            <div>
              <label className="block font-body text-sm font-medium text-[#1E1B4B] mb-1">Email Address</label>
              <div className="relative">
                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]" />
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="john@example.com" className={inputClass} />
              </div>
            </div>
            <div>
              <label className="block font-body text-sm font-medium text-[#1E1B4B] mb-1">Username</label>
              <div className="relative">
                <AtSign size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]" />
                <input type="text" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value.toLowerCase() })} placeholder="johndoe" className={inputClass} />
              </div>
              <p className="text-xs text-[#6B7280] mt-1 font-body">Only lowercase letters and numbers</p>
            </div>
            <div>
              <label className="block font-body text-sm font-medium text-[#1E1B4B] mb-1">Password</label>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]" />
                <input type={showPassword ? 'text' : 'password'} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Min 6 characters" className="w-full border border-[#EDE9FE] rounded-lg pl-10 pr-10 py-3 focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand-subtle font-body" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280]">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {form.password && (
                <div className="flex gap-1 mt-2">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="h-1 flex-1 rounded-full transition-colors" style={{ background: i <= passwordStrength ? strengthColors[passwordStrength] : '#EDE9FE' }} />
                  ))}
                  <span className="text-xs font-body ml-2" style={{ color: strengthColors[passwordStrength] }}>{strengthLabels[passwordStrength]}</span>
                </div>
              )}
            </div>

            <button type="submit" disabled={loading}
              className="w-full h-12 bg-gradient-to-r from-brand to-accent text-white rounded-lg font-body font-semibold hover:shadow-button transition-shadow flex items-center justify-center gap-2">
              {loading ? <><LoadingSpinner size="sm" /> Creating account...</> : 'Create Account 🚀'}
            </button>
          </form>

          <p className="text-center text-sm text-[#6B7280] font-body mt-5">
            Already have an account?{' '}
            <button onClick={() => navigate('/login')} className="text-brand font-semibold hover:underline">Sign In</button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
