const db = require('../config/database');

const createUser = async ({ first_name, last_name, gender, phone, email, password_hash, address, role_id = 1, status = 'active' }) => {
  const normalizedRoleId = Number(role_id || 1);

  const result = await db.query(
    `INSERT INTO users (first_name, last_name, gender, phone, email, password_hash, address, role_id, status)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
     RETURNING *`,
    [first_name, last_name, gender, phone, email, password_hash, address, normalizedRoleId, status]
  );

  return result.rows[0];
};

const findUserByPhone = async (phone) => {
  const res = await db.query(`SELECT * FROM users WHERE phone = $1 LIMIT 1`, [phone]);
  return res.rows[0];
};

const findUserByEmail = async (email) => {
  const normalizedEmail = email.toLowerCase();
  const res = await db.query(`SELECT * FROM users WHERE LOWER(email) = $1 LIMIT 1`, [normalizedEmail]);
  return res.rows[0];
};

const findUserByIdentifier = async (identifier) => {
  const normalizedIdentifier = identifier.trim();
  const res = await db.query(
    `SELECT * FROM users WHERE LOWER(email) = LOWER($1) OR phone = $2 LIMIT 1`,
    [normalizedIdentifier, normalizedIdentifier]
  );
  return res.rows[0];
};

const findUserById = async (userId) => {
  const res = await db.query(`SELECT * FROM users WHERE user_id = $1 LIMIT 1`, [userId]);
  return res.rows[0];
};

module.exports = {
  createUser,
  findUserByPhone,
  findUserByEmail,
  findUserByIdentifier,
  findUserById,
};
