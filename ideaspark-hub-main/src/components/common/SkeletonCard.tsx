interface Props {
  lines?: number;
  showAvatar?: boolean;
}

const SkeletonCard = ({ lines = 3, showAvatar = false }: Props) => {
  const widths = ['100%', '80%', '60%', '90%', '70%'];
  return (
    <div className="bg-card rounded-xl p-4 shadow-card border border-[#EDE9FE] animate-pulse">
      {showAvatar && <div className="w-10 h-10 bg-[#EDE9FE] rounded-full mb-3" />}
      <div className="space-y-3">
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className="h-3 bg-[#EDE9FE] rounded"
            style={{ width: widths[i % widths.length] }}
          />
        ))}
      </div>
    </div>
  );
};

export default SkeletonCard;
