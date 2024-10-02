const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres', 
  host: 'localhost', 
  database: 'attendance_tracking_system',
  password: 'YashStarboy@12345', 
  port: 5432,
});

module.exports = pool;
