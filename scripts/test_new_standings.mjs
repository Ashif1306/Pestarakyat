import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_3zmx1GoBjZOM@ep-curly-dust-azxmkqbz-pooler.c-3.ap-southeast-1.aws.neon.tech/neondb?sslmode=require');

const TEAMS_CORRECT = {
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
    { id: "vpi-t1", name: "MTs", group: "A" },
    { id: "vpi-t2", name: "Rante Limbong", group: "A" },
    { id: "vpi-t3", name: "Siduruk Tim", group: "A" },
    { id: "vpi-t4", name: "SMPN 6 Alla", group: "B" },
    { id: "vpi-t5", name: "Maliba Simpang", group: "B" },
    { id: "vpi-t6", name: "PBV Bala Batu B", group: "B" },
    { id: "vpi-t7", name: "Alloan Squad", group: "C" },
    { id: "vpi-t8", name: "Buntu Kalosi", group: "C" },
    { id: "vpi-t9", name: "PBV Bala Batu A", group: "C" },
    { id: "vpi-t10", name: "Buntu Ampalla", group: "D" },
    { id: "vpi-t11", name: "Garuda Muda", group: "D" },
    { id: "vpi-t12", name: "PBV Maliba", group: "D" }
  ]
};

function calcStandings(allMatches, sport, teamsList) {
  const matches = allMatches.filter(m => m.sport === sport);
  const standingsMap = {};

  teamsList.forEach(t => {
    const grp = t.group || 'A';
    if (!standingsMap[grp]) standingsMap[grp] = {};
    standingsMap[grp][t.name] = {
      name: t.name, played: 0, won: 0, lost: 0, setsFor: 0, setsAgainst: 0, points: 0
    };
  });

  matches.forEach(m => {
    if (m.phase !== 'group') return;
    if (m.score_a === null || m.score_b === null) return;
    if (m.status !== 'finished' && m.status !== 'live') return;

    const grp = m.group_name || 'A';
    const tA = m.team_a;
    const tB = m.team_b;

    if (!standingsMap[grp]) standingsMap[grp] = {};
    if (!standingsMap[grp][tA]) standingsMap[grp][tA] = { name: tA, played: 0, won: 0, lost: 0, setsFor: 0, setsAgainst: 0, points: 0 };
    if (!standingsMap[grp][tB]) standingsMap[grp][tB] = { name: tB, played: 0, won: 0, lost: 0, setsFor: 0, setsAgainst: 0, points: 0 };

    const stA = standingsMap[grp][tA];
    const stB = standingsMap[grp][tB];

    stA.played += 1;
    stB.played += 1;

    stA.setsFor += m.score_a;
    stA.setsAgainst += m.score_b;
    stB.setsFor += m.score_b;
    stB.setsAgainst += m.score_a;

    if (m.score_a > m.score_b) {
      stA.won += 1;
      stA.points += (m.score_a === 2 && m.score_b === 0) ? 3 : 2;
      stB.lost += 1;
      stB.points += 0;
    } else if (m.score_b > m.score_a) {
      stB.won += 1;
      stB.points += (m.score_b === 2 && m.score_a === 0) ? 3 : 2;
      stA.lost += 1;
      stA.points += 0;
    }
  });

  const result = {};
  Object.keys(standingsMap).sort().forEach(grp => {
    const list = Object.values(standingsMap[grp]);
    list.sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      const diffA = a.setsFor - a.setsAgainst;
      const diffB = b.setsFor - b.setsAgainst;
      if (diffB !== diffA) return diffB - diffA;
      return b.setsFor - a.setsFor;
    });
    result[grp] = list;
  });
  return result;
}

async function run() {
  const matches = await sql`SELECT * FROM matches`;

  for (const sport of ['volly-putra', 'volly-putri']) {
    console.log(`\n=================== ${sport.toUpperCase()} STANDINGS (EXACT USER GROUPS) ===================`);
    const st = calcStandings(matches, sport, TEAMS_CORRECT[sport]);
    for (const [grp, list] of Object.entries(st)) {
      console.log(`--- GRUP ${grp} ---`);
      list.forEach((t, idx) => {
        const diff = t.setsFor - t.setsAgainst;
        console.log(` ${idx+1}. ${t.name.padEnd(20)} | P:${t.played} W:${t.won} L:${t.lost} | SF:${t.setsFor} SA:${t.setsAgainst} (Diff:${diff>=0?'+':''}${diff}) | PTS:${t.points}`);
      });
    }
  }
}

run().catch(console.error);
