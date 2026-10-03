import pool from '../config/db.js';

export const getAllStates = async () => {
  const [rows] = await pool.execute(
    `SELECT
      id,
      name,
      code,
      type,
      capital,
      description,
      image_url
     FROM states
     ORDER BY name ASC`
  );

  return rows;
};

export const getStateById = async (id) => {
  const [rows] = await pool.execute(
    `SELECT
      id,
      name,
      code,
      type,
      capital,
      description,
      image_url
     FROM states
     WHERE id = ?`,
    [id]
  );

  return rows[0] || null;
};