const pool = require('../config/db');

const User = {
  async findById(userId) {
    const res = await pool.query('SELECT * FROM Users WHERE user_id = $1', [userId]);
    return res.rows[0];
  },

  async findByEmail(email) {
    const res = await pool.query('SELECT * FROM Users WHERE email = $1', [email]);
    return res.rows[0];
  },

  async create(name, password, role, email) {
    const res = await pool.query(
      'INSERT INTO Users (name, password, role, email) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, password, role, email]
    );
    return res.rows[0];
  },
};

module.exports = User;
