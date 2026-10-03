import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";

import {
  addSavedPlace,
  deleteSavedPlace,
  getSavedPlaces,
  checkSavedPlace,
} from "../controllers/savedPlaceController.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/", getSavedPlaces);

router.post("/", addSavedPlace);

router.delete("/:destinationId", deleteSavedPlace);

router.get(
  "/check/:destinationId",
  checkSavedPlace
);

export default router;