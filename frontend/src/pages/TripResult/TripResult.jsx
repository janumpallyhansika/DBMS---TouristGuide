import {
  Clock,
  Navigation,
  CalendarDays,
  Save,
  Edit3,
  Loader2,
  AlertCircle,
  MapPin,
} from "lucide-react";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import TripMap from "../../components/TripMap/TripMap";

import "./TripResult.css";


const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000";


// ==================================================
// HELPER: Format time
// ==================================================

const formatTime = (time) => {
  if (!time) {
    return "Time not specified";
  }

  const value = String(time);

  // MySQL TIME: 09:00:00
  const match = value.match(
    /^(\d{1,2}):(\d{2})(?::\d{2})?$/
  );

  if (match) {
    let hour = Number(match[1]);
    const minute = match[2];

    const period =
      hour >= 12 ? "PM" : "AM";

    if (hour === 0) {
      hour = 12;
    } else if (hour > 12) {
      hour -= 12;
    }

    return `${String(hour).padStart(
      2,
      "0"
    )}:${minute} ${period}`;
  }

  return value;
};


// ==================================================
// HELPER: Format date
// ==================================================

const formatDate = (date) => {
  if (!date) {
    return "";
  }

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return String(date);
  }

  return parsed.toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
};


// ==================================================
// HELPER: Get place name
// ==================================================

const getPlaceName = (place) => {
  return (
    place?.name ||
    place?.destination_name ||
    place?.destinationName ||
    place?.activity ||
    "Unknown place"
  );
};


// ==================================================
// HELPER: Get city
// ==================================================

const getPlaceCity = (place) => {
  return (
    place?.city ||
    place?.destination_city ||
    place?.state_name ||
    ""
  );
};


// ==================================================
// HELPER: Get duration
// ==================================================

const getPlaceDuration = (place) => {
  if (place?.duration) {
    return place.duration;
  }

  if (
    place?.estimated_hours !== null &&
    place?.estimated_hours !== undefined
  ) {
    return `${place.estimated_hours} hours`;
  }

  if (place?.notes) {
    const match = String(
      place.notes
    ).match(
      /Duration:\s*(.*)/i
    );

    if (match) {
      return match[1];
    }
  }

  return "Duration not specified";
};


// ==================================================
// HELPER: Convert backend itinerary to UI format
// ==================================================

const normalizeItinerary = (
  itinerary
) => {
  if (!Array.isArray(itinerary)) {
    return [];
  }


  // -----------------------------------------------
  // Case 1:
  // Backend returns already grouped days
  // -----------------------------------------------

  if (
    itinerary.some(
      (item) =>
        Array.isArray(item?.places) ||
        Array.isArray(item?.items)
    )
  ) {
    return itinerary.map(
      (dayItem, index) => {

        const dayNumber =
          Number(
            dayItem.day_number ??
            dayItem.day ??
            index + 1
          );

        const places =
          Array.isArray(
            dayItem.places
          )
            ? dayItem.places
            : Array.isArray(
                dayItem.items
              )
            ? dayItem.items
            : [];

        return {
          dayNumber,
          day:
            dayItem.title ||
            `Day ${dayNumber}`,
          city:
            dayItem.city ||
            places
              .map(
                getPlaceCity
              )
              .find(Boolean) ||
            "",
          places: places.map(
            (place) => ({
              ...place,
              name:
                getPlaceName(
                  place
                ),
              city:
                getPlaceCity(
                  place
                ),
              time:
                formatTime(
                  place.time ||
                  place.start_time ||
                  place.startTime
                ),
              duration:
                getPlaceDuration(
                  place
                ),
            })
          ),
        };
      }
    );
  }


  // -----------------------------------------------
  // Case 2:
  // Backend returns flat itinerary items
  // -----------------------------------------------

  const grouped = {};

  itinerary.forEach(
    (item) => {

      const dayNumber =
        Number(
          item.day_number ??
          item.dayNumber ??
          item.day ??
          1
        );

      if (!grouped[dayNumber]) {
        grouped[dayNumber] = [];
      }

      grouped[dayNumber].push(
        item
      );
    }
  );


  return Object.keys(grouped)
    .sort(
      (a, b) =>
        Number(a) - Number(b)
    )
    .map(
      (dayNumber) => {

        const places =
          grouped[dayNumber];

        return {
          dayNumber:
            Number(dayNumber),

          day:
            `Day ${dayNumber}`,

          city:
            places
              .map(
                getPlaceCity
              )
              .find(Boolean) ||
            "",

          places:
            places.map(
              (place) => ({
                ...place,

                name:
                  getPlaceName(
                    place
                  ),

                city:
                  getPlaceCity(
                    place
                  ),

                time:
                  formatTime(
                    place.start_time ||
                    place.startTime ||
                    place.time
                  ),

                duration:
                  getPlaceDuration(
                    place
                  ),
              })
            ),
        };
      }
    );
};


// ==================================================
// COMPONENT
// ==================================================

function TripResult() {

  const navigate = useNavigate();

  const { tripId } =
    useParams();


  // ==================================================
  // STATE
  // ==================================================

  const [trip, setTrip] =
    useState(null);

  const [destinations, setDestinations] =
    useState([]);

  const [itinerary, setItinerary] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [routeInfo, setRouteInfo] =
    useState({
      distance: null,
      duration: null,
    });


  // ==================================================
  // LOAD TRIP FROM MYSQL
  // ==================================================

  const loadTrip = async () => {

    try {

      setLoading(true);
      setError("");

      const token =
        localStorage.getItem(
          "token"
        );


      if (!token) {

        setError(
          "Please login to view this trip."
        );

        setLoading(false);

        return;
      }


      if (!tripId) {

        setError(
          "Trip ID is missing."
        );

        setLoading(false);

        return;
      }


      const response =
        await fetch(
          `${API_URL}/api/trips/${tripId}`,
          {
            method: "GET",

            headers: {
              Authorization:
                `Bearer ${token}`,

              "Content-Type":
                "application/json",
            },
          }
        );


      const data =
        await response.json();


      if (!response.ok) {

        throw new Error(
          data.message ||
          "Failed to load trip"
        );
      }


      console.log(
        "Trip loaded from MySQL:",
        data
      );


      setTrip(
        data.trip || null
      );


      setDestinations(
        Array.isArray(
          data.destinations
        )
          ? data.destinations
          : []
      );


      setItinerary(
        normalizeItinerary(
          data.itinerary
        )
      );

    } catch (err) {

      console.error(
        "Trip Result Error:",
        err
      );

      setError(
        err.message ||
        "Unable to load trip."
      );

    } finally {

      setLoading(false);

    }
  };


  // ==================================================
  // LOAD WHEN PAGE OPENS
  // ==================================================

  useEffect(() => {
    loadTrip();
  }, [tripId]);


  // ==================================================
  // ALL ROUTE PLACES
  // ==================================================

  const routePlaces =
    useMemo(() => {

      const places = [];


      // First try itinerary order
      itinerary.forEach(
        (day) => {

          day.places.forEach(
            (place) => {

              const name =
                getPlaceName(
                  place
                );

              const city =
                getPlaceCity(
                  place
                );


              if (
                name &&
                name !==
                  "Unknown place"
              ) {

                const fullName =
                  city
                    ? `${name}, ${city}, India`
                    : `${name}, India`;


                if (
                  !places.includes(
                    fullName
                  )
                ) {

                  places.push(
                    fullName
                  );
                }
              }
            }
          );
        }
      );


      // If itinerary has no places,
      // use trip destinations
      if (
        places.length === 0
      ) {

        destinations.forEach(
          (destination) => {

            if (
              destination?.name
            ) {

              const fullName =
                destination.city
                  ? `${destination.name}, ${destination.city}, India`
                  : `${destination.name}, India`;


              if (
                !places.includes(
                  fullName
                )
              ) {

                places.push(
                  fullName
                );
              }
            }
          }
        );
      }


      return places;

    }, [
      itinerary,
      destinations,
    ]);


  // ==================================================
  // ORIGIN
  // ==================================================

  const origin =
    trip?.source_location ||
    (
      destinations.length > 0
        ? destinations[0]?.city
        : ""
    ) ||
    "India";


  // ==================================================
  // FINAL DESTINATION
  // ==================================================

  const destination =
    routePlaces.length > 0
      ? routePlaces[
          routePlaces.length - 1
        ]
      : origin;


  // ==================================================
  // WAYPOINTS
  // ==================================================

  const waypoints =
    routePlaces.length > 1
      ? routePlaces.slice(
          0,
          -1
        )
      : [];


  // ==================================================
  // OPEN GOOGLE MAPS
  // ==================================================

  const openGoogleMaps = () => {

    if (
      routePlaces.length === 0
    ) {

      alert(
        "No destinations are available for this trip."
      );

      return;
    }


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


    const googleMapsUrl =
      `https://www.google.com/maps/dir/?${params.toString()}`;


    window.open(
      googleMapsUrl,
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
          minHeight: "70vh",
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
          Loading your trip...
        </h3>

        <p>
          Getting your itinerary from MySQL.
        </p>

      </div>
    );
  }


  // ==================================================
  // ERROR SCREEN
  // ==================================================

  if (error) {

    return (
      <div
        className="page-inner"
        style={{
          minHeight: "70vh",
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
          Unable to load trip
        </h2>

        <p>
          {error}
        </p>

        <button
          className="primary-button"
          onClick={loadTrip}
        >
          Try Again
        </button>

      </div>
    );
  }


  // ==================================================
  // NO TRIP
  // ==================================================

  if (!trip) {

    return (
      <div
        className="page-inner"
        style={{
          minHeight: "70vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: "15px",
        }}
      >

        <MapPin
          size={40}
        />

        <h2>
          Trip not found
        </h2>

        <button
          className="primary-button"
          onClick={() =>
            navigate("/my-trips")
          }
        >
          Back to My Trips
        </button>

      </div>
    );
  }


  // ==================================================
  // TOTAL PLACES
  // ==================================================

  const totalPlaces =
    itinerary.reduce(
      (
        total,
        day
      ) =>
        total +
        day.places.length,
      0
    );


  // ==================================================
  // NUMBER OF DAYS
  // ==================================================

  const numberOfDays =
    trip.number_of_days ||
    itinerary.length ||
    0;


  // ==================================================
  // TRIP TITLE
  // ==================================================

  const tripTitle =
    trip.title ||
    "My Trip";


  // ==================================================
  // RETURN UI
  // ==================================================

  return (

    <div className="page-inner">


      {/* ============================================
          HEADER
          ============================================ */}

      <div className="trip-result-header">

        <div>

          <span>
            YOUR ITINERARY
          </span>


          <h1>
            {tripTitle}
          </h1>


          <p
            style={{
              display: "flex",
              alignItems: "center",
              gap: "7px",
              flexWrap: "wrap",
            }}
          >

            <CalendarDays
              size={14}
            />

            {numberOfDays}{" "}
            {Number(
              numberOfDays
            ) === 1
              ? "Day"
              : "Days"}

            {" • "}

            {totalPlaces}{" "}
            {totalPlaces === 1
              ? "Place"
              : "Places"}

          </p>

        </div>


        {/* ==========================================
            ACTIONS
            ========================================== */}

        <div className="trip-result-actions">

          <button
            className="secondary-button"
            onClick={() =>
              navigate("/my-trips")
            }
          >

            <Save
              size={15}
            />

            Saved to My Trips

          </button>


          <button
            className="primary-button"
            onClick={() =>
              navigate(
                "/customize-trip"
              )
            }
          >

            <Edit3
              size={15}
            />

            Edit Trip

          </button>

        </div>

      </div>


      {/* ============================================
          MAIN CONTENT
          ============================================ */}

      <div className="trip-result-layout">


        {/* ==========================================
            LEFT SIDE
            ========================================== */}

        <div className="itinerary">


          {/* ------------------------------------------
              TRIP INFORMATION
              ------------------------------------------ */}

          <div
            className="itinerary-day card"
          >

            <div
              className="day-heading"
            >

              <div
                className="day-number"
              >
                <MapPin
                  size={20}
                />
              </div>


              <div>

                <h2>
                  Trip Details
                </h2>

                <span>
                  {trip.source_location
                    ? `Starting from ${trip.source_location}`
                    : "India"}
                </span>

              </div>

            </div>


            <div
              style={{
                marginTop: "18px",
                display: "flex",
                flexDirection: "column",
                gap: "8px",
              }}
            >

              {trip.travel_type && (
                <p>
                  <strong>
                    Travelling with:
                  </strong>{" "}
                  {trip.travel_type}
                </p>
              )}


              {trip.budget && (
                <p>
                  <strong>
                    Budget:
                  </strong>{" "}
                  ₹
                  {Number(
                    trip.budget
                  ).toLocaleString(
                    "en-IN"
                  )}
                </p>
              )}


              {trip.start_date && (
                <p>
                  <strong>
                    Start:
                  </strong>{" "}
                  {formatDate(
                    trip.start_date
                  )}
                </p>
              )}


              {trip.end_date && (
                <p>
                  <strong>
                    End:
                  </strong>{" "}
                  {formatDate(
                    trip.end_date
                  )}
                </p>
              )}

            </div>

          </div>


          {/* ==========================================
              ITINERARY DAYS
              ========================================== */}

          {itinerary.length === 0 ? (

            <div
              className="itinerary-day card"
            >

              <div
                className="day-heading"
              >

                <div
                  className="day-number"
                >
                  <CalendarDays
                    size={20}
                  />
                </div>

                <div>

                  <h2>
                    Itinerary not available
                  </h2>

                  <span>
                    No itinerary items were saved for this trip.
                  </span>

                </div>

              </div>

            </div>

          ) : (

            itinerary.map(
              (day) => (

                <div
                  className="itinerary-day card"
                  key={
                    day.dayNumber
                  }
                >

                  {/* Day heading */}

                  <div
                    className="day-heading"
                  >

                    <div
                      className="day-number"
                    >

                      {day.dayNumber}

                    </div>


                    <div>

                      <h2>
                        {day.day}
                      </h2>

                      <span>
                        {day.city ||
                          "India"}
                      </span>

                    </div>

                  </div>


                  {/* Timeline */}

                  <div
                    className="timeline"
                  >

                    {day.places.map(
                      (
                        place,
                        index
                      ) => (

                        <div
                          className="timeline-item"
                          key={
                            place.id ||
                            place.item_id ||
                            `${place.name}-${index}`
                          }
                        >

                          <div
                            className="timeline-dot"
                          />


                          <div
                            className="timeline-content"
                          >

                            <span
                              style={{
                                display:
                                  "flex",
                                alignItems:
                                  "center",
                                gap: "5px",
                              }}
                            >

                              <Clock
                                size={12}
                              />

                              {place.time}

                            </span>


                            <h3>
                              {place.name}
                            </h3>


                            <p>
                              Visit for{" "}
                              {
                                place.duration
                              }
                            </p>

                          </div>

                        </div>

                      )
                    )}

                  </div>

                </div>

              )
            )

          )}

        </div>


        {/* ==========================================
            RIGHT SIDE - MAP
            ========================================== */}

        <div
          className="map-container"
        >


          {/* MAP HEADER */}

          <div
            className="map-header"
          >

            <div>

              <h3>
                Your Route
              </h3>

              <span>
                Real Google Maps route
              </span>

            </div>


            <Navigation
              size={18}
            />

          </div>


          {/* MAP */}

          <div
            className="real-map-wrapper"
          >

            {routePlaces.length > 0 ? (

              <TripMap
                startingLocation={
                  origin
                }

                destination={
                  destination
                }

                waypoints={
                  waypoints
                }

                onRouteInfo={
                  setRouteInfo
                }
              />

            ) : (

              <div
                style={{
                  minHeight:
                    "300px",
                  display:
                    "flex",
                  alignItems:
                    "center",
                  justifyContent:
                    "center",
                  textAlign:
                    "center",
                  padding:
                    "30px",
                }}
              >

                <p>
                  No route locations available for this trip.
                </p>

              </div>

            )}

          </div>


          {/* ==========================================
              ROUTE STATS
              ========================================== */}

          <div
            className="map-stats"
          >

            <div>

              <span>
                Distance
              </span>

              <strong>
                {routeInfo.distance ||
                  "Calculating..."}
              </strong>

            </div>


            <div>

              <span>
                Travel Time
              </span>

              <strong>
                {routeInfo.duration ||
                  "Calculating..."}
              </strong>

            </div>

          </div>


          {/* ==========================================
              OPEN GOOGLE MAPS
              ========================================== */}

          <button
            className="open-google-maps-button"
            onClick={
              openGoogleMaps
            }
          >

            <Navigation
              size={17}
            />

            <span>
              Open Complete Trip in Google Maps
            </span>

          </button>

        </div>

      </div>

    </div>

  );
}


export default TripResult;