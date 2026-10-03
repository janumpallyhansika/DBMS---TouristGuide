import {
  getAllDestinations,
  getDestinationsByState,
  getDestinationById,
  searchDestinations,
} from "../models/destinationModel.js";

import {
  getWikimediaImage,
} from "../services/wikimediaImageService.js";


/* =========================================================
   GET ALL DESTINATIONS
   ========================================================= */

export const getDestinations = async (
  req,
  res,
  next
) => {
  try {
    const {
      stateId,
      state_id,
      search,
      category,
    } = req.query;

    let destinations;


    /* -----------------------------
       SEARCH
       ----------------------------- */

    if (
      search &&
      search.trim()
    ) {
      destinations =
        await searchDestinations(
          search.trim()
        );
    }


    /* -----------------------------
       STATE FILTER
       ----------------------------- */

    else if (
      stateId ||
      state_id
    ) {
      destinations =
        await getDestinationsByState(
          stateId || state_id
        );
    }


    /* -----------------------------
       ALL DESTINATIONS
       ----------------------------- */

    else {
      destinations =
        await getAllDestinations();
    }


    /* -----------------------------
       CATEGORY FILTER
       ----------------------------- */

    if (
      category &&
      category.trim()
    ) {
      destinations =
        destinations.filter(
          (destination) =>
            String(
              destination.category || ""
            ).toLowerCase() ===
            category
              .trim()
              .toLowerCase()
        );
    }


    /* =====================================================
       GET IMAGE FOR DESTINATIONS
       ===================================================== */

    destinations =
      await Promise.all(
        destinations.map(
          async (destination) => {

            // If database already has an image,
            // keep it.
            if (
              destination.image_url &&
              destination.image_url.trim()
            ) {
              return destination;
            }


            // Otherwise find an image
            // from Wikimedia/Wikipedia.
            const image =
              await getWikimediaImage(
                destination.name,
                destination.city
              );


            return {
              ...destination,
              image_url: image,
            };
          }
        )
      );


    /* -----------------------------
       SEND RESPONSE
       ----------------------------- */

    res.json({
      success: true,
      count: destinations.length,
      destinations,
    });

  } catch (error) {

    console.error(
      "Get destinations error:",
      error
    );

    next(error);
  }
};


/* =========================================================
   GET SINGLE DESTINATION
   ========================================================= */

export const getDestination = async (
  req,
  res,
  next
) => {

  try {

    const { id } = req.params;


    /* -----------------------------
       GET DESTINATION FROM DATABASE
       ----------------------------- */

    const destination =
      await getDestinationById(id);


    if (!destination) {

      return res.status(404).json({
        success: false,
        message:
          "Destination not found",
      });

    }


    /* =====================================================
       GET IMAGE
       ===================================================== */

    if (
      !destination.image_url
    ) {

      const image =
        await getWikimediaImage(
          destination.name,
          destination.city
        );


      destination.image_url =
        image;

    }


    /* -----------------------------
       SEND RESPONSE
       ----------------------------- */

    res.json({
      success: true,
      destination,
    });

  } catch (error) {

    console.error(
      "Get destination error:",
      error
    );

    next(error);
  }
};