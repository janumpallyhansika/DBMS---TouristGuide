import express from "express";

import pool from "../config/db.js";


const router = express.Router();


// =====================================================
// GET ALL STATES
// GET /api/states
// =====================================================

router.get("/", async (req, res, next) => {

  try {

    const [states] =
      await pool.execute(

        `
        SELECT
          id,
          name,
          code,
          type,
          capital,
          description,
          image_url
        FROM states
        ORDER BY name ASC
        `

      );


    res.json({

      success: true,

      count: states.length,

      states,

    });


  } catch (error) {

    console.error(
      "Get states error:",
      error
    );

    next(error);

  }

});


// =====================================================
// GET ONE STATE
// GET /api/states/:id
// =====================================================

router.get(
  "/:id",
  async (req, res, next) => {

    try {

      const { id } =
        req.params;


      const [states] =
        await pool.execute(

          `
          SELECT
            id,
            name,
            code,
            type,
            capital,
            description,
            image_url
          FROM states
          WHERE id = ?
          LIMIT 1
          `,

          [id]

        );


      if (states.length === 0) {

        return res.status(404).json({

          success: false,

          message:
            "State not found",

        });

      }


      res.json({

        success: true,

        state: states[0],

      });


    } catch (error) {

      console.error(
        "Get state error:",
        error
      );

      next(error);

    }

  }
);


export default router;