import { neon } from '@neondatabase/serverless';
import fs from 'fs';

let databaseUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;

if (!databaseUrl && fs.existsSync('.env.local')) {
  const envContent = fs.readFileSync('.env.local', 'utf-8');
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (trimmed.startsWith('DATABASE_URL=')) {
      databaseUrl = trimmed.substring('DATABASE_URL='.length).replace(/["']/g, '');
    }
  }
}

if (!databaseUrl) {
  console.log('No database URL found');
  process.exit(0);
}

const sql = neon(databaseUrl);

async function main() {
  const newDesc = "PANITIA PELAKSANA PESTA RAKYAT KKN IAIN PAREPARE POSKO 03 ANGKATAN 37 DESA BUNTU BARANA KOLABORASI PEMUDA BALABATU";
  console.log('Updating event description in DB...');
  await sql`UPDATE event SET description = ${newDesc}, organizer = 'KKN IAIN Parepare Posko 03 Angkatan 37 Dusun Bala Batu' WHERE true`;
  console.log('Successfully updated DB!');
}

main().catch(err => console.error(err));
