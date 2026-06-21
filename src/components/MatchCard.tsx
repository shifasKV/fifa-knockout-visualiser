import type { Match } from '../data/teams';
import TeamSlot from './TeamSlot';

interface Props {
  match: Match;
  onSelectWinner: (matchId: string, teamId: string) => void;
  fixtureLabel?: string;
}

export default function MatchCard({
  match,
  onSelectWinner,
  fixtureLabel,
}: Props) {
  const bothTeamsPresent = match.teamA !== null && match.teamB !== null;

  return (
    <div
      className={`bg-white rounded-lg overflow-hidden w-[164px] shrink-0 transition-shadow border ${
        match.winnerId
          ? 'border-fifa-teal/40 shadow-md'
          : 'border-gray-200 shadow-sm hover:shadow-md'
      }`}
    >
      {fixtureLabel && (
        <div className="px-2.5 py-1 bg-gray-50 border-b border-gray-100">
          <span className="text-[8px] text-gray-400 font-mono uppercase tracking-wider">
            {fixtureLabel}
          </span>
        </div>
      )}
      <TeamSlot
        team={match.teamA}
        isWinner={match.winnerId === match.teamA?.id}
        isSelectable={bothTeamsPresent}
        onClick={() => match.teamA && onSelectWinner(match.id, match.teamA.id)}
      />
      <div className="h-px bg-gray-100" />
      <TeamSlot
        team={match.teamB}
        isWinner={match.winnerId === match.teamB?.id}
        isSelectable={bothTeamsPresent}
        onClick={() => match.teamB && onSelectWinner(match.id, match.teamB.id)}
      />
    </div>
  );
}
