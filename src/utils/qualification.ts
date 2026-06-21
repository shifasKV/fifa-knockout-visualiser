import type { Group, Team, ThirdPlaceEntry } from '../data/teams';
import { DEFAULT_THIRD_PLACE_GROUP_ORDER } from '../data/initialGroups';

export function getGroupWinner(group: Group): Team {
  return group.teams[0];
}

export function getGroupRunnerUp(group: Group): Team {
  return group.teams[1];
}

export function getGroupThird(group: Group): Team {
  return group.teams[2];
}

export function buildThirdPlaceList(
  groups: Group[],
  existingRanking: ThirdPlaceEntry[]
): ThirdPlaceEntry[] {
  const currentThirds = groups.map((g) => ({
    group: g.id,
    team: getGroupThird(g),
    qualified: false,
  }));

  const ranked: ThirdPlaceEntry[] = [];
  const used = new Set<string>();

  for (const existing of existingRanking) {
    const current = currentThirds.find((c) => c.group === existing.group);
    if (current && !used.has(current.group)) {
      ranked.push(current);
      used.add(current.group);
    }
  }

  for (const current of currentThirds) {
    if (!used.has(current.group)) {
      ranked.push(current);
      used.add(current.group);
    }
  }

  return ranked.map((entry, i) => ({
    ...entry,
    qualified: i < 8,
  }));
}

export function buildDefaultThirdPlaceList(groups: Group[]): ThirdPlaceEntry[] {
  return buildThirdPlaceList(
    groups,
    DEFAULT_THIRD_PLACE_GROUP_ORDER.map((groupId, i) => {
      const group = groups.find((g) => g.id === groupId);
      if (!group) {
        throw new Error(`Unknown group in default 3rd-place order: ${groupId}`);
      }
      return {
        group: groupId,
        team: getGroupThird(group),
        qualified: i < 8,
      };
    })
  );
}

export function getQualifiedThirdPlaceTeams(
  ranking: ThirdPlaceEntry[]
): ThirdPlaceEntry[] {
  return ranking.filter((e) => e.qualified);
}

export function getEliminatedThirdPlaceTeams(
  ranking: ThirdPlaceEntry[]
): ThirdPlaceEntry[] {
  return ranking.filter((e) => !e.qualified);
}

/** Returns labels like 1A, 2B, 3C based on current group standings. */
export function buildQualificationLabels(
  groups: Group[],
  thirdPlaceRanking: ThirdPlaceEntry[]
): Record<string, string> {
  const labels: Record<string, string> = {};

  for (const group of groups) {
    labels[group.teams[0].id] = `1${group.id}`;
    labels[group.teams[1].id] = `2${group.id}`;

    const thirdEntry = thirdPlaceRanking.find((e) => e.group === group.id);
    if (thirdEntry?.qualified) {
      labels[thirdEntry.team.id] = `3${group.id}`;
    }
  }

  return labels;
}

export function getTeamQualificationLabel(
  team: Team | null,
  labels: Record<string, string>
): string | undefined {
  if (!team) return undefined;
  return labels[team.id];
}
