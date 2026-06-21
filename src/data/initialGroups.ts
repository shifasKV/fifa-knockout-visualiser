import { ALL_TEAMS, type Group } from './teams';

const T = ALL_TEAMS;

export const INITIAL_GROUPS: Group[] = [
  { id: 'A', name: 'Group A', teams: [T.MEX, T.RSA, T.KOR, T.CZE] },
  { id: 'B', name: 'Group B', teams: [T.CAN, T.BIH, T.QAT, T.SUI] },
  { id: 'C', name: 'Group C', teams: [T.BRA, T.MAR, T.HAI, T.SCO] },
  { id: 'D', name: 'Group D', teams: [T.USA, T.PAR, T.AUS, T.TUR] },
  { id: 'E', name: 'Group E', teams: [T.GER, T.CUW, T.CIV, T.ECU] },
  { id: 'F', name: 'Group F', teams: [T.NED, T.JPN, T.SWE, T.TUN] },
  { id: 'G', name: 'Group G', teams: [T.BEL, T.EGY, T.IRN, T.NZL] },
  { id: 'H', name: 'Group H', teams: [T.ESP, T.CPV, T.KSA, T.URU] },
  { id: 'I', name: 'Group I', teams: [T.FRA, T.SEN, T.IRQ, T.NOR] },
  { id: 'J', name: 'Group J', teams: [T.ARG, T.ALG, T.AUT, T.JOR] },
  { id: 'K', name: 'Group K', teams: [T.POR, T.COD, T.UZB, T.COL] },
  { id: 'L', name: 'Group L', teams: [T.ENG, T.CRO, T.GHA, T.PAN] },
];
