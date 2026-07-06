// One-off: point portfolio_items at the surviving Feb-2026 videos on Vercel Blob.
// Mapping: exact base-name matches pinned, remainder matched by category.
import postgres from 'postgres';
import fs from 'fs';
import path from 'path';

const envPath = path.join(process.cwd(), '.env.local');
for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
  const m = line.match(/^([A-Z0-9_]+)="?([^"]*)"?$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
}

const token = process.env.BLOB_READ_WRITE_TOKEN;
const res = await fetch('https://blob.vercel-storage.com/?prefix=videos/&limit=100', {
  headers: { Authorization: `Bearer ${token}` },
});
const { blobs } = await res.json();
const urlFor = (ts) => {
  const b = blobs.find((b) => b.pathname.startsWith(`videos/${ts}-`));
  if (!b) throw new Error(`No blob found for timestamp ${ts}`);
  return b.url;
};

// item id -> blob upload timestamp (from filename)
const MAPPING = {
  1: '1770734124760', // Lifestyle 1        <- Lifestyle___4__mov.mov (category match)
  3: '1770734568897', // Wedding event      <- Events__8__mp4.mp4 (only Events file)
  4: '1770734638710', // Travel             <- Travel_and_hospitali.mp4 42MB
  5: '1770734913794', // Education          <- Education_and_wellne.mp4 55MB
  6: '1770821403250', // Travel             <- Travel_and_hospitali.mp4 9MB
  7: '1770821074929', // Lifestyle          <- Lifestyle__Kijiji__m.mp4 (category match)
  8: '1770734820095', // Travel             <- Travel_and_Hospitali.mp4 (capital-H matches old URL)
  9: '1770821520905', // Travel Casa        <- Travel_and_hospitali.mp4 53MB
  10: '1770734400843', // Lifestyle         <- Lifestyle__4__mp4.mp4 (base-name match)
  13: '1770787347119', // Education         <- copy_E5DBA3D0_0C82_4.mp4 (exact base-name match)
  14: '1770734304370', // Lifestylw         <- Lifestyle__3__mp4.mp4 (exact base-name match)
};

const sql = postgres(process.env.POSTGRES_URL, { ssl: 'require', prepare: false });

for (const [id, ts] of Object.entries(MAPPING)) {
  const url = urlFor(ts);
  await sql`UPDATE portfolio_items SET video_url = ${url}, updated_at = CURRENT_TIMESTAMP WHERE id = ${id}`;
  console.log(`✅ #${id} -> ${url.split('/').pop()}`);
}

const rows = await sql`SELECT id, title, video_url FROM portfolio_items ORDER BY id`;
console.log('\nFinal state:');
for (const r of rows) console.log(` ${r.id}\t${r.title}\t${r.video_url.split('/').pop().slice(0, 60)}`);

await sql.end();
