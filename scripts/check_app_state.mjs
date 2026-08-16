import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

async function main() {
  const rows = await sql`SELECT * FROM app_state`;
  console.log('App state rows:', rows.length);
  if (rows.length > 0) {
    console.log('Keys:', rows.map(r => r.key || r.id));
    console.log('Sample data:', JSON.stringify(rows[0]).substring(0, 500));
  }
}

main().catch(console.error);
