import { ChevronUp, ChevronDown } from 'lucide-react';
import type { ThirdPlaceEntry } from '../data/teams';

interface Props {
  entry: ThirdPlaceEntry;
  isFirst: boolean;
  isLast: boolean;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

export default function ThirdPlaceRow({
  entry,
  isFirst,
  isLast,
  onMoveUp,
  onMoveDown,
}: Props) {
  return (
    <div
      className={`flex items-center gap-2 py-1.5 px-3 rounded-md transition-colors ${
        entry.qualified
          ? 'hover:bg-green-50'
          : 'opacity-45'
      }`}
    >
      <span className="text-base leading-none">{entry.team.flag}</span>

      <span className={`text-[13px] truncate flex-1 min-w-0 ${entry.qualified ? 'text-gray-800' : 'text-gray-400'}`}>
        {entry.team.name}
      </span>

      <span className="text-[9px] text-gray-400 font-mono shrink-0">
        {entry.group}
      </span>

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
