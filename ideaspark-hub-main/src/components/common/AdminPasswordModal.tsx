import { useState } from 'react';
import { Lock, Eye, EyeOff, X } from 'lucide-react';
import toast from 'react-hot-toast';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  title?: string;
}

const AdminPasswordModal = ({ isOpen, onClose, onSuccess, title = 'Admin Access Required' }: Props) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin@123') {
      toast.success('✓ Admin access granted');
      onSuccess();
      setPassword('');
      setError('');
      onClose();
    } else {
      setError('Incorrect password. Try again.');
    }
  };

  const handleClose = () => {
    setPassword('');
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-2xl p-6 w-full max-w-sm shadow-cardHover animate-in">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Lock size={20} className="text-brand" />
            <h3 className="font-heading font-bold text-lg">{title}</h3>
          </div>
          <button onClick={handleClose} className="text-[#6B7280] hover:text-[#1E1B4B]">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(''); }}
              placeholder="Enter admin password"
              className="w-full border border-[#EDE9FE] rounded-lg px-4 py-3 pr-10 focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand-subtle font-body"
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280]">
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {error && <p className="text-danger text-sm mt-2">{error}</p>}
          <div className="flex gap-3 mt-4">
            <button type="button" onClick={handleClose} className="flex-1 border border-[#EDE9FE] rounded-lg py-2.5 text-[#6B7280] hover:bg-surface font-body font-medium">
              Cancel
            </button>
            <button type="submit" className="flex-1 bg-gradient-to-r from-brand to-accent text-white rounded-lg py-2.5 font-body font-semibold hover:shadow-button transition-shadow">
              Verify Access
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminPasswordModal;
