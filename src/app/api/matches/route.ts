import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import type { Match } from '@/types';
import defaultMatchesData from '../../../../data/matches.json';

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

  // 1. PRIMARY: SUPABASE DATABASE
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
            headers: {
              'Cache-Control': 'no-store, no-cache, must-revalidate',
            },
          });
        }

        // If Supabase is connected but empty, AUTO-SEED Supabase with default matches!
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

  // 2. SECONDARY: UPSTASH / VERCEL KV
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

  // 3. FALLBACK: INITIAL DATA
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

    // 1. PRIMARY: SAVE TO SUPABASE DATABASE
    if (supabaseUrl && supabaseKey) {
      try {
        const res = await fetch(`${supabaseUrl}/rest/v1/app_state`, {
          method: 'POST',
          headers: {
            apikey: supabaseKey,
            Authorization: `Bearer ${supabaseKey}`,
            'Content-Type': 'application/json',
            Prefer: 'resolution=merge-duplicates',
          },
          body: JSON.stringify({ id: 'pr_matches', data: matches }),
        });
        if (!res.ok) {
          console.error('Supabase write HTTP error:', res.status, await res.text());
        }
      } catch (e) {
        console.error('Supabase POST error:', e);
      }
    }

    // 2. SECONDARY: SAVE TO CLOUD KV (if present)
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

    // 3. LOCAL FILE FALLBACK (for offline local development)
    try {
      const filePath = path.join(process.cwd(), 'data', 'matches.json');
      fs.writeFileSync(filePath, JSON.stringify({ matches }, null, 2), 'utf8');
    } catch {
      // expected on serverless
    }

    return NextResponse.json({ success: true, message: 'Data pertandingan berhasil disimpan ke Supabase Database!' }, {
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save matches data' }, { status: 500 });
  }
}
