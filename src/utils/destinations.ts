import { R32_FIXTURES, MATCH_BY_ID } from '../data/bracketSlots';
import { resolveThirdPlaceAllocation } from './thirdPlace';
import type { ThirdPlaceEntry } from '../data/teams';

export function getKnockoutDestination(
  groupId: string,
  rank: number,
  thirdQualified: boolean,
  thirdPlaceRanking: ThirdPlaceEntry[]
): string | null {
  if (rank === 1) {
    const fixture = R32_FIXTURES.find(
      (f) =>
        (f.slotA.type === '1st' && f.slotA.group === groupId) ||
        (f.slotB.type === '1st' && f.slotB.group === groupId)
    );
    if (!fixture) return null;
    const slot =
      fixture.slotA.group === groupId ? fixture.slotA : fixture.slotB;
    return `M${fixture.matchId}: ${slot.label}`;
  }

  if (rank === 2) {
    const fixture = R32_FIXTURES.find(
      (f) =>
        (f.slotA.type === '2nd' && f.slotA.group === groupId) ||
        (f.slotB.type === '2nd' && f.slotB.group === groupId)
    );
    if (!fixture) return null;
    const slot =
      fixture.slotA.group === groupId ? fixture.slotA : fixture.slotB;
    const opponent =
      fixture.slotA.group === groupId ? fixture.slotB : fixture.slotA;
    const oppLabel =
      opponent.type === '3rd' ? '3rd' : opponent.label;
    return `M${fixture.matchId}: ${slot.label} vs ${oppLabel}`;
  }

  if (rank === 3) {
    if (!thirdQualified) return 'Eliminated';
    try {
      const qualifiedGroups = thirdPlaceRanking
        .filter((e) => e.qualified)
        .map((e) => e.group);
      if (qualifiedGroups.length !== 8) return '3rd place — top 8';
      const allocation = resolveThirdPlaceAllocation(qualifiedGroups);
      for (const [matchId, assignedGroup] of Object.entries(allocation)) {
        if (assignedGroup === groupId) {
          const fixture = MATCH_BY_ID[Number(matchId)];
          if (!fixture) return `M${matchId}: 3${groupId}`;
          return `M${matchId}: ${fixture.slotA.label} vs 3${groupId}`;
        }
      }
    } catch {
      return '3rd place — top 8';
    }
  }

  return 'Eliminated';
}
