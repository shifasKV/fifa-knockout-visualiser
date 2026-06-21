import type { Group, Team, Match, ThirdPlaceEntry } from '../data/teams';
import {
  OFFICIAL_MATCHES,
  MATCH_BY_ID,
  FINAL_MATCH_ID,
  type SlotDef,
} from '../data/bracketSlots';
import {
  getGroupWinner,
  getGroupRunnerUp,
  getGroupThird,
  getQualifiedThirdPlaceTeams,
} from './qualification';
import { resolveThirdPlaceAllocation } from './thirdPlace';

export function matchIdStr(fifaMatchId: number): string {
  return `M${fifaMatchId}`;
}

function roundToNumber(round: string): number {
  switch (round) {
    case 'R32':
      return 32;
    case 'R16':
      return 16;
    case 'QF':
      return 8;
    case 'SF':
      return 4;
    case 'F':
      return 2;
    default:
      return 0;
  }
}

function resolveGroupSlot(
  slot: SlotDef,
  groups: Group[]
): Team | null {
  if (slot.type === '1st' && slot.group) {
    const group = groups.find((g) => g.id === slot.group);
    return group ? getGroupWinner(group) : null;
  }
  if (slot.type === '2nd' && slot.group) {
    const group = groups.find((g) => g.id === slot.group);
    return group ? getGroupRunnerUp(group) : null;
  }
  return null;
}

function resolveThirdPlaceSlot(
  matchId: number,
  groups: Group[],
  allocation: Record<number, string>
): Team | null {
  const assignedGroup = allocation[matchId];
  if (!assignedGroup) return null;
  const group = groups.find((g) => g.id === assignedGroup);
  return group ? getGroupThird(group) : null;
}

function getWinnerTeamFromMatch(
  fifaMatchId: number,
  resolved: Record<number, Match>,
  winners: Record<string, string>
): Team | null {
  const match = resolved[fifaMatchId];
  if (!match) return null;
  const winnerId = winners[matchIdStr(fifaMatchId)];
  if (!winnerId) return null;
  if (match.teamA?.id === winnerId) return match.teamA;
  if (match.teamB?.id === winnerId) return match.teamB;
  return null;
}

function resolveSlotTeam(
  matchId: number,
  slot: SlotDef,
  groups: Group[],
  allocation: Record<number, string>,
  resolved: Record<number, Match>,
  winners: Record<string, string>
): Team | null {
  if (slot.type === '1st' || slot.type === '2nd') {
    return resolveGroupSlot(slot, groups);
  }
  if (slot.type === '3rd') {
    return resolveThirdPlaceSlot(matchId, groups, allocation);
  }
  if (slot.type === 'win' && slot.winMatch) {
    return getWinnerTeamFromMatch(slot.winMatch, resolved, winners);
  }
  return null;
}

export interface BracketState {
  rounds: Record<number, Match[]>;
  /** All resolved matches keyed by FIFA match id */
  byMatchId: Record<number, Match>;
  champion: Team | null;
  thirdPlaceAllocation: Record<number, string>;
}

export function generateR32Matches(
  groups: Group[],
  thirdPlaceRanking: ThirdPlaceEntry[]
): Match[] {
  const bracket = buildFullBracket(groups, thirdPlaceRanking, {});
  return bracket.rounds[32] || [];
}

export function buildFullBracket(
  groups: Group[],
  thirdPlaceRanking: ThirdPlaceEntry[],
  winners: Record<string, string>
): BracketState {
  const qualifiedThirds = getQualifiedThirdPlaceTeams(thirdPlaceRanking);
  const qualifiedGroups = qualifiedThirds.map((e) => e.group);

  let allocation: Record<number, string> = {};
  if (qualifiedGroups.length === 8) {
    allocation = resolveThirdPlaceAllocation(qualifiedGroups);
  }

  const resolved: Record<number, Match> = {};

  for (const fixture of OFFICIAL_MATCHES) {
    const teamA = resolveSlotTeam(
      fixture.matchId,
      fixture.slotA,
      groups,
      allocation,
      resolved,
      winners
    );
    const teamB = resolveSlotTeam(
      fixture.matchId,
      fixture.slotB,
      groups,
      allocation,
      resolved,
      winners
    );

    const id = matchIdStr(fixture.matchId);
    const winnerId = winners[id] || null;
    const validWinner =
      winnerId &&
      (teamA?.id === winnerId || teamB?.id === winnerId)
        ? winnerId
        : null;

    resolved[fixture.matchId] = {
      id,
      round: roundToNumber(fixture.round),
      position: fixture.matchId,
      teamA,
      teamB,
      winnerId: validWinner,
      nextMatchId: null,
      nextSlot: null,
    };
  }

  const rounds: Record<number, Match[]> = {
    32: OFFICIAL_MATCHES.filter((m) => m.round === 'R32').map(
      (m) => resolved[m.matchId]
    ),
    16: OFFICIAL_MATCHES.filter((m) => m.round === 'R16').map(
      (m) => resolved[m.matchId]
    ),
    8: OFFICIAL_MATCHES.filter((m) => m.round === 'QF').map(
      (m) => resolved[m.matchId]
    ),
    4: OFFICIAL_MATCHES.filter((m) => m.round === 'SF').map(
      (m) => resolved[m.matchId]
    ),
    2: OFFICIAL_MATCHES.filter((m) => m.round === 'F').map(
      (m) => resolved[m.matchId]
    ),
  };

  const finalMatch = resolved[FINAL_MATCH_ID];
  const champion = finalMatch?.winnerId
    ? finalMatch.teamA?.id === finalMatch.winnerId
      ? finalMatch.teamA
      : finalMatch.teamB
    : null;

  return {
    rounds,
    byMatchId: resolved,
    champion: champion ?? null,
    thirdPlaceAllocation: allocation,
  };
}

export function cleanupWinners(
  bracket: BracketState,
  currentWinners: Record<string, string>
): Record<string, string> {
  const cleaned: Record<string, string> = {};

  for (const [matchId, winnerId] of Object.entries(currentWinners)) {
    const fifaId = parseInt(matchId.replace('M', ''), 10);
    const match = bracket.byMatchId[fifaId];
    if (match && (match.teamA?.id === winnerId || match.teamB?.id === winnerId)) {
      cleaned[matchId] = winnerId;
    }
  }

  return cleaned;
}

export function getTeamR32FixtureLabel(
  teamId: string,
  bracket: BracketState
): string | null {
  const match = (bracket.rounds[32] || []).find(
    (m) => m.teamA?.id === teamId || m.teamB?.id === teamId
  );
  if (!match) return null;

  const fifaId = parseInt(match.id.replace('M', ''), 10);
  const fixture = MATCH_BY_ID[fifaId];
  if (!fixture) return null;

  const thirdGroup = bracket.thirdPlaceAllocation[fifaId];
  const slotBLabel =
    fixture.slotB.type === '3rd' && thirdGroup
      ? `3${thirdGroup}`
      : fixture.slotB.label;

  return `${fixture.slotA.label} vs ${slotBLabel}`;
}

export function getThirdPlaceAssignmentLabel(
  group: string,
  bracket: BracketState
): string | null {
  for (const [matchId, assignedGroup] of Object.entries(
    bracket.thirdPlaceAllocation
  )) {
    if (assignedGroup === group) {
      const fixture = MATCH_BY_ID[Number(matchId)];
      if (!fixture) return null;
      return `M${matchId}: ${fixture.slotA.label} vs 3${group}`;
    }
  }
  return null;
}

/** @deprecated use buildFullBracket directly */
export function buildFullBracketFromR32(
  _r32Matches: Match[],
  _winners: Record<string, string>
): BracketState {
  throw new Error('Use buildFullBracket(groups, thirdPlaceRanking, winners)');
}
