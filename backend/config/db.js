const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

let pool = null;

// Create pool function
const createPool = () => {
  pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'study_planner2',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    enableKeepAlive: true
  });
  return pool;
};

// Initialize pool on first call
const getPool = () => {
  if (!pool) {
    createPool();
  }
  return pool;
};

// Export as both direct pool and getPool function for compatibility
module.exports = {
  getConnection: () => getPool().getConnection(),
  createPool,
  getPool,
  query: (sql, values) => getPool().query(sql, values)
};
