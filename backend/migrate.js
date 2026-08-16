const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

const migrationsDir = path.join(__dirname, 'migrations');

async function run() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error('DATABASE_URL environment variable is required.');
    process.exit(1);
  }

  const pool = new Pool({ connectionString: databaseUrl });

  try {
    const files = fs.readdirSync(migrationsDir).filter(f => f.endsWith('.sql')).sort();
    for (const file of files) {
      const full = path.join(migrationsDir, file);
      console.log('Running migration:', file);
      const sql = fs.readFileSync(full, 'utf8');
      await pool.query(sql);
    }
    console.log('Migrations applied successfully.');
  } catch (err) {
    console.error('Migration error:', err.message || err);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

run();
