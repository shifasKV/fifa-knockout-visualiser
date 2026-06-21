import { createClient } from '@supabase/supabase-js';

const STARTING_COUNT = 11361;

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const supabase =
  supabaseUrl && supabaseKey
    ? createClient(supabaseUrl, supabaseKey)
    : null;

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

async function incrementCountFromSupabase(): Promise<number | null> {
  if (!supabase) return null;

  const { data, error } = await supabase.rpc('increment_visitor');
  if (error || data == null) return null;
  return Number(data);
}

/**
 * Increments the global view counter on every page load (YouTube-style).
 * Tries Vercel API first (service role), then Supabase RPC.
 */
export async function recordVisitorVisit(): Promise<number> {
  const next =
    (await incrementCountFromApi()) ?? (await incrementCountFromSupabase());

  return next ?? STARTING_COUNT;
}
