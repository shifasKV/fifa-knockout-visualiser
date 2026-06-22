import { ALL_TEAMS, type Group } from './teams';

const T = ALL_TEAMS;

export const INITIAL_GROUPS: Group[] = [
  { id: 'A', name: 'Group A', teams: [T.MEX, T.RSA, T.KOR, T.CZE] },
  { id: 'B', name: 'Group B', teams: [T.CAN, T.BIH, T.QAT, T.SUI] },
  { id: 'C', name: 'Group C', teams: [T.BRA, T.MAR, T.HAI, T.SCO] },
  { id: 'D', name: 'Group D', teams: [T.USA, T.AUS, T.PAR, T.TUR] },
  { id: 'E', name: 'Group E', teams: [T.GER, T.CIV, T.CUW, T.ECU] },
  { id: 'F', name: 'Group F', teams: [T.NED, T.JPN, T.SWE, T.TUN] },
  { id: 'G', name: 'Group G', teams: [T.EGY, T.BEL, T.NZL, T.IRN] },
  { id: 'H', name: 'Group H', teams: [T.ESP, T.URU, T.CPV, T.KSA] },
  { id: 'I', name: 'Group I', teams: [T.FRA, T.SEN, T.NOR, T.IRQ] },
  { id: 'J', name: 'Group J', teams: [T.ARG, T.AUT, T.ALG, T.JOR] },
  { id: 'K', name: 'Group K', teams: [T.COL, T.POR, T.COD, T.UZB] },
  { id: 'L', name: 'Group L', teams: [T.ENG, T.CRO, T.GHA, T.PAN] },
];

/** Default 3rd-place ranking by group (top 8 qualify). */
export const DEFAULT_THIRD_PLACE_GROUP_ORDER = [
  'A', // South Korea
  'D', // Paraguay
  'E', // Curaçao
  'F', // Sweden
  'G', // New Zealand
  'L', // Ghana
  'J', // Algeria
  'C', // Haiti
  'H', // Cape Verde (OUT)
  'B', // Qatar (OUT)
  'I', // Norway (OUT)
  'K', // DR Congo (OUT)
];
