import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_3zmx1GoBjZOM@ep-curly-dust-azxmkqbz-pooler.c-3.ap-southeast-1.aws.neon.tech/neondb?sslmode=require');

async function check() {
  const rows = await sql`SELECT * FROM matches WHERE sport = 'volly-putra' AND status = 'finished'`;
  console.log('Volly Putra finished matches count:', rows.length);
  rows.forEach(r => console.log(`${r.id}: ${r.team_a} ${r.score_a}-${r.score_b} ${r.team_b} (Winner: ${r.winner})`));
}

check().catch(console.error);
