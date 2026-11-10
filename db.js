const { Pool } = require('pg');
require('dotenv').config();

let pool = null;
const dbUrl = process.env.DATABASE_URL || '';

if (dbUrl) {
  try {
    pool = new Pool({
      connectionString: dbUrl,
      ssl: {
        rejectUnauthorized: false
      }
    });

    pool.connect()
      .then((client) => {
        console.log('✅ Neon PostgreSQL Database Connected Successfully!');
        client.release();
      })
      .catch(err => console.error('❌ Database Connection Error:', err.message));
  } catch (e) {
    console.error('Failed to initialize PG pool:', e.message);
  }
} else {
  console.warn('⚠️ DATABASE_URL is not set. Please set it in .env or Vercel Environment Variables.');
}

module.exports = pool;
