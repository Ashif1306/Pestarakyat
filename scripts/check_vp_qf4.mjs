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
  const m = await sql`SELECT * FROM matches WHERE id = 'vp-qf4'`;
  console.log('vp-qf4:', JSON.stringify(m, null, 2));
}

main().catch(err => console.error(err));
