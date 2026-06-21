import type { Group, ThirdPlaceEntry } from '../data/teams';

/** Bump when INITIAL_GROUPS default order changes so stale saves are ignored. */
export const DEFAULT_STANDINGS_VERSION = 3;

const KEYS = {
  groups: 'fifa-bracket-groups',
  thirdPlace: 'fifa-bracket-third-place',
  winners: 'fifa-bracket-winners',
  version: 'fifa-bracket-standings-version',
} as const;

function savedVersionMatches(): boolean {
  try {
    return localStorage.getItem(KEYS.version) === String(DEFAULT_STANDINGS_VERSION);
  } catch {
    return false;
  }
}

function markStandingsSaved() {
  try {
    localStorage.setItem(KEYS.version, String(DEFAULT_STANDINGS_VERSION));
  } catch {}
}

export function saveGroups(groups: Group[]) {
  try {
    const data = groups.map((g) => ({
      id: g.id,
      teamIds: g.teams.map((t) => t.id),
    }));
    localStorage.setItem(KEYS.groups, JSON.stringify(data));
    markStandingsSaved();
  } catch {}
}

export function loadGroups(
  defaultGroups: Group[]
): Group[] | null {
  if (!savedVersionMatches()) return null;
  try {
    const raw = localStorage.getItem(KEYS.groups);
    if (!raw) return null;
    const data = JSON.parse(raw) as { id: string; teamIds: string[] }[];

    const allTeams = defaultGroups.flatMap((g) => g.teams);
    const teamById = Object.fromEntries(allTeams.map((t) => [t.id, t]));

    return data.map((saved) => {
      const defaultGroup = defaultGroups.find((g) => g.id === saved.id);
      if (!defaultGroup) return null;
      const teams = saved.teamIds
        .map((id) => teamById[id])
        .filter(Boolean);
      if (teams.length !== defaultGroup.teams.length) return null;
      return { ...defaultGroup, teams };
    }).filter(Boolean) as Group[];
  } catch {
    return null;
  }
}

export function saveThirdPlaceRanking(ranking: ThirdPlaceEntry[]) {
  try {
    const data = ranking.map((e) => e.group);
    localStorage.setItem(KEYS.thirdPlace, JSON.stringify(data));
    markStandingsSaved();
  } catch {}
}

export function loadThirdPlaceGroupOrder(): string[] | null {
  if (!savedVersionMatches()) return null;
  try {
    const raw = localStorage.getItem(KEYS.thirdPlace);
    if (!raw) return null;
    return JSON.parse(raw) as string[];
  } catch {
    return null;
  }
}

export function saveWinners(winners: Record<string, string>) {
  try {
    localStorage.setItem(KEYS.winners, JSON.stringify(winners));
  } catch {}
}

export function loadWinners(): Record<string, string> | null {
  try {
    const raw = localStorage.getItem(KEYS.winners);
    if (!raw) return null;
    return JSON.parse(raw) as Record<string, string>;
  } catch {
    return null;
  }
}
