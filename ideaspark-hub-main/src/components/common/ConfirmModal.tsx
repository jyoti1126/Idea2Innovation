import { CheckCircle } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
}

const ConfirmModal = ({
  isOpen, onClose, onConfirm, title, message,
  confirmText = 'Yes, I did it! ✓', cancelText = 'Not yet', isLoading = false
}: Props) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-2xl p-6 w-full max-w-md shadow-cardHover" style={{ animation: 'fadeUp 0.2s ease' }}>
        <div className="flex items-center gap-2 mb-3">
          <CheckCircle size={24} className="text-success" />
          <h3 className="font-heading font-bold text-lg">{title}</h3>
        </div>
        <p className="text-[#6B7280] font-body text-sm mb-5">{message}</p>
        <div className="flex gap-3">
          <button onClick={onClose} disabled={isLoading} className="flex-1 border border-[#EDE9FE] rounded-lg py-2.5 text-[#6B7280] hover:bg-surface font-body font-medium">
            {cancelText}
          </button>
          <button onClick={onConfirm} disabled={isLoading} className="flex-1 bg-gradient-to-r from-success to-[#047857] text-white rounded-lg py-2.5 font-body font-semibold hover:shadow-button transition-shadow flex items-center justify-center gap-2">
            {isLoading ? <LoadingSpinner size="sm" /> : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
