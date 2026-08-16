import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_3zmx1GoBjZOM@ep-curly-dust-azxmkqbz-pooler.c-3.ap-southeast-1.aws.neon.tech/neondb?sslmode=require');

async function dump() {
  const matches = await sql`SELECT * FROM matches ORDER BY sport, id`;
  console.log('Total matches in DB:', matches.length);
  console.log(JSON.stringify(matches, null, 2));
}

dump().catch(console.error);
