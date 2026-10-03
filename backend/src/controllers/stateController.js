import pool from "../config/db.js";

// =====================================================
// GET ALL STATES AND UNION TERRITORIES
// GET /api/states
// =====================================================

export async function getAllStates(req, res) {
  try {
    const [rows] = await pool.query(`
      SELECT
        id,
        name,
        code,
        type,
        capital,
        description
      FROM states
      ORDER BY name ASC
    `);

    res.status(200).json({
      success: true,
      count: rows.length,
      data: rows
    });

  } catch (error) {
    console.error("❌ Error fetching states:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to fetch states",
      error: error.message
    });
  }
}


// =====================================================
// GET ONE STATE
// GET /api/states/:id
// =====================================================

export async function getStateById(req, res) {
  try {
    const { id } = req.params;

    const [rows] = await pool.query(
      `
      SELECT
        id,
        name,
        code,
        type,
        capital,
        description
      FROM states
      WHERE id = ?
      `,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "State not found"
      });
    }

    res.status(200).json({
      success: true,
      data: rows[0]
    });

  } catch (error) {
    console.error("❌ Error fetching state:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to fetch state",
      error: error.message
    });
  }
}