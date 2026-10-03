import pool from "../config/db.js";

/* =========================================
   SAVE PLACE
========================================= */

export const savePlace = async (userId, destinationId) => {
  const [result] = await pool.execute(
    `
    INSERT INTO saved_places
      (user_id, destination_id)
    VALUES
      (?, ?)
    ON DUPLICATE KEY UPDATE
      id = id
    `,
    [userId, destinationId]
  );

  return result;
};


/* =========================================
   REMOVE SAVED PLACE
========================================= */

export const removeSavedPlace = async (
  userId,
  destinationId
) => {
  const [result] = await pool.execute(
    `
    DELETE FROM saved_places
    WHERE user_id = ?
      AND destination_id = ?
    `,
    [userId, destinationId]
  );

  return result;
};


/* =========================================
   GET USER SAVED PLACES
========================================= */

export const getSavedPlacesByUser = async (
  userId
) => {
  const [rows] = await pool.execute(
    `
    SELECT
      d.id,
      d.state_id,
      d.name,
      d.city,
      d.category,
      d.description,
      d.latitude,
      d.longitude,
      d.image_url,
      d.estimated_hours,
      d.best_time,
      s.name AS state_name,
      sp.created_at AS saved_at

    FROM saved_places sp

    INNER JOIN destinations d
      ON sp.destination_id = d.id

    LEFT JOIN states s
      ON d.state_id = s.id

    WHERE sp.user_id = ?

    ORDER BY sp.created_at DESC
    `,
    [userId]
  );

  return rows;
};


/* =========================================
   CHECK IF PLACE IS SAVED
========================================= */

export const isPlaceSaved = async (
  userId,
  destinationId
) => {
  const [rows] = await pool.execute(
    `
    SELECT id
    FROM saved_places
    WHERE user_id = ?
      AND destination_id = ?
    LIMIT 1
    `,
    [userId, destinationId]
  );

  return rows.length > 0;
};