require('dotenv').config();
const dbModule = require('./config/database');

// Helper to obtain a query function and a graceful pool end function from different export shapes
function resolveDb(moduleExport) {
  let queryFn = null;
  let endFn = async () => {};

  if (!moduleExport) {
    throw new Error('Database module did not export anything');
  }

  // Case A: module exports a Pool instance directly (pool.query exists and pool.end exists)
  if (typeof moduleExport.query === 'function' && typeof moduleExport.end === 'function') {
    queryFn = moduleExport.query.bind(moduleExport);
    endFn = () => moduleExport.end();
    return { queryFn, endFn };
  }

  // Case B: module exports an object like { query, pool, ... }
  if (typeof moduleExport.query === 'function') {
    queryFn = moduleExport.query.bind(moduleExport);
    if (moduleExport.pool && typeof moduleExport.pool.end === 'function') {
      endFn = () => moduleExport.pool.end();
    } else if (typeof moduleExport.end === 'function') {
      endFn = () => moduleExport.end();
    }
    return { queryFn, endFn };
  }

  // Case C: module exports only a client with connect/query/end
  if (typeof moduleExport.connect === 'function' && typeof moduleExport.query === 'function') {
    queryFn = moduleExport.query.bind(moduleExport);
    if (typeof moduleExport.end === 'function') endFn = () => moduleExport.end();
    return { queryFn, endFn };
  }

  throw new Error('Unsupported database module shape');
}

async function testConnection() {
  const { queryFn, endFn } = resolveDb(dbModule);
  try {
    const result = await queryFn('SELECT NOW() as now');
    console.log('Connected!');
    if (result && result.rows) console.log(result.rows[0]);
    else console.log(result);
  } catch (err) {
    console.error('Connection test failed:', err);
    process.exitCode = 1;
  } finally {
    try {
      await endFn();
    } catch (e) {
      // ignore
    }
  }
}

if (require.main === module) {
  testConnection();
}

module.exports = { testConnection };
