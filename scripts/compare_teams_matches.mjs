import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_3zmx1GoBjZOM@ep-curly-dust-azxmkqbz-pooler.c-3.ap-southeast-1.aws.neon.tech/neondb?sslmode=require');

const DEFAULT_TEAMS = {
  "volly-putra": [
    { id: "vp-t1", name: "Pemula Squad", group: "A" },
    { id: "vp-t2", name: "PBV Uluway", group: "A" },
    { id: "vp-t3", name: "PBV Liba", group: "A" },
    { id: "vp-t4", name: "PBV Siduruk", group: "B" },
    { id: "vp-t5", name: "Le'To Bara", group: "B" },
    { id: "vp-t6", name: "PBV Masbro", group: "B" },
    { id: "vp-t7", name: "MVC Malannying", group: "C" },
    { id: "vp-t8", name: "PBV Bala Batu A", group: "C" },
    { id: "vp-t9", name: "Solleakka Group", group: "C" },
    { id: "vp-t10", name: "PBV Bala Batu B", group: "D" },
    { id: "vp-t11", name: "PBV Bunga Duri", group: "D" },
    { id: "vp-t12", name: "PBV Lamba", group: "D" }
  ],
  "volly-putri": [
    { id: "vpi-t1", name: "Alloan Squad", group: "A" },
    { id: "vpi-t2", name: "PBV Bala Batu A", group: "A" },
    { id: "vpi-t3", name: "Buntu Kalosi", group: "A" },
    { id: "vpi-t4", name: "MTs", group: "B" },
    { id: "vpi-t5", name: "Rante Limbong", group: "B" },
    { id: "vpi-t6", name: "Siduruk Tim", group: "B" },
    { id: "vpi-t7", name: "Buntu Ampalla", group: "C" },
    { id: "vpi-t8", name: "PBV Maliba", group: "C" },
    { id: "vpi-t9", name: "Garuda Muda", group: "C" },
    { id: "vpi-t10", name: "Maliba Simpang", group: "D" },
    { id: "vpi-t11", name: "SMPN 6 Alla", group: "D" },
    { id: "vpi-t12", name: "PBV Bala Batu B", group: "D" }
  ],
  "sepak-bola-mini": [
    { id: "sbm-1", name: "BUNTU BARANA A", group: "A" },
    { id: "sbm-2", name: "SDN 130 RANTELIMBONG", group: "A" },
    { id: "sbm-3", name: "MIS MINANGA B", group: "A" },
    { id: "sbm-4", name: "SD ULUWAI JUNIOR", group: "A" },
    { id: "sbm-5", name: "MALIBA", group: "A" },
    { id: "sbm-6", name: "BALABATU A", group: "A" },
    { id: "sbm-7", name: "BUNTU BARANA B", group: "B" },
    { id: "sbm-8", name: "13 CURIO", group: "B" },
    { id: "sbm-9", name: "MIS MINANGA A", group: "B" },
    { id: "sbm-10", name: "MALANYING JUNIOR", group: "B" },
    { id: "sbm-11", name: "BALABATU B", group: "B" },
    { id: "sbm-12", name: "168 SUMBANG", group: "B" }
  ]
};

async function checkAll() {
  const dbTeams = await sql`SELECT * FROM teams ORDER BY sport_id, group_name, name`;
  const dbMatches = await sql`SELECT * FROM matches ORDER BY sport, id`;

  console.log('=== COMPARING TEAMS & MATCHES ===');
  for (const sport of ['volly-putra', 'volly-putri', 'sepak-bola-mini']) {
    console.log(`\n--- SPORT: ${sport} ---`);
    console.log('DEFAULT_TEAMS in data.ts:');
    const def = DEFAULT_TEAMS[sport] || [];
    def.forEach(t => console.log(`  Grp ${t.group}: ${t.name}`));

    console.log('DB TEAMS:');
    const dbt = dbTeams.filter(t => t.sport_id === sport);
    dbt.forEach(t => console.log(`  Grp ${t.group_name}: ${t.name}`));

    console.log('GROUP MATCHES IN DB:');
    const dbm = dbMatches.filter(m => m.sport === sport && m.phase === 'group');
    dbm.forEach(m => console.log(`  [Grp ${m.group_name}] ${m.team_a} vs ${m.team_b} (${m.score_a}-${m.score_b})`));
  }
}

checkAll().catch(console.error);
