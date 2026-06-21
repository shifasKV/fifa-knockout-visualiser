export interface Team {
  id: string;
  name: string;
  flag: string;
  group: string;
}

export interface Group {
  id: string;
  name: string;
  teams: Team[];
}

export interface Match {
  id: string;
  round: number;
  position: number;
  teamA: Team | null;
  teamB: Team | null;
  winnerId: string | null;
  nextMatchId: string | null;
  nextSlot: 'A' | 'B' | null;
}

export interface ThirdPlaceEntry {
  group: string;
  team: Team;
  qualified: boolean;
}

const t = (id: string, name: string, flag: string, group: string): Team => ({
  id,
  name,
  flag,
  group,
});

export const ALL_TEAMS: Record<string, Team> = {
  MEX: t('MEX', 'Mexico', '🇲🇽', 'A'),
  RSA: t('RSA', 'South Africa', '🇿🇦', 'A'),
  KOR: t('KOR', 'South Korea', '🇰🇷', 'A'),
  CZE: t('CZE', 'Czechia', '🇨🇿', 'A'),

  CAN: t('CAN', 'Canada', '🇨🇦', 'B'),
  BIH: t('BIH', 'Bosnia & Herzegovina', '🇧🇦', 'B'),
  QAT: t('QAT', 'Qatar', '🇶🇦', 'B'),
  SUI: t('SUI', 'Switzerland', '🇨🇭', 'B'),

  BRA: t('BRA', 'Brazil', '🇧🇷', 'C'),
  MAR: t('MAR', 'Morocco', '🇲🇦', 'C'),
  HAI: t('HAI', 'Haiti', '🇭🇹', 'C'),
  SCO: t('SCO', 'Scotland', '🏴󠁧󠁢󠁳󠁣󠁴󠁿', 'C'),

  USA: t('USA', 'United States', '🇺🇸', 'D'),
  PAR: t('PAR', 'Paraguay', '🇵🇾', 'D'),
  AUS: t('AUS', 'Australia', '🇦🇺', 'D'),
  TUR: t('TUR', 'Türkiye', '🇹🇷', 'D'),

  GER: t('GER', 'Germany', '🇩🇪', 'E'),
  CUW: t('CUW', 'Curaçao', '🇨🇼', 'E'),
  CIV: t('CIV', 'Ivory Coast', '🇨🇮', 'E'),
  ECU: t('ECU', 'Ecuador', '🇪🇨', 'E'),

  NED: t('NED', 'Netherlands', '🇳🇱', 'F'),
  JPN: t('JPN', 'Japan', '🇯🇵', 'F'),
  SWE: t('SWE', 'Sweden', '🇸🇪', 'F'),
  TUN: t('TUN', 'Tunisia', '🇹🇳', 'F'),

  BEL: t('BEL', 'Belgium', '🇧🇪', 'G'),
  EGY: t('EGY', 'Egypt', '🇪🇬', 'G'),
  IRN: t('IRN', 'Iran', '🇮🇷', 'G'),
  NZL: t('NZL', 'New Zealand', '🇳🇿', 'G'),

  ESP: t('ESP', 'Spain', '🇪🇸', 'H'),
  CPV: t('CPV', 'Cape Verde', '🇨🇻', 'H'),
  KSA: t('KSA', 'Saudi Arabia', '🇸🇦', 'H'),
  URU: t('URU', 'Uruguay', '🇺🇾', 'H'),

  FRA: t('FRA', 'France', '🇫🇷', 'I'),
  SEN: t('SEN', 'Senegal', '🇸🇳', 'I'),
  IRQ: t('IRQ', 'Iraq', '🇮🇶', 'I'),
  NOR: t('NOR', 'Norway', '🇳🇴', 'I'),

  ARG: t('ARG', 'Argentina', '🇦🇷', 'J'),
  ALG: t('ALG', 'Algeria', '🇩🇿', 'J'),
  AUT: t('AUT', 'Austria', '🇦🇹', 'J'),
  JOR: t('JOR', 'Jordan', '🇯🇴', 'J'),

  POR: t('POR', 'Portugal', '🇵🇹', 'K'),
  COD: t('COD', 'DR Congo', '🇨🇩', 'K'),
  UZB: t('UZB', 'Uzbekistan', '🇺🇿', 'K'),
  COL: t('COL', 'Colombia', '🇨🇴', 'K'),

  ENG: t('ENG', 'England', '🏴󠁧󠁢󠁥󠁮󠁧󠁿', 'L'),
  CRO: t('CRO', 'Croatia', '🇭🇷', 'L'),
  GHA: t('GHA', 'Ghana', '🇬🇭', 'L'),
  PAN: t('PAN', 'Panama', '🇵🇦', 'L'),
};
