import { useEffect, useState } from "react";

import {
  Sparkles,
  MapPin,
  CalendarDays,
  WalletCards,
  Users,
  Navigation,
} from "lucide-react";

import "./PlanTrip.css";

import TripMap from "../../components/TripMap/TripMap";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

const interestsList = [
  "Nature",
  "Beaches",
  "History",
  "Food",
  "Adventure",
  "Shopping",
  "Wildlife",
  "Photography",
];

function PlanTrip() {
  // =====================================================
  // STATE
  // =====================================================

  const [states, setStates] = useState([]);

  const [allDestinations, setAllDestinations] = useState([]);

  const [startingLocation, setStartingLocation] =
    useState("Hyderabad");

  const [destination, setDestination] =
    useState("");

  const [days, setDays] =
    useState("3");

  const [budget, setBudget] =
    useState("Budget");

  const [travellingWith, setTravellingWith] =
    useState("Solo");

  const [interests, setInterests] =
    useState([]);

  const [loadingStates, setLoadingStates] =
    useState(true);

  const [generating, setGenerating] =
    useState(false);

  const [savingTrip, setSavingTrip] =
    useState(false);

  const [error, setError] =
    useState("");

  const [itinerary, setItinerary] =
    useState(null);

  const [savedTrip, setSavedTrip] =
    useState(null);


  // =====================================================
  // LOAD STATES + DESTINATIONS FROM DATABASE
  // =====================================================

  useEffect(() => {
    const loadDatabaseData = async () => {
      try {
        setLoadingStates(true);
        setError("");

        // -----------------------------------------------
        // LOAD STATES
        // -----------------------------------------------

        const statesResponse = await fetch(
          `${API_URL}/api/states`
        );

        const statesText =
          await statesResponse.text();

        let statesData;

        try {
          statesData =
            JSON.parse(statesText);
        } catch {
          throw new Error(
            `Backend returned an invalid states response (${statesResponse.status}).`
          );
        }

        if (
          !statesResponse.ok ||
          !statesData.success
        ) {
          throw new Error(
            statesData.message ||
              "Unable to load states"
          );
        }

        setStates(
          statesData.states || []
        );

        if (
          statesData.states &&
          statesData.states.length > 0
        ) {
          setDestination(
            statesData.states[0].name
          );
        }


        // -----------------------------------------------
        // LOAD DESTINATIONS
        // -----------------------------------------------

        try {
          const destinationsResponse =
            await fetch(
              `${API_URL}/api/destinations`
            );

          const destinationsText =
            await destinationsResponse.text();

          let destinationsData;

          try {
            destinationsData =
              JSON.parse(
                destinationsText
              );
          } catch {
            console.warn(
              "Destinations endpoint returned non-JSON response."
            );
            destinationsData = null;
          }

          if (
            destinationsResponse.ok &&
            destinationsData?.success
          ) {
            setAllDestinations(
              destinationsData.destinations ||
                []
            );

            console.log(
              "Destinations loaded:",
              destinationsData.destinations?.length ||
                0
            );
          } else {
            console.warn(
              "Unable to load destinations:",
              destinationsData
            );

            setAllDestinations([]);
          }
        } catch (destinationError) {
          console.warn(
            "Destination loading error:",
            destinationError
          );

          setAllDestinations([]);
        }

      } catch (err) {
        console.error(
          "Database data loading error:",
          err
        );

        setError(
          err.message ||
            "Unable to load data from backend."
        );

      } finally {
        setLoadingStates(false);
      }
    };

    loadDatabaseData();
  }, []);


  // =====================================================
  // INTEREST SELECTION
  // =====================================================

  const toggleInterest = (
    interest
  ) => {
    setInterests((current) => {
      if (
        current.includes(interest)
      ) {
        return current.filter(
          (item) =>
            item !== interest
        );
      }

      return [
        ...current,
        interest,
      ];
    });
  };


  // =====================================================
  // FIND DESTINATION IDS FROM AI PLACE NAMES
  // =====================================================

  const findDestinationIds = (
    plan
  ) => {
    if (
      !plan ||
      !Array.isArray(plan.days)
    ) {
      return [];
    }

    if (
      !Array.isArray(allDestinations) ||
      allDestinations.length === 0
    ) {
      console.warn(
        "No database destinations are loaded."
      );

      return [];
    }

    const matchedIds = [];

    plan.days.forEach((day) => {
      if (
        !Array.isArray(day.places)
      ) {
        return;
      }

      day.places.forEach((place) => {
        if (
          !place ||
          !place.name
        ) {
          return;
        }

        const aiName =
          String(place.name)
            .trim()
            .toLowerCase();

        const match =
          allDestinations.find(
            (destinationItem) => {
              const dbName =
                String(
                  destinationItem.name ||
                    ""
                )
                  .trim()
                  .toLowerCase();

              return (
                dbName === aiName
              );
            }
          );

        if (
          match &&
          match.id &&
          !matchedIds.includes(
            match.id
          )
        ) {
          matchedIds.push(
            match.id
          );
        }
      });
    });

    console.log(
      "Matched destination IDs:",
      matchedIds
    );

    return matchedIds;
  };


  // =====================================================
  // SAVE GENERATED TRIP TO MYSQL
  // =====================================================

  const saveTripToDatabase = async (
    generatedPlan
  ) => {
    const token =
      localStorage.getItem(
        "token"
      );

    if (!token) {
      throw new Error(
        "You must be logged in to save your trip."
      );
    }

    setSavingTrip(true);

    try {
      const destinationIds =
        findDestinationIds(
          generatedPlan
        );

      const tripPayload = {
        title: `${destination} Trip`,

        startDate: null,

        endDate: null,

        numberOfDays:
          Number(days),

        budget,

        travelType:
          travellingWith,

        planningType:
          "ai",

        sourceLocation:
          startingLocation,

        destinationIds,

        aiGenerated: true,

        itinerary:
          generatedPlan,
      };

      console.log(
        "Saving trip to MySQL:",
        tripPayload
      );

      const response =
        await fetch(
          `${API_URL}/api/trips`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",

              Authorization:
                `Bearer ${token}`,
            },

            body:
              JSON.stringify(
                tripPayload
              ),
          }
        );

      const text =
        await response.text();

      let data;

      try {
        data =
          JSON.parse(text);
      } catch {
        console.error(
          "Trip save returned non-JSON:",
          text
        );

        throw new Error(
          `Trip save returned an invalid response (${response.status}).`
        );
      }

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.message ||
            "Unable to save trip to MySQL."
        );
      }

      console.log(
        "Trip successfully saved:",
        data
      );

      setSavedTrip(
        data.trip || null
      );

      return data;

    } finally {
      setSavingTrip(false);
    }
  };


  // =====================================================
  // GENERATE AI TRIP
  // =====================================================

  const handleGenerateTrip =
    async () => {
      setError("");

      setItinerary(null);

      setSavedTrip(null);


      // -----------------------------------------------
      // VALIDATION
      // -----------------------------------------------

      if (!destination) {
        setError(
          "Please select a destination."
        );

        return;
      }

      if (!days) {
        setError(
          "Destination and number of days are required"
        );

        return;
      }


      try {
        setGenerating(true);


        const token =
          localStorage.getItem(
            "token"
          );


        // -----------------------------------------------
        // AI REQUEST
        // -----------------------------------------------

        const tripData = {
          startingLocation,

          destination,

          numberOfDays:
            Number(days),

          days:
            Number(days),

          budget,

          travelType:
            travellingWith,

          travellingWith,

          interests,
        };


        console.log(
          "Sending trip data to AI:",
          tripData
        );


        const response =
          await fetch(
            `${API_URL}/api/ai/plan-trip`,
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",

                ...(token
                  ? {
                      Authorization:
                        `Bearer ${token}`,
                    }
                  : {}),
              },

              body:
                JSON.stringify(
                  tripData
                ),
            }
          );


        const text =
          await response.text();


        let data;


        try {
          data =
            JSON.parse(text);

        } catch {
          console.error(
            "Backend returned non-JSON response:",
            text
          );

          if (
            response.status === 404
          ) {
            throw new Error(
              "AI route not found. Please connect /api/ai/plan-trip in server.js."
            );
          }

          throw new Error(
            `Backend returned an invalid response (${response.status}).`
          );
        }


        if (
          !response.ok ||
          !data.success
        ) {
          throw new Error(
            data.message ||
              "Unable to generate trip"
          );
        }


        console.log(
          "AI trip response:",
          data
        );


        // =================================================
        // GET STRUCTURED AI PLAN
        // =================================================

        let generatedPlan =
          data.plan ||
          data.itinerary ||
          data.response;


        // -----------------------------------------------
        // PARSE JSON STRING IF NECESSARY
        // -----------------------------------------------

        if (
          typeof generatedPlan ===
          "string"
        ) {
          try {
            generatedPlan =
              JSON.parse(
                generatedPlan
              );

          } catch {
            console.warn(
              "AI plan is still plain text."
            );
          }
        }


        // -----------------------------------------------
        // VALIDATE AI PLAN
        // -----------------------------------------------

        if (
          !generatedPlan
        ) {
          throw new Error(
            "AI did not return a valid trip plan."
          );
        }


        console.log(
          "Parsed AI plan:",
          generatedPlan
        );


        // =================================================
        // SHOW ITINERARY ON WEBSITE
        // =================================================

        setItinerary(
          generatedPlan
        );


        // =================================================
        // SAVE TO MYSQL
        // =================================================

        let databaseTrip = null;

        try {
          const saved =
            await saveTripToDatabase(
              generatedPlan
            );

          databaseTrip =
            saved.trip || null;

          console.log(
            "DATABASE SAVE SUCCESS:",
            saved
          );

        } catch (saveError) {
          console.error(
            "DATABASE SAVE ERROR:",
            saveError
          );

          setError(
            `Trip generated successfully, but it could not be saved to MySQL: ${saveError.message}`
          );
        }


        // =================================================
        // SAVE COMPLETE TRIP LOCALLY
        // =================================================

        localStorage.setItem(
          "plannedTrip",
          JSON.stringify({
            tripId:
              databaseTrip?.id ||
              null,

            startingLocation,

            destination,

            days:
              Number(days),

            budget,

            travellingWith,

            interests,

            itinerary:
              generatedPlan,

            savedToDatabase:
              Boolean(
                databaseTrip
              ),
          })
        );


      } catch (err) {
        console.error(
          "Generate trip error:",
          err
        );

        setError(
          err.message ||
            "AI trip generation failed."
        );

      } finally {
        setGenerating(false);
      }
    };


  // =====================================================
  // GET EXACT PLACES FROM AI JSON
  // =====================================================

  const getTripPlaces = () => {
    if (
      !itinerary ||
      !Array.isArray(
        itinerary.days
      )
    ) {
      return [];
    }


    const places = [];


    itinerary.days.forEach(
      (day) => {
        if (
          !Array.isArray(
            day.places
          )
        ) {
          return;
        }


        day.places.forEach(
          (place) => {
            if (
              place &&
              place.name
            ) {
              places.push(
                place.name
              );
            }
          }
        );
      }
    );


    return places;
  };


  const tripPlaces =
    getTripPlaces();


  // =====================================================
  // GOOGLE MAP DATA
  // =====================================================

  const googlePlaces =
    tripPlaces.map(
      (place) =>
        `${place}, ${destination}, India`
    );


  const mapDestination =
    googlePlaces.length > 0
      ? googlePlaces[
          googlePlaces.length - 1
        ]
      : `${destination}, India`;


  const mapWaypoints =
    googlePlaces.slice(
      0,
      -1
    );


  // =====================================================
  // OPEN ACTUAL GOOGLE MAPS
  // =====================================================

  const openGoogleMaps = () => {
    if (
      googlePlaces.length === 0
    ) {
      alert(
        "No places are available in the AI itinerary."
      );

      return;
    }


    const origin =
      `${startingLocation}, India`;


    const finalDestination =
      googlePlaces[
        googlePlaces.length - 1
      ];


    const waypoints =
      googlePlaces.slice(
        0,
        -1
      );


    const params =
      new URLSearchParams();


    params.set(
      "api",
      "1"
    );


    params.set(
      "origin",
      origin
    );


    params.set(
      "destination",
      finalDestination
    );


    params.set(
      "travelmode",
      "driving"
    );


    if (
      waypoints.length > 0
    ) {
      params.set(
        "waypoints",
        waypoints.join("|")
      );
    }


    const googleMapsUrl =
      `https://www.google.com/maps/dir/?${params.toString()}`;


    console.log(
      "Opening actual Google Maps:",
      googleMapsUrl
    );


    window.open(
      googleMapsUrl,
      "_blank",
      "noopener,noreferrer"
    );
  };


  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="plan-trip-page">

      {/* =================================================
          PAGE HEADING
      ================================================= */}

      <div className="planner-heading">

        <span>
          SMART PLANNER
        </span>

        <h1>
          Plan your trip
        </h1>

        <p>
          Tell us what you want and we'll
          help create your journey.
        </p>

      </div>


      {/* =================================================
          PLANNER FORM
      ================================================= */}

      <div className="planner-form">

        {/* HEADER */}

        <div className="planner-form-header">

          <div className="planner-icon">
            <Sparkles size={21} />
          </div>

          <div>
            <h2>
              Tell us about your trip
            </h2>

            <p>
              We'll use your preferences
              to build an itinerary.
            </p>
          </div>

        </div>


        {/* =================================================
            FORM GRID
        ================================================= */}

        <div className="planner-grid">

          {/* STARTING LOCATION */}

          <div className="form-group">

            <label className="form-label">

              <MapPin size={15} />

              Starting location

            </label>


            <select
              value={startingLocation}
              onChange={(e) =>
                setStartingLocation(
                  e.target.value
                )
              }
            >

              <option value="Hyderabad">
                Hyderabad
              </option>

              <option value="Delhi">
                Delhi
              </option>

              <option value="Mumbai">
                Mumbai
              </option>

              <option value="Bangalore">
                Bangalore
              </option>

              <option value="Chennai">
                Chennai
              </option>

              <option value="Kolkata">
                Kolkata
              </option>

              <option value="Pune">
                Pune
              </option>

              <option value="Ahmedabad">
                Ahmedabad
              </option>

            </select>

          </div>


          {/* DESTINATION */}

          <div className="form-group">

            <label className="form-label">

              <MapPin size={15} />

              Destination

            </label>


            <select
              value={destination}
              onChange={(e) =>
                setDestination(
                  e.target.value
                )
              }
              disabled={
                loadingStates
              }
            >

              {loadingStates ? (

                <option value="">
                  Loading states...
                </option>

              ) : states.length > 0 ? (

                states.map(
                  (state) => (

                    <option
                      key={state.id}
                      value={state.name}
                    >
                      {state.name}
                    </option>

                  )
                )

              ) : (

                <option value="">
                  No states available
                </option>

              )}

            </select>

          </div>


          {/* NUMBER OF DAYS */}

          <div className="form-group">

            <label className="form-label">

              <CalendarDays size={15} />

              Number of days

            </label>


            <select
              value={days}
              onChange={(e) =>
                setDays(
                  e.target.value
                )
              }
            >

              <option value="1">
                1 Day
              </option>

              <option value="2">
                2 Days
              </option>

              <option value="3">
                3 Days
              </option>

              <option value="4">
                4 Days
              </option>

              <option value="5">
                5 Days
              </option>

              <option value="7">
                7 Days
              </option>

              <option value="10">
                10 Days
              </option>

              <option value="14">
                14 Days
              </option>

            </select>

          </div>


          {/* BUDGET */}

          <div className="form-group">

            <label className="form-label">

              <WalletCards size={15} />

              Budget

            </label>


            <select
              value={budget}
              onChange={(e) =>
                setBudget(
                  e.target.value
                )
              }
            >

              <option value="Budget">
                Budget
              </option>

              <option value="Medium">
                Medium
              </option>

              <option value="Luxury">
                Luxury
              </option>

            </select>

          </div>


          {/* TRAVELLING WITH */}

          <div className="form-group">

            <label className="form-label">

              <Users size={15} />

              Travelling with

            </label>


            <select
              value={travellingWith}
              onChange={(e) =>
                setTravellingWith(
                  e.target.value
                )
              }
            >

              <option value="Solo">
                Solo
              </option>

              <option value="Partner">
                Partner
              </option>

              <option value="Friends">
                Friends
              </option>

              <option value="Family">
                Family
              </option>

            </select>

          </div>

        </div>


        {/* =================================================
            INTERESTS
        ================================================= */}

        <div className="interest-section">

          <label className="form-label">
            What are you interested in?
          </label>


          <div className="interest-options">

            {interestsList.map(
              (interest) => (

                <label
                  key={interest}
                  className="interest-option"
                >

                  <input
                    type="checkbox"
                    checked={
                      interests.includes(
                        interest
                      )
                    }
                    onChange={() =>
                      toggleInterest(
                        interest
                      )
                    }
                  />

                  <span>
                    {interest}
                  </span>

                </label>

              )
            )}

          </div>

        </div>


        {/* =================================================
            ERROR
        ================================================= */}

        {error && (

          <div className="planner-error">
            {error}
          </div>

        )}


        {/* =================================================
            GENERATE BUTTON
        ================================================= */}

        <button
          className="generate-button"
          onClick={
            handleGenerateTrip
          }
          disabled={
            generating ||
            savingTrip ||
            loadingStates
          }
        >

          <Sparkles size={17} />

          {generating
            ? "Generating your trip..."
            : savingTrip
            ? "Saving trip to MySQL..."
            : "Generate My Trip"}

        </button>


        {/* =================================================
            DATABASE SUCCESS MESSAGE
        ================================================= */}

        {savedTrip && (

          <div className="planner-note">

            <Sparkles size={16} />

            <span>
              Trip generated and saved
              successfully to MySQL.
              Trip ID:{" "}
              <strong>
                {savedTrip.id}
              </strong>
            </span>

          </div>

        )}


        {/* =================================================
            NOTE
        ================================================= */}

        {!itinerary && (

          <div className="planner-note">

            <Sparkles size={16} />

            <span>
              Your preferences will be sent
              to Ollama to generate a real AI
              travel itinerary.
            </span>

          </div>

        )}


        {/* =================================================
            AI RESULT
        ================================================= */}

        {itinerary && (

          <div className="itinerary-result">


            {/* RESULT HEADER */}

            <div className="itinerary-result-header">

              <Sparkles size={18} />

              <div>

                <h2>
                  Your AI Trip Plan
                </h2>

                <p>
                  {startingLocation}
                  {" → "}
                  {destination}
                  {" • "}
                  {days} days
                </p>

              </div>

            </div>


            {/* =================================================
                STRUCTURED ITINERARY
            ================================================= */}

            <div className="itinerary-content">


              {/* TRIP OVERVIEW */}

              {itinerary.tripOverview && (

                <div className="trip-overview">

                  <h3>
                    Trip Overview
                  </h3>

                  <p>
                    <strong>
                      Starting:
                    </strong>{" "}
                    {
                      itinerary
                        .tripOverview
                        .startingLocation
                    }
                  </p>

                  <p>
                    <strong>
                      Destination:
                    </strong>{" "}
                    {
                      itinerary
                        .tripOverview
                        .destination
                    }
                  </p>

                  <p>
                    <strong>
                      Duration:
                    </strong>{" "}
                    {
                      itinerary
                        .tripOverview
                        .numberOfDays
                    }{" "}
                    days
                  </p>

                  <p>
                    <strong>
                      Budget:
                    </strong>{" "}
                    {
                      itinerary
                        .tripOverview
                        .budget
                    }
                  </p>

                  <p>
                    <strong>
                      Travelling With:
                    </strong>{" "}
                    {
                      itinerary
                        .tripOverview
                        .travellingWith
                    }
                  </p>

                </div>

              )}


              {/* =================================================
                  DAYS
              ================================================= */}

              {Array.isArray(
                itinerary.days
              ) &&
                itinerary.days.map(
                  (day) => (

                    <div
                      className="ai-day"
                      key={day.day}
                    >

                      <h3>
                        Day {day.day}
                      </h3>


                      {Array.isArray(
                        day.places
                      ) &&
                        day.places.map(
                          (
                            place,
                            index
                          ) => (

                            <div
                              className="ai-place"
                              key={`${place.name}-${index}`}
                            >

                              <div>

                                <strong>
                                  {place.name}
                                </strong>

                                <span>
                                  {place.time}
                                  {" • "}
                                  {
                                    place.duration
                                  }
                                </span>

                              </div>

                            </div>

                          )
                        )}

                    </div>

                  )
                )}


              {/* =================================================
                  FOOD
              ================================================= */}

              {Array.isArray(
                itinerary.foodSuggestions
              ) &&
                itinerary
                  .foodSuggestions
                  .length > 0 && (

                  <div className="ai-extra-section">

                    <h3>
                      Food Suggestions
                    </h3>

                    <ul>

                      {itinerary
                        .foodSuggestions
                        .map(
                          (
                            item,
                            index
                          ) => (

                            <li
                              key={index}
                            >
                              {item}
                            </li>

                          )
                        )}

                    </ul>

                  </div>

                )}


              {/* =================================================
                  TRAVEL TIPS
              ================================================= */}

              {Array.isArray(
                itinerary.travelTips
              ) &&
                itinerary
                  .travelTips
                  .length > 0 && (

                  <div className="ai-extra-section">

                    <h3>
                      Travel Tips
                    </h3>

                    <ul>

                      {itinerary
                        .travelTips
                        .map(
                          (
                            item,
                            index
                          ) => (

                            <li
                              key={index}
                            >
                              {item}
                            </li>

                          )
                        )}

                    </ul>

                  </div>

                )}


              {/* =================================================
                  PRECAUTIONS
              ================================================= */}

              {Array.isArray(
                itinerary
                  .importantPrecautions
              ) &&
                itinerary
                  .importantPrecautions
                  .length > 0 && (

                  <div className="ai-extra-section">

                    <h3>
                      Important Precautions
                    </h3>

                    <ul>

                      {itinerary
                        .importantPrecautions
                        .map(
                          (
                            item,
                            index
                          ) => (

                            <li
                              key={index}
                            >
                              {item}
                            </li>

                          )
                        )}

                    </ul>

                  </div>

                )}

            </div>


            {/* =================================================
                GOOGLE MAP
            ================================================= */}

            <div className="trip-map-section">


              <div className="trip-map-heading">

                <div>

                  <MapPin size={18} />

                  <div>

                    <h2>
                      Your Trip Map
                    </h2>

                    <p>
                      {startingLocation}
                      {" → "}
                      {
                        tripPlaces.length >
                        0
                          ? tripPlaces[
                              tripPlaces.length -
                                1
                            ]
                          : destination
                      }
                    </p>

                  </div>

                </div>

              </div>


              {/* REAL GOOGLE MAP */}

              {tripPlaces.length > 0 ? (

                <TripMap
                  startingLocation={
                    `${startingLocation}, India`
                  }

                  destination={
                    mapDestination
                  }

                  waypoints={
                    mapWaypoints
                  }
                />

              ) : (

                <div className="planner-error">

                  No places were returned
                  by the AI itinerary.

                </div>

              )}


              {/* =================================================
                  OPEN ACTUAL GOOGLE MAPS
              ================================================= */}

              <button
                type="button"
                className="open-google-maps-button"
                onClick={
                  openGoogleMaps
                }
                disabled={
                  tripPlaces.length === 0
                }
              >

                <Navigation size={17} />

                <span>
                  Open Complete Trip in Google Maps
                </span>

              </button>


              <p className="google-maps-help">

                This opens the actual Google Maps
                website/app with your planned
                places in order.

              </p>


            </div>


          </div>

        )}

      </div>

    </div>
  );
}

export default PlanTrip;