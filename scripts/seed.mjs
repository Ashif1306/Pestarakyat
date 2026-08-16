// Seed script: Pindahkan semua data JSON ke Neon Postgres
// Jalankan: node --env-file=.env.local scripts/seed.mjs

import { neon } from '@neondatabase/serverless';

const DATABASE_URL = process.env.DATABASE_URL || process.env.POSTGRES_URL;

if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL tidak ditemukan! Pastikan file .env.local ada.');
  process.exit(1);
}

const sql = neon(DATABASE_URL);

async function seed() {
  console.log('🐘 Menghubungkan ke Neon Postgres...\n');

  // ── Create Tables ─────────────────────────────────────────────────────────
  console.log('📋 Membuat tabel...');
  await sql`
    CREATE TABLE IF NOT EXISTS app_state (
      id TEXT PRIMARY KEY,
      data JSONB NOT NULL
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS event (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      tagline TEXT,
      description TEXT,
      start_date TEXT,
      end_date TEXT,
      location TEXT,
      organizer TEXT
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS sports (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      icon TEXT,
      color TEXT,
      total_teams INT DEFAULT 0,
      total_groups INT DEFAULT 0
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS teams (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      sport_id TEXT NOT NULL,
      group_name TEXT NOT NULL
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS matches (
      id TEXT PRIMARY KEY,
      sport TEXT NOT NULL,
      phase TEXT NOT NULL,
      group_name TEXT,
      round TEXT,
      team_a TEXT NOT NULL,
      team_b TEXT NOT NULL,
      date TEXT,
      time TEXT,
      venue TEXT,
      status TEXT DEFAULT 'scheduled',
      score_a INT,
      score_b INT,
      winner TEXT
    )
  `;
  console.log('✅ Tabel berhasil dibuat!\n');

  // ── Seed Event ────────────────────────────────────────────────────────────
  console.log('📅 Menyimpan data event...');
  await sql`DELETE FROM event`;
  await sql`
    INSERT INTO event (name, tagline, description, start_date, end_date, location, organizer) VALUES (
      'Pesta Rakyat X KKN IAIN',
      'Berkarya, Berbagi, Menginspirasi',
      'Turnamen olahraga antar dusun & pemuda dalam rangka Pesta Rakyat yang diselenggarakan oleh mahasiswa KKN IAIN Parepare Posko 03 Angkatan 37 berkolaborasi dengan Pemuda Balabatu. Mempertemukan tim-tim terbaik dalam 3 cabang pertandingan seru.',
      '2026-08-10',
      '2026-08-25',
      'Dusun Bala Batu, Desa Buntu Barana, Kec. Curio, Kab. Enrekang',
      'KKN IAIN Parepare Posko 03 Angkatan 37 × Pemuda Balabatu'
    )
  `;
  console.log('✅ Data event tersimpan!\n');

  // ── Seed Sports ───────────────────────────────────────────────────────────
  console.log('🏅 Menyimpan data cabang olahraga...');
  await sql`DELETE FROM sports`;
  await sql`INSERT INTO sports (id, name, icon, color, total_teams, total_groups) VALUES ('volly-putra', 'Volly Putra', '🏐', '#0ea5e9', 12, 4)`;
  await sql`INSERT INTO sports (id, name, icon, color, total_teams, total_groups) VALUES ('volly-putri', 'Volly Putri', '🏐', '#e11d48', 12, 4)`;
  await sql`INSERT INTO sports (id, name, icon, color, total_teams, total_groups) VALUES ('sepak-bola-mini', 'Sepak Bola Mini', '⚽', '#16a34a', 12, 2)`;
  console.log('✅ Data cabang olahraga tersimpan!\n');

  // ── Seed Teams ────────────────────────────────────────────────────────────
  console.log('👥 Menyimpan data tim...');
  await sql`DELETE FROM teams`;
  const teams = [
    // Volly Putra
    { id: 'vp-t1', name: 'Pemula Squad', sport_id: 'volly-putra', group_name: 'A' },
    { id: 'vp-t2', name: 'PBV Uluway', sport_id: 'volly-putra', group_name: 'A' },
    { id: 'vp-t3', name: 'PBV Liba', sport_id: 'volly-putra', group_name: 'A' },
    { id: 'vp-t4', name: 'PBV Siduruk', sport_id: 'volly-putra', group_name: 'B' },
    { id: 'vp-t5', name: "Le'To Bara", sport_id: 'volly-putra', group_name: 'B' },
    { id: 'vp-t6', name: 'PBV Masbro', sport_id: 'volly-putra', group_name: 'B' },
    { id: 'vp-t7', name: 'MVC Malannying', sport_id: 'volly-putra', group_name: 'C' },
    { id: 'vp-t8', name: 'PBV Bala Batu A', sport_id: 'volly-putra', group_name: 'C' },
    { id: 'vp-t9', name: 'Solleakka Group', sport_id: 'volly-putra', group_name: 'C' },
    { id: 'vp-t10', name: 'PBV Bala Batu B', sport_id: 'volly-putra', group_name: 'D' },
    { id: 'vp-t11', name: 'PBV Bunga Duri', sport_id: 'volly-putra', group_name: 'D' },
    { id: 'vp-t12', name: 'PBV Lamba', sport_id: 'volly-putra', group_name: 'D' },
    // Volly Putri
    { id: 'vpi-t1', name: 'Alloan Squad', sport_id: 'volly-putri', group_name: 'A' },
    { id: 'vpi-t2', name: 'PBV Bala Batu A', sport_id: 'volly-putri', group_name: 'A' },
    { id: 'vpi-t3', name: 'Buntu Kalosi', sport_id: 'volly-putri', group_name: 'A' },
    { id: 'vpi-t4', name: 'MTs', sport_id: 'volly-putri', group_name: 'B' },
    { id: 'vpi-t5', name: 'Rante Limbong', sport_id: 'volly-putri', group_name: 'B' },
    { id: 'vpi-t6', name: 'Siduruk Tim', sport_id: 'volly-putri', group_name: 'B' },
    { id: 'vpi-t7', name: 'Buntu Ampalla', sport_id: 'volly-putri', group_name: 'C' },
    { id: 'vpi-t8', name: 'PBV Maliba', sport_id: 'volly-putri', group_name: 'C' },
    { id: 'vpi-t9', name: 'Garuda Muda', sport_id: 'volly-putri', group_name: 'C' },
    { id: 'vpi-t10', name: 'Maliba Simpang', sport_id: 'volly-putri', group_name: 'D' },
    { id: 'vpi-t11', name: 'SMPN 6 Alla', sport_id: 'volly-putri', group_name: 'D' },
    { id: 'vpi-t12', name: 'PBV Bala Batu B', sport_id: 'volly-putri', group_name: 'D' },
    // Sepak Bola Mini
    { id: 'sbm-t1', name: 'BUNTU BARANA A', sport_id: 'sepak-bola-mini', group_name: 'A' },
    { id: 'sbm-t2', name: 'SDN 130 RANTELIMBONG', sport_id: 'sepak-bola-mini', group_name: 'A' },
    { id: 'sbm-t3', name: 'MIS MINANGA B', sport_id: 'sepak-bola-mini', group_name: 'A' },
    { id: 'sbm-t4', name: 'SD ULUWAI JUNIOR', sport_id: 'sepak-bola-mini', group_name: 'A' },
    { id: 'sbm-t5', name: 'MALIBA', sport_id: 'sepak-bola-mini', group_name: 'A' },
    { id: 'sbm-t6', name: 'BALABATU A', sport_id: 'sepak-bola-mini', group_name: 'A' },
    { id: 'sbm-t7', name: 'BUNTU BARANA B', sport_id: 'sepak-bola-mini', group_name: 'B' },
    { id: 'sbm-t8', name: '13 CURIO', sport_id: 'sepak-bola-mini', group_name: 'B' },
    { id: 'sbm-t9', name: 'MIS MINANGA A', sport_id: 'sepak-bola-mini', group_name: 'B' },
    { id: 'sbm-t10', name: 'MALANYING JUNIOR', sport_id: 'sepak-bola-mini', group_name: 'B' },
    { id: 'sbm-t11', name: 'BALABATU B', sport_id: 'sepak-bola-mini', group_name: 'B' },
    { id: 'sbm-t12', name: '168 SUMBANG', sport_id: 'sepak-bola-mini', group_name: 'B' },
  ];
  for (const t of teams) {
    await sql`INSERT INTO teams (id, name, sport_id, group_name) VALUES (${t.id}, ${t.name}, ${t.sport_id}, ${t.group_name})`;
  }
  console.log(`✅ ${teams.length} tim tersimpan!\n`);

  // ── Seed Matches ──────────────────────────────────────────────────────────
  console.log('🏆 Menyimpan data pertandingan...');
  await sql`DELETE FROM matches`;

  const matches = [
    // Sepak Bola Mini - Fase Grup
    { id: 'sbm-1', sport: 'sepak-bola-mini', phase: 'group', group_name: 'A', round: 'Fase Grup A', team_a: 'BUNTU BARANA A', team_b: 'SDN 130 RANTELIMBONG', date: '2026-08-10', time: '15:20', venue: 'Lapangan Mini Bala Batu', status: 'finished', score_a: 2, score_b: 1, winner: 'BUNTU BARANA A' },
    { id: 'sbm-2', sport: 'sepak-bola-mini', phase: 'group', group_name: 'B', round: 'Fase Grup B', team_a: 'BUNTU BARANA B', team_b: '13 CURIO', date: '2026-08-10', time: '15:45', venue: 'Lapangan Mini Bala Batu', status: 'finished', score_a: 0, score_b: 0, winner: null },
    { id: 'sbm-3', sport: 'sepak-bola-mini', phase: 'group', group_name: 'A', round: 'Fase Grup A', team_a: 'BALABATU A', team_b: 'SD ULUWAI JUNIOR', date: '2026-08-10', time: '16:10', venue: 'Lapangan Mini Bala Batu', status: 'finished', score_a: 3, score_b: 0, winner: 'BALABATU A' },
    { id: 'sbm-4', sport: 'sepak-bola-mini', phase: 'group', group_name: 'A', round: 'Fase Grup A', team_a: 'MIS MINANGA B', team_b: 'MALIBA', date: '2026-08-11', time: '15:20', venue: 'Lapangan Mini Bala Batu', status: 'finished', score_a: 1, score_b: 2, winner: 'MALIBA' },
    { id: 'sbm-5', sport: 'sepak-bola-mini', phase: 'group', group_name: 'B', round: 'Fase Grup B', team_a: 'MIS MINANGA A', team_b: 'MALANYING JUNIOR', date: '2026-08-11', time: '15:45', venue: 'Lapangan Mini Bala Batu', status: 'finished', score_a: 2, score_b: 2, winner: null },
    { id: 'sbm-6', sport: 'sepak-bola-mini', phase: 'group', group_name: 'B', round: 'Fase Grup B', team_a: 'BALABATU B', team_b: '168 SUMBANG', date: '2026-08-11', time: '16:10', venue: 'Lapangan Mini Bala Batu', status: 'finished', score_a: 1, score_b: 0, winner: 'BALABATU B' },
    { id: 'sbm-7', sport: 'sepak-bola-mini', phase: 'group', group_name: 'A', round: 'Fase Grup A', team_a: 'BUNTU BARANA A', team_b: 'MIS MINANGA B', date: '2026-08-12', time: '15:20', venue: 'Lapangan Mini Bala Batu', status: 'finished', score_a: 4, score_b: 1, winner: 'BUNTU BARANA A' },
    { id: 'sbm-8', sport: 'sepak-bola-mini', phase: 'group', group_name: 'B', round: 'Fase Grup B', team_a: 'BUNTU BARANA B', team_b: 'MIS MINANGA A', date: '2026-08-12', time: '15:45', venue: 'Lapangan Mini Bala Batu', status: 'finished', score_a: 1, score_b: 3, winner: 'MIS MINANGA A' },
    { id: 'sbm-9', sport: 'sepak-bola-mini', phase: 'group', group_name: 'A', round: 'Fase Grup A', team_a: 'BALABATU A', team_b: 'SDN 130 RANTELIMBONG', date: '2026-08-12', time: '16:10', venue: 'Lapangan Mini Bala Batu', status: 'finished', score_a: 2, score_b: 0, winner: 'BALABATU A' },
    { id: 'sbm-10', sport: 'sepak-bola-mini', phase: 'group', group_name: 'A', round: 'Fase Grup A', team_a: 'SD ULUWAI JUNIOR', team_b: 'MALIBA', date: '2026-08-13', time: '15:20', venue: 'Lapangan Mini Bala Batu', status: 'finished', score_a: 0, score_b: 1, winner: 'MALIBA' },
    { id: 'sbm-11', sport: 'sepak-bola-mini', phase: 'group', group_name: 'B', round: 'Fase Grup B', team_a: 'BALABATU B', team_b: '13 CURIO', date: '2026-08-13', time: '15:45', venue: 'Lapangan Mini Bala Batu', status: 'finished', score_a: 2, score_b: 1, winner: 'BALABATU B' },
    { id: 'sbm-12', sport: 'sepak-bola-mini', phase: 'group', group_name: 'B', round: 'Fase Grup B', team_a: '168 SUMBANG', team_b: 'MALANYING JUNIOR', date: '2026-08-13', time: '16:10', venue: 'Lapangan Mini Bala Batu', status: 'finished', score_a: 0, score_b: 3, winner: 'MALANYING JUNIOR' },
    { id: 'sbm-13', sport: 'sepak-bola-mini', phase: 'group', group_name: 'A', round: 'Fase Grup A', team_a: 'SD ULUWAI JUNIOR', team_b: 'BUNTU BARANA A', date: '2026-08-14', time: '15:20', venue: 'Lapangan Mini Bala Batu', status: 'finished', score_a: 1, score_b: 3, winner: 'BUNTU BARANA A' },
    { id: 'sbm-14', sport: 'sepak-bola-mini', phase: 'group', group_name: 'B', round: 'Fase Grup B', team_a: '168 SUMBANG', team_b: 'BUNTU BARANA B', date: '2026-08-14', time: '15:45', venue: 'Lapangan Mini Bala Batu', status: 'finished', score_a: 2, score_b: 1, winner: '168 SUMBANG' },
    { id: 'sbm-15', sport: 'sepak-bola-mini', phase: 'group', group_name: 'A', round: 'Fase Grup A', team_a: 'BALABATU A', team_b: 'MALIBA', date: '2026-08-14', time: '16:10', venue: 'Lapangan Mini Bala Batu', status: 'finished', score_a: 2, score_b: 2, winner: null },
    { id: 'sbm-16', sport: 'sepak-bola-mini', phase: 'group', group_name: 'A', round: 'Fase Grup A', team_a: 'SDN 130 RANTELIMBONG', team_b: 'MIS MINANGA B', date: '2026-08-15', time: '15:20', venue: 'Lapangan Mini Bala Batu', status: 'scheduled', score_a: null, score_b: null, winner: null },
    { id: 'sbm-17', sport: 'sepak-bola-mini', phase: 'group', group_name: 'B', round: 'Fase Grup B', team_a: '13 CURIO', team_b: 'MIS MINANGA A', date: '2026-08-15', time: '15:45', venue: 'Lapangan Mini Bala Batu', status: 'scheduled', score_a: null, score_b: null, winner: null },
    { id: 'sbm-18', sport: 'sepak-bola-mini', phase: 'group', group_name: 'B', round: 'Fase Grup B', team_a: 'BALABATU B', team_b: 'MALANYING JUNIOR', date: '2026-08-15', time: '16:10', venue: 'Lapangan Mini Bala Batu', status: 'scheduled', score_a: null, score_b: null, winner: null },
    { id: 'sbm-19', sport: 'sepak-bola-mini', phase: 'group', group_name: 'A', round: 'Fase Grup A', team_a: 'MALIBA', team_b: 'BUNTU BARANA A', date: '2026-08-18', time: '15:20', venue: 'Lapangan Mini Bala Batu', status: 'scheduled', score_a: null, score_b: null, winner: null },
    { id: 'sbm-20', sport: 'sepak-bola-mini', phase: 'group', group_name: 'B', round: 'Fase Grup B', team_a: 'MALANYING JUNIOR', team_b: 'BUNTU BARANA B', date: '2026-08-18', time: '15:45', venue: 'Lapangan Mini Bala Batu', status: 'scheduled', score_a: null, score_b: null, winner: null },
    { id: 'sbm-21', sport: 'sepak-bola-mini', phase: 'group', group_name: 'A', round: 'Fase Grup A', team_a: 'SDN 130 RANTELIMBONG', team_b: 'SD ULUWAI JUNIOR', date: '2026-08-18', time: '16:10', venue: 'Lapangan Mini Bala Batu', status: 'scheduled', score_a: null, score_b: null, winner: null },
    { id: 'sbm-22', sport: 'sepak-bola-mini', phase: 'group', group_name: 'A', round: 'Fase Grup A', team_a: 'BALABATU A', team_b: 'MIS MINANGA B', date: '2026-08-19', time: '15:20', venue: 'Lapangan Mini Bala Batu', status: 'scheduled', score_a: null, score_b: null, winner: null },
    { id: 'sbm-23', sport: 'sepak-bola-mini', phase: 'group', group_name: 'B', round: 'Fase Grup B', team_a: 'BALABATU B', team_b: 'MIS MINANGA A', date: '2026-08-19', time: '15:45', venue: 'Lapangan Mini Bala Batu', status: 'scheduled', score_a: null, score_b: null, winner: null },
    { id: 'sbm-24', sport: 'sepak-bola-mini', phase: 'group', group_name: 'B', round: 'Fase Grup B', team_a: '13 CURIO', team_b: '168 SUMBANG', date: '2026-08-19', time: '16:10', venue: 'Lapangan Mini Bala Batu', status: 'scheduled', score_a: null, score_b: null, winner: null },
    { id: 'sbm-25', sport: 'sepak-bola-mini', phase: 'group', group_name: 'A', round: 'Fase Grup A', team_a: 'BALABATU A', team_b: 'BUNTU BARANA A', date: '2026-08-20', time: '15:20', venue: 'Lapangan Mini Bala Batu', status: 'scheduled', score_a: null, score_b: null, winner: null },
    { id: 'sbm-26', sport: 'sepak-bola-mini', phase: 'group', group_name: 'B', round: 'Fase Grup B', team_a: 'BALABATU B', team_b: 'BUNTU BARANA B', date: '2026-08-20', time: '15:45', venue: 'Lapangan Mini Bala Batu', status: 'scheduled', score_a: null, score_b: null, winner: null },
    { id: 'sbm-27', sport: 'sepak-bola-mini', phase: 'group', group_name: 'A', round: 'Fase Grup A', team_a: 'MIS MINANGA B', team_b: 'SD ULUWAI JUNIOR', date: '2026-08-20', time: '16:10', venue: 'Lapangan Mini Bala Batu', status: 'scheduled', score_a: null, score_b: null, winner: null },
    { id: 'sbm-28', sport: 'sepak-bola-mini', phase: 'group', group_name: 'A', round: 'Fase Grup A', team_a: 'MALIBA', team_b: 'SDN 130 RANTELIMBONG', date: '2026-08-21', time: '15:20', venue: 'Lapangan Mini Bala Batu', status: 'scheduled', score_a: null, score_b: null, winner: null },
    { id: 'sbm-29', sport: 'sepak-bola-mini', phase: 'group', group_name: 'B', round: 'Fase Grup B', team_a: 'MALANYING JUNIOR', team_b: '13 CURIO', date: '2026-08-21', time: '15:45', venue: 'Lapangan Mini Bala Batu', status: 'scheduled', score_a: null, score_b: null, winner: null },
    { id: 'sbm-30', sport: 'sepak-bola-mini', phase: 'group', group_name: 'B', round: 'Fase Grup B', team_a: 'MIS MINANGA A', team_b: '168 SUMBANG', date: '2026-08-21', time: '16:10', venue: 'Lapangan Mini Bala Batu', status: 'scheduled', score_a: null, score_b: null, winner: null },
    { id: 'sbm-sf1', sport: 'sepak-bola-mini', phase: 'knockout', group_name: null, round: 'Semi Final', team_a: 'TBD', team_b: 'TBD', date: '2026-08-22', time: '15:30', venue: 'Lapangan Mini Bala Batu', status: 'scheduled', score_a: null, score_b: null, winner: null },
    { id: 'sbm-sf2', sport: 'sepak-bola-mini', phase: 'knockout', group_name: null, round: 'Semi Final', team_a: 'TBD', team_b: 'TBD', date: '2026-08-22', time: '16:15', venue: 'Lapangan Mini Bala Batu', status: 'scheduled', score_a: null, score_b: null, winner: null },
    { id: 'sbm-f', sport: 'sepak-bola-mini', phase: 'knockout', group_name: null, round: 'Final', team_a: 'TBD', team_b: 'TBD', date: '2026-08-24', time: '16:00', venue: 'Lapangan Mini Bala Batu', status: 'scheduled', score_a: null, score_b: null, winner: null },
    // Volly Putra
    { id: 'vp-1', sport: 'volly-putra', phase: 'group', group_name: 'A', round: 'Fase Grup A', team_a: 'Pemula Squad', team_b: 'PBV Uluway', date: '2026-08-10', time: '16:00', venue: 'Lapangan Utama Bala Batu', status: 'finished', score_a: 2, score_b: 0, winner: 'Pemula Squad' },
    { id: 'vp-2', sport: 'volly-putra', phase: 'group', group_name: 'B', round: 'Fase Grup B', team_a: 'PBV Siduruk', team_b: "Le'To Bara", date: '2026-08-10', time: '17:00', venue: 'Lapangan Utama Bala Batu', status: 'finished', score_a: 1, score_b: 2, winner: "Le'To Bara" },
    { id: 'vp-3', sport: 'volly-putra', phase: 'group', group_name: 'D', round: 'Fase Grup D', team_a: 'PBV Bunga Duri', team_b: 'PBV Lamba', date: '2026-08-11', time: '16:00', venue: 'Lapangan Utama Bala Batu', status: 'finished', score_a: 2, score_b: 0, winner: 'PBV Bunga Duri' },
    { id: 'vp-4', sport: 'volly-putra', phase: 'group', group_name: 'C', round: 'Fase Grup C', team_a: 'MVC Malannying', team_b: 'Solleakka Group', date: '2026-08-11', time: '17:00', venue: 'Lapangan Utama Bala Batu', status: 'finished', score_a: 2, score_b: 1, winner: 'MVC Malannying' },
    { id: 'vp-5', sport: 'volly-putra', phase: 'group', group_name: 'B', round: 'Fase Grup B', team_a: "Le'To Bara", team_b: 'PBV Masbro', date: '2026-08-12', time: '16:00', venue: 'Lapangan Utama Bala Batu', status: 'finished', score_a: 2, score_b: 1, winner: "Le'To Bara" },
    { id: 'vp-6', sport: 'volly-putra', phase: 'group', group_name: 'C', round: 'Fase Grup C', team_a: 'Solleakka Group', team_b: 'PBV Bala Batu A', date: '2026-08-12', time: '17:00', venue: 'Lapangan Utama Bala Batu', status: 'finished', score_a: 1, score_b: 2, winner: 'PBV Bala Batu A' },
    { id: 'vp-7', sport: 'volly-putra', phase: 'group', group_name: 'D', round: 'Fase Grup D', team_a: 'PBV Lamba', team_b: 'PBV Bala Batu B', date: '2026-08-13', time: '16:00', venue: 'Lapangan Utama Bala Batu', status: 'finished', score_a: 0, score_b: 2, winner: 'PBV Bala Batu B' },
    { id: 'vp-8', sport: 'volly-putra', phase: 'group', group_name: 'A', round: 'Fase Grup A', team_a: 'PBV Liba', team_b: 'PBV Uluway', date: '2026-08-13', time: '17:00', venue: 'Lapangan Utama Bala Batu', status: 'finished', score_a: 2, score_b: 0, winner: 'PBV Liba' },
    { id: 'vp-9', sport: 'volly-putra', phase: 'group', group_name: 'A', round: 'Fase Grup A', team_a: 'Pemula Squad', team_b: 'PBV Liba', date: '2026-08-14', time: '16:00', venue: 'Lapangan Utama Bala Batu', status: 'finished', score_a: 2, score_b: 1, winner: 'Pemula Squad' },
    { id: 'vp-10', sport: 'volly-putra', phase: 'group', group_name: 'B', round: 'Fase Grup B', team_a: 'PBV Siduruk', team_b: 'PBV Masbro', date: '2026-08-14', time: '17:00', venue: 'Lapangan Utama Bala Batu', status: 'finished', score_a: 2, score_b: 0, winner: 'PBV Siduruk' },
    { id: 'vp-11', sport: 'volly-putra', phase: 'group', group_name: 'D', round: 'Fase Grup D', team_a: 'PBV Bunga Duri', team_b: 'PBV Bala Batu B', date: '2026-08-15', time: '16:00', venue: 'Lapangan Utama Bala Batu', status: 'scheduled', score_a: null, score_b: null, winner: null },
    { id: 'vp-12', sport: 'volly-putra', phase: 'group', group_name: 'C', round: 'Fase Grup C', team_a: 'MVC Malannying', team_b: 'PBV Bala Batu A', date: '2026-08-15', time: '17:00', venue: 'Lapangan Utama Bala Batu', status: 'scheduled', score_a: null, score_b: null, winner: null },
    { id: 'vp-qf1', sport: 'volly-putra', phase: 'knockout', group_name: null, round: 'Perempat Final', team_a: 'TBD', team_b: 'TBD', date: '2026-08-20', time: '15:00', venue: 'Lapangan Utama Bala Batu', status: 'scheduled', score_a: null, score_b: null, winner: null },
    { id: 'vp-qf2', sport: 'volly-putra', phase: 'knockout', group_name: null, round: 'Perempat Final', team_a: 'TBD', team_b: 'TBD', date: '2026-08-20', time: '16:00', venue: 'Lapangan Utama Bala Batu', status: 'scheduled', score_a: null, score_b: null, winner: null },
    { id: 'vp-qf3', sport: 'volly-putra', phase: 'knockout', group_name: null, round: 'Perempat Final', team_a: 'TBD', team_b: 'TBD', date: '2026-08-21', time: '15:00', venue: 'Lapangan Utama Bala Batu', status: 'scheduled', score_a: null, score_b: null, winner: null },
    { id: 'vp-qf4', sport: 'volly-putra', phase: 'knockout', group_name: null, round: 'Perempat Final', team_a: 'TBD', team_b: 'TBD', date: '2026-08-21', time: '16:00', venue: 'Lapangan Utama Bala Batu', status: 'scheduled', score_a: null, score_b: null, winner: null },
    { id: 'vp-sf1', sport: 'volly-putra', phase: 'knockout', group_name: null, round: 'Semi Final', team_a: 'TBD', team_b: 'TBD', date: '2026-08-23', time: '15:00', venue: 'Lapangan Utama Bala Batu', status: 'scheduled', score_a: null, score_b: null, winner: null },
    { id: 'vp-sf2', sport: 'volly-putra', phase: 'knockout', group_name: null, round: 'Semi Final', team_a: 'TBD', team_b: 'TBD', date: '2026-08-23', time: '16:30', venue: 'Lapangan Utama Bala Batu', status: 'scheduled', score_a: null, score_b: null, winner: null },
    { id: 'vp-f', sport: 'volly-putra', phase: 'knockout', group_name: null, round: 'Final', team_a: 'TBD', team_b: 'TBD', date: '2026-08-25', time: '16:00', venue: 'Lapangan Utama Bala Batu', status: 'scheduled', score_a: null, score_b: null, winner: null },
    // Volly Putri
    { id: 'vpi-1', sport: 'volly-putri', phase: 'group', group_name: 'A', round: 'Fase Grup A', team_a: 'Alloan Squad', team_b: 'PBV Bala Batu A', date: '2026-08-10', time: '16:00', venue: 'Lapangan Utama Bala Batu', status: 'finished', score_a: 1, score_b: 2, winner: 'PBV Bala Batu A' },
    { id: 'vpi-2', sport: 'volly-putri', phase: 'group', group_name: 'B', round: 'Fase Grup B', team_a: 'MTs', team_b: 'Rante Limbong', date: '2026-08-10', time: '17:00', venue: 'Lapangan Utama Bala Batu', status: 'finished', score_a: 2, score_b: 0, winner: 'MTs' },
    { id: 'vpi-3', sport: 'volly-putri', phase: 'group', group_name: 'B', round: 'Fase Grup B', team_a: 'Rante Limbong', team_b: 'Siduruk Tim', date: '2026-08-11', time: '16:00', venue: 'Lapangan Utama Bala Batu', status: 'finished', score_a: 1, score_b: 2, winner: 'Siduruk Tim' },
    { id: 'vpi-4', sport: 'volly-putri', phase: 'group', group_name: 'A', round: 'Fase Grup A', team_a: 'Buntu Kalosi', team_b: 'PBV Bala Batu A', date: '2026-08-11', time: '17:00', venue: 'Lapangan Utama Bala Batu', status: 'finished', score_a: 0, score_b: 2, winner: 'PBV Bala Batu A' },
    { id: 'vpi-5', sport: 'volly-putri', phase: 'group', group_name: 'A', round: 'Fase Grup A', team_a: 'Alloan Squad', team_b: 'Buntu Kalosi', date: '2026-08-12', time: '16:00', venue: 'Lapangan Utama Bala Batu', status: 'finished', score_a: 2, score_b: 1, winner: 'Alloan Squad' },
    { id: 'vpi-6', sport: 'volly-putri', phase: 'group', group_name: 'B', round: 'Fase Grup B', team_a: 'MTs', team_b: 'Siduruk Tim', date: '2026-08-12', time: '17:00', venue: 'Lapangan Utama Bala Batu', status: 'finished', score_a: 2, score_b: 1, winner: 'MTs' },
    { id: 'vpi-7', sport: 'volly-putri', phase: 'group', group_name: 'C', round: 'Fase Grup C', team_a: 'Buntu Ampalla', team_b: 'PBV Maliba', date: '2026-08-13', time: '16:00', venue: 'Lapangan Utama Bala Batu', status: 'finished', score_a: 0, score_b: 2, winner: 'PBV Maliba' },
    { id: 'vpi-8', sport: 'volly-putri', phase: 'group', group_name: 'D', round: 'Fase Grup D', team_a: 'Maliba Simpang', team_b: 'SMPN 6 Alla', date: '2026-08-13', time: '17:00', venue: 'Lapangan Utama Bala Batu', status: 'finished', score_a: 1, score_b: 2, winner: 'SMPN 6 Alla' },
    { id: 'vpi-9', sport: 'volly-putri', phase: 'group', group_name: 'D', round: 'Fase Grup D', team_a: 'SMPN 6 Alla', team_b: 'PBV Bala Batu B', date: '2026-08-14', time: '16:00', venue: 'Lapangan Utama Bala Batu', status: 'finished', score_a: 2, score_b: 1, winner: 'SMPN 6 Alla' },
    { id: 'vpi-10', sport: 'volly-putri', phase: 'group', group_name: 'C', round: 'Fase Grup C', team_a: 'Buntu Ampalla', team_b: 'Garuda Muda', date: '2026-08-14', time: '17:00', venue: 'Lapangan Utama Bala Batu', status: 'finished', score_a: 2, score_b: 1, winner: 'Buntu Ampalla' },
    { id: 'vpi-11', sport: 'volly-putri', phase: 'group', group_name: 'C', round: 'Fase Grup C', team_a: 'Garuda Muda', team_b: 'PBV Maliba', date: '2026-08-15', time: '16:00', venue: 'Lapangan Utama Bala Batu', status: 'scheduled', score_a: null, score_b: null, winner: null },
    { id: 'vpi-12', sport: 'volly-putri', phase: 'group', group_name: 'D', round: 'Fase Grup D', team_a: 'PBV Bala Batu B', team_b: 'Maliba Simpang', date: '2026-08-15', time: '17:00', venue: 'Lapangan Utama Bala Batu', status: 'scheduled', score_a: null, score_b: null, winner: null },
    { id: 'vpi-qf1', sport: 'volly-putri', phase: 'knockout', group_name: null, round: 'Perempat Final', team_a: 'TBD', team_b: 'TBD', date: '2026-08-20', time: '15:00', venue: 'Lapangan Utama Bala Batu', status: 'scheduled', score_a: null, score_b: null, winner: null },
    { id: 'vpi-qf2', sport: 'volly-putri', phase: 'knockout', group_name: null, round: 'Perempat Final', team_a: 'TBD', team_b: 'TBD', date: '2026-08-20', time: '16:00', venue: 'Lapangan Utama Bala Batu', status: 'scheduled', score_a: null, score_b: null, winner: null },
    { id: 'vpi-qf3', sport: 'volly-putri', phase: 'knockout', group_name: null, round: 'Perempat Final', team_a: 'TBD', team_b: 'TBD', date: '2026-08-21', time: '15:00', venue: 'Lapangan Utama Bala Batu', status: 'scheduled', score_a: null, score_b: null, winner: null },
    { id: 'vpi-qf4', sport: 'volly-putri', phase: 'knockout', group_name: null, round: 'Perempat Final', team_a: 'TBD', team_b: 'TBD', date: '2026-08-21', time: '16:00', venue: 'Lapangan Utama Bala Batu', status: 'scheduled', score_a: null, score_b: null, winner: null },
    { id: 'vpi-sf1', sport: 'volly-putri', phase: 'knockout', group_name: null, round: 'Semi Final', team_a: 'TBD', team_b: 'TBD', date: '2026-08-23', time: '15:00', venue: 'Lapangan Utama Bala Batu', status: 'scheduled', score_a: null, score_b: null, winner: null },
    { id: 'vpi-sf2', sport: 'volly-putri', phase: 'knockout', group_name: null, round: 'Semi Final', team_a: 'TBD', team_b: 'TBD', date: '2026-08-23', time: '16:30', venue: 'Lapangan Utama Bala Batu', status: 'scheduled', score_a: null, score_b: null, winner: null },
    { id: 'vpi-f', sport: 'volly-putri', phase: 'knockout', group_name: null, round: 'Final', team_a: 'TBD', team_b: 'TBD', date: '2026-08-25', time: '16:00', venue: 'Lapangan Utama Bala Batu', status: 'scheduled', score_a: null, score_b: null, winner: null },
  ];

  for (const m of matches) {
    await sql`
      INSERT INTO matches (id, sport, phase, group_name, round, team_a, team_b, date, time, venue, status, score_a, score_b, winner)
      VALUES (${m.id}, ${m.sport}, ${m.phase}, ${m.group_name}, ${m.round}, ${m.team_a}, ${m.team_b}, ${m.date}, ${m.time}, ${m.venue}, ${m.status}, ${m.score_a}, ${m.score_b}, ${m.winner})
    `;
  }
  console.log(`✅ ${matches.length} pertandingan tersimpan!\n`);

  // ALSO SYNC app_state TABLE WITH THE UPDATED MATCHES ARRAY!
  const formattedMatches = matches.map(m => ({
    id: m.id,
    sport: m.sport,
    phase: m.phase,
    group: m.group_name,
    round: m.round,
    teamA: m.team_a,
    teamB: m.team_b,
    date: m.date,
    time: m.time,
    venue: m.venue,
    status: m.status,
    scoreA: m.score_a,
    scoreB: m.score_b,
    winner: m.winner,
  }));

  await sql`
    INSERT INTO app_state (id, data)
    VALUES ('pr_matches', ${JSON.stringify(formattedMatches)})
    ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data
  `;
  console.log('✅ app_state (pr_matches) berhasil di-sync!\n');

  console.log('🎉 SELESAI! Semua data berhasil dipindahkan ke Neon Postgres!');
}

seed().catch(err => {
  console.error('❌ SEED GAGAL:', err);
  process.exit(1);
});
