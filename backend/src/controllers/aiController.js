import {
  askOllama,
  generateAITripPlan
} from "../services/ollamaService.js";

import {
  getDestinationsByCityOrState
} from "../models/destinationModel.js";


/* =====================================================
   AI CHAT
===================================================== */

export const chatWithAI = async (req, res) => {
  try {

    const {
      message,
      context
    } = req.body;


    if (
      !message ||
      !message.trim()
    ) {

      return res.status(400).json({
        success: false,
        message: "Message is required"
      });

    }


    const response =
      await askOllama(
        message,
        context || ""
      );


    res.json({
      success: true,
      response
    });


  } catch (error) {

    console.error(
      "Ollama Chat Error:",
      error.message
    );


    res.status(500).json({
      success: false,
      message:
        "Unable to communicate with Ollama. Make sure Ollama is running."
    });

  }
};


/* =====================================================
   AI TRIP PLANNER
===================================================== */

export const planTripWithAI = async (
  req,
  res
) => {

  try {

    const {
      destination,
      numberOfDays,
      days,
      budget,
      interests,
      travelType,
      travellingWith,
      startingLocation
    } = req.body;


    /* =================================================
       ACCEPT BOTH NUMBER OF DAYS NAMES
    ================================================= */

    const finalDays =
      numberOfDays || days;


    /* =================================================
       ACCEPT BOTH TRAVEL TYPE NAMES
    ================================================= */

    const finalTravelType =
      travelType ||
      travellingWith ||
      "Solo";


    /* =================================================
       VALIDATE DESTINATION
    ================================================= */

    if (!destination) {

      return res.status(400).json({
        success: false,
        message: "Destination is required"
      });

    }


    /* =================================================
       VALIDATE DAYS
    ================================================= */

    if (
      finalDays === undefined ||
      finalDays === null ||
      finalDays === ""
    ) {

      return res.status(400).json({
        success: false,
        message:
          "Number of days is required"
      });

    }


    /* =================================================
       LOG REQUEST
    ================================================= */

    console.log(
      "================================"
    );

    console.log(
      "AI TRIP REQUEST"
    );

    console.log(
      "Starting:",
      startingLocation
    );

    console.log(
      "Destination:",
      destination
    );

    console.log(
      "Days:",
      finalDays
    );

    console.log(
      "Budget:",
      budget
    );

    console.log(
      "Travel Type:",
      finalTravelType
    );

    console.log(
      "Interests:",
      interests
    );

    console.log(
      "================================"
    );


    /* =================================================
       GET REAL DESTINATIONS FROM MYSQL
    ================================================= */

    const databasePlaces =
      await getDestinationsByCityOrState(
        destination
      );


    console.log(
      "DATABASE PLACES FOUND:",
      databasePlaces.length
    );


    /* =================================================
       IF NO PLACES FOUND
    ================================================= */

    if (
      !databasePlaces ||
      databasePlaces.length === 0
    ) {

      console.warn(
        "No database destinations found for:",
        destination
      );

      return res.status(404).json({
        success: false,
        message:
          `No destinations were found in the database for "${destination}".`
      });

    }


    /* =================================================
       CREATE CLEAN PLACE LIST FOR AI
    ================================================= */

    const availablePlaces =
      databasePlaces.map((place) => ({
        id: place.id,

        name: place.name,

        city: place.city,

        state: place.state_name,

        category: place.category,

        latitude: place.latitude,

        longitude: place.longitude
      }));


    console.log(
      "AVAILABLE AI PLACES:"
    );

    console.log(
      availablePlaces
    );


    /* =================================================
       GENERATE AI PLAN
    ================================================= */

    const response =
      await generateAITripPlan({

        startingLocation,

        destination,

        numberOfDays:
          Number(finalDays),

        budget,

        interests,

        travelType:
          finalTravelType,

        availablePlaces

      });


    /* =================================================
       SEND RESPONSE
    ================================================= */

    res.json({

      success: true,

      startingLocation,

      destination,

      numberOfDays:
        Number(finalDays),

      budget,

      travelType:
        finalTravelType,

      interests,

      plan: response

    });


  } catch (error) {

    console.error(
      "AI Trip Planner Error:",
      error
    );


    res.status(500).json({

      success: false,

      message:
        error.message ||
        "AI trip planning failed"

    });

  }
};