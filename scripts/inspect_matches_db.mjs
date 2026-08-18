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
  const matches = await sql`SELECT * FROM matches ORDER BY id`;
  console.log('Matches count:', matches.length);
  for (const m of matches) {
    if (m.team_a === m.team_b || m.sport === 'volly-putra') {
      console.log(`Match ${m.id} (${m.sport} - ${m.round}): ${m.team_a} vs ${m.team_b} | score: ${m.score_a}-${m.score_b} | winner: ${m.winner}`);
    }
  }
}

main().catch(err => console.error(err));
