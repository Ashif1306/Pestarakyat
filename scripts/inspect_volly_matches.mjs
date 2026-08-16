import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_3zmx1GoBjZOM@ep-curly-dust-azxmkqbz-pooler.c-3.ap-southeast-1.aws.neon.tech/neondb?sslmode=require');

async function main() {
  const matches = await sql`SELECT * FROM matches WHERE sport LIKE 'volly%' ORDER BY sport, id`;
  console.log('--- DB VOLLY MATCHES COUNT:', matches.length);
  matches.forEach(m => {
    console.log(`[${m.sport}] ID:${m.id} | Phase:${m.phase} | Grp:${m.group_name} | Round:${m.round} | ${m.team_a} vs ${m.team_b} | Score: ${m.score_a}-${m.score_b} | Winner: ${m.winner} | Status: ${m.status}`);
  });
}

main().catch(console.error);
