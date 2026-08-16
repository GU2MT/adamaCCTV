const { Pool, Client } = require('pg');
const fs = require('fs');
const path = require('path');

// Configuration: prefer DATABASE_URL. For automatic database creation provide DB_SUPERUSER_URL.
// Example DATABASE_URL: postgres://user:pass@host:5433/adama_cctv
const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  throw new Error('DATABASE_URL is required in the environment. Set it in .env or export it before starting the app.');
}
console.log('DATABASE_URL =', DATABASE_URL);
console.log('PORT =', new URL(DATABASE_URL).port);
const DB_SUPERUSER_URL = process.env.DB_SUPERUSER_URL || DATABASE_URL; // optional, required to auto-create DB if missing

let pool = new Pool({ connectionString: DATABASE_URL });

async function ensureDatabaseExists() {
  // Try a simple query; if the database does not exist, Postgres returns code '3D000' (invalid_catalog_name)
  try {
    await pool.query('SELECT 1');
    return; // database reachable
  } catch (err) {
    if (err && err.code === '3D000') {
      console.warn('Database not found:', DATABASE_URL);
      if (!DB_SUPERUSER_URL) {
        console.warn('DB_SUPERUSER_URL not provided; cannot create database automatically. Please create the database manually.');
        throw err;
      }

      // Parse database name from DATABASE_URL
      const dbUrl = new URL(DATABASE_URL);
      const dbName = dbUrl.pathname.replace(/^\//, '');
      const superClient = new Client({ connectionString: DB_SUPERUSER_URL });
      try {
        await superClient.connect();
        // Create database if not exists (idempotent wrapper)
        // Note: CREATE DATABASE cannot be run inside a transaction block.
        const check = await superClient.query(`SELECT 1 FROM pg_database WHERE datname = $1`, [dbName]);
        if (check.rowCount === 0) {
          console.log(`Creating database '${dbName}' using DB_SUPERUSER_URL`);
          await superClient.query(`CREATE DATABASE "${dbName}"`);
        } else {
          console.log(`Database '${dbName}' already exists`);
        }
      } finally {
        await superClient.end();
      }

      // Recreate pool to point at the newly created database
      pool.end().catch(() => {});
      pool = new Pool({ connectionString: DATABASE_URL });
      // Wait until reachable or throw
      await pool.query('SELECT 1');
      return;
    }
    // Other errors - rethrow
    throw err;
  }
}

async function runMigrations() {
  const migrationsDir = path.join(__dirname, '..', 'migrations');
  if (!fs.existsSync(migrationsDir)) {
    console.warn('Migrations directory not found:', migrationsDir);
    return;
  }

  const files = fs.readdirSync(migrationsDir)
    .filter((f) => f.toLowerCase().endsWith('.sql'))
    .sort();

  const client = await pool.connect();
  try {
    // Ensure schema_migrations table exists to track applied migrations
    await client.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        version TEXT PRIMARY KEY,
        applied_at TIMESTAMP WITH TIME ZONE DEFAULT now()
      );
    `);

    for (const file of files) {
      const version = file;
      const already = await client.query('SELECT 1 FROM schema_migrations WHERE version = $1', [version]);
      if (already.rowCount > 0) {
        // skip already applied migration
        continue;
      }

      console.log('Applying migration:', file);
      const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
      try {
        // Run migration in its own transaction when possible. Some migrations (e.g., CREATE EXTENSION) may run outside transactions;
        // execute as-is and allow errors to surface.
        await client.query('BEGIN');
        await client.query(sql);
        await client.query('INSERT INTO schema_migrations (version) VALUES ($1)', [version]);
        await client.query('COMMIT');
      } catch (e) {
        await client.query('ROLLBACK').catch(() => {});
        // If the migration contains commands that cannot be run inside a transaction (e.g., CREATE DATABASE inside some contexts),
        // try to run it without explicit transaction wrapper as a fallback.
        console.warn(`Migration ${file} failed in transaction; retrying without explicit transaction:`, e.message);
        try {
          await client.query(sql);
          await client.query('INSERT INTO schema_migrations (version) VALUES ($1)', [version]);
        } catch (e2) {
          console.error(`Migration ${file} failed:`, e2.message);
          throw e2;
        }
      }
    }
  } finally {
    client.release();
  }
}

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
  ensureDatabaseExists,
  runMigrations,
};
