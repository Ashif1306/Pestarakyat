import fs from 'fs';

const dump = JSON.parse(fs.readFileSync('scripts/matches_dump.json', 'utf8'));

let dataTs = fs.readFileSync('src/lib/data.ts', 'utf8');

// Replace DEFAULT_MATCHES array in data.ts
const defaultMatchesStr = `export const DEFAULT_MATCHES: Match[] = ${JSON.stringify(dump, null, 2)};`;

// Regex replace export const DEFAULT_MATCHES: Match[] = [...];
dataTs = dataTs.replace(/export const DEFAULT_MATCHES: Match\[\] = \[[\s\S]*?\n\];/, defaultMatchesStr);

fs.writeFileSync('src/lib/data.ts', dataTs);
console.log('Updated src/lib/data.ts with exact real DB matches!');
