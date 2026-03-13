interface Props {
  size?: 'sm' | 'md' | 'lg';
  fullScreen?: boolean;
}

const sizes = { sm: 16, md: 32, lg: 48 };

const LoadingSpinner = ({ size = 'md', fullScreen = false }: Props) => {
  const s = sizes[size];
  const spinner = (
    <div className="flex flex-col items-center gap-3">
      <svg width={s} height={s} viewBox="0 0 24 24" fill="none" className="animate-spin">
        <circle cx="12" cy="12" r="10" stroke="#EDE9FE" strokeWidth="3" />
        <path d="M12 2a10 10 0 0 1 10 10" stroke="#4F46E5" strokeWidth="3" strokeLinecap="round" />
      </svg>
      {fullScreen && <p className="text-sm text-[#6B7280] font-body">Loading...</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-surface/80 backdrop-blur-sm">
        {spinner}
      </div>
    );
  }
  return spinner;
};

export default LoadingSpinner;
