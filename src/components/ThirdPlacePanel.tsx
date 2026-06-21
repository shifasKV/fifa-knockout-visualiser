import { Reorder } from 'framer-motion';
import type { ThirdPlaceEntry } from '../data/teams';
import DelayedReorderItem from './DelayedReorderItem';
import ThirdPlaceRow from './ThirdPlaceRow';

interface Props {
  ranking: ThirdPlaceEntry[];
  onReorder: (newRanking: ThirdPlaceEntry[]) => void;
}

export default function ThirdPlacePanel({ ranking, onReorder }: Props) {
  const moveEntry = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= ranking.length) return;
    const next = [...ranking];
    const [moved] = next.splice(fromIndex, 1);
    next.splice(toIndex, 0, moved);
    onReorder(next);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="bg-fifa-navy px-3 py-2">
        <h3 className="text-[11px] font-bold text-white tracking-wider uppercase">
          Best 3rd-Place Teams
        </h3>
        <p className="text-[10px] text-gray-400 mt-0.5">
          Top 8 qualify — hold to drag on mobile, or use arrows
        </p>
      </div>
      <Reorder.Group
        axis="y"
        values={ranking}
        onReorder={onReorder}
        className="p-1.5 space-y-0"
      >
        {ranking.map((entry, i) => (
          <DelayedReorderItem
            key={entry.group}
            value={entry}
            className="cursor-grab active:cursor-grabbing touch-pan-y"
            whileDrag={{
              scale: 1.03,
              zIndex: 10,
              boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
            }}
            transition={{ duration: 0.15 }}
          >
            <ThirdPlaceRow
              entry={entry}
              isFirst={i === 0}
              isLast={i === ranking.length - 1}
              onMoveUp={() => moveEntry(i, i - 1)}
              onMoveDown={() => moveEntry(i, i + 1)}
            />
          </DelayedReorderItem>
        ))}
      </Reorder.Group>
    </div>
  );
}
