import express from "express";

import {
  getDestinations,
  getDestination,
} from "../controllers/destinationController.js";

const router = express.Router();


/* =====================================================
   GET ALL DESTINATIONS

   GET:
   /api/destinations

   Examples:

   /api/destinations

   /api/destinations?stateId=1

   /api/destinations?state_id=1

   /api/destinations?search=Hyderabad

   /api/destinations?category=Beach
===================================================== */

router.get(
  "/",
  getDestinations
);


/* =====================================================
   GET DESTINATIONS BY STATE

   GET:
   /api/destinations/state/:stateId

   Example:

   /api/destinations/state/1
===================================================== */

router.get(
  "/state/:stateId",
  async (req, res, next) => {

    try {

      req.query.stateId =
        req.params.stateId;

      return getDestinations(
        req,
        res,
        next
      );

    } catch (error) {

      next(error);

    }

  }
);


/* =====================================================
   GET ONE DESTINATION

   IMPORTANT:

   This must come AFTER /state/:stateId

   Example:

   /api/destinations/25
===================================================== */

router.get(
  "/:id",
  getDestination
);


export default router;