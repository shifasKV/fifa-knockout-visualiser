import { createClient } from '@supabase/supabase-js';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const STARTING_COUNT = 11361;

function getAdminClient() {
  const url = process.env.VITE_SUPABASE_URL ?? process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    return null;
  }

  return createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

async function ensureSeedRow(
  supabase: ReturnType<typeof createClient>
): Promise<void> {
  const { data } = await supabase
    .from('visitor_counter')
    .select('id')
    .eq('id', 1)
    .maybeSingle();

  if (data) return;

  const { error } = await supabase
    .from('visitor_counter')
    .insert({ id: 1, count: STARTING_COUNT });

  if (error && !error.message.includes('duplicate')) {
    throw error;
  }
}

async function readCount(
  supabase: ReturnType<typeof createClient>
): Promise<number> {
  await ensureSeedRow(supabase);

  const { data, error } = await supabase
    .from('visitor_counter')
    .select('count')
    .eq('id', 1)
    .maybeSingle();

  if (error) throw error;
  return data?.count ?? STARTING_COUNT;
}

async function incrementCount(
  supabase: ReturnType<typeof createClient>
): Promise<number> {
  await ensureSeedRow(supabase);

  const { data, error } = await supabase.rpc('increment_visitor');
  if (!error && data != null) {
    return Number(data);
  }

  const current = await readCount(supabase);
  const next = current + 1;
  const { error: updateError } = await supabase
    .from('visitor_counter')
    .update({ count: next })
    .eq('id', 1);

  if (updateError) throw updateError;
  return next;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 'no-store');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  const supabase = getAdminClient();
  if (!supabase) {
    return res.status(500).json({
      error: 'Missing SUPABASE_SERVICE_ROLE_KEY or SUPABASE_URL on Vercel',
    });
  }

  try {
    if (req.method === 'GET') {
      const count = await readCount(supabase);
      return res.status(200).json({ count });
    }

    if (req.method === 'POST') {
      const count = await incrementCount(supabase);
      return res.status(200).json({ count });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : typeof error === 'object' && error !== null && 'message' in error
          ? String((error as { message: unknown }).message)
          : JSON.stringify(error);
    return res.status(500).json({ error: message });
  }
}
