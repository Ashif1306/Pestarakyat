import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

async function main() {
  console.log('--- INSPECTING NEON DB ---');
  const matches = await sql`SELECT * FROM matches WHERE status = 'finished' ORDER BY date, time`;
  console.log(`Finished Matches Count: ${matches.length}`);
  matches.forEach((m) => {
    console.log(`Match ${m.id} (${m.sport}): ${m.team_a} ${m.score_a} - ${m.score_b} ${m.team_b} -> Winner: ${m.winner}`);
  });

  const appState = await sql`SELECT * FROM app_state`;
  console.log(`App State Count: ${appState.length}`);
  if (appState.length > 0) {
    console.log(`State Key: ${appState[0].key}, Updated At: ${appState[0].updated_at}`);
  }
}

main().catch(console.error);
