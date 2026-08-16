import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_3zmx1GoBjZOM@ep-curly-dust-azxmkqbz-pooler.c-3.ap-southeast-1.aws.neon.tech/neondb?sslmode=require');

async function main() {
  const teams = await sql`SELECT * FROM teams ORDER BY sport_id, group_name, name`;
  console.log('--- DB TEAMS COUNT:', teams.length);
  teams.forEach(t => {
    console.log(`[${t.sport_id}] Group ${t.group_name}: ${t.name} (id: ${t.id})`);
  });
}

main().catch(console.error);
