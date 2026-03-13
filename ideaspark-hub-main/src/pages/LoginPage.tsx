import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { User, Lock, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { signinApi } from '@/api/authApi';
import { mockSigninApi } from '@/api/mockApi';
import { useAuth } from '@/context/AuthContext';
import LoadingSpinner from '@/components/common/LoadingSpinner';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const [form, setForm] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) return <Navigate to="/dashboard" replace />;


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.username || !form.password) {
      toast.error('Please fill in all fields');
      return;
    }
    setLoading(true);
    try {
      let data;
      try {
        const res = await signinApi(form);
        data = res.data;
      } catch (backendErr: any) {
        if (!backendErr.response) {
          const res = await mockSigninApi(form);
          data = res.data;
        } else {
          throw backendErr;
        }
      }
      login({ user: data.user, accessToken: data.accessToken, refreshToken: data.refreshToken });
      navigate('/dashboard');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

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
          <div className="text-center mb-6 md:hidden">
            <span className="font-heading font-bold text-2xl text-brand">IDEA</span>
            <span className="font-heading font-bold text-2xl text-accent">2</span>
            <span className="font-heading font-bold text-2xl text-brand">IMPACT</span>
          </div>
          <h2 className="font-heading text-2xl font-bold text-[#1E1B4B] mb-1">Welcome back!</h2>
          <p className="text-[#6B7280] font-body text-sm mb-6">Sign in to your account to continue</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-body text-sm font-medium text-[#1E1B4B] mb-1">Username</label>
              <div className="relative">
                <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]" />
                <input
                  type="text" value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                  placeholder="Enter username"
                  className="w-full border border-[#EDE9FE] rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand-subtle font-body"
                />
              </div>
            </div>

            <div>
              <label className="block font-body text-sm font-medium text-[#1E1B4B] mb-1">Password</label>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]" />
                <input
                  type={showPassword ? 'text' : 'password'} value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="Enter password"
                  className="w-full border border-[#EDE9FE] rounded-lg pl-10 pr-10 py-3 focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand-subtle font-body"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280]">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full h-12 bg-gradient-to-r from-brand to-accent text-white rounded-lg font-body font-semibold hover:shadow-button transition-shadow flex items-center justify-center gap-2">
              {loading ? <><LoadingSpinner size="sm" /> Signing in...</> : 'Sign In →'}
            </button>


          </form>

          <p className="text-center text-sm text-[#6B7280] font-body mt-5">
            Don't have an account?{' '}
            <button onClick={() => navigate('/signup')} className="text-brand font-semibold hover:underline">Sign Up</button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
