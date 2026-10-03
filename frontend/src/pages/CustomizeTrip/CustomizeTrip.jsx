import { useEffect, useMemo, useState } from "react";

import {
  Target,
  MapPin,
  CalendarDays,
  CheckCircle2,
  Navigation,
  Loader2,
  AlertCircle,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import "./CustomizeTrip.css";


const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000";


function CustomizeTrip() {

  const navigate = useNavigate();


  // ==================================================
  // STATE
  // ==================================================

  const [states, setStates] =
    useState([]);

  const [destinations, setDestinations] =
    useState([]);

  const [selectedState, setSelectedState] =
    useState("");

  const [selectedPlaces, setSelectedPlaces] =
    useState([]);

  const [numberOfDays, setNumberOfDays] =
    useState("2");

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");


  // ==================================================
  // LOAD STATES + DESTINATIONS FROM MYSQL
  // ==================================================

  useEffect(() => {

    const loadData = async () => {

      try {

        setLoading(true);
        setError("");


        const [
          statesResponse,
          destinationsResponse,
        ] = await Promise.all([

          fetch(
            `${API_URL}/api/states`
          ),

          fetch(
            `${API_URL}/api/destinations`
          ),

        ]);


        const statesData =
          await statesResponse.json();

        const destinationsData =
          await destinationsResponse.json();


        if (!statesResponse.ok) {
          throw new Error(
            statesData.message ||
            "Failed to load states."
          );
        }


        if (!destinationsResponse.ok) {
          throw new Error(
            destinationsData.message ||
            "Failed to load destinations."
          );
        }


        const loadedStates =
          Array.isArray(
            statesData.states
          )
            ? statesData.states
            : Array.isArray(
                statesData.data
              )
            ? statesData.data
            : [];


        const loadedDestinations =
          Array.isArray(
            destinationsData.destinations
          )
            ? destinationsData.destinations
            : Array.isArray(
                destinationsData.data
              )
            ? destinationsData.data
            : [];


        setStates(
          loadedStates
        );

        setDestinations(
          loadedDestinations
        );


        // ----------------------------------------------
        // Select first state automatically
        // ----------------------------------------------

        if (
          loadedStates.length > 0
        ) {

          setSelectedState(
            loadedStates[0].name
          );

        }

      } catch (err) {

        console.error(
          "Customize Trip Load Error:",
          err
        );

        setError(
          err.message ||
          "Unable to load destinations."
        );

      } finally {

        setLoading(false);

      }

    };


    loadData();

  }, []);


  // ==================================================
  // DESTINATIONS FOR SELECTED STATE
  // ==================================================

  const availablePlaces =
    useMemo(() => {

      if (!selectedState) {
        return [];
      }


      return destinations.filter(
        (destination) => {

          const stateName =
            destination.state_name ||
            destination.stateName;


          return (
            stateName ===
            selectedState
          );

        }
      );

    }, [
      destinations,
      selectedState,
    ]);


  // ==================================================
  // TOGGLE PLACE
  // ==================================================

  const togglePlace = (
    destination
  ) => {

    setSelectedPlaces(
      (current) => {

        const alreadySelected =
          current.some(
            (place) =>
              place.id ===
              destination.id
          );


        if (
          alreadySelected
        ) {

          return current.filter(
            (place) =>
              place.id !==
              destination.id
          );

        }


        return [
          ...current,
          destination,
        ];

      }
    );

  };


  // ==================================================
  // CHANGE STATE
  // ==================================================

  const handleStateChange = (
    event
  ) => {

    const newState =
      event.target.value;


    setSelectedState(
      newState
    );

    setSelectedPlaces([]);

  };


  // ==================================================
  // GET CITY
  // ==================================================

  const getCity = (
    destination
  ) => {

    return (
      destination.city ||
      destination.state_name ||
      selectedState ||
      "India"
    );

  };


  // ==================================================
  // CREATE AI-LIKE CUSTOM ITINERARY
  // ==================================================

  const buildCustomItinerary =
    () => {

      const days =
        Number(numberOfDays);


      const result = [];


      for (
        let dayIndex = 0;
        dayIndex < days;
        dayIndex++
      ) {

        result.push({
          day:
            dayIndex + 1,

          places: [],
        });

      }


      // ----------------------------------------------
      // Distribute selected places across days
      // ----------------------------------------------

      selectedPlaces.forEach(
        (
          place,
          index
        ) => {

          const dayIndex =
            index % days;


          // Simple visit times
          const times = [
            "09:00 AM",
            "11:30 AM",
            "02:00 PM",
            "04:30 PM",
            "06:30 PM",
          ];


          result[
            dayIndex
          ].places.push({

            name:
              place.name,

            time:
              times[
                index %
                times.length
              ],

            duration:
              place.estimated_hours
                ? `${place.estimated_hours} hours`
                : "2 hours",

          });

        }
      );


      return {
        days: result,
      };

    };


  // ==================================================
  // SAVE CUSTOM TRIP TO MYSQL
  // ==================================================

  const generateTrip = async () => {

    if (
      selectedPlaces.length === 0
    ) {

      alert(
        "Please select at least one place."
      );

      return;

    }


    const token =
      localStorage.getItem(
        "token"
      );


    if (!token) {

      alert(
        "Please login before creating a trip."
      );

      navigate("/login");

      return;

    }


    try {

      setSaving(true);
      setError("");


      // ----------------------------------------------
      // Build itinerary
      // ----------------------------------------------

      const customItinerary =
        buildCustomItinerary();


      // ----------------------------------------------
      // Destination IDs
      // ----------------------------------------------

      const destinationIds =
        selectedPlaces.map(
          (place) =>
            Number(place.id)
        );


      // ----------------------------------------------
      // Source location
      // ----------------------------------------------

      const firstPlace =
        selectedPlaces[0];


      const sourceLocation =
        firstPlace?.city ||
        selectedState ||
        "India";


      // ----------------------------------------------
      // Trip payload
      // ----------------------------------------------

      const tripPayload = {

        title:
          `${selectedState} Custom Trip`,

        startDate:
          null,

        endDate:
          null,

        numberOfDays:
          Number(numberOfDays),

        budget:
          null,

        travelType:
          "Custom",

        planningType:
          "custom",

        sourceLocation,

        destinationIds,

        aiGenerated:
          false,

        itinerary:
          customItinerary,

      };


      console.log(
        "Saving custom trip:",
        tripPayload
      );


      // ----------------------------------------------
      // Save to backend
      // ----------------------------------------------

      const response =
        await fetch(
          `${API_URL}/api/trips`,
          {

            method: "POST",

            headers: {

              Authorization:
                `Bearer ${token}`,

              "Content-Type":
                "application/json",

            },

            body:
              JSON.stringify(
                tripPayload
              ),

          }
        );


      const data =
        await response.json();


      if (!response.ok) {

        throw new Error(
          data.message ||
          "Failed to save custom trip."
        );

      }


      console.log(
        "Custom trip saved:",
        data
      );


      // ----------------------------------------------
      // Check trip ID
      // ----------------------------------------------

      if (
        !data.trip ||
        !data.trip.id
      ) {

        throw new Error(
          "Trip was saved but no Trip ID was returned."
        );

      }


      // ----------------------------------------------
      // Store a small local copy
      // ----------------------------------------------

      localStorage.setItem(
        "customTrip",
        JSON.stringify({
          tripId:
            data.trip.id,

          state:
            selectedState,

          numberOfDays:
            Number(numberOfDays),

          places:
            selectedPlaces,
        })
      );


      // ----------------------------------------------
      // Open actual saved trip
      // ----------------------------------------------

      navigate(
        `/trip/${data.trip.id}`
      );

    } catch (err) {

      console.error(
        "Custom Trip Error:",
        err
      );

      setError(
        err.message ||
        "Unable to save custom trip."
      );

    } finally {

      setSaving(false);

    }

  };


  // ==================================================
  // OPEN GOOGLE MAPS
  // ==================================================

  const openGoogleMaps = () => {

    if (
      selectedPlaces.length === 0
    ) {

      alert(
        "Please select places first."
      );

      return;

    }


    const firstPlace =
      selectedPlaces[0];


    const origin =
      firstPlace.city
        ? `${firstPlace.city}, ${selectedState}, India`
        : `${selectedState}, India`;


    const lastPlace =
      selectedPlaces[
        selectedPlaces.length - 1
      ];


    const destination =
      lastPlace.city
        ? `${lastPlace.name}, ${lastPlace.city}, ${selectedState}, India`
        : `${lastPlace.name}, ${selectedState}, India`;


    const waypoints =
      selectedPlaces
        .slice(
          0,
          -1
        )
        .map(
          (place) =>
            place.city
              ? `${place.name}, ${place.city}, ${selectedState}, India`
              : `${place.name}, ${selectedState}, India`
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
      destination
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


    const url =
      `https://www.google.com/maps/dir/?${params.toString()}`;


    window.open(
      url,
      "_blank",
      "noopener,noreferrer"
    );

  };


  // ==================================================
  // LOADING SCREEN
  // ==================================================

  if (loading) {

    return (
      <div
        className="page-inner"
        style={{
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: "15px",
        }}
      >

        <Loader2
          size={35}
          className="spin"
        />

        <h3>
          Loading destinations...
        </h3>

        <p>
          Getting places from MySQL.
        </p>

      </div>
    );

  }


  // ==================================================
  // ERROR
  // ==================================================

  if (
    error &&
    states.length === 0
  ) {

    return (
      <div
        className="page-inner"
        style={{
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: "15px",
          textAlign: "center",
        }}
      >

        <AlertCircle
          size={40}
        />

        <h2>
          Unable to load destinations
        </h2>

        <p>
          {error}
        </p>

        <button
          className="primary-button"
          onClick={() =>
            window.location.reload()
          }
        >
          Try Again
        </button>

      </div>
    );

  }


  // ==================================================
  // MAIN UI
  // ==================================================

  return (

    <div className="page-inner">


      {/* ============================================
          HEADING
          ============================================ */}

      <div className="customize-heading">

        <span>
          CUSTOM TRIP
        </span>

        <h1>
          Build your own journey
        </h1>

        <p>
          Choose exactly what you want
          to experience.
        </p>

      </div>


      {/* ============================================
          ERROR MESSAGE
          ============================================ */}

      {error && (

        <div
          style={{
            marginBottom: "20px",
            padding: "14px 18px",
            borderRadius: "12px",
            border:
              "1px solid rgba(255,80,80,0.3)",
            background:
              "rgba(255,80,80,0.08)",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >

          <AlertCircle
            size={18}
          />

          <span>
            {error}
          </span>

        </div>

      )}


      {/* ============================================
          MAIN
          ============================================ */}

      <div className="customize-layout">


        {/* ==========================================
            FORM
            ========================================== */}

        <div className="customize-form card">


          <div className="customize-title">

            <div className="customize-icon">

              <Target
                size={20}
              />

            </div>


            <div>

              <h2>
                Customize your trip
              </h2>

              <p>
                Select your state and
                favorite places.
              </p>

            </div>

          </div>


          {/* ========================================
              STATE
              ======================================== */}

          <div className="form-group">

            <label
              className="form-label"
            >

              <MapPin
                size={13}
              />

              Select State

            </label>


            <select
              className="select-field"
              value={selectedState}
              onChange={
                handleStateChange
              }
            >

              {states.map(
                (stateItem) => (

                  <option
                    key={
                      stateItem.id
                    }
                    value={
                      stateItem.name
                    }
                  >

                    {stateItem.name}

                  </option>

                )
              )}

            </select>

          </div>


          {/* ========================================
              DAYS
              ======================================== */}

          <div className="form-group">

            <label
              className="form-label"
            >

              <CalendarDays
                size={13}
              />

              Number of Days

            </label>


            <select
              className="select-field"
              value={numberOfDays}
              onChange={(event) =>
                setNumberOfDays(
                  event.target.value
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

              <option value="6">
                6 Days
              </option>

              <option value="7">
                7 Days
              </option>

            </select>

          </div>


          {/* ========================================
              PLACES
              ======================================== */}

          <div
            className="custom-place-section"
          >

            <label
              className="form-label"
            >

              Select Places

            </label>


            {availablePlaces.length === 0 ? (

              <div
                className="custom-empty"
              >

                <MapPin
                  size={28}
                />

                <h3>
                  No destinations found
                </h3>

                <p>
                  There are no destinations
                  available for this state.
                </p>

              </div>

            ) : (

              <div
                className="custom-place-list"
              >

                {availablePlaces.map(
                  (place) => {

                    const selected =
                      selectedPlaces.some(
                        (item) =>
                          item.id ===
                          place.id
                      );


                    return (

                      <button
                        key={
                          place.id
                        }
                        type="button"
                        className={
                          selected
                            ? "custom-place selected"
                            : "custom-place"
                        }
                        onClick={() =>
                          togglePlace(
                            place
                          )
                        }
                      >

                        <span>
                          {place.name}
                        </span>


                        {selected && (

                          <CheckCircle2
                            size={16}
                          />

                        )}

                      </button>

                    );

                  }
                )}

              </div>

            )}

          </div>


          {/* ========================================
              GENERATE
              ======================================== */}

          <button
            className="generate-button"
            onClick={
              generateTrip
            }
            disabled={
              saving ||
              selectedPlaces.length === 0
            }
          >

            {saving ? (

              <>
                <Loader2
                  size={17}
                  className="spin"
                />

                Saving Trip...

              </>

            ) : (

              "Generate My Custom Trip"

            )}

          </button>


          {/* ========================================
              GOOGLE MAPS
              ======================================== */}

          <button
            type="button"
            className="google-maps-custom-button"
            onClick={
              openGoogleMaps
            }
            disabled={
              selectedPlaces.length === 0 ||
              saving
            }
          >

            <Navigation
              size={17}
            />

            Open Trip in Google Maps

          </button>


        </div>


        {/* ==========================================
            PREVIEW
            ========================================== */}

        <div
          className="customize-preview card"
        >


          <div
            className="preview-header"
          >

            <h3>
              Your Selection
            </h3>


            <span>
              {selectedPlaces.length}{" "}
              {selectedPlaces.length === 1
                ? "place"
                : "places"}
            </span>

          </div>


          {selectedPlaces.length === 0 ? (

            <div
              className="custom-empty"
            >

              <Target
                size={32}
              />

              <h3>
                Start selecting places
              </h3>

              <p>
                Select places from the
                left and they will appear
                here.
              </p>

            </div>

          ) : (

            <div
              className="selected-list"
            >

              {selectedPlaces.map(
                (
                  place,
                  index
                ) => (

                  <div
                    className="selected-place"
                    key={
                      place.id
                    }
                  >

                    <div
                      className="selected-number"
                    >

                      {index + 1}

                    </div>


                    <div>

                      <strong>
                        {place.name}
                      </strong>

                      <span>
                        {getCity(
                          place
                        )}
                      </span>

                    </div>

                  </div>

                )
              )}

            </div>

          )}

        </div>

      </div>

    </div>

  );

}


export default CustomizeTrip;