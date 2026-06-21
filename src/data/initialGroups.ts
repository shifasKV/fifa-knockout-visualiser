import { ALL_TEAMS, type Group } from './teams';

const T = ALL_TEAMS;

export const INITIAL_GROUPS: Group[] = [
  { id: 'A', name: 'Group A', teams: [T.MEX, T.RSA, T.CZE, T.KOR] },
  { id: 'B', name: 'Group B', teams: [T.SUI, T.CAN, T.BIH, T.QAT] },
  { id: 'C', name: 'Group C', teams: [T.BRA, T.MAR, T.SCO, T.HAI] },
  { id: 'D', name: 'Group D', teams: [T.USA, T.AUS, T.PAR, T.TUR] },
  { id: 'E', name: 'Group E', teams: [T.GER, T.CIV, T.CUW, T.ECU] },
  { id: 'F', name: 'Group F', teams: [T.NED, T.JPN, T.SWE, T.TUN] },
  { id: 'G', name: 'Group G', teams: [T.BEL, T.EGY, T.IRN, T.NZL] },
  { id: 'H', name: 'Group H', teams: [T.ESP, T.URU, T.KSA, T.CPV] },
  { id: 'I', name: 'Group I', teams: [T.FRA, T.SEN, T.NOR, T.IRQ] },
  { id: 'J', name: 'Group J', teams: [T.ARG, T.AUT, T.ALG, T.JOR] },
  { id: 'K', name: 'Group K', teams: [T.COL, T.POR, T.COD, T.UZB] },
  { id: 'L', name: 'Group L', teams: [T.ENG, T.CRO, T.GHA, T.PAN] },
];
