import { neon } from '@neondatabase/serverless';
import fs from 'fs';

const sql = neon(process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_3zmx1GoBjZOM@ep-curly-dust-azxmkqbz-pooler.c-3.ap-southeast-1.aws.neon.tech/neondb?sslmode=require');

function rowToMatch(r) {
  return {
    id: r.id,
    sport: r.sport,
    phase: r.phase,
    group: r.group_name || undefined,
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

async function gen() {
  const rows = await sql`SELECT * FROM matches ORDER BY sport, id`;
  const matches = rows.map(rowToMatch);
  console.log(`Exported ${matches.length} matches.`);
  fs.writeFileSync('scripts/matches_dump.json', JSON.stringify(matches, null, 2));
}

gen().catch(console.error);
