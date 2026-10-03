import {
  createTrip,
  addTripDestination,
  getTripsByUser,
  getTripById,
  getTripDestinations
} from "../models/tripModel.js";

import {
  getDestinationById,
  getDestinationByName
} from "../models/destinationModel.js";

import {
  createItinerary,
  addItineraryItem,
  getItineraryByTrip
} from "../models/itineraryModel.js";


// --------------------------------------------------
// Helper: convert budget to MySQL DECIMAL
// --------------------------------------------------

const normalizeBudget = (budget) => {
  if (budget === null || budget === undefined || budget === "") {
    return null;
  }

  if (typeof budget === "number") {
    return budget;
  }

  const match = String(budget).match(/[\d,]+(?:\.\d+)?/);

  if (!match) {
    return null;
  }

  const value = Number(match[0].replace(/,/g, ""));

  return Number.isFinite(value) ? value : null;
};


// --------------------------------------------------
// Helper: convert AI time to MySQL TIME
// Examples:
// "09:00 AM" -> "09:00:00"
// "9:30 PM"  -> "21:30:00"
// "14:00"    -> "14:00:00"
// --------------------------------------------------

const normalizeTime = (time) => {
  if (!time) {
    return null;
  }

  const value = String(time).trim();

  // 24-hour format
  const twentyFourHourMatch = value.match(
    /^(\d{1,2}):(\d{2})(?::(\d{2}))?$/
  );

  if (twentyFourHourMatch) {
    const hour = String(
      Number(twentyFourHourMatch[1])
    ).padStart(2, "0");

    const minute = twentyFourHourMatch[2];

    const second =
      twentyFourHourMatch[3] || "00";

    return `${hour}:${minute}:${second}`;
  }

  // 12-hour format
  const twelveHourMatch = value.match(
    /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i
  );

  if (!twelveHourMatch) {
    return null;
  }

  let hour = Number(twelveHourMatch[1]);

  const minute = twelveHourMatch[2];

  const period =
    twelveHourMatch[3].toUpperCase();

  if (period === "PM" && hour !== 12) {
    hour += 12;
  }

  if (period === "AM" && hour === 12) {
    hour = 0;
  }

  return `${String(hour).padStart(2, "0")}:${minute}:00`;
};


// --------------------------------------------------
// Create a new trip
// --------------------------------------------------

export const createNewTrip = async (req, res, next) => {
  try {
    const {
      title,
      startDate,
      endDate,
      numberOfDays,
      budget,
      travelType,
      planningType,
      sourceLocation,
      destinationIds,
      aiGenerated,
      itinerary
    } = req.body;


    // --------------------------------------------------
    // Validate user
    // --------------------------------------------------

    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: "User authentication required"
      });
    }


    // --------------------------------------------------
    // Validate title
    // --------------------------------------------------

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Trip title is required"
      });
    }


    // --------------------------------------------------
    // Create main trip
    // --------------------------------------------------

    const tripId = await createTrip({
      userId: req.user.id,
      title,
      startDate,
      endDate,
      numberOfDays,
      budget: normalizeBudget(budget),
      travelType,
      planningType,
      sourceLocation,
      aiGenerated: Boolean(aiGenerated)
    });


    // --------------------------------------------------
    // Save selected destination IDs
    // --------------------------------------------------

    if (
      Array.isArray(destinationIds) &&
      destinationIds.length > 0
    ) {
      for (
        let index = 0;
        index < destinationIds.length;
        index++
      ) {
        const destinationId = destinationIds[index];

        const destination =
          await getDestinationById(destinationId);

        if (destination) {
          await addTripDestination({
            tripId,
            destinationId,
            visitOrder: index + 1
          });
        }
      }
    }


    // --------------------------------------------------
    // Save AI generated itinerary
    // --------------------------------------------------

    if (
      itinerary &&
      Array.isArray(itinerary.days)
    ) {
      console.log(
        "Saving AI itinerary for trip:",
        tripId
      );

      for (
        let dayIndex = 0;
        dayIndex < itinerary.days.length;
        dayIndex++
      ) {
        const day = itinerary.days[dayIndex];

        const dayNumber =
          Number(day.day) ||
          dayIndex + 1;


        // --------------------------------------------------
        // Create itinerary day
        // --------------------------------------------------

        const itineraryId =
          await createItinerary({
            tripId,
            dayNumber,
            title: `Day ${dayNumber}`,
            description:
              `AI generated itinerary for day ${dayNumber}`
          });


        // --------------------------------------------------
        // Save places for this day
        // --------------------------------------------------

        if (Array.isArray(day.places)) {
          for (
            let placeIndex = 0;
            placeIndex < day.places.length;
            placeIndex++
          ) {
            const place =
              day.places[placeIndex];

            if (
              !place ||
              !place.name
            ) {
              continue;
            }


            // --------------------------------------------------
            // Find destination in database
            // --------------------------------------------------

            let destination = null;

            try {
              destination =
                await getDestinationByName(
                  place.name
                );
            } catch (error) {
              console.log(
                "Destination lookup failed:",
                place.name,
                error.message
              );
            }


            const destinationId =
              destination
                ? destination.id
                : null;


            // --------------------------------------------------
            // Save itinerary item
            // --------------------------------------------------

            await addItineraryItem({
              itineraryId,
              destinationId,
              startTime:
                normalizeTime(place.time),
              endTime: null,
              activity: place.name,
              notes:
                place.duration
                  ? `Duration: ${place.duration}`
                  : null
            });
          }
        }
      }
    }


    // --------------------------------------------------
    // Fetch saved data
    // --------------------------------------------------

    const trip =
      await getTripById(
        tripId,
        req.user.id
      );

    const destinations =
      await getTripDestinations(
        tripId
      );

    const savedItinerary =
      await getItineraryByTrip(
        tripId
      );


    // --------------------------------------------------
    // Response
    // --------------------------------------------------

    res.status(201).json({
      success: true,
      message: "Trip created successfully",
      trip,
      destinations,
      itinerary: savedItinerary
    });

  } catch (error) {
    console.error(
      "Create Trip Error:",
      error
    );

    next(error);
  }
};


// --------------------------------------------------
// Get all trips of logged-in user
// --------------------------------------------------

export const getMyTrips = async (
  req,
  res,
  next
) => {
  try {

    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: "User authentication required"
      });
    }

    const trips =
      await getTripsByUser(
        req.user.id
      );

    res.json({
      success: true,
      count: trips.length,
      trips
    });

  } catch (error) {
    console.error(
      "Get My Trips Error:",
      error
    );

    next(error);
  }
};


// --------------------------------------------------
// Get single trip
// --------------------------------------------------

export const getSingleTrip = async (
  req,
  res,
  next
) => {
  try {

    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: "User authentication required"
      });
    }


    const trip =
      await getTripById(
        req.params.id,
        req.user.id
      );


    if (!trip) {
      return res.status(404).json({
        success: false,
        message: "Trip not found"
      });
    }


    const destinations =
      await getTripDestinations(
        trip.id
      );


    const itinerary =
      await getItineraryByTrip(
        trip.id
      );


    res.json({
      success: true,
      trip,
      destinations,
      itinerary
    });

  } catch (error) {
    console.error(
      "Get Single Trip Error:",
      error
    );

    next(error);
  }
};