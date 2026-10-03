import pool from "../config/db.js";


// --------------------------------------------------
// Create Trip
// --------------------------------------------------

export const createTrip = async ({
  userId,
  title,
  startDate,
  endDate,
  numberOfDays,
  budget,
  travelType,
  planningType,
  sourceLocation,
  aiGenerated = false
}) => {

  const [result] = await pool.execute(
    `
    INSERT INTO trips
    (
      user_id,
      title,
      start_date,
      end_date,
      number_of_days,
      budget,
      travel_type,
      planning_type,
      source_location,
      status,
      ai_generated
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'planned', ?)
    `,
    [
      userId,
      title,
      startDate || null,
      endDate || null,
      numberOfDays || null,
      budget || null,
      travelType || null,
      planningType || "normal",
      sourceLocation || null,
      Boolean(aiGenerated)
    ]
  );

  return result.insertId;
};


// --------------------------------------------------
// Add Destination to Trip
// --------------------------------------------------

export const addTripDestination = async ({
  tripId,
  destinationId,
  visitOrder,
  visitDate = null,
  notes = null
}) => {

  const [result] = await pool.execute(
    `
    INSERT INTO trip_destinations
    (
      trip_id,
      destination_id,
      visit_order,
      visit_date,
      notes
    )
    VALUES (?, ?, ?, ?, ?)
    `,
    [
      tripId,
      destinationId,
      visitOrder,
      visitDate,
      notes
    ]
  );

  return result.insertId;
};


// --------------------------------------------------
// Get All Trips of User
// --------------------------------------------------

export const getTripsByUser = async (
  userId
) => {

  const [rows] = await pool.execute(
    `
    SELECT
      *
    FROM trips
    WHERE user_id = ?
    ORDER BY created_at DESC
    `,
    [userId]
  );

  return rows;
};


// --------------------------------------------------
// Get One Trip
// --------------------------------------------------

export const getTripById = async (
  tripId,
  userId
) => {

  const [rows] = await pool.execute(
    `
    SELECT
      *
    FROM trips
    WHERE id = ?
      AND user_id = ?
    `,
    [
      tripId,
      userId
    ]
  );

  return rows[0] || null;
};


// --------------------------------------------------
// Get Destinations of Trip
// --------------------------------------------------

export const getTripDestinations = async (
  tripId
) => {

  const [rows] = await pool.execute(
    `
    SELECT
      td.id,
      td.visit_order,
      td.visit_date,
      td.notes,

      d.id AS destination_id,
      d.name,
      d.city,
      d.category,
      d.description,
      d.latitude,
      d.longitude,
      d.image_url,

      s.name AS state_name

    FROM trip_destinations td

    INNER JOIN destinations d
      ON td.destination_id = d.id

    INNER JOIN states s
      ON d.state_id = s.id

    WHERE td.trip_id = ?

    ORDER BY td.visit_order
    `,
    [tripId]
  );

  return rows;
};