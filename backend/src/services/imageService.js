import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const GOOGLE_API_KEY =
  process.env.GOOGLE_MAPS_API_KEY;


/* =====================================================
   FIND IMAGE FOR EXACT DESTINATION
===================================================== */

export const getDestinationImage = async (
  name,
  city = "",
  latitude = null,
  longitude = null
) => {

  try {

    if (!GOOGLE_API_KEY) {
      console.log("Google Maps API key is missing");
      return null;
    }

    const searchText =
      `${name}, ${city}, India`;

    const requestBody = {
      textQuery: searchText,
      languageCode: "en",
      regionCode: "IN",
      pageSize: 5
    };


    /* =========================================
       USE DESTINATION COORDINATES
       TO FIND THE CORRECT PLACE
    ========================================= */

    if (
      latitude !== null &&
      longitude !== null
    ) {

      requestBody.locationBias = {
        circle: {
          center: {
            latitude: Number(latitude),
            longitude: Number(longitude)
          },
          radius: 10000
        }
      };

    }


    /* =========================================
       SEARCH GOOGLE PLACES
    ========================================= */

    const response = await axios.post(
      "https://places.googleapis.com/v1/places:searchText",
      requestBody,
      {
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": GOOGLE_API_KEY,
          "X-Goog-FieldMask":
            "places.id,places.displayName,places.location,places.photos"
        }
      }
    );


    const places =
      response.data?.places || [];


    if (places.length === 0) {

      console.log(
        `No place found for: ${name}`
      );

      return null;

    }


    /* =========================================
       SELECT CLOSEST PLACE
    ========================================= */

    let selectedPlace = places[0];


    if (
      latitude !== null &&
      longitude !== null
    ) {

      let smallestDistance =
        Number.MAX_VALUE;


      for (const place of places) {

        if (!place.location) {
          continue;
        }


        const distance =
          Math.pow(
            Number(place.location.latitude) -
              Number(latitude),
            2
          ) +
          Math.pow(
            Number(place.location.longitude) -
              Number(longitude),
            2
          );


        if (
          distance <
          smallestDistance
        ) {

          smallestDistance =
            distance;

          selectedPlace =
            place;

        }

      }

    }


    /* =========================================
       CHECK PHOTO
    ========================================= */

    if (
      !selectedPlace.photos ||
      selectedPlace.photos.length === 0
    ) {

      console.log(
        `No photo available for: ${name}`
      );

      return null;

    }


    const photo =
      selectedPlace.photos[0];


    /* =========================================
       CREATE GOOGLE PHOTO URL
    ========================================= */

    const imageUrl =
      `https://places.googleapis.com/v1/${photo.name}/media` +
      `?maxWidthPx=1200` +
      `&maxHeightPx=800` +
      `&key=${GOOGLE_API_KEY}`;


    console.log(
      `Image found: ${name} → ${selectedPlace.displayName?.text}`
    );


    return imageUrl;


  } catch (error) {

    console.error(
      `Image error for ${name}:`,
      error.response?.data ||
      error.message
    );

    return null;

  }

};