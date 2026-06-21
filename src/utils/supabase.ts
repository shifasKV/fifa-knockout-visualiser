import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const supabase =
  supabaseUrl && supabaseKey
    ? createClient(supabaseUrl, supabaseKey)
    : null;

/**
 * Increments the global visitor count in Supabase and returns the new total.
 * Falls back to localStorage if Supabase is not configured.
 *
 * Supabase table schema (run once in SQL editor):
 *
 *   create table if not exists visitor_counter (
 *     id int primary key default 1,
 *     count bigint not null default 11361
 *   );
 *   insert into visitor_counter (id, count) values (1, 11361) on conflict do nothing;
 *
 *   -- RPC to atomically increment
 *   create or replace function increment_visitor()
 *   returns bigint as $$
 *     update visitor_counter set count = count + 1 where id = 1 returning count;
 *   $$ language sql;
 */
export async function incrementVisitorCount(): Promise<number> {
  if (!supabase) {
    return incrementLocalCount();
  }

  try {
    const { data, error } = await supabase.rpc('increment_visitor');
    if (error || data == null) {
      console.warn('Supabase counter failed, using localStorage:', error);
      return incrementLocalCount();
    }
    return typeof data === 'number' ? data : Number(data);
  } catch {
    return incrementLocalCount();
  }
}

function incrementLocalCount(): number {
  const KEY = 'fifa-bracket-visitor-count';
  const stored = localStorage.getItem(KEY);
  const current = stored ? parseInt(stored, 10) : 11361;
  const next = current + 1;
  localStorage.setItem(KEY, String(next));
  return next;
}
