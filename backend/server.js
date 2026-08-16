require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { ensureDatabaseExists, runMigrations } = require('./config/database');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Health
app.get('/api/health', (req, res) => {
  res.json({ message: 'Backend is running for Adama City CCTV and GIS system.' });
});

// Mount API routes
const usersRoutes = require('./routes/users');
const cctvRoutes = require('./routes/cctv');
const incidentsRoutes = require('./routes/incidents');

app.use('/api/users', usersRoutes);
app.use('/api/cctv', cctvRoutes);
app.use('/api/incidents', incidentsRoutes);

app._router.stack.forEach((r) => {
  if (r.route) console.log('ROUTE:', r.route.path);
  else if (r.name === 'router') {
    r.handle.stack.forEach((h) => {
      if (h.route) console.log('SUBROUTE:', h.route.path, Object.keys(h.route.methods));
    });
  }
});

app.get('/', (req, res) => {
  res.send('Adama City CCTV backend is running.');
});

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ error: 'Not found' });
});

// Error handler
app.use(errorHandler);

async function start() {
  try {
    if (process.env.DATABASE_URL) {
      await ensureDatabaseExists();
      await runMigrations();
    }

    app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

start();
