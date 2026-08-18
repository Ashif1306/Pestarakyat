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

const sql = neon(databaseUrl);

async function main() {
  console.log('Fixing match statuses and team names in DB...');

  // Fix vp-qf4: set status to finished, trim team_b
  await sql`
    UPDATE matches 
    SET status = 'finished', team_b = 'PBV Uluway', winner = 'PBV Lamba'
    WHERE id = 'vp-qf4'
  `;

  // Fix vpi-qf4 if it has duplicate team names
  await sql`
    UPDATE matches
    SET team_a = 'Siduruk Tim', team_b = 'Maliba Simpang'
    WHERE id = 'vpi-qf4' AND (team_a = team_b OR team_a = 'PBV Maliba')
  `;

  console.log('Successfully updated DB matches!');
}

main().catch(err => console.error(err));
