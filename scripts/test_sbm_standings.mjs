import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_3zmx1GoBjZOM@ep-curly-dust-azxmkqbz-pooler.c-3.ap-southeast-1.aws.neon.tech/neondb?sslmode=require');

async function run() {
  const matches = await sql`SELECT * FROM matches WHERE sport = 'sepak-bola-mini'`;
  
  const standingsMap = {};
  matches.forEach(m => {
    if (m.phase !== 'group') return;
    if (m.score_a === null || m.score_b === null) return;
    if (m.status !== 'finished' && m.status !== 'live') return;

    const grp = m.group_name || 'A';
    const tA = m.team_a;
    const tB = m.team_b;

    if (!standingsMap[grp]) standingsMap[grp] = {};
    if (!standingsMap[grp][tA]) standingsMap[grp][tA] = { name: tA, played: 0, won: 0, draw: 0, lost: 0, gf: 0, ga: 0, pts: 0 };
    if (!standingsMap[grp][tB]) standingsMap[grp][tB] = { name: tB, played: 0, won: 0, draw: 0, lost: 0, gf: 0, ga: 0, pts: 0 };

    const stA = standingsMap[grp][tA];
    const stB = standingsMap[grp][tB];

    stA.played += 1;
    stB.played += 1;

    stA.gf += m.score_a;
    stA.ga += m.score_b;
    stB.gf += m.score_b;
    stB.ga += m.score_a;

    if (m.score_a > m.score_b) {
      stA.won += 1; stA.pts += 3;
      stB.lost += 1;
    } else if (m.score_b > m.score_a) {
      stB.won += 1; stB.pts += 3;
      stA.lost += 1;
    } else {
      stA.draw += 1; stA.pts += 1;
      stB.draw += 1; stB.pts += 1;
    }
  });

  console.log('=== SEPAK BOLA MINI STANDINGS ===');
  for (const [grp, map] of Object.entries(standingsMap)) {
    console.log(`--- GRUP ${grp} ---`);
    const list = Object.values(map).sort((a, b) => {
      if (b.pts !== a.pts) return b.pts - a.pts;
      const diffA = a.gf - a.ga;
      const diffB = b.gf - b.ga;
      if (diffB !== diffA) return diffB - diffA;
      return b.gf - a.gf;
    });
    list.forEach((t, i) => console.log(` ${i+1}. ${t.name.padEnd(25)} P:${t.played} W:${t.won} D:${t.draw} L:${t.lost} GF:${t.gf} GA:${t.ga} (Diff:${t.gf-t.ga}) PTS:${t.pts}`));
  }

  const knockout = matches.filter(m => m.phase === 'knockout');
  console.log('\n--- KNOCKOUT MATCHES IN DB ---');
  knockout.forEach(m => console.log(` [${m.round}] ${m.team_a} vs ${m.team_b} (${m.score_a}-${m.score_b}) Winner:${m.winner}`));
}

run().catch(console.error);
