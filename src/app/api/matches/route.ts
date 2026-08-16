import { NextResponse } from 'next/server';
import { getDb, initDatabase } from '@/lib/db';
import { DEFAULT_MATCHES } from '@/lib/data';

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
    
    if (process.env.DATABASE_URL || process.env.POSTGRES_URL) {
      try {
        const sql = getDb();
        await initDatabase();

        // 1. Try reading from app_state table first (for universal cloud state)
        try {
          const appStateRows = await sql`SELECT data FROM app_state WHERE id = 'pr_matches'`;
          if (appStateRows && appStateRows.length > 0 && appStateRows[0].data) {
            const matches = appStateRows[0].data;
            const filtered = sport ? matches.filter((m: any) => m.sport === sport) : matches;
            return NextResponse.json(
              { matches: filtered, source: 'neon-app-state' },
              { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' } }
            );
          }
        } catch {
          // fallback to matches table
        }

        // 2. Try reading from matches table
        try {
          const rows = sport
            ? await sql`SELECT * FROM matches WHERE sport = ${sport} ORDER BY date, time`
            : await sql`SELECT * FROM matches ORDER BY date, time`;

          if (rows && rows.length > 0) {
            return NextResponse.json(
              { matches: rows.map(rowToMatch), source: 'neon-postgres' },
              { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' } }
            );
          }
        } catch {
          // ignore
        }
      } catch (e) {
        console.warn('Neon DB query error in /api/matches:', e);
      }
    }

    const filtered = sport ? DEFAULT_MATCHES.filter(m => m.sport === sport) : DEFAULT_MATCHES;
    return NextResponse.json(
      { matches: filtered, source: 'default-fallback' },
      { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' } }
    );
  } catch (error) {
    console.error('GET /api/matches error:', error);
    return NextResponse.json({ matches: DEFAULT_MATCHES, source: 'error-fallback' });
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

    let saved = false;

    if (process.env.DATABASE_URL || process.env.POSTGRES_URL) {
      try {
        const sql = getDb();
        await initDatabase();

        // 1. Save to app_state table
        try {
          await sql`
            INSERT INTO app_state (id, data)
            VALUES ('pr_matches', ${JSON.stringify(matches)})
            ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data
          `;
          saved = true;
        } catch (e) {
          console.warn('Write to app_state failed:', e);
        }

        // 2. Save to matches table if available
        try {
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
          saved = true;
        } catch (e) {
          console.warn('Write to matches table failed:', e);
        }
      } catch (err) {
        console.error('Neon DB save error:', err);
      }
    }

    return NextResponse.json({
      success: true,
      message: saved ? 'Semua pertandingan berhasil disimpan ke Neon Postgres!' : 'Data diperbarui di runtime!',
    }, { headers: { 'Cache-Control': 'no-store' } });
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

    if (process.env.DATABASE_URL || process.env.POSTGRES_URL) {
      try {
        const sql = getDb();
        await initDatabase();

        const id = m.id || `match-${Date.now()}`;
        try {
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
        } catch {
          // ignore
        }
      } catch (e) {
        console.warn('PUT match DB error:', e);
      }
    }

    return NextResponse.json({ success: true, message: 'Pertandingan berhasil disimpan!' });
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

    if (process.env.DATABASE_URL || process.env.POSTGRES_URL) {
      try {
        const sql = getDb();
        await initDatabase();
        await sql`DELETE FROM matches WHERE id = ${id}`;
      } catch (e) {
        console.warn('DELETE match DB error:', e);
      }
    }

    return NextResponse.json({ success: true, message: 'Pertandingan berhasil dihapus!' });
  } catch (error) {
    console.error('DELETE /api/matches error:', error);
    return NextResponse.json({ error: 'Failed to delete match' }, { status: 500 });
  }
}
