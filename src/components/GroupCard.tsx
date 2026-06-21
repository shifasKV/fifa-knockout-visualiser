import { Reorder } from 'framer-motion';
import type { Group, Team } from '../data/teams';
import GroupTeamRow from './GroupTeamRow';

interface Props {
  group: Group;
  onReorderGroup: (groupId: string, newTeams: Team[]) => void;
}

export default function GroupCard({ group, onReorderGroup }: Props) {
  const moveTeam = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= group.teams.length) return;
    const next = [...group.teams];
    const [moved] = next.splice(fromIndex, 1);
    next.splice(toIndex, 0, moved);
    onReorderGroup(group.id, next);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="bg-fifa-navy px-3 py-2">
        <h3 className="text-[11px] font-bold text-white tracking-wider uppercase">
          {group.name}
        </h3>
      </div>
      <Reorder.Group
        axis="y"
        values={group.teams}
        onReorder={(newTeams) => onReorderGroup(group.id, newTeams)}
        className="p-1.5 space-y-0"
      >
        {group.teams.map((team, i) => (
          <Reorder.Item
            key={team.id}
            value={team}
            className="cursor-grab active:cursor-grabbing"
            whileDrag={{
              scale: 1.03,
              zIndex: 10,
              boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
            }}
            transition={{ duration: 0.15 }}
          >
            <GroupTeamRow
              team={team}
              rank={i + 1}
              isFirst={i === 0}
              isLast={i === group.teams.length - 1}
              onMoveUp={() => moveTeam(i, i - 1)}
              onMoveDown={() => moveTeam(i, i + 1)}
              isEliminated={i === 3}
            />
          </Reorder.Item>
        ))}
      </Reorder.Group>
    </div>
  );
}
