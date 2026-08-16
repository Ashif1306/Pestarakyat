import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_3zmx1GoBjZOM@ep-curly-dust-azxmkqbz-pooler.c-3.ap-southeast-1.aws.neon.tech/neondb?sslmode=require');

async function main() {
  const teams = await sql`SELECT * FROM teams WHERE sport_id = 'volly-putri' ORDER BY group_name, name`;
  const matches = await sql`SELECT * FROM matches WHERE sport = 'volly-putri' AND phase = 'group' ORDER BY group_name, id`;

  console.log('--- VOLLEY PUTRI TEAMS IN DB ---');
  teams.forEach(t => console.log(`Team: ${t.name.padEnd(20)} | Group in TEAMS table: ${t.group_name}`));

  console.log('\n--- VOLLEY PUTRI GROUP MATCHES IN DB ---');
  matches.forEach(m => console.log(`Match ${m.id}: ${m.team_a} vs ${m.team_b} | Group in MATCHES table: ${m.group_name}`));
}

main().catch(console.error);
