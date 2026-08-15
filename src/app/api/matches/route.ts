import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import type { Match } from '@/types';

const kvUrl = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const kvToken = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_PUBLISHABLE_KEY;

export async function GET() {
  // 1. Try Supabase if configured
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
          return NextResponse.json({ matches: rows[0].data }, {
            headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' },
          });
        }
      }
    } catch (e) {
      console.warn('Supabase read error:', e);
    }
  }

  // 2. Try Upstash / Vercel KV if configured
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
          return NextResponse.json({ matches }, {
            headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' },
          });
        }
      }
    } catch (e) {
      console.warn('Cloud KV read error:', e);
    }
  }

  // 3. Fallback to local file matches.json
  try {
    const filePath = path.join(process.cwd(), 'data', 'matches.json');
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf8');
      return NextResponse.json(JSON.parse(data), {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
      });
    }
  } catch (error) {
    console.error('Local file read error:', error);
  }

  return NextResponse.json({ matches: [] });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const matches: Match[] = body.matches;

    if (!Array.isArray(matches)) {
      return NextResponse.json({ error: 'Invalid data format' }, { status: 400 });
    }

    // 1. Save to Supabase if configured
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
        console.error('Supabase write error:', e);
      }
    }

    // 2. Save to Cloud KV (Upstash / Vercel KV) if configured
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
        console.error('Cloud KV write error:', e);
      }
    }

    // 3. Also write to local disk (for local dev)
    try {
      const filePath = path.join(process.cwd(), 'data', 'matches.json');
      fs.writeFileSync(filePath, JSON.stringify({ matches }, null, 2), 'utf8');
    } catch (e) {
      // In Vercel serverless disk is read-only
    }

    return NextResponse.json({ success: true, message: 'Data matches berhasil disimpan!' }, {
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to write matches data' }, { status: 500 });
  }
}
