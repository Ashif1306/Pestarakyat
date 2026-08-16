import { neon } from '@neondatabase/serverless';

if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL tidak ditemukan!');
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);

async function seed() {
  console.log('🐘 Menghubungkan ke Neon Postgres...\n');

  // SAFETY GUARD: Prevent overwriting existing user score data
  try {
    const existing = await sql`SELECT count(*) as count FROM matches WHERE status = 'finished'`;
    const count = parseInt(existing[0]?.count || '0', 10);
    if (count > 0 && !process.env.FORCE_SEED) {
      console.log(`⚠️ SEED ABORTED: Database sudah berisi ${count} pertandingan selesai.`);
      console.log('⚠️ Untuk mencegah data terhapus, seed di-cancel. (Gunakan FORCE_SEED=1 jika ingin reset paksa).');
      process.exit(0);
    }
  } catch (err) {
    // table doesn't exist yet, proceed with setup
  }

  // ── Create Tables ──────────────────────────────────────────────────────────
  console.log('📋 Membuat tabel...');
  await sql`
    CREATE TABLE IF NOT EXISTS event_info (
      id TEXT PRIMARY KEY,
      title TEXT NOT JSON NULL,
      tagline TEXT,
      date_range TEXT,
      location TEXT,
      description TEXT,
      footer_text TEXT
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS sports (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      icon TEXT,
      color TEXT,
      total_teams INTEGER,
      total_groups INTEGER
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS teams (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      sport_id TEXT NOT NULL,
      group_name TEXT
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS matches (
      id TEXT PRIMARY KEY,
      sport TEXT NOT NULL,
      phase TEXT NOT NULL,
      group_name TEXT,
      round TEXT NOT NULL,
      team_a TEXT NOT NULL,
      team_b TEXT NOT NULL,
      date TEXT NOT NULL,
      time TEXT NOT NULL,
      venue TEXT NOT NULL,
      status TEXT NOT NULL,
      score_a INTEGER,
      score_b INTEGER,
      winner TEXT
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS app_state (
      id TEXT PRIMARY KEY,
      data JSONB NOT NULL,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  console.log('✅ Tabel berhasil dibuat!\n');
}

seed().catch((err) => {
  console.error('❌ Gagal seeding database:', err);
  process.exit(1);
});
