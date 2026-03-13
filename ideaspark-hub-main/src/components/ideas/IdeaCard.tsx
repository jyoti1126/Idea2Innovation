import { useState } from 'react';
import { truncate } from '@/utils/helpers';
import LoadingSpinner from '@/components/common/LoadingSpinner';

interface Props {
  idea: any;
  isIgnored: boolean;
  onIgnore: () => void;
  onAccept: () => void;
}

const IdeaCard = ({ idea, isIgnored, onIgnore, onAccept }: Props) => {
  const [accepting, setAccepting] = useState(false);
  const score = idea.feasibilityScore || 0;
  const scoreColor = score >= 70 ? '#059669' : score >= 50 ? '#D97706' : '#DC2626';

  const handleAccept = async () => {
    setAccepting(true);
    await onAccept();
    setAccepting(false);
  };

  return (
    <div className={`bg-card rounded-2xl border border-[#EDE9FE] shadow-card overflow-hidden transition-opacity relative ${isIgnored ? 'opacity-40' : ''}`}>
      <div className="h-1.5 bg-gradient-to-r from-brand to-accent" />
      {isIgnored && (
        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
          <span className="text-4xl font-heading font-bold text-[#6B7280]/30 -rotate-12">Ignored</span>
        </div>
      )}
      <div className="p-6">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-heading text-lg font-bold text-[#1E1B4B] flex-1">{idea.title}</h3>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full whitespace-nowrap" style={{ background: scoreColor + '20', color: scoreColor }}>
            Score: {score}/100
          </span>
        </div>
        <p className="text-sm text-[#6B7280] font-body mt-2">{idea.description}</p>

        <div className="flex flex-wrap gap-2 mt-3">
          <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full">📈 {idea.marketDemand || 'Medium'} Demand</span>
          <span className="text-xs bg-purple-50 text-purple-600 px-2 py-1 rounded-full">⚔️ {idea.competitionLevel || 'Medium'} Competition</span>
          <span className="text-xs bg-gray-100 text-[#6B7280] px-2 py-1 rounded-full">👥 {truncate(idea.targetAudience || '', 20)}</span>
        </div>

        {idea.validationQuestions?.length > 0 && (
          <>
            <div className="border-t border-[#EDE9FE] mt-4 pt-3">
              <p className="text-xs font-semibold text-[#6B7280] font-body mb-1.5">Validation Questions:</p>
              <ol className="list-decimal list-inside space-y-1">
                {idea.validationQuestions.slice(0, 3).map((q: string, i: number) => (
                  <li key={i} className="text-xs text-[#6B7280] font-body">{q}</li>
                ))}
              </ol>
            </div>
          </>
        )}

        <div className="border-t border-[#EDE9FE] mt-4 pt-4 flex gap-3">
          <button onClick={onIgnore} disabled={isIgnored}
            className="flex-1 border border-[#EDE9FE] text-[#6B7280] rounded-lg py-2 text-sm font-body font-medium hover:bg-surface transition-colors">
            ✕ Ignore
          </button>
          <button onClick={handleAccept} disabled={isIgnored || accepting}
            className="flex-1 bg-gradient-to-r from-success to-[#047857] text-white rounded-lg py-2 text-sm font-body font-semibold hover:shadow-button transition-shadow flex items-center justify-center gap-1">
            {accepting ? <LoadingSpinner size="sm" /> : '✓ Accept This Idea'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default IdeaCard;
