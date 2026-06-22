import { ALL_TEAMS, type Group, type Team } from '../data/teams';
import { INITIAL_GROUPS } from '../data/initialGroups';

interface LiveStandingsResponse {
  groups: Record<string, string[]>;
  updatedAt: string;
}

const teamByFifa: Record<string, Team> = {};
for (const team of Object.values(ALL_TEAMS)) {
  teamByFifa[team.id] = team;
}

export async function fetchLiveStandings(): Promise<{
  groups: Group[];
  updatedAt: string;
} | null> {
  try {
    const res = await fetch('/api/standings');
    if (!res.ok) return null;
    const data = (await res.json()) as LiveStandingsResponse;
    if (!data.groups) return null;

    const groups: Group[] = INITIAL_GROUPS.map((defaultGroup) => {
      const liveCodes = data.groups[defaultGroup.id];
      if (!liveCodes || liveCodes.length !== 4) return defaultGroup;

      const teams = liveCodes
        .map((code) => teamByFifa[code])
        .filter(Boolean);

      if (teams.length !== 4) return defaultGroup;
      return { ...defaultGroup, teams };
    });

    return { groups, updatedAt: data.updatedAt };
  } catch {
    return null;
  }
}
