import pool from '../config/db.js';

export const createItinerary = async ({
  tripId,
  dayNumber,
  title,
  description
}) => {
  const [result] = await pool.execute(
    `INSERT INTO itineraries
    (
      trip_id,
      day_number,
      title,
      description
    )
    VALUES (?, ?, ?, ?)`,
    [
      tripId,
      dayNumber,
      title,
      description
    ]
  );

  return result.insertId;
};

export const addItineraryItem = async ({
  itineraryId,
  destinationId,
  startTime,
  endTime,
  activity,
  notes
}) => {
  const [result] = await pool.execute(
    `INSERT INTO itinerary_items
    (
      itinerary_id,
      destination_id,
      start_time,
      end_time,
      activity,
      notes
    )
    VALUES (?, ?, ?, ?, ?, ?)`,
    [
      itineraryId,
      destinationId || null,
      startTime || null,
      endTime || null,
      activity || null,
      notes || null
    ]
  );

  return result.insertId;
};

export const getItineraryByTrip = async (tripId) => {
  const [rows] = await pool.execute(
    `SELECT
      i.id,
      i.day_number,
      i.title,
      i.description,
      ii.id AS item_id,
      ii.destination_id,
      ii.start_time,
      ii.end_time,
      ii.activity,
      ii.notes,
      d.name AS destination_name,
      d.latitude,
      d.longitude
     FROM itineraries i
     LEFT JOIN itinerary_items ii
       ON i.id = ii.itinerary_id
     LEFT JOIN destinations d
       ON ii.destination_id = d.id
     WHERE i.trip_id = ?
     ORDER BY i.day_number, ii.start_time`,
    [tripId]
  );

  return rows;
};