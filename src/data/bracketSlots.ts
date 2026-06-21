export interface BracketFixture {
  matchId: number;
  round: 'R32' | 'R16' | 'QF' | 'SF' | 'F';
  slotA: SlotDef;
  slotB: SlotDef;
}

export interface SlotDef {
  type: '1st' | '2nd' | '3rd' | 'win';
  group?: string;
  groups?: string[];
  winMatch?: number;
  label: string;
}

const g = (s: string) => s.split('/');

/** Official FIFA World Cup 2026 knockout bracket (matches M73–M104). */
export const OFFICIAL_MATCHES: BracketFixture[] = [
  // Round of 32
  { matchId: 73, round: 'R32', slotA: { type: '2nd', group: 'A', label: '2A' }, slotB: { type: '2nd', group: 'B', label: '2B' } },
  { matchId: 74, round: 'R32', slotA: { type: '1st', group: 'E', label: '1E' }, slotB: { type: '3rd', groups: g('A/B/C/D/F'), label: '3rd' } },
  { matchId: 75, round: 'R32', slotA: { type: '1st', group: 'F', label: '1F' }, slotB: { type: '2nd', group: 'C', label: '2C' } },
  { matchId: 76, round: 'R32', slotA: { type: '1st', group: 'C', label: '1C' }, slotB: { type: '2nd', group: 'F', label: '2F' } },
  { matchId: 77, round: 'R32', slotA: { type: '1st', group: 'I', label: '1I' }, slotB: { type: '3rd', groups: g('C/D/F/G/H'), label: '3rd' } },
  { matchId: 78, round: 'R32', slotA: { type: '2nd', group: 'E', label: '2E' }, slotB: { type: '2nd', group: 'I', label: '2I' } },
  { matchId: 79, round: 'R32', slotA: { type: '1st', group: 'A', label: '1A' }, slotB: { type: '3rd', groups: g('C/E/F/H/I'), label: '3rd' } },
  { matchId: 80, round: 'R32', slotA: { type: '1st', group: 'L', label: '1L' }, slotB: { type: '3rd', groups: g('E/H/I/J/K'), label: '3rd' } },
  { matchId: 81, round: 'R32', slotA: { type: '1st', group: 'D', label: '1D' }, slotB: { type: '3rd', groups: g('B/E/F/I/J'), label: '3rd' } },
  { matchId: 82, round: 'R32', slotA: { type: '1st', group: 'G', label: '1G' }, slotB: { type: '3rd', groups: g('A/E/H/I/J'), label: '3rd' } },
  { matchId: 83, round: 'R32', slotA: { type: '2nd', group: 'K', label: '2K' }, slotB: { type: '2nd', group: 'L', label: '2L' } },
  { matchId: 84, round: 'R32', slotA: { type: '1st', group: 'H', label: '1H' }, slotB: { type: '2nd', group: 'J', label: '2J' } },
  { matchId: 85, round: 'R32', slotA: { type: '1st', group: 'B', label: '1B' }, slotB: { type: '3rd', groups: g('E/F/G/I/J'), label: '3rd' } },
  { matchId: 86, round: 'R32', slotA: { type: '1st', group: 'J', label: '1J' }, slotB: { type: '2nd', group: 'H', label: '2H' } },
  { matchId: 87, round: 'R32', slotA: { type: '1st', group: 'K', label: '1K' }, slotB: { type: '3rd', groups: g('D/E/I/J/L'), label: '3rd' } },
  { matchId: 88, round: 'R32', slotA: { type: '2nd', group: 'D', label: '2D' }, slotB: { type: '2nd', group: 'G', label: '2G' } },

  // Round of 16
  { matchId: 89, round: 'R16', slotA: { type: 'win', winMatch: 74, label: 'W74' }, slotB: { type: 'win', winMatch: 77, label: 'W77' } },
  { matchId: 90, round: 'R16', slotA: { type: 'win', winMatch: 73, label: 'W73' }, slotB: { type: 'win', winMatch: 75, label: 'W75' } },
  { matchId: 91, round: 'R16', slotA: { type: 'win', winMatch: 76, label: 'W76' }, slotB: { type: 'win', winMatch: 78, label: 'W78' } },
  { matchId: 92, round: 'R16', slotA: { type: 'win', winMatch: 79, label: 'W79' }, slotB: { type: 'win', winMatch: 80, label: 'W80' } },
  { matchId: 93, round: 'R16', slotA: { type: 'win', winMatch: 83, label: 'W83' }, slotB: { type: 'win', winMatch: 84, label: 'W84' } },
  { matchId: 94, round: 'R16', slotA: { type: 'win', winMatch: 81, label: 'W81' }, slotB: { type: 'win', winMatch: 82, label: 'W82' } },
  { matchId: 95, round: 'R16', slotA: { type: 'win', winMatch: 86, label: 'W86' }, slotB: { type: 'win', winMatch: 88, label: 'W88' } },
  { matchId: 96, round: 'R16', slotA: { type: 'win', winMatch: 85, label: 'W85' }, slotB: { type: 'win', winMatch: 87, label: 'W87' } },

  // Quarter-finals
  { matchId: 97, round: 'QF', slotA: { type: 'win', winMatch: 89, label: 'W89' }, slotB: { type: 'win', winMatch: 90, label: 'W90' } },
  { matchId: 98, round: 'QF', slotA: { type: 'win', winMatch: 93, label: 'W93' }, slotB: { type: 'win', winMatch: 94, label: 'W94' } },
  { matchId: 99, round: 'QF', slotA: { type: 'win', winMatch: 91, label: 'W91' }, slotB: { type: 'win', winMatch: 92, label: 'W92' } },
  { matchId: 100, round: 'QF', slotA: { type: 'win', winMatch: 95, label: 'W95' }, slotB: { type: 'win', winMatch: 96, label: 'W96' } },

  // Semi-finals
  { matchId: 101, round: 'SF', slotA: { type: 'win', winMatch: 97, label: 'W97' }, slotB: { type: 'win', winMatch: 98, label: 'W98' } },
  { matchId: 102, round: 'SF', slotA: { type: 'win', winMatch: 99, label: 'W99' }, slotB: { type: 'win', winMatch: 100, label: 'W100' } },

  // Final
  { matchId: 104, round: 'F', slotA: { type: 'win', winMatch: 101, label: 'W101' }, slotB: { type: 'win', winMatch: 102, label: 'W102' } },
];

export const MATCH_BY_ID: Record<number, BracketFixture> = Object.fromEntries(
  OFFICIAL_MATCHES.map((m) => [m.matchId, m])
);

export const R32_FIXTURES = OFFICIAL_MATCHES.filter((m) => m.round === 'R32');

export const FINAL_MATCH_ID = 104;

export const ROUND_NAMES: Record<string, string> = {
  R32: 'Round of 32',
  R16: 'Round of 16',
  QF: 'Quarter-finals',
  SF: 'Semi-finals',
  F: 'Final',
};

/** Visual bracket layout — top half (SF 101). */
export function getLeftBracketMatchIds(round: 'R32' | 'R16' | 'QF' | 'SF'): number[] {
  const feeders = (matchId: number): number[] => {
    const m = MATCH_BY_ID[matchId];
    const ids: number[] = [];
    if (m.slotA.type === 'win' && m.slotA.winMatch) ids.push(m.slotA.winMatch);
    if (m.slotB.type === 'win' && m.slotB.winMatch) ids.push(m.slotB.winMatch);
    return ids;
  };

  const depth: Record<string, number> = { SF: 0, QF: 1, R16: 2, R32: 3 };
  let frontier = [101];
  for (let d = 0; d < depth[round]; d++) {
    frontier = frontier.flatMap((id) => feeders(id));
  }
  return frontier;
}

/** Visual bracket layout — bottom half (SF 102). */
export function getRightBracketMatchIds(round: 'R32' | 'R16' | 'QF' | 'SF'): number[] {
  const feeders = (matchId: number): number[] => {
    const m = MATCH_BY_ID[matchId];
    const ids: number[] = [];
    if (m.slotA.type === 'win' && m.slotA.winMatch) ids.push(m.slotA.winMatch);
    if (m.slotB.type === 'win' && m.slotB.winMatch) ids.push(m.slotB.winMatch);
    return ids;
  };

  const depth: Record<string, number> = { SF: 0, QF: 1, R16: 2, R32: 3 };
  let frontier = [102];
  for (let d = 0; d < depth[round]; d++) {
    frontier = frontier.flatMap((id) => feeders(id));
  }
  return frontier;
}
