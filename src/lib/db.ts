import { neon } from '@neondatabase/serverless';

const DATABASE_URL = process.env.DATABASE_URL || process.env.POSTGRES_URL || '';

export function getDb() {
  if (!DATABASE_URL) throw new Error('DATABASE_URL is not set');
  return neon(DATABASE_URL);
}

let isInitialized = false;

export async function initDatabase() {
  if (isInitialized) return;
  
  try {
    const sql = getDb();

    // Create tables if DB user has DDL permission
    try {
      await sql`
        CREATE TABLE IF NOT EXISTS app_state (
          id TEXT PRIMARY KEY,
          data JSONB NOT NULL
        )
      `;
    } catch {
      // ignore if no DDL permission or table exists
    }

    try {
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
    } catch (ddlError) {
      console.warn('DDL permissions skipped:', (ddlError as Error).message);
    }

    isInitialized = true;
  } catch (err) {
    console.warn('initDatabase error:', err);
  }
}
