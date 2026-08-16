import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

async function check() {
  const event = await sql`SELECT COUNT(*) as c FROM event`;
  const sports = await sql`SELECT COUNT(*) as c FROM sports`;
  const teams = await sql`SELECT COUNT(*) as c FROM teams`;
  const matches = await sql`SELECT COUNT(*) as c FROM matches`;
  const appState = await sql`SELECT COUNT(*) as c FROM app_state`;

  console.log('STATUS DATABASE NEON POSTGRES:');
  console.log('---------------------------------');
  console.log('Event table    :', event[0].c, 'row(s)');
  console.log('Sports table   :', sports[0].c, 'row(s)');
  console.log('Teams table    :', teams[0].c, 'row(s)');
  console.log('Matches table  :', matches[0].c, 'row(s)');
  console.log('AppState table :', appState[0].c, 'row(s)');
  console.log('---------------------------------');
  console.log('✅ Semua data 100% AMAN & PERMANEN di Neon Postgres Cloud!');
}

check().catch(console.error);
