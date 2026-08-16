const fs = require('fs');
const path = require('path');
const db = require('../config/database');

async function runMigrations() {
  const dir = __dirname;
  const files = fs.readdirSync(dir)
    .filter(f => f.toLowerCase().endsWith('.sql'))
    .sort(); // relies on numeric prefixes for order

  // If the database helper exposes ensureDatabaseExists, call it first to create the DB when possible
  if (typeof db.ensureDatabaseExists === 'function') {
    console.log('Ensuring database exists...');
    await db.ensureDatabaseExists();
  }

  for (const file of files) {
    const full = path.join(dir, file);
    console.log(`Running ${file}...`);
    const sql = fs.readFileSync(full, 'utf8');
    try {
      await db.pool.query(sql);
    } catch (err) {
      console.error(`Failed running ${file}:`, err.message || err);
      throw err;
    }
  }

  console.log('All migrations complete.');
  await db.pool.end();
}

runMigrations().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
