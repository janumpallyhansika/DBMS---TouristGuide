import pool from "../config/db.js";

/* =====================================================
   GET ALL DESTINATIONS
===================================================== */

export const getAllDestinations = async () => {
  const [rows] = await pool.execute(`
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
      d.created_at,

      s.name AS state_name,
      s.code AS state_code

    FROM destinations d

    INNER JOIN states s
      ON d.state_id = s.id

    ORDER BY d.name ASC
  `);

  return rows;
};


/* =====================================================
   GET DESTINATIONS BY STATE
===================================================== */

export const getDestinationsByState = async (stateId) => {
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
      d.created_at,

      s.name AS state_name,
      s.code AS state_code

    FROM destinations d

    INNER JOIN states s
      ON d.state_id = s.id

    WHERE d.state_id = ?

    ORDER BY d.name ASC
    `,
    [stateId]
  );

  return rows;
};


/* =====================================================
   GET DESTINATION BY ID
===================================================== */

export const getDestinationById = async (id) => {
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
      d.created_at,

      s.name AS state_name,
      s.code AS state_code

    FROM destinations d

    INNER JOIN states s
      ON d.state_id = s.id

    WHERE d.id = ?

    LIMIT 1
    `,
    [id]
  );

  return rows[0] || null;
};


/* =====================================================
   GET DESTINATION BY EXACT NAME
===================================================== */

export const getDestinationByName = async (name) => {
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
      s.code AS state_code

    FROM destinations d

    INNER JOIN states s
      ON d.state_id = s.id

    WHERE LOWER(TRIM(d.name)) =
          LOWER(TRIM(?))

    LIMIT 1
    `,
    [name]
  );

  return rows[0] || null;
};


/* =====================================================
   SEARCH DESTINATIONS
===================================================== */

export const searchDestinations = async (search) => {
  const keyword = `%${String(search || "").trim()}%`;

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
      s.code AS state_code

    FROM destinations d

    INNER JOIN states s
      ON d.state_id = s.id

    WHERE
      d.name LIKE ?
      OR d.city LIKE ?
      OR d.category LIKE ?
      OR d.description LIKE ?
      OR s.name LIKE ?

    ORDER BY d.name ASC
    `,
    [
      keyword,
      keyword,
      keyword,
      keyword,
      keyword
    ]
  );

  return rows;
};


/* =====================================================
   GET DESTINATIONS FOR AI TRIP PLANNER
===================================================== */

export const getDestinationsByCityOrState = async (
  destination
) => {
  const search =
    `%${String(destination || "").trim()}%`;

  const [rows] = await pool.execute(
    `
    SELECT
      d.id,
      d.name,
      d.city,
      d.category,
      d.description,
      d.latitude,
      d.longitude,
      d.image_url,
      d.estimated_hours,
      d.best_time,

      s.id AS state_id,
      s.name AS state_name,
      s.code AS state_code

    FROM destinations d

    INNER JOIN states s
      ON d.state_id = s.id

    WHERE
      d.city LIKE ?
      OR s.name LIKE ?
      OR d.name LIKE ?

    ORDER BY d.name ASC
    `,
    [
      search,
      search,
      search
    ]
  );

  return rows;
};