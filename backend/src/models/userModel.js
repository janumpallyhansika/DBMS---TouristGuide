import pool from '../config/db.js';

export const createUser = async ({
  name,
  email,
  password,
  googleId = null,
  profileImage = null,
  authProvider = 'local'
}) => {
  const [result] = await pool.execute(
    `INSERT INTO users
    (name, email, password, google_id, profile_image, auth_provider)
    VALUES (?, ?, ?, ?, ?, ?)`,
    [
      name,
      email,
      password,
      googleId,
      profileImage,
      authProvider
    ]
  );

  return result.insertId;
};

export const findUserByEmail = async (email) => {
  const [rows] = await pool.execute(
    'SELECT * FROM users WHERE email = ? LIMIT 1',
    [email]
  );

  return rows[0] || null;
};

export const findUserById = async (id) => {
  const [rows] = await pool.execute(
    'SELECT id, name, email, profile_image, auth_provider, created_at FROM users WHERE id = ?',
    [id]
  );

  return rows[0] || null;
};

export const findUserByGoogleId = async (googleId) => {
  const [rows] = await pool.execute(
    'SELECT * FROM users WHERE google_id = ? LIMIT 1',
    [googleId]
  );

  return rows[0] || null;
};