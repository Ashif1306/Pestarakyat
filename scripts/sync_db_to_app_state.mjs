import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_3zmx1GoBjZOM@ep-curly-dust-azxmkqbz-pooler.c-3.ap-southeast-1.aws.neon.tech/neondb?sslmode=require');

function rowToMatch(r) {
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

async function sync() {
  const rows = await sql`SELECT * FROM matches ORDER BY date, time`;
  const matches = rows.map(rowToMatch);
  
  await sql`
    INSERT INTO app_state (id, data)
    VALUES ('pr_matches', ${JSON.stringify(matches)})
    ON CONFLICT (id) DO UPDATE SET data = ${JSON.stringify(matches)}
  `;
  console.log(`✅ Synced ${matches.length} matches from matches table to app_state!`);
}

sync().catch(console.error);
