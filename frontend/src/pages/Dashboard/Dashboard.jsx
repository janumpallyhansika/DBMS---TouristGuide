import {
  Plane,
  Hotel,
  Map,
  Bot,
  ArrowRight,
  Sparkles,
  Heart,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import DestinationCard from "../../components/DestinationCard/DestinationCard";

import "./Dashboard.css";


const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000";


function Dashboard() {

  const navigate = useNavigate();


  /* =========================================
     STATE
  ========================================= */

  const [destinations, setDestinations] =
    useState([]);

  const [trips, setTrips] =
    useState([]);

  const [loadingDestinations, setLoadingDestinations] =
    useState(true);

  const [loadingTrips, setLoadingTrips] =
    useState(true);


  /* =========================================
     LOAD DESTINATIONS
  ========================================= */

  useEffect(() => {

    const loadDestinations = async () => {

      try {

        setLoadingDestinations(true);


        const response =
          await fetch(
            `${API_URL}/api/destinations`
          );


        const data =
          await response.json();


        if (!response.ok) {

          throw new Error(
            data.message ||
            "Failed to load destinations."
          );
        }


        const destinationList =
          Array.isArray(data)
            ? data
            : data.destinations ||
              data.data ||
              [];


        /*
          Convert database fields into the
          format expected by DestinationCard.
        */

        const formatted =
          destinationList.map(
            (destination) => ({

              ...destination,

              image:
                destination.image ||
                destination.image_url ||
                "",

              location:
                destination.city ||
                destination.state_name ||
                destination.state ||
                "India",

              rating:
                destination.rating ||
                "4.5",

            })
          );


        setDestinations(
          formatted.slice(0, 6)
        );


      } catch (error) {

        console.error(
          "Dashboard destinations error:",
          error
        );

        setDestinations([]);

      } finally {

        setLoadingDestinations(false);

      }
    };


    loadDestinations();

  }, []);


  /* =========================================
     LOAD MY TRIPS
  ========================================= */

  useEffect(() => {

    const loadTrips = async () => {

      try {

        setLoadingTrips(true);


        const token =
          localStorage.getItem("token");


        if (!token) {

          setTrips([]);

          return;
        }


        const response =
          await fetch(
            `${API_URL}/api/trips`,
            {
              method: "GET",

              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );


        const data =
          await response.json();


        if (!response.ok) {

          throw new Error(
            data.message ||
            "Failed to load trips."
          );
        }


        const tripList =
          Array.isArray(data)
            ? data
            : data.trips ||
              data.data ||
              [];


        setTrips(
          tripList
        );


      } catch (error) {

        console.error(
          "Dashboard trips error:",
          error
        );

        setTrips([]);

      } finally {

        setLoadingTrips(false);

      }
    };


    loadTrips();

  }, []);


  /* =========================================
     UPCOMING / LATEST TRIP
  ========================================= */

  const latestTrip =
    trips.length > 0
      ? trips[0]
      : null;


  /* =========================================
     USER NAME
  ========================================= */

  let userName =
    "Hansika";


  try {

    const storedUser =
      localStorage.getItem("user");


    if (storedUser) {

      const parsedUser =
        JSON.parse(storedUser);


      userName =
        parsedUser.name ||
        parsedUser.username ||
        "Hansika";
    }

  } catch {

    userName =
      "Hansika";
  }


  /* =========================================
     RENDER
  ========================================= */

  return (

    <div className="page-inner dashboard-page">


      {/* =====================================
          HEADER
      ===================================== */}

      <div className="dashboard-heading">

        <div>

          <h1>
            Hello, {userName}! 👋
          </h1>

          <p>
            Let's explore India and plan your next journey.
          </p>

        </div>

      </div>


      {/* =====================================
          QUICK ACTIONS
      ===================================== */}

      <div className="quick-actions">


        {/* EXPLORE */}

        <button
          onClick={() =>
            navigate("/explore")
          }
          className="quick-action"
        >

          <div className="quick-icon blue">

            <Plane size={20} />

          </div>


          <div>

            <strong>
              Explore India
            </strong>

            <span>
              Discover destinations
            </span>

          </div>

        </button>


        {/* PLAN */}

        <button
          onClick={() =>
            navigate("/plan-trip")
          }
          className="quick-action"
        >

          <div className="quick-icon purple">

            <Map size={20} />

          </div>


          <div>

            <strong>
              Plan My Trip
            </strong>

            <span>
              Build your itinerary
            </span>

          </div>

        </button>


        {/* CUSTOMIZE */}

        <button
          onClick={() =>
            navigate("/customize-trip")
          }
          className="quick-action"
        >

          <div className="quick-icon yellow">

            <Hotel size={20} />

          </div>


          <div>

            <strong>
              Customize Trip
            </strong>

            <span>
              Choose every place
            </span>

          </div>

        </button>


        {/* AI */}

        <button
          onClick={() =>
            navigate("/ai-assistant")
          }
          className="quick-action"
        >

          <div className="quick-icon pink">

            <Bot size={20} />

          </div>


          <div>

            <strong>
              AI Assistant
            </strong>

            <span>
              Ask for travel help
            </span>

          </div>

        </button>

      </div>


      {/* =====================================
          MAIN GRID
      ===================================== */}

      <div className="dashboard-main-grid">


        <div>


          {/* =================================
              HERO
          ================================= */}

          <div className="hero-banner">

            <div className="hero-banner-overlay"></div>


            <div className="hero-banner-content">

              <span>
                DISCOVER INCREDIBLE INDIA
              </span>


              <h2>
                Every journey
                <br />
                tells a story.
              </h2>


              <p>
                Explore breathtaking places and create
                journeys designed around you.
              </p>


              <button
                onClick={() =>
                  navigate("/explore")
                }
              >

                Explore Now

                <ArrowRight size={16} />

              </button>

            </div>

          </div>


          {/* =================================
              POPULAR DESTINATIONS
          ================================= */}

          <div className="dashboard-section">


            <div className="section-header">

              <div>

                <h2 className="section-title">
                  Popular Destinations
                </h2>


                <p className="section-subtitle">
                  Places travelers are exploring
                </p>

              </div>


              <button
                className="text-button"
                onClick={() =>
                  navigate("/explore")
                }
              >

                View All

                <ArrowRight size={14} />

              </button>

            </div>


            {/* LOADING */}

            {loadingDestinations && (

              <div className="dashboard-loading">

                Loading destinations...

              </div>

            )}


            {/* DESTINATIONS */}

            {!loadingDestinations &&
              destinations.length > 0 && (

                <div className="destination-grid">

                  {destinations.map(
                    (destination) => (

                      <DestinationCard
                        key={destination.id}
                        destination={
                          destination
                        }
                      />

                    )
                  )}

                </div>

              )}


            {/* EMPTY */}

            {!loadingDestinations &&
              destinations.length === 0 && (

                <div className="dashboard-empty">

                  <Map size={30} />

                  <p>
                    No destinations available.
                  </p>

                </div>

              )}

          </div>

        </div>


        {/* ===================================
            RIGHT SIDE
        =================================== */}

        <div className="dashboard-side">


          {/* =================================
              MY TRIP WIDGET
          ================================= */}

          <div className="dashboard-widget">


            <div className="widget-heading">

              <div>

                <h3>
                  My Latest Trip
                </h3>

                <span>
                  Your saved journey
                </span>

              </div>


              <button
                onClick={() =>
                  navigate("/my-trips")
                }
              >

                View All

              </button>

            </div>


            {loadingTrips && (

              <div className="upcoming-trip">

                <div className="upcoming-content">

                  <h4>
                    Loading...
                  </h4>

                </div>

              </div>

            )}


            {!loadingTrips &&
              latestTrip && (

                <div
                  className="upcoming-trip"
                  onClick={() =>
                    navigate(
                      `/trip/${latestTrip.id}`
                    )
                  }
                  style={{
                    cursor: "pointer",
                  }}
                >

                  <div className="upcoming-trip-placeholder">

                    <Map size={34} />

                  </div>


                  <div className="upcoming-content">

                    <h4>
                      {latestTrip.title ||
                        latestTrip.destination ||
                        "My Trip"}
                    </h4>


                    <p>

                      {latestTrip.number_of_days ||
                        latestTrip.numberOfDays ||
                        latestTrip.days ||
                        "—"}{" "}

                      {(
                        latestTrip.number_of_days ||
                        latestTrip.numberOfDays ||
                        latestTrip.days
                      ) === 1
                        ? "Day"
                        : "Days"}

                    </p>


                    <span>
                      Saved Trip
                    </span>

                  </div>

                </div>

              )}


            {!loadingTrips &&
              !latestTrip && (

                <div className="upcoming-trip">

                  <div className="upcoming-trip-placeholder">

                    <Heart size={34} />

                  </div>


                  <div className="upcoming-content">

                    <h4>
                      No trips yet
                    </h4>

                    <p>
                      Create your first trip
                    </p>

                    <span>
                      Start Planning
                    </span>

                  </div>

                </div>

              )}

          </div>


          {/* =================================
              AI WIDGET
          ================================= */}

          <div className="ai-widget">


            <div className="ai-widget-icon">

              <Sparkles size={20} />

            </div>


            <div>

              <h3>
                Ask your AI Travel Guide
              </h3>


              <p>
                Need ideas? Ask about destinations,
                activities or itinerary planning.
              </p>


              <button
                onClick={() =>
                  navigate("/ai-assistant")
                }
              >

                Start Chat

                <ArrowRight size={14} />

              </button>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}


export default Dashboard;