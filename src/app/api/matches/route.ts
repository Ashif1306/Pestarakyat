import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import type { Match } from '@/types';

const kvUrl = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const kvToken = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

export async function GET() {
  // 1. Try Cloud KV Database (Vercel KV / Upstash Redis) if env variables exist
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
            headers: {
              'Cache-Control': 'no-store, no-cache, must-revalidate',
            },
          });
        }
      }
    } catch (e) {
      console.warn('Cloud KV read error, falling back to local file:', e);
    }
  }

  // 2. Fallback to local file matches.json
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

    // 1. Save to Cloud KV Database (Vercel KV / Upstash Redis) if configured
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

    // 2. Also try writing to local disk (for localhost development)
    try {
      const filePath = path.join(process.cwd(), 'data', 'matches.json');
      fs.writeFileSync(filePath, JSON.stringify({ matches }, null, 2), 'utf8');
    } catch (e) {
      // In Vercel serverless environment disk is read-only, which is expected
    }

    return NextResponse.json({ success: true, message: 'Data matches berhasil disimpan!' }, {
      headers: {
        'Cache-Control': 'no-store',
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to write matches data' }, { status: 500 });
  }
}
