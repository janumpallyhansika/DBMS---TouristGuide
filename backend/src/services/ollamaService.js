import ollama from "../config/ollama.js";

/* =====================================================
   HELPERS
===================================================== */

const normalizeText = (value) => {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
};


/* =====================================================
   FILTER PLACES FOR SELECTED DESTINATION
===================================================== */

const filterPlacesForDestination = (
  availablePlaces = [],
  destination
) => {

  const selectedDestination =
    normalizeText(destination);

  if (!selectedDestination) {
    return availablePlaces;
  }

  return availablePlaces.filter((place) => {

    const state =
      normalizeText(place.state);

    const city =
      normalizeText(place.city);

    const placeName =
      normalizeText(place.name);

    return (
      state === selectedDestination ||
      city === selectedDestination ||
      placeName === selectedDestination
    );
  });
};


/* =====================================================
   AI CHAT
===================================================== */

export const askOllama = async (
  message,
  context = ""
) => {

  const prompt = `
You are IndiaGuide AI, an intelligent India-focused
travel assistant.

Give practical, clear and structured travel information.

User question:
${message}

Additional context:
${context}

Rules:

- Focus on India for Indian travel questions.
- Do not invent live prices or availability.
- Keep answers easy to understand.
- Use headings and bullet points when useful.
`;

  const response = await ollama.post(
    "/api/generate",
    {
      model:
        process.env.OLLAMA_MODEL ||
        "llama3.2",

      prompt,

      stream: false
    }
  );

  return response.data.response;
};


/* =====================================================
   AI TRIP PLANNER
===================================================== */

export const generateAITripPlan = async ({
  startingLocation,
  destination,
  numberOfDays,
  budget,
  interests,
  travelType,
  availablePlaces = []
}) => {

  /* ===================================================
     VALIDATE INPUT
  =================================================== */

  const days =
    Number(numberOfDays);

  if (!destination) {
    throw new Error(
      "Destination is required for AI trip planning."
    );
  }

  if (!days || days < 1) {
    throw new Error(
      "Number of days must be at least 1."
    );
  }


  /* ===================================================
     FILTER DATABASE PLACES
  =================================================== */

  const destinationPlaces =
    filterPlacesForDestination(
      availablePlaces,
      destination
    );


  console.log(
    "================================"
  );

  console.log(
    "AI TRIP PLANNER"
  );

  console.log(
    "Selected destination:",
    destination
  );

  console.log(
    "Total database places:",
    availablePlaces.length
  );

  console.log(
    "Places for selected destination:",
    destinationPlaces.length
  );

  console.log(
    "Available places:"
  );

  destinationPlaces.forEach(
    (place) => {
      console.log(
        `- ${place.name} | ${place.city} | ${place.state}`
      );
    }
  );

  console.log(
    "================================"
  );


  /* ===================================================
     STOP IF NO PLACES
  =================================================== */

  if (destinationPlaces.length === 0) {

    throw new Error(
      `No tourist places were found in the database for "${destination}".`
    );
  }


  /* ===================================================
     DATABASE PLACE LIST
  =================================================== */

  const databasePlaceList =
    destinationPlaces
      .map(
        (place) =>
          `${place.name} | ${place.city} | ${place.state} | ${place.category}`
      )
      .join("\n");


  /* ===================================================
     INTERESTS
  =================================================== */

  const interestList =
    interests && interests.length
      ? interests.join(", ")
      : "General sightseeing";


  /* ===================================================
     AI PROMPT
  =================================================== */

  const prompt = `
You are IndiaGuide AI, an intelligent India travel planner.

Create a realistic travel itinerary for the user.

=====================================================
USER INFORMATION
=====================================================

Starting location:
${startingLocation || "Not specified"}

Selected destination:
${destination}

Number of days:
${days}

Budget:
${budget || "Not specified"}

Travelling with:
${travelType || "Solo"}

Interests:
${interestList}


=====================================================
VERY IMPORTANT DATABASE RULE
=====================================================

The database place list below contains the ONLY
tourist places that you are allowed to use.

You MUST choose tourist places ONLY from this list.

The selected destination is:

${destination}


=====================================================
STRICT PLACE RULES
=====================================================

1. Every itinerary place MUST exist in the database list.

2. The place name MUST exactly match the database name.

3. NEVER invent a tourist place.

4. NEVER create a new tourist place.

5. NEVER modify a database place name.

6. NEVER change the spelling of a database place.

7. NEVER change the city of a database place.

8. NEVER change the state of a database place.

9. NEVER use a place from another destination.

10. NEVER use a city name as a tourist place unless
    that exact city name exists as a place in the
    database list.

11. For example, "Port Blair" is a city.
    DO NOT use "Port Blair" as an itinerary place
    unless "Port Blair" appears EXACTLY in the
    DATABASE PLACE LIST below.

12. Do not use general geographic names such as:
    - cities
    - districts
    - islands
    - states
    - regions

    unless they appear exactly as a tourist place
    in the database list.

13. Do not put descriptions inside the place name.

14. Do not put multiple places inside one name.

15. If you need a tourist place, select one from
    the database list.


=====================================================
DATABASE PLACE LIST
=====================================================

${databasePlaceList}


=====================================================
IMPORTANT
=====================================================

The database list above is the source of truth.

For this destination, the available tourist places are
ONLY the places shown above.

Do not use your own knowledge of India to add places.

Do not use places from Google.

Do not use places from Wikipedia.

Do not use places from general travel knowledge.

Use ONLY the database list.


=====================================================
OUTPUT FORMAT
=====================================================

Return ONLY valid JSON.

DO NOT return markdown.

DO NOT return code fences.

DO NOT write an explanation before the JSON.

DO NOT write an explanation after the JSON.

The response must be directly parseable using:

JSON.parse(response)


=====================================================
EXACT JSON STRUCTURE
=====================================================

{
  "tripOverview": {
    "startingLocation": "${startingLocation || "Not specified"}",
    "destination": "${destination}",
    "numberOfDays": ${days},
    "budget": "${budget || "Not specified"}",
    "travellingWith": "${travelType || "Solo"}"
  },

  "days": [
    {
      "day": 1,
      "places": [
        {
          "name": "Exact database place name",
          "time": "09:00 AM",
          "duration": "1.5 hours"
        }
      ]
    }
  ],

  "foodSuggestions": [
    "Food suggestion 1",
    "Food suggestion 2"
  ],

  "travelTips": [
    "Travel tip 1",
    "Travel tip 2"
  ],

  "importantPrecautions": [
    "Precaution 1",
    "Precaution 2"
  ]
}


=====================================================
ITINERARY RULES
=====================================================

1. Create exactly ${days} day objects.

2. Each day MUST contain a places array.

3. Every place MUST contain:
   - name
   - time
   - duration

4. Every name MUST exactly match the database.

5. Never invent places.

6. Never use city names as places unless present
   exactly in the database.

7. Use realistic geographical order.

8. Do not repeat places unnecessarily.

9. Consider the user's interests.

10. Consider the user's budget.

11. Consider travelling type.

12. Use realistic visiting times.

13. Keep daily sightseeing realistic.

14. Do not schedule impossible travel.

15. Use simple database place names.

16. Every place must come from the database.

17. If there are fewer places than required days,
    use the available database places rather than
    inventing new places.

18. Never use Port Blair unless it is explicitly
    present as a place in the database list.

19. Never use any place outside the database list.


=====================================================
FOOD SUGGESTIONS
=====================================================

Provide realistic local food suggestions related to
the selected destination.

Do not invent restaurants.

Prefer known local dishes and food types.

Food suggestions do NOT need to come from the
destination database.


=====================================================
TRAVEL TIPS
=====================================================

Provide practical travel tips related to:

- transportation
- local travel
- suitable visiting times
- tickets when relevant
- weather when relevant


=====================================================
IMPORTANT PRECAUTIONS
=====================================================

Provide practical safety and travel precautions.


=====================================================
FINAL REQUIREMENT
=====================================================

EVERY PLACE IN THE ITINERARY MUST EXIST IN THE
DATABASE PLACE LIST.

EVERY PLACE MUST BELONG TO:

${destination}

Return ONLY the JSON object.

NO MARKDOWN.

NO CODE FENCE.

NO EXPLANATION.

NO EXTRA TEXT.
`;


  /* ===================================================
     CALL OLLAMA
  =================================================== */

  try {

    const response =
      await ollama.post(
        "/api/generate",
        {
          model:
            process.env.OLLAMA_MODEL ||
            "llama3.2",

          prompt,

          stream: false
        }
      );


    const rawResponse =
      response.data.response;


    /* =================================================
       LOG RAW RESPONSE
    ================================================= */

    console.log(
      "================================"
    );

    console.log(
      "OLLAMA RAW TRIP RESPONSE"
    );

    console.log(
      rawResponse
    );

    console.log(
      "================================"
    );


    /* =================================================
       CLEAN RESPONSE
    ================================================= */

    let cleanedResponse =
      String(rawResponse || "").trim();

    cleanedResponse =
      cleanedResponse
        .replace(
          /^```json\s*/i,
          ""
        )
        .replace(
          /^```\s*/i,
          ""
        )
        .replace(
          /\s*```$/i,
          ""
        )
        .trim();


    /* =================================================
       PARSE JSON
    ================================================= */

    try {

      const parsed =
        JSON.parse(
          cleanedResponse
        );


      console.log(
        "AI TRIP JSON PARSED SUCCESSFULLY"
      );


      /* ===============================================
         VALIDATE DAYS
      =============================================== */

      if (
        !Array.isArray(parsed.days)
      ) {

        parsed.days = [];
      }


      /* ===============================================
         VALID DATABASE PLACE NAMES
      =============================================== */

      const validPlaceNames =
        new Set(
          destinationPlaces.map(
            (place) =>
              normalizeText(place.name)
          )
        );


      /* ===============================================
         EXACT DATABASE NAMES
      =============================================== */

      const exactDatabaseNames =
        new Map(
          destinationPlaces.map(
            (place) => [
              normalizeText(place.name),
              place.name
            ]
          )
        );


      /* ===============================================
         VALIDATE AND CLEAN PLACES
      =============================================== */

      const invalidPlaces = [];


      parsed.days =
        parsed.days.map(
          (day, index) => {

            const places =
              Array.isArray(day.places)
                ? day.places
                : [];


            const cleanedPlaces =
              places
                .filter(
                  (place) => {

                    if (
                      !place ||
                      !place.name
                    ) {
                      return false;
                    }


                    const normalizedName =
                      normalizeText(
                        place.name
                      );


                    if (
                      !validPlaceNames.has(
                        normalizedName
                      )
                    ) {

                      invalidPlaces.push(
                        place.name
                      );

                      return false;
                    }


                    return true;
                  }
                )
                .map(
                  (place) => {

                    const normalizedName =
                      normalizeText(
                        place.name
                      );


                    return {
                      ...place,

                      name:
                        exactDatabaseNames.get(
                          normalizedName
                        )
                    };
                  }
                );


            return {
              ...day,

              day:
                index + 1,

              places:
                cleanedPlaces
            };
          }
        );


      /* ===============================================
         REMOVE DUPLICATES
      =============================================== */

      const usedPlaces =
        new Set();


      parsed.days =
        parsed.days.map(
          (day) => {

            const uniquePlaces = [];


            for (
              const place
              of day.places || []
            ) {

              const placeName =
                normalizeText(
                  place.name
                );


              if (
                usedPlaces.has(
                  placeName
                )
              ) {

                continue;
              }


              usedPlaces.add(
                placeName
              );


              uniquePlaces.push(
                place
              );
            }


            return {
              ...day,

              places:
                uniquePlaces
            };
          }
        );


      /* ===============================================
         LOG INVALID PLACES
      =============================================== */

      if (
        invalidPlaces.length > 0
      ) {

        console.warn(
          "INVALID AI PLACES REMOVED:",
          invalidPlaces
        );
      }


      /* ===============================================
         FILL EMPTY DAYS
      =============================================== */

      const unusedPlaces =
        destinationPlaces.filter(
          (place) =>
            !usedPlaces.has(
              normalizeText(
                place.name
              )
            )
        );


      for (
        let i = 0;
        i < parsed.days.length;
        i++
      ) {

        if (
          parsed.days[i].places.length === 0 &&
          unusedPlaces.length > 0
        ) {

          const place =
            unusedPlaces.shift();


          parsed.days[i].places.push({

            name:
              place.name,

            time:
              "10:00 AM",

            duration:
              "2 hours"
          });

        }
      }


      /* ===============================================
         IF AI RETURNED FEWER DAYS
      =============================================== */

      while (
        parsed.days.length < days
      ) {

        let fallbackPlace =
          destinationPlaces.find(
            (place) =>
              !usedPlaces.has(
                normalizeText(
                  place.name
                )
              )
          );


        /*
          If every place was already used and there
          are more days than database places, reuse
          the first available database place.
        */

        if (!fallbackPlace) {

          fallbackPlace =
            destinationPlaces[0];
        }


        parsed.days.push({

          day:
            parsed.days.length + 1,

          places: [
            {
              name:
                fallbackPlace.name,

              time:
                "10:00 AM",

              duration:
                "2 hours"
            }
          ]
        });
      }


      /* ===============================================
         IF AI RETURNED TOO MANY DAYS
      =============================================== */

      if (
        parsed.days.length > days
      ) {

        parsed.days =
          parsed.days.slice(
            0,
            days
          );
      }


      /* ===============================================
         ENSURE DAY NUMBERS
      =============================================== */

      parsed.days =
        parsed.days.map(
          (day, index) => ({
            ...day,

            day:
              index + 1
          })
        );


      /* ===============================================
         ENSURE TRIP OVERVIEW
      =============================================== */

      parsed.tripOverview = {

        startingLocation:
          startingLocation ||
          "Not specified",

        destination,

        numberOfDays:
          days,

        budget:
          budget ||
          "Not specified",

        travellingWith:
          travelType ||
          "Solo"
      };


      /* ===============================================
         ENSURE ARRAYS
      =============================================== */

      if (
        !Array.isArray(
          parsed.foodSuggestions
        )
      ) {

        parsed.foodSuggestions = [];
      }


      if (
        !Array.isArray(
          parsed.travelTips
        )
      ) {

        parsed.travelTips = [];
      }


      if (
        !Array.isArray(
          parsed.importantPrecautions
        )
      ) {

        parsed.importantPrecautions = [];
      }


      /* ===============================================
         FINAL LOG
      =============================================== */

      console.log(
        "================================"
      );

      console.log(
        "AI TRIP PLAN VALIDATED"
      );

      console.log(
        "Destination:",
        destination
      );

      console.log(
        "Valid database places:",
        destinationPlaces.length
      );

      console.log(
        "Generated days:",
        parsed.days.length
      );

      console.log(
        "================================"
      );


      return parsed;


    } catch (parseError) {

      console.error(
        "AI returned invalid JSON."
      );

      console.error(
        "JSON parse error:",
        parseError
      );

      console.error(
        "Raw response:",
        rawResponse
      );


      return {

        tripOverview: {

          startingLocation:
            startingLocation ||
            "Not specified",

          destination,

          numberOfDays:
            days,

          budget:
            budget ||
            "Not specified",

          travellingWith:
            travelType ||
            "Solo"
        },

        days: [],

        foodSuggestions: [],

        travelTips: [],

        importantPrecautions: [],

        rawResponse
      };
    }


  } catch (error) {

    console.error(
      "Ollama Trip Planning Error:",
      error
    );

    throw error;
  }
};