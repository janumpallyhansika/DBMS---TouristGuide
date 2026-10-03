import { Plus, Loader2, AlertCircle, MapPin, CalendarDays } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./MyTrips.css";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

function MyTrips() {
  const navigate = useNavigate();

  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // --------------------------------------------------
  // Load trips from MySQL
  // --------------------------------------------------

  const loadTrips = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        setError("Please login to view your trips.");
        setLoading(false);
        return;
      }

      const response = await fetch(
        `${API_URL}/api/trips`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to load trips"
        );
      }

      setTrips(
        Array.isArray(data.trips)
          ? data.trips
          : []
      );
    } catch (err) {
      console.error("My Trips Error:", err);

      setError(
        err.message ||
          "Unable to load your trips."
      );
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------
  // Load trips when page opens
  // --------------------------------------------------

  useEffect(() => {
    loadTrips();
  }, []);

  // --------------------------------------------------
  // Open trip
  // --------------------------------------------------

  const openTrip = (tripId) => {
    navigate(`/trip/${tripId}`);
  };

  // --------------------------------------------------
  // Format date
  // --------------------------------------------------

  const formatDate = (date) => {
    if (!date) {
      return "Date not selected";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return date;
    }

    return parsedDate.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  // --------------------------------------------------
  // Render
  // --------------------------------------------------

  return (
    <div className="page-inner">

      {/* -------------------------------------------- */}
      {/* Heading */}
      {/* -------------------------------------------- */}

      <div className="my-trips-heading">

        <div>
          <span>YOUR JOURNEYS</span>

          <h1>My Trips</h1>

          <p>
            Manage your saved and upcoming journeys.
          </p>
        </div>

        <button
          className="primary-button"
          onClick={() =>
            navigate("/plan-trip")
          }
        >
          <Plus size={15} />
          New Trip
        </button>

      </div>


      {/* -------------------------------------------- */}
      {/* Loading */}
      {/* -------------------------------------------- */}

      {loading && (
        <div
          style={{
            minHeight: "300px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            gap: "12px",
          }}
        >
          <Loader2
            size={30}
            className="spin"
          />

          <p>
            Loading your trips...
          </p>
        </div>
      )}


      {/* -------------------------------------------- */}
      {/* Error */}
      {/* -------------------------------------------- */}

      {!loading && error && (
        <div
          style={{
            minHeight: "250px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            gap: "12px",
            textAlign: "center",
          }}
        >
          <AlertCircle size={35} />

          <h3>
            Unable to load trips
          </h3>

          <p>
            {error}
          </p>

          <button
            className="primary-button"
            onClick={loadTrips}
          >
            Try Again
          </button>
        </div>
      )}


      {/* -------------------------------------------- */}
      {/* No trips */}
      {/* -------------------------------------------- */}

      {!loading &&
        !error &&
        trips.length === 0 && (
          <div
            style={{
              minHeight: "300px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              gap: "12px",
              textAlign: "center",
            }}
          >
            <MapPin size={40} />

            <h3>
              No trips yet
            </h3>

            <p>
              Your saved trips will appear here.
            </p>

            <button
              className="primary-button"
              onClick={() =>
                navigate("/plan-trip")
              }
            >
              <Plus size={15} />
              Plan Your First Trip
            </button>
          </div>
        )}


      {/* -------------------------------------------- */}
      {/* Trips from MySQL */}
      {/* -------------------------------------------- */}

      {!loading &&
        !error &&
        trips.length > 0 && (

          <div className="trips-list">

            {trips.map((trip) => (

              <div
                key={trip.id}
                className="trip-db-card"
                onClick={() =>
                  openTrip(trip.id)
                }
                style={{
                  cursor: "pointer",
                }}
              >

                {/* Trip title */}

                <div className="trip-db-card-content">

                  <div className="trip-db-card-top">

                    <div>

                      <span className="trip-db-label">
                        {trip.ai_generated
                          ? "AI PLANNED"
                          : "TRIP"}
                      </span>

                      <h2>
                        {trip.title ||
                          "My Trip"}
                      </h2>

                    </div>

                    <span className="trip-db-status">
                      {trip.status ||
                        "planned"}
                    </span>

                  </div>


                  {/* Trip information */}

                  <div className="trip-db-info">

                    {trip.source_location && (
                      <div>
                        <MapPin
                          size={15}
                        />

                        <span>
                          From{" "}
                          {trip.source_location}
                        </span>
                      </div>
                    )}


                    {trip.number_of_days && (
                      <div>
                        <CalendarDays
                          size={15}
                        />

                        <span>
                          {trip.number_of_days}{" "}
                          {Number(
                            trip.number_of_days
                          ) === 1
                            ? "Day"
                            : "Days"}
                        </span>
                      </div>
                    )}


                    {trip.start_date && (
                      <div>
                        <CalendarDays
                          size={15}
                        />

                        <span>
                          {formatDate(
                            trip.start_date
                          )}
                        </span>
                      </div>
                    )}

                  </div>


                  {/* Bottom section */}

                  <div className="trip-db-card-bottom">

                    <span>
                      Created{" "}
                      {formatDate(
                        trip.created_at
                      )}
                    </span>

                    <button
                      type="button"
                      className="trip-open-button"
                      onClick={(event) => {
                        event.stopPropagation();

                        openTrip(
                          trip.id
                        );
                      }}
                    >
                      View Trip →
                    </button>

                  </div>

                </div>

              </div>

            ))}

          </div>

        )}

    </div>
  );
}

export default MyTrips;