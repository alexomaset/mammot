// One-off: seed portfolio_items in the new Supabase DB from data/portfolio.json
// Usage: node scripts/seed-from-json.mjs
import postgres from 'postgres';
import fs from 'fs';
import path from 'path';

// Minimal .env.local loader (avoids extra deps)
const envPath = path.join(process.cwd(), '.env.local');
for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
  const m = line.match(/^([A-Z0-9_]+)="?([^"]*)"?$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
}

const sql = postgres(process.env.POSTGRES_URL, { ssl: 'require', prepare: false });

const items = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'data', 'portfolio.json'), 'utf8'));

await sql`
  CREATE TABLE IF NOT EXISTS portfolio_items (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    video_url TEXT NOT NULL,
    thumbnail TEXT NOT NULL,
    description TEXT,
    tags TEXT[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
  );
`;

for (const item of items) {
  await sql`
    INSERT INTO portfolio_items (id, title, category, video_url, thumbnail, description, tags, created_at)
    VALUES (${item.id}, ${item.title}, ${item.category}, ${item.videoUrl}, ${item.thumbnail},
            ${item.description || ''}, ${item.tags || []}, ${item.createdAt || new Date().toISOString()})
    ON CONFLICT (id) DO UPDATE SET
      title = EXCLUDED.title,
      category = EXCLUDED.category,
      video_url = EXCLUDED.video_url,
      thumbnail = EXCLUDED.thumbnail,
      description = EXCLUDED.description,
      tags = EXCLUDED.tags
  `;
  console.log(`✅ Seeded #${item.id} ${item.title}`);
}

// Keep the id sequence ahead of the seeded ids
await sql`SELECT setval(pg_get_serial_sequence('portfolio_items', 'id'), (SELECT MAX(id) FROM portfolio_items))`;

const rows = await sql`SELECT id, title, category FROM portfolio_items ORDER BY id`;
console.log(`\n${rows.length} rows in portfolio_items:`);
for (const r of rows) console.log(` ${r.id}\t${r.title}\t(${r.category})`);

await sql.end();
