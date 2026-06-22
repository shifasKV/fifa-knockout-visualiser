import { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import type { Group, Team, ThirdPlaceEntry } from '../data/teams';
import GroupCard from './GroupCard';
import ThirdPlacePanel from './ThirdPlacePanel';

interface Props {
  groups: Group[];
  onReorderGroup: (groupId: string, newTeams: Team[]) => void;
  thirdPlaceRanking: ThirdPlaceEntry[];
  onThirdPlaceReorder: (newRanking: ThirdPlaceEntry[]) => void;
  liveUpdatedAt: string | null;
  isLive: boolean;
  onSyncLive: () => Promise<void>;
}

function formatTimeAgo(isoDate: string): string {
  const diff = Date.now() - new Date(isoDate).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function GroupsPanel({
  groups,
  onReorderGroup,
  thirdPlaceRanking,
  onThirdPlaceReorder,
  liveUpdatedAt,
  isLive,
  onSyncLive,
}: Props) {
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await onSyncLive();
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <section className="px-4 py-6">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-fifa-navy">Group Standings</h2>
            {liveUpdatedAt && isLive && (
              <span className="flex items-center gap-1 text-[10px] text-green-600">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                Live · updated {formatTimeAgo(liveUpdatedAt)}
              </span>
            )}
            {liveUpdatedAt && !isLive && (
              <span className="text-[10px] text-gray-400">Manual mode</span>
            )}
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold
              bg-fifa-teal/10 text-fifa-teal hover:bg-fifa-teal/20
              rounded-lg transition-colors cursor-pointer
              disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw size={12} className={refreshing ? 'animate-spin' : ''} />
            {refreshing ? 'Refreshing...' : 'Refresh Live'}
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
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
      </div>
    </section>
  );
}
