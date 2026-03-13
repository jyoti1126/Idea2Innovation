import { LucideIcon } from 'lucide-react';

interface Props {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

const EmptyState = ({ icon: Icon, title, description, actionLabel, onAction }: Props) => (
  <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
    <Icon size={64} className="text-[#6B7280] mb-4 opacity-40" />
    <h3 className="font-heading text-xl font-bold text-[#1E1B4B] mb-2">{title}</h3>
    <p className="text-[#6B7280] font-body text-sm max-w-sm">{description}</p>
    {actionLabel && onAction && (
      <button onClick={onAction} className="mt-5 bg-gradient-to-r from-brand to-accent text-white rounded-lg px-6 py-2.5 font-body font-semibold hover:shadow-button transition-shadow">
        {actionLabel}
      </button>
    )}
  </div>
);

export default EmptyState;
