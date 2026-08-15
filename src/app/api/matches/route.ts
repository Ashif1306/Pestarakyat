import { NextResponse } from 'next/server';
import { getDb, initDatabase } from '@/lib/db';

function rowToMatch(r: any) {
  return {
    id: r.id,
    sport: r.sport,
    phase: r.phase,
    group: r.group_name,
    round: r.round,
    teamA: r.team_a,
    teamB: r.team_b,
    date: r.date,
    time: r.time,
    venue: r.venue,
    status: r.status,
    scoreA: r.score_a,
    scoreB: r.score_b,
    winner: r.winner,
  };
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sport = searchParams.get('sport');
    const sql = getDb();
    await initDatabase();

    const rows = sport
      ? await sql`SELECT * FROM matches WHERE sport = ${sport} ORDER BY date, time`
      : await sql`SELECT * FROM matches ORDER BY date, time`;

    return NextResponse.json(
      { matches: rows.map(rowToMatch), source: 'neon-postgres' },
      { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' } }
    );
  } catch (error) {
    console.error('GET /api/matches error:', error);
    return NextResponse.json({ error: 'Failed to fetch matches' }, { status: 500 });
  }
}

// POST: Batch upsert all matches (bulk save from admin)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const matches = body.matches;
    if (!Array.isArray(matches)) {
      return NextResponse.json({ error: 'matches array required' }, { status: 400 });
    }
    const sql = getDb();
    await initDatabase();

    for (const m of matches) {
      await sql`
        INSERT INTO matches (id, sport, phase, group_name, round, team_a, team_b, date, time, venue, status, score_a, score_b, winner)
        VALUES (${m.id}, ${m.sport}, ${m.phase}, ${m.group || null}, ${m.round}, ${m.teamA}, ${m.teamB}, ${m.date}, ${m.time}, ${m.venue}, ${m.status}, ${m.scoreA ?? null}, ${m.scoreB ?? null}, ${m.winner ?? null})
        ON CONFLICT (id) DO UPDATE SET
          sport = EXCLUDED.sport, phase = EXCLUDED.phase, group_name = EXCLUDED.group_name,
          round = EXCLUDED.round, team_a = EXCLUDED.team_a, team_b = EXCLUDED.team_b,
          date = EXCLUDED.date, time = EXCLUDED.time, venue = EXCLUDED.venue,
          status = EXCLUDED.status, score_a = EXCLUDED.score_a, score_b = EXCLUDED.score_b,
          winner = EXCLUDED.winner
      `;
    }

    return NextResponse.json({ success: true, message: 'Semua pertandingan berhasil disimpan ke Neon Postgres!' }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    console.error('POST /api/matches error:', error);
    return NextResponse.json({ error: 'Failed to save matches' }, { status: 500 });
  }
}

// PUT: Add or update one single match
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const m = body.match;
    if (!m || !m.id) {
      return NextResponse.json({ error: 'match object with id required' }, { status: 400 });
    }
    const sql = getDb();
    await initDatabase();

    const id = m.id || `match-${Date.now()}`;
    await sql`
      INSERT INTO matches (id, sport, phase, group_name, round, team_a, team_b, date, time, venue, status, score_a, score_b, winner)
      VALUES (${id}, ${m.sport}, ${m.phase}, ${m.group || null}, ${m.round}, ${m.teamA}, ${m.teamB}, ${m.date}, ${m.time}, ${m.venue}, ${m.status}, ${m.scoreA ?? null}, ${m.scoreB ?? null}, ${m.winner ?? null})
      ON CONFLICT (id) DO UPDATE SET
        sport = EXCLUDED.sport, phase = EXCLUDED.phase, group_name = EXCLUDED.group_name,
        round = EXCLUDED.round, team_a = EXCLUDED.team_a, team_b = EXCLUDED.team_b,
        date = EXCLUDED.date, time = EXCLUDED.time, venue = EXCLUDED.venue,
        status = EXCLUDED.status, score_a = EXCLUDED.score_a, score_b = EXCLUDED.score_b,
        winner = EXCLUDED.winner
    `;

    return NextResponse.json({ success: true, id, message: 'Pertandingan berhasil disimpan!' });
  } catch (error) {
    console.error('PUT /api/matches error:', error);
    return NextResponse.json({ error: 'Failed to upsert match' }, { status: 500 });
  }
}

// DELETE: Remove one match by id
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'id is required' }, { status: 400 });
    }
    const sql = getDb();
    await sql`DELETE FROM matches WHERE id = ${id}`;

    return NextResponse.json({ success: true, message: 'Pertandingan berhasil dihapus!' });
  } catch (error) {
    console.error('DELETE /api/matches error:', error);
    return NextResponse.json({ error: 'Failed to delete match' }, { status: 500 });
  }
}
