import { ChevronUp, ChevronDown } from 'lucide-react';
import type { Team } from '../data/teams';

interface Props {
  team: Team;
  isFirst: boolean;
  isLast: boolean;
  onMoveUp: () => void;
  onMoveDown: () => void;
  isEliminated?: boolean;
}

export default function GroupTeamRow({
  team,
  isFirst,
  isLast,
  onMoveUp,
  onMoveDown,
  isEliminated,
}: Props) {
  return (
    <div
      className={`flex items-center gap-2 py-2 px-2 rounded-md transition-colors ${
        isEliminated ? 'opacity-40' : 'hover:bg-gray-50'
      }`}
    >
      <span className="text-base leading-none shrink-0">{team.flag}</span>

      <span
        className={`text-[13px] truncate flex-1 min-w-0 ${
          isEliminated ? 'text-gray-400' : 'text-gray-800'
        }`}
      >
        {team.name}
      </span>

      {isEliminated && (
        <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full bg-red-50 text-red-400 shrink-0">
          OUT
        </span>
      )}

      <div className="flex flex-col shrink-0">
        <button
          onClick={onMoveUp}
          disabled={isFirst}
          className="p-0.5 text-gray-300 hover:text-fifa-teal disabled:opacity-20 disabled:cursor-default transition-colors cursor-pointer"
          aria-label="Move up"
        >
          <ChevronUp size={14} />
        </button>
        <button
          onClick={onMoveDown}
          disabled={isLast}
          className="p-0.5 text-gray-300 hover:text-fifa-teal disabled:opacity-20 disabled:cursor-default transition-colors cursor-pointer"
          aria-label="Move down"
        >
          <ChevronDown size={14} />
        </button>
      </div>
    </div>
  );
}
