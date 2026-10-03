import express from "express";

import {
  createNewTrip,
  getMyTrips,
  getSingleTrip
} from "../controllers/tripController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

router.post(
  "/",
  createNewTrip
);

router.get(
  "/",
  getMyTrips
);

router.get(
  "/:id",
  getSingleTrip
);

export default router;