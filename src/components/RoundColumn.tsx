import type { Match } from '../data/teams';
import { MATCH_BY_ID } from '../data/bracketSlots';
import MatchCard from './MatchCard';

interface Props {
  roundName: string;
  matchIds: number[];
  byMatchId: Record<number, Match>;
  onSelectWinner: (matchId: string, teamId: string) => void;
  round: number;
  thirdPlaceAllocation: Record<number, string>;
}

export default function RoundColumn({
  roundName,
  matchIds,
  byMatchId,
  onSelectWinner,
  round,
  thirdPlaceAllocation,
}: Props) {
  return (
    <div className="flex flex-col items-center shrink-0">
      <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-3 whitespace-nowrap">
        {roundName}
      </div>
      <div className="flex flex-col justify-around flex-1 gap-1.5">
        {matchIds.map((fifaId) => {
          const match = byMatchId[fifaId];
          if (!match) return null;

          const fixture = MATCH_BY_ID[fifaId];
          let fixtureLabel: string | undefined;

          if (fixture && round === 32) {
            const thirdGroup = thirdPlaceAllocation[fifaId];
            const slotBLabel =
              fixture.slotB.type === '3rd' && thirdGroup
                ? `3${thirdGroup}`
                : fixture.slotB.label;
            fixtureLabel = `${fixture.slotA.label} vs ${slotBLabel}`;
          }

          return (
            <MatchCard
              key={match.id}
              match={match}
              onSelectWinner={onSelectWinner}
              fixtureLabel={fixtureLabel}
            />
          );
        })}
      </div>
    </div>
  );
}
