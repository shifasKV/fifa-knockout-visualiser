import { createClient } from '@supabase/supabase-js';

const STARTING_COUNT = 11361;
const SESSION_KEY = 'fifa-bracket-visit-recorded';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const supabase =
  supabaseUrl && supabaseKey
    ? createClient(supabaseUrl, supabaseKey)
    : null;

async function fetchCountFromApi(): Promise<number | null> {
  try {
    const res = await fetch('/api/visitor');
    if (!res.ok) return null;
    const body = (await res.json()) as { count?: number };
    return body.count ?? null;
  } catch {
    return null;
  }
}

async function incrementCountFromApi(): Promise<number | null> {
  try {
    const res = await fetch('/api/visitor', { method: 'POST' });
    if (!res.ok) return null;
    const body = (await res.json()) as { count?: number };
    return body.count ?? null;
  } catch {
    return null;
  }
}

async function fetchCountFromSupabase(): Promise<number | null> {
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('visitor_counter')
    .select('count')
    .eq('id', 1)
    .maybeSingle();

  if (error || data == null) return null;
  return Number(data.count);
}

async function incrementCountFromSupabase(): Promise<number | null> {
  if (!supabase) return null;

  const { data, error } = await supabase.rpc('increment_visitor');
  if (error || data == null) return null;
  return Number(data);
}

/**
 * Records one visit per browser session and returns the global count.
 * Uses Vercel API (service role) in production, then Supabase RPC fallback.
 */
export async function recordVisitorVisit(): Promise<number> {
  const alreadyRecorded = sessionStorage.getItem(SESSION_KEY) === '1';

  if (alreadyRecorded) {
    const existing =
      (await fetchCountFromApi()) ??
      (await fetchCountFromSupabase()) ??
      STARTING_COUNT;
    return existing;
  }

  const next =
    (await incrementCountFromApi()) ??
    (await incrementCountFromSupabase());

  if (next != null) {
    sessionStorage.setItem(SESSION_KEY, '1');
    return next;
  }

  return STARTING_COUNT;
}
