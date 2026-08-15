import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { neon } from '@neondatabase/serverless';
import type { Match } from '@/types';
import defaultMatchesData from '../../../../data/matches.json';

const neonDbUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_PUBLISHABLE_KEY;

const kvUrl = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const kvToken = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

function getInitialDefaultMatches(): Match[] {
  try {
    const filePath = path.join(process.cwd(), 'data', 'matches.json');
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      const parsed = JSON.parse(content);
      if (parsed && Array.isArray(parsed.matches)) {
        return parsed.matches;
      }
    }
  } catch {
    // fallback
  }
  return defaultMatchesData.matches as Match[];
}

export async function GET() {
  const defaultMatches = getInitialDefaultMatches();

  // 1. PRIMARY: NEON SERVERLESS POSTGRES
  if (neonDbUrl) {
    try {
      const sql = neon(neonDbUrl);
      // Auto create table if not exists
      await sql`CREATE TABLE IF NOT EXISTS app_state (id TEXT PRIMARY KEY, data JSONB);`;
      const rows = await sql`SELECT data FROM app_state WHERE id = 'pr_matches';`;

      if (rows && rows.length > 0 && rows[0].data) {
        return NextResponse.json({ matches: rows[0].data, source: 'neon-postgres' }, {
          headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' },
        });
      }

      // If empty, auto-seed Neon Postgres
      await sql`INSERT INTO app_state (id, data) VALUES ('pr_matches', ${JSON.stringify(defaultMatches)}) ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data;`;
      return NextResponse.json({ matches: defaultMatches, source: 'neon-postgres-seeded' }, {
        headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' },
      });
    } catch (e) {
      console.warn('Neon Postgres GET error:', e);
    }
  }

  // 2. SECONDARY: SUPABASE POSTGRES
  if (supabaseUrl && supabaseKey) {
    try {
      const res = await fetch(`${supabaseUrl}/rest/v1/app_state?id=eq.pr_matches&select=data`, {
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
        },
        cache: 'no-store',
      });

      if (res.ok) {
        const rows = await res.json();
        if (Array.isArray(rows) && rows.length > 0 && rows[0].data) {
          return NextResponse.json({ matches: rows[0].data, source: 'supabase' }, {
            headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' },
          });
        }

        // Auto-seed Supabase
        await fetch(`${supabaseUrl}/rest/v1/app_state`, {
          method: 'POST',
          headers: {
            apikey: supabaseKey,
            Authorization: `Bearer ${supabaseKey}`,
            'Content-Type': 'application/json',
            Prefer: 'resolution=merge-duplicates',
          },
          body: JSON.stringify({ id: 'pr_matches', data: defaultMatches }),
        });

        return NextResponse.json({ matches: defaultMatches, source: 'supabase-seeded' }, {
          headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' },
        });
      }
    } catch (e) {
      console.warn('Supabase GET error:', e);
    }
  }

  // 3. TERTIARY: CLOUD KV (UPSTASH / VERCEL KV)
  if (kvUrl && kvToken) {
    try {
      const res = await fetch(`${kvUrl}/get/pr_matches`, {
        headers: { Authorization: `Bearer ${kvToken}` },
        cache: 'no-store',
      });
      if (res.ok) {
        const data = await res.json();
        if (data.result) {
          const matches = typeof data.result === 'string' ? JSON.parse(data.result) : data.result;
          return NextResponse.json({ matches, source: 'upstash' }, {
            headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' },
          });
        }
      }
    } catch (e) {
      console.warn('Cloud KV GET error:', e);
    }
  }

  // 4. FALLBACK: LOCAL FILE
  return NextResponse.json({ matches: defaultMatches, source: 'default' }, {
    headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' },
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const matches: Match[] = body.matches;

    if (!Array.isArray(matches)) {
      return NextResponse.json({ error: 'Invalid data format' }, { status: 400 });
    }

    // 1. PRIMARY: SAVE TO NEON SERVERLESS POSTGRES
    if (neonDbUrl) {
      try {
        const sql = neon(neonDbUrl);
        await sql`CREATE TABLE IF NOT EXISTS app_state (id TEXT PRIMARY KEY, data JSONB);`;
        await sql`INSERT INTO app_state (id, data) VALUES ('pr_matches', ${JSON.stringify(matches)}) ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data;`;
      } catch (e) {
        console.error('Neon Postgres POST error:', e);
      }
    }

    // 2. SECONDARY: SAVE TO SUPABASE POSTGRES
    if (supabaseUrl && supabaseKey) {
      try {
        await fetch(`${supabaseUrl}/rest/v1/app_state`, {
          method: 'POST',
          headers: {
            apikey: supabaseKey,
            Authorization: `Bearer ${supabaseKey}`,
            'Content-Type': 'application/json',
            Prefer: 'resolution=merge-duplicates',
          },
          body: JSON.stringify({ id: 'pr_matches', data: matches }),
        });
      } catch (e) {
        console.error('Supabase POST error:', e);
      }
    }

    // 3. TERTIARY: SAVE TO CLOUD KV (UPSTASH)
    if (kvUrl && kvToken) {
      try {
        await fetch(`${kvUrl}/set/pr_matches`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${kvToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(JSON.stringify(matches)),
        });
      } catch (e) {
        console.error('Cloud KV POST error:', e);
      }
    }

    // 4. LOCAL FILE DISK FALLBACK
    try {
      const filePath = path.join(process.cwd(), 'data', 'matches.json');
      fs.writeFileSync(filePath, JSON.stringify({ matches }, null, 2), 'utf8');
    } catch {
      // serverless read-only
    }

    return NextResponse.json({ success: true, message: 'Data pertandingan berhasil disimpan ke Postgres Database!' }, {
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save matches data' }, { status: 500 });
  }
}
