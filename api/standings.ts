import { createClient } from '@supabase/supabase-js';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const API_TEAMS_URL = 'https://worldcup26.ir/get/teams';
const API_GROUPS_URL = 'https://worldcup26.ir/get/groups';

interface ApiTeam {
  id: string;
  name_en: string;
  fifa_code: string;
  groups: string;
}

interface ApiGroupTeam {
  team_id: string;
  mp: string;
  w: string;
  l: string;
  d: string;
  pts: string;
  gf: string;
  ga: string;
  gd: string;
}

interface ApiGroup {
  name: string;
  teams: ApiGroupTeam[];
}

function getAdminClient() {
  const url = process.env.VITE_SUPABASE_URL ?? process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) return null;
  return createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
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
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  const supabase = getAdminClient();

  if (req.method === 'POST') {
    const authHeader = req.headers.authorization;
    const cronSecret = process.env.CRON_SECRET;
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
      const standings = await fetchLiveStandings();

      if (supabase) {
        await supabase.from('live_standings').upsert(
          { id: 1, data: standings.groups, updated_at: standings.updatedAt },
          { onConflict: 'id' }
        );
      }

      res.setHeader('Cache-Control', 'no-store');
      return res.status(200).json(standings);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return res.status(500).json({ error: message });
    }
  }

  if (req.method === 'GET') {
    if (supabase) {
      const { data } = await supabase
        .from('live_standings')
        .select('data, updated_at')
        .eq('id', 1)
        .maybeSingle();

      if (data) {
        res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=120');
        return res.status(200).json({
          groups: data.data,
          updatedAt: data.updated_at,
        });
      }
    }

    try {
      const standings = await fetchLiveStandings();

      if (supabase) {
        await supabase.from('live_standings').upsert(
          { id: 1, data: standings.groups, updated_at: standings.updatedAt },
          { onConflict: 'id' }
        );
      }

      res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=120');
      return res.status(200).json(standings);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return res.status(500).json({ error: message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
