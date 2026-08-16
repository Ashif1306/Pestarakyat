import { NextResponse } from 'next/server';
import { getDb, initDatabase } from '@/lib/db';
import { DEFAULT_TEAMS } from '@/lib/data';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sport = searchParams.get('sport');

    if (process.env.DATABASE_URL || process.env.POSTGRES_URL) {
      try {
        const sql = getDb();
        await initDatabase();

        const rows = sport
          ? await sql`SELECT * FROM teams WHERE sport_id = ${sport} ORDER BY group_name, name`
          : await sql`SELECT * FROM teams ORDER BY sport_id, group_name, name`;

        if (rows && rows.length > 0) {
          const teams = rows.map((r: any) => ({
            id: r.id,
            name: r.name,
            sport_id: r.sport_id,
            group: r.group_name,
          }));
          return NextResponse.json({ teams }, { headers: { 'Cache-Control': 'no-store' } });
        }
      } catch (e) {
        console.warn('Neon DB query error in /api/teams:', e);
      }
    }

    const fallbackTeams = sport ? DEFAULT_TEAMS[sport] || [] : Object.values(DEFAULT_TEAMS).flat();
    return NextResponse.json({ teams: fallbackTeams }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    console.error('GET /api/teams error:', error);
    return NextResponse.json({ teams: [] }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, sport_id, group_name } = body;
    if (!name || !sport_id || !group_name) {
      return NextResponse.json({ error: 'name, sport_id, group_name are required' }, { status: 400 });
    }
    const sql = getDb();
    await initDatabase();

    const id = `${sport_id}-t-${Date.now()}`;
    await sql`INSERT INTO teams (id, name, sport_id, group_name) VALUES (${id}, ${name}, ${sport_id}, ${group_name})`;

    return NextResponse.json({ success: true, id, message: `Tim "${name}" berhasil ditambahkan ke Grup ${group_name}!` });
  } catch (error) {
    console.error('POST /api/teams error:', error);
    return NextResponse.json({ error: 'Failed to add team' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, name, group_name } = body;
    if (!id || !name || !group_name) {
      return NextResponse.json({ error: 'id, name, group_name are required' }, { status: 400 });
    }
    const sql = getDb();
    await sql`UPDATE teams SET name = ${name}, group_name = ${group_name} WHERE id = ${id}`;

    return NextResponse.json({ success: true, message: `Tim berhasil diperbarui!` });
  } catch (error) {
    console.error('PUT /api/teams error:', error);
    return NextResponse.json({ error: 'Failed to update team' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'id is required' }, { status: 400 });
    }
    const sql = getDb();
    await sql`DELETE FROM teams WHERE id = ${id}`;

    return NextResponse.json({ success: true, message: 'Tim berhasil dihapus!' });
  } catch (error) {
    console.error('DELETE /api/teams error:', error);
    return NextResponse.json({ error: 'Failed to delete team' }, { status: 500 });
  }
}
