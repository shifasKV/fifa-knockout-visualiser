import type { Team } from '../data/teams';

interface Props {
  team: Team | null;
  isWinner: boolean;
  isSelectable: boolean;
  onClick: () => void;
}

export default function TeamSlot({
  team,
  isWinner,
  isSelectable,
  onClick,
}: Props) {
  if (!team) {
    return (
      <div className="flex items-center gap-2 px-2.5 py-2 min-h-[34px]">
        <span className="text-[11px] text-gray-300 italic">TBD</span>
      </div>
    );
  }

  return (
    <button
      onClick={onClick}
      disabled={!isSelectable}
      className={`flex items-center gap-2 px-2.5 py-2 w-full text-left transition-all cursor-pointer disabled:cursor-default min-h-[34px] ${
        isWinner
          ? 'bg-fifa-teal/10 font-semibold'
          : isSelectable
            ? 'hover:bg-gray-50'
            : 'opacity-50'
      }`}
    >
      <span className="text-sm leading-none shrink-0">{team.flag}</span>
      <span
        className={`text-[11px] truncate flex-1 min-w-0 ${
          isWinner ? 'text-fifa-teal-dark font-semibold' : 'text-gray-700'
        }`}
      >
        {team.name}
      </span>
      {isWinner && (
        <span className="w-4 h-4 rounded-full bg-fifa-teal flex items-center justify-center shrink-0">
          <svg width="8" height="8" viewBox="0 0 10 8" fill="none">
            <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
      )}
    </button>
  );
}
