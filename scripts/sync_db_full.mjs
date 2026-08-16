import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_3zmx1GoBjZOM@ep-curly-dust-azxmkqbz-pooler.c-3.ap-southeast-1.aws.neon.tech/neondb?sslmode=require');

const CORRECT_TEAMS = [
  // Volly Putra
  { id: "vp-t1", name: "Pemula Squad", sport_id: "volly-putra", group_name: "A" },
  { id: "vp-t2", name: "PBV Uluway", sport_id: "volly-putra", group_name: "A" },
  { id: "vp-t3", name: "PBV Liba", sport_id: "volly-putra", group_name: "A" },
  { id: "vp-t4", name: "PBV Siduruk", sport_id: "volly-putra", group_name: "B" },
  { id: "vp-t5", name: "Le'To Bara", sport_id: "volly-putra", group_name: "B" },
  { id: "vp-t6", name: "PBV Masbro", sport_id: "volly-putra", group_name: "B" },
  { id: "vp-t7", name: "MVC Malannying", sport_id: "volly-putra", group_name: "C" },
  { id: "vp-t8", name: "PBV Bala Batu A", sport_id: "volly-putra", group_name: "C" },
  { id: "vp-t9", name: "Solleakka Group", sport_id: "volly-putra", group_name: "C" },
  { id: "vp-t10", name: "PBV Bala Batu B", sport_id: "volly-putra", group_name: "D" },
  { id: "vp-t11", name: "PBV Bunga Duri", sport_id: "volly-putra", group_name: "D" },
  { id: "vp-t12", name: "PBV Lamba", sport_id: "volly-putra", group_name: "D" },

  // Volly Putri (User's Exact Groups: A=MTs,Rante Limbong,Siduruk Tim | B=SMPN 6 Alla,Maliba Simpang,PBV Bala Batu B | C=Alloan Squad,Buntu Kalosi,PBV Bala Batu A | D=Buntu Ampalla,Garuda Muda,PBV Maliba)
  { id: "vpi-t1", name: "MTs", sport_id: "volly-putri", group_name: "A" },
  { id: "vpi-t2", name: "Rante Limbong", sport_id: "volly-putri", group_name: "A" },
  { id: "vpi-t3", name: "Siduruk Tim", sport_id: "volly-putri", group_name: "A" },
  { id: "vpi-t4", name: "SMPN 6 Alla", sport_id: "volly-putri", group_name: "B" },
  { id: "vpi-t5", name: "Maliba Simpang", sport_id: "volly-putri", group_name: "B" },
  { id: "vpi-t6", name: "PBV Bala Batu B", sport_id: "volly-putri", group_name: "B" },
  { id: "vpi-t7", name: "Alloan Squad", sport_id: "volly-putri", group_name: "C" },
  { id: "vpi-t8", name: "Buntu Kalosi", sport_id: "volly-putri", group_name: "C" },
  { id: "vpi-t9", name: "PBV Bala Batu A", sport_id: "volly-putri", group_name: "C" },
  { id: "vpi-t10", name: "Buntu Ampalla", sport_id: "volly-putri", group_name: "D" },
  { id: "vpi-t11", name: "Garuda Muda", sport_id: "volly-putri", group_name: "D" },
  { id: "vpi-t12", name: "PBV Maliba", sport_id: "volly-putri", group_name: "D" },

  // Sepak Bola Mini
  { id: "sbm-t1", name: "BUNTU BARANA A", sport_id: "sepak-bola-mini", group_name: "A" },
  { id: "sbm-t2", name: "SDN 130 RANTELIMBONG", sport_id: "sepak-bola-mini", group_name: "A" },
  { id: "sbm-t3", name: "MIS MINANGA B", sport_id: "sepak-bola-mini", group_name: "A" },
  { id: "sbm-t4", name: "SD ULUWAI JUNIOR", sport_id: "sepak-bola-mini", group_name: "A" },
  { id: "sbm-t5", name: "MALIBA", sport_id: "sepak-bola-mini", group_name: "A" },
  { id: "sbm-t6", name: "BALABATU A", sport_id: "sepak-bola-mini", group_name: "A" },
  { id: "sbm-t7", name: "BUNTU BARANA B", sport_id: "sepak-bola-mini", group_name: "B" },
  { id: "sbm-t8", name: "13 CURIO", sport_id: "sepak-bola-mini", group_name: "B" },
  { id: "sbm-t9", name: "MIS MINANGA A", sport_id: "sepak-bola-mini", group_name: "B" },
  { id: "sbm-t10", name: "MALANYING JUNIOR", sport_id: "sepak-bola-mini", group_name: "B" },
  { id: "sbm-t11", name: "BALABATU B", sport_id: "sepak-bola-mini", group_name: "B" },
  { id: "sbm-t12", name: "168 SUMBANG", sport_id: "sepak-bola-mini", group_name: "B" }
];

// Volly Putri Match Groups Update in Matches Table
const VOLLY_PUTRI_MATCH_GROUPS = [
  { id: "vpi-1", group_name: "C", round: "Fase Grup C" },
  { id: "vpi-2", group_name: "A", round: "Fase Grup A" },
  { id: "vpi-3", group_name: "A", round: "Fase Grup A" },
  { id: "vpi-4", group_name: "C", round: "Fase Grup C" },
  { id: "vpi-5", group_name: "C", round: "Fase Grup C" },
  { id: "vpi-6", group_name: "A", round: "Fase Grup A" },
  { id: "vpi-7", group_name: "D", round: "Fase Grup D" },
  { id: "vpi-8", group_name: "B", round: "Fase Grup B" },
  { id: "vpi-9", group_name: "B", round: "Fase Grup B" },
  { id: "vpi-10", group_name: "D", round: "Fase Grup D" },
  { id: "vpi-11", group_name: "D", round: "Fase Grup D" },
  { id: "vpi-12", group_name: "B", round: "Fase Grup B" }
];

const KNOCKOUT_UPDATES = [
  // Volly Putra QFs
  { id: "vp-qf1", team_a: "PBV Liba", team_b: "PBV Siduruk" },
  { id: "vp-qf2", team_a: "MVC Malannying", team_b: "PBV Bunga Duri" },
  { id: "vp-qf3", team_a: "PBV Masbro", team_b: "PBV Bala Batu A" },
  { id: "vp-qf4", team_a: "PBV Lamba", team_b: "PBV Uluway" },

  // Volly Putri QFs (Reflecting new group ordering)
  // QF1 (1 A vs 2 B): Siduruk Tim vs Maliba Simpang
  // QF2 (1 C vs 2 D): Buntu Kalosi vs Garuda Muda
  // QF3 (1 B vs 2 C): PBV Bala Batu B vs Alloan Squad
  // QF4 (1 D vs 2 A): PBV Maliba vs Rante Limbong
  { id: "vpi-qf1", team_a: "Siduruk Tim", team_b: "Maliba Simpang" },
  { id: "vpi-qf2", team_a: "Buntu Kalosi", team_b: "Garuda Muda" },
  { id: "vpi-qf3", team_a: "PBV Bala Batu B", team_b: "Alloan Squad" },
  { id: "vpi-qf4", team_a: "PBV Maliba", team_b: "Rante Limbong" },

  // Sepak Bola Mini SFs
  { id: "sbm-sf1", team_a: "BUNTU BARANA A", team_b: "13 CURIO" },
  { id: "sbm-sf2", team_a: "168 SUMBANG", team_b: "BALABATU A" }
];

async function sync() {
  console.log('--- SYNCING TEAMS TABLE IN NEON POSTGRES ---');
  for (const t of CORRECT_TEAMS) {
    await sql`
      INSERT INTO teams (id, name, sport_id, group_name)
      VALUES (${t.id}, ${t.name}, ${t.sport_id}, ${t.group_name})
      ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        sport_id = EXCLUDED.sport_id,
        group_name = EXCLUDED.group_name
    `;
  }
  console.log('✅ Teams table synchronized successfully!');

  console.log('--- UPDATING VOLLY PUTRI MATCH GROUPS IN NEON POSTGRES ---');
  for (const mg of VOLLY_PUTRI_MATCH_GROUPS) {
    await sql`
      UPDATE matches
      SET group_name = ${mg.group_name}, round = ${mg.round}
      WHERE id = ${mg.id}
    `;
  }
  console.log('✅ Volly Putri match group names updated successfully!');

  console.log('--- SYNCING KNOCKOUT MATCHES IN NEON POSTGRES ---');
  for (const k of KNOCKOUT_UPDATES) {
    await sql`
      UPDATE matches
      SET team_a = ${k.team_a}, team_b = ${k.team_b}
      WHERE id = ${k.id}
    `;
  }
  console.log('✅ Knockout matches synchronized successfully!');

  // Check if app_state has pr_matches
  const appStateRows = await sql`SELECT * FROM app_state WHERE id = 'pr_matches'`;
  if (appStateRows.length > 0) {
    console.log('--- UPDATING APP_STATE TABLE ---');
    const allMatches = await sql`SELECT * FROM matches ORDER BY sport, id`;
    const formattedMatches = allMatches.map(m => ({
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
      winner: m.winner
    }));
    await sql`
      UPDATE app_state
      SET data = ${JSON.stringify(formattedMatches)}
      WHERE id = 'pr_matches'
    `;
    console.log('✅ app_state pr_matches updated!');
  }
}

sync().catch(console.error);
