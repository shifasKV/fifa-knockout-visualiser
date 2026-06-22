import type { VercelRequest, VercelResponse } from '@vercel/node';

const API_TEAMS_URL = 'https://worldcup26.ir/get/teams';
const API_GROUPS_URL = 'https://worldcup26.ir/get/groups';

interface ApiTeam {
  id: string;
  fifa_code: string;
}

interface ApiGroupTeam {
  team_id: string;
}

interface ApiGroup {
  name: string;
  teams: ApiGroupTeam[];
}

async function fetchLiveStandings(): Promise<{
  groups: Record<string, string[]>;
  updatedAt: string;
}> {
  const [teamsRes, groupsRes] = await Promise.all([
    fetch(API_TEAMS_URL),
    fetch(API_GROUPS_URL),
  ]);

  if (!teamsRes.ok || !groupsRes.ok) {
    throw new Error('Failed to fetch from worldcup26.ir');
  }

  const teamsData = (await teamsRes.json()) as { teams: ApiTeam[] };
  const groupsData = (await groupsRes.json()) as { groups: ApiGroup[] };

  const idToFifa: Record<string, string> = {};
  for (const t of teamsData.teams) {
    idToFifa[t.id] = t.fifa_code;
  }

  const groups: Record<string, string[]> = {};
  for (const g of groupsData.groups) {
    groups[g.name] = g.teams.map((t) => idToFifa[t.team_id] || t.team_id);
  }

  return { groups, updatedAt: new Date().toISOString() };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  try {
    const standings = await fetchLiveStandings();
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=120');
    return res.status(200).json(standings);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return res.status(500).json({ error: message });
  }
}
