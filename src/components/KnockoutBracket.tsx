import type { Team } from '../data/teams';
import type { BracketState } from '../utils/bracket';
import RoundColumn from './RoundColumn';
import {
  ROUND_NAMES,
  getLeftBracketMatchIds,
  getRightBracketMatchIds,
  FINAL_MATCH_ID,
} from '../data/bracketSlots';
import { Trophy } from 'lucide-react';

interface Props {
  bracket: BracketState;
  onSelectWinner: (matchId: string, teamId: string) => void;
}

const ROUND_KEY = ['R32', 'R16', 'QF', 'SF'] as const;
const ROUND_NUM = { R32: 32, R16: 16, QF: 8, SF: 4, F: 2 } as const;

export default function KnockoutBracket({ bracket, onSelectWinner }: Props) {
  const { byMatchId, champion } = bracket;

  return (
    <section className="py-6">
      <div className="overflow-x-auto pb-4">
        <div
          className="inline-flex items-stretch px-6 py-2"
          style={{ minWidth: 'max-content' }}
        >
          {ROUND_KEY.map((roundKey) => {
            const leftIds = getLeftBracketMatchIds(roundKey);
            return (
              <div key={`left-${roundKey}`} className="flex items-stretch">
                <RoundColumn
                  roundName={ROUND_NAMES[roundKey]}
                  matchIds={leftIds}
                  byMatchId={byMatchId}
                  onSelectWinner={onSelectWinner}
                  round={ROUND_NUM[roundKey]}
                  thirdPlaceAllocation={bracket.thirdPlaceAllocation}
                />
                <BracketConnector matchCount={leftIds.length} direction="right" />
              </div>
            );
          })}

          <div className="flex flex-col items-center justify-center shrink-0 mx-1">
            <RoundColumn
              roundName={ROUND_NAMES.F}
              matchIds={[FINAL_MATCH_ID]}
              byMatchId={byMatchId}
              onSelectWinner={onSelectWinner}
              round={2}
              thirdPlaceAllocation={bracket.thirdPlaceAllocation}
            />
            <div className="mt-4">
              <ChampionCard champion={champion} />
            </div>
          </div>

          {[...ROUND_KEY].reverse().map((roundKey) => {
            const rightIds = getRightBracketMatchIds(roundKey);
            return (
              <div key={`right-${roundKey}`} className="flex items-stretch">
                <BracketConnector matchCount={rightIds.length} direction="left" />
                <RoundColumn
                  roundName={ROUND_NAMES[roundKey]}
                  matchIds={rightIds}
                  byMatchId={byMatchId}
                  onSelectWinner={onSelectWinner}
                  round={ROUND_NUM[roundKey]}
                  thirdPlaceAllocation={bracket.thirdPlaceAllocation}
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function BracketConnector({
  matchCount,
  direction,
}: {
  matchCount: number;
  direction: 'left' | 'right';
}) {
  const pairCount = matchCount / 2;
  const STROKE = '#9ca3af';

  if (pairCount < 1) {
    return (
      <div className="w-8 shrink-0 flex items-center">
        <div className="w-full border-t-[1.5px] border-[#9ca3af]" />
      </div>
    );
  }

  return (
    <div className="w-8 shrink-0 flex flex-col justify-around">
      {Array.from({ length: pairCount }).map((_, i) => (
        <svg
          key={i}
          className="w-8"
          viewBox="0 0 32 80"
          fill="none"
          preserveAspectRatio="none"
          style={{ height: `${100 / pairCount}%`, minHeight: 60 }}
        >
          {direction === 'right' ? (
            <>
              <line x1="0" y1="20" x2="16" y2="20" stroke={STROKE} strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
              <line x1="0" y1="60" x2="16" y2="60" stroke={STROKE} strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
              <line x1="16" y1="20" x2="16" y2="60" stroke={STROKE} strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
              <line x1="16" y1="40" x2="32" y2="40" stroke={STROKE} strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
            </>
          ) : (
            <>
              <line x1="32" y1="20" x2="16" y2="20" stroke={STROKE} strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
              <line x1="32" y1="60" x2="16" y2="60" stroke={STROKE} strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
              <line x1="16" y1="20" x2="16" y2="60" stroke={STROKE} strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
              <line x1="16" y1="40" x2="0" y2="40" stroke={STROKE} strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
            </>
          )}
        </svg>
      ))}
    </div>
  );
}

function ChampionCard({ champion }: { champion: Team | null }) {
  return (
    <div
      className={`flex flex-col items-center justify-center px-5 py-4 rounded-xl w-[170px] transition-all ${
        champion
          ? 'bg-gradient-to-b from-fifa-gold/20 to-fifa-gold/5 border-2 border-fifa-gold/40 shadow-lg'
          : 'bg-white border-2 border-dashed border-gray-200'
      }`}
    >
      <Trophy
        size={22}
        className={champion ? 'text-fifa-gold mb-1.5' : 'text-gray-300 mb-1.5'}
      />
      <div className="text-[9px] text-gray-400 uppercase tracking-widest font-bold mb-1.5">
        Champion
      </div>
      {champion ? (
        <div className="text-center">
          <div className="text-2xl">{champion.flag}</div>
          <div className="text-sm font-extrabold text-fifa-navy mt-1">
            {champion.name}
          </div>
        </div>
      ) : (
        <div className="text-xs text-gray-300 italic">TBD</div>
      )}
    </div>
  );
}
