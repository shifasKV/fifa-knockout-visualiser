import { useState, useMemo, useCallback, useEffect } from 'react';
import type { Group, Team, ThirdPlaceEntry } from './data/teams';
import { INITIAL_GROUPS } from './data/initialGroups';
import { buildThirdPlaceList, buildDefaultThirdPlaceList } from './utils/qualification';
import { buildFullBracket, cleanupWinners } from './utils/bracket';
import {
  saveGroups,
  loadGroups,
  saveThirdPlaceRanking,
  loadThirdPlaceGroupOrder,
  saveWinners,
  loadWinners,
} from './utils/storage';
import { fetchLiveStandings } from './utils/liveStandings';
import Header from './components/Header';
import GroupsPanel from './components/GroupsPanel';
import KnockoutBracket from './components/KnockoutBracket';

function deepCloneGroups(groups: Group[]): Group[] {
  return groups.map((g) => ({ ...g, teams: [...g.teams] }));
}

function initGroups(): Group[] {
  const saved = loadGroups(INITIAL_GROUPS);
  return saved && saved.length === INITIAL_GROUPS.length
    ? saved
    : deepCloneGroups(INITIAL_GROUPS);
}

function initThirdPlace(): ThirdPlaceEntry[] {
  const savedOrder = loadThirdPlaceGroupOrder();
  const baseline = buildDefaultThirdPlaceList(INITIAL_GROUPS);
  if (!savedOrder) return baseline;

  const reordered: ThirdPlaceEntry[] = [];
  const used = new Set<string>();
  for (const group of savedOrder) {
    const entry = baseline.find((e) => e.group === group);
    if (entry && !used.has(group)) {
      reordered.push(entry);
      used.add(group);
    }
  }
  for (const entry of baseline) {
    if (!used.has(entry.group)) {
      reordered.push(entry);
    }
  }
  return reordered.map((e, i) => ({ ...e, qualified: i < 8 }));
}

function initWinners(): Record<string, string> {
  return loadWinners() || {};
}

export default function App() {
  const [activeTab, setActiveTab] = useState<'knockout' | 'groups'>('knockout');
  const [groups, setGroups] = useState<Group[]>(initGroups);
  const [thirdPlaceRanking, setThirdPlaceRanking] =
    useState<ThirdPlaceEntry[]>(initThirdPlace);
  const [winners, setWinners] = useState<Record<string, string>>(initWinners);
  const [liveUpdatedAt, setLiveUpdatedAt] = useState<string | null>(null);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetchLiveStandings().then((result) => {
      if (cancelled || !result) return;
      setGroups(result.groups);
      setLiveUpdatedAt(result.updatedAt);
      setIsLive(true);
    });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!isLive) return;
    const interval = setInterval(async () => {
      const result = await fetchLiveStandings();
      if (result) {
        setGroups(result.groups);
        setLiveUpdatedAt(result.updatedAt);
      }
    }, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [isLive]);

  const currentThirdPlace = useMemo(
    () => buildThirdPlaceList(groups, thirdPlaceRanking),
    [groups, thirdPlaceRanking]
  );

  const bracket = useMemo(
    () => buildFullBracket(groups, currentThirdPlace, winners),
    [groups, currentThirdPlace, winners]
  );

  useEffect(() => {
    const cleaned = cleanupWinners(bracket, winners);
    if (Object.keys(cleaned).length !== Object.keys(winners).length) {
      setWinners(cleaned);
    }
  }, [bracket, winners]);

  useEffect(() => { saveGroups(groups); }, [groups]);
  useEffect(() => { saveThirdPlaceRanking(currentThirdPlace); }, [currentThirdPlace]);
  useEffect(() => { saveWinners(winners); }, [winners]);

  const handleReorderGroup = useCallback(
    (groupId: string, newTeams: Team[]) => {
      setIsLive(false);
      setGroups((prev) =>
        prev.map((g) => (g.id === groupId ? { ...g, teams: newTeams } : g))
      );
    },
    []
  );

  const handleThirdPlaceReorder = useCallback(
    (newRanking: ThirdPlaceEntry[]) => {
      setThirdPlaceRanking(newRanking);
    },
    []
  );

  const handleSelectWinner = useCallback(
    (matchId: string, teamId: string) => {
      setWinners((prev) => {
        const next = { ...prev };

        if (next[matchId] === teamId) {
          delete next[matchId];
          return clearDownstreamOf(next, matchId, teamId);
        }

        const oldWinnerId = next[matchId];
        next[matchId] = teamId;

        if (oldWinnerId) {
          return clearDownstreamOf(next, matchId, oldWinnerId);
        }

        return next;
      });
    },
    []
  );

  const handleSyncLive = useCallback(async () => {
    const result = await fetchLiveStandings();
    if (result) {
      setGroups(result.groups);
      setLiveUpdatedAt(result.updatedAt);
      setIsLive(true);
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        champion={bracket.champion}
        liveUpdatedAt={liveUpdatedAt}
        isLive={isLive}
        onSyncLive={handleSyncLive}
      />

      {activeTab === 'knockout' && (
        <KnockoutBracket
          bracket={bracket}
          onSelectWinner={handleSelectWinner}
        />
      )}

      {activeTab === 'groups' && (
        <GroupsPanel
          groups={groups}
          onReorderGroup={handleReorderGroup}
          thirdPlaceRanking={currentThirdPlace}
          onThirdPlaceReorder={handleThirdPlaceReorder}
        />
      )}
    </div>
  );
}

/**
 * Only clear winner selections in matches DOWNSTREAM (later rounds)
 * from the changed match. Match IDs are "M73"..."M104" — higher
 * numbers are later rounds, so only clear matches with a higher number.
 */
function clearDownstreamOf(
  winners: Record<string, string>,
  changedMatchId: string,
  removedTeamId: string
): Record<string, string> {
  const changedNum = parseInt(changedMatchId.replace('M', ''), 10);
  const next = { ...winners };
  for (const [mid, wid] of Object.entries(next)) {
    if (mid === changedMatchId) continue;
    const midNum = parseInt(mid.replace('M', ''), 10);
    if (midNum > changedNum && wid === removedTeamId) {
      delete next[mid];
    }
  }
  return next;
}
