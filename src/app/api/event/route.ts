import { NextResponse } from 'next/server';
import { getDb, initDatabase } from '@/lib/db';
import { DEFAULT_EVENT } from '@/lib/data';

export async function GET() {
  try {
    if (process.env.DATABASE_URL || process.env.POSTGRES_URL) {
      try {
        const sql = getDb();
        await initDatabase();

        const eventRows = await sql`SELECT * FROM event LIMIT 1`;
        const sportsRows = await sql`SELECT * FROM sports ORDER BY id`;

        if (eventRows && eventRows.length > 0) {
          const ev = eventRows[0];
          return NextResponse.json({
            name: ev.name,
            tagline: ev.tagline,
            description: ev.description,
            startDate: ev.start_date,
            endDate: ev.end_date,
            location: ev.location,
            organizer: ev.organizer,
            sports: sportsRows.map((s: any) => ({
              id: s.id,
              name: s.name,
              icon: s.icon,
              color: s.color,
              totalTeams: s.total_teams,
              totalGroups: s.total_groups,
            })),
          }, { headers: { 'Cache-Control': 'no-store' } });
        }
      } catch (e) {
        console.warn('Neon DB query error in /api/event:', e);
      }
    }

    return NextResponse.json(DEFAULT_EVENT, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    console.error('GET /api/event error:', error);
    return NextResponse.json(DEFAULT_EVENT, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const sql = getDb();
    await initDatabase();

    await sql`
      UPDATE event SET
        name = ${body.name},
        tagline = ${body.tagline},
        description = ${body.description},
        start_date = ${body.startDate},
        end_date = ${body.endDate},
        location = ${body.location},
        organizer = ${body.organizer}
      WHERE id = (SELECT id FROM event LIMIT 1)
    `;

    return NextResponse.json({ success: true, message: 'Info event berhasil diperbarui!' });
  } catch (error) {
    console.error('PUT /api/event error:', error);
    return NextResponse.json({ error: 'Failed to update event' }, { status: 500 });
  }
}
