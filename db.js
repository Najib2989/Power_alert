const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

pool.connect()
  .then(() => console.log('✅ Neon PostgreSQL Database Connected Successfully!'))
  .catch(err => console.error('❌ Database Connection Error:', err.stack));

module.exports = pool;
