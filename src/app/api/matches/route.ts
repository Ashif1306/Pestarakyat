import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import type { Match } from '@/types';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'data', 'matches.json');
    const data = fs.readFileSync(filePath, 'utf8');
    return NextResponse.json(JSON.parse(data), {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read matches data' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const matches: Match[] = body.matches;

    if (!Array.isArray(matches)) {
      return NextResponse.json({ error: 'Invalid data format' }, { status: 400 });
    }

    const filePath = path.join(process.cwd(), 'data', 'matches.json');
    fs.writeFileSync(filePath, JSON.stringify({ matches }, null, 2), 'utf8');

    return NextResponse.json({ success: true, message: 'Data matches berhasil disimpan ke database JSON!' }, {
      headers: {
        'Cache-Control': 'no-store',
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to write matches data' }, { status: 500 });
  }
}
