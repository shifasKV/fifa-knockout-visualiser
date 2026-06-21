import type { Group, Team, ThirdPlaceEntry } from '../data/teams';
import GroupCard from './GroupCard';
import ThirdPlacePanel from './ThirdPlacePanel';

interface Props {
  groups: Group[];
  onReorderGroup: (groupId: string, newTeams: Team[]) => void;
  thirdPlaceRanking: ThirdPlaceEntry[];
  onThirdPlaceReorder: (newRanking: ThirdPlaceEntry[]) => void;
}

export default function GroupsPanel({
  groups,
  onReorderGroup,
  thirdPlaceRanking,
  onThirdPlaceReorder,
}: Props) {
  return (
    <section className="px-4 py-6">
      <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row gap-6">
        <div className="flex-1 min-w-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
            {groups.map((group) => (
              <GroupCard
                key={group.id}
                group={group}
                onReorderGroup={onReorderGroup}
              />
            ))}
          </div>
        </div>

        <div className="lg:w-80 shrink-0">
          <ThirdPlacePanel
            ranking={thirdPlaceRanking}
            onReorder={onThirdPlaceReorder}
          />
        </div>
      </div>
    </section>
  );
}
