import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

async function main() {
  const rows = await sql`SELECT data FROM app_state WHERE id = 'pr_matches'`;
  if (rows.length > 0) {
    const matches = rows[0].data;
    console.log(`Total matches in app_state: ${matches.length}`);
    const finished = matches.filter(m => m.status === 'finished');
    console.log(`Finished matches in app_state: ${finished.length}`);
    finished.forEach(m => {
      console.log(`[${m.sport}] ${m.id}: ${m.teamA} ${m.scoreA} - ${m.scoreB} ${m.teamB} (${m.winner})`);
    });
  }
}

main().catch(console.error);
