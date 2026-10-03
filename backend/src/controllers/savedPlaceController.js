import {
  savePlace,
  removeSavedPlace,
  getSavedPlacesByUser,
  isPlaceSaved,
} from "../models/savedPlaceModel.js";


/* =========================================
   SAVE PLACE
========================================= */

export const addSavedPlace = async (
  req,
  res
) => {
  try {

    const userId = req.user?.id;

    const {
      destinationId
    } = req.body;


    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }


    if (!destinationId) {
      return res.status(400).json({
        success: false,
        message: "Destination ID is required.",
      });
    }


    await savePlace(
      userId,
      Number(destinationId)
    );


    res.status(201).json({
      success: true,
      message: "Place saved successfully.",
    });

  } catch (error) {

    console.error(
      "SAVE PLACE ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to save place.",
      error: error.message,
    });
  }
};


/* =========================================
   REMOVE PLACE
========================================= */

export const deleteSavedPlace = async (
  req,
  res
) => {
  try {

    const userId = req.user?.id;

    const {
      destinationId
    } = req.params;


    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }


    await removeSavedPlace(
      userId,
      Number(destinationId)
    );


    res.json({
      success: true,
      message: "Place removed from saved places.",
    });

  } catch (error) {

    console.error(
      "REMOVE SAVED PLACE ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to remove saved place.",
      error: error.message,
    });
  }
};


/* =========================================
   GET SAVED PLACES
========================================= */

export const getSavedPlaces = async (
  req,
  res
) => {
  try {

    const userId = req.user?.id;


    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }


    const places =
      await getSavedPlacesByUser(
        userId
      );


    res.json({
      success: true,
      places,
    });

  } catch (error) {

    console.error(
      "GET SAVED PLACES ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to load saved places.",
      error: error.message,
    });
  }
};


/* =========================================
   CHECK SAVED STATUS
========================================= */

export const checkSavedPlace = async (
  req,
  res
) => {
  try {

    const userId = req.user?.id;

    const {
      destinationId
    } = req.params;


    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }


    const saved =
      await isPlaceSaved(
        userId,
        Number(destinationId)
      );


    res.json({
      success: true,
      saved,
    });

  } catch (error) {

    console.error(
      "CHECK SAVED PLACE ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to check saved place.",
      error: error.message,
    });
  }
};