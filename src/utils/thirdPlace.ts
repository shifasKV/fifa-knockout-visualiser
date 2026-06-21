import {
  FIFA_THIRD_PLACE_TABLE,
  THIRD_PLACE_MATCH_ORDER,
} from '../data/thirdPlaceTable';

/**
 * Official FIFA Annex C third-place allocation.
 * Key = 8 qualified third-place groups sorted alphabetically.
 * Value maps each match in THIRD_PLACE_MATCH_ORDER to a group letter.
 */
export function resolveThirdPlaceAllocation(
  qualifiedThirdGroups: string[]
): Record<number, string> {
  const key = [...qualifiedThirdGroups].sort().join('');
  const encoded = FIFA_THIRD_PLACE_TABLE[key];

  if (!encoded) {
    throw new Error(`No FIFA third-place allocation found for ${key}`);
  }

  return Object.fromEntries(
    THIRD_PLACE_MATCH_ORDER.map((matchId, index) => [matchId, encoded[index]])
  );
}

export { THIRD_PLACE_MATCH_ORDER, FIFA_THIRD_PLACE_TABLE };
