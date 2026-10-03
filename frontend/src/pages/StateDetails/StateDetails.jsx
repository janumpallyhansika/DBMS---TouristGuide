import {
  ArrowLeft,
  MapPin,
  CalendarDays,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import PlaceCard from "../../components/PlaceCard/PlaceCard";

import "./StateDetails.css";


function StateDetails() {

  const navigate = useNavigate();

  const { stateId } = useParams();


  const [state, setState] =
    useState(null);

  const [places, setPlaces] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  useEffect(() => {

    const loadState = async () => {

      try {

        setLoading(true);
        setError("");


        /* =========================================
           LOAD STATE
        ========================================= */

        const stateResponse =
          await fetch(
            `http://localhost:5000/api/states/${stateId}`
          );


        const stateData =
          await stateResponse.json();


        if (
          !stateResponse.ok ||
          !stateData.success
        ) {
          throw new Error(
            stateData.message ||
            "State not found"
          );
        }


        setState(
          stateData.state
        );


        /* =========================================
           LOAD DESTINATIONS
        ========================================= */

        const placesResponse =
          await fetch(
            `http://localhost:5000/api/destinations/state/${stateId}`
          );


        const placesData =
          await placesResponse.json();


        if (
          placesResponse.ok &&
          placesData.success
        ) {

          setPlaces(
            placesData.destinations || []
          );

        } else {

          setPlaces([]);

        }


      } catch (err) {

        console.error(
          "State loading error:",
          err
        );

        setError(
          err.message ||
          "Unable to load state"
        );


      } finally {

        setLoading(false);

      }

    };


    if (stateId) {
      loadState();
    }

  }, [stateId]);


  /* =========================================
     LOADING
  ========================================= */

  if (loading) {

    return (
      <div className="page-inner">

        <div className="state-loading">
          Loading state...
        </div>

      </div>
    );

  }


  /* =========================================
     ERROR
  ========================================= */

  if (error || !state) {

    return (

      <div className="page-inner">

        <button
          className="back-button"
          onClick={() =>
            navigate("/explore")
          }
        >

          <ArrowLeft size={16} />

          Back to Explore

        </button>


        <div className="destination-error">

          <h2>
            State not found
          </h2>

          <p>
            {error}
          </p>

        </div>

      </div>

    );

  }


  /* =========================================
     STATE IMAGE
  ========================================= */

  const stateImage =
    state.image_url || "";


  return (

    <div className="page-inner">


      {/* =====================================
          BACK
      ===================================== */}

      <button
        className="back-button"
        onClick={() =>
          navigate("/explore")
        }
      >

        <ArrowLeft size={16} />

        Back to Explore

      </button>


      {/* =====================================
          STATE HERO
      ===================================== */}

      <div
        className="state-hero"
        style={
          stateImage
            ? {
                backgroundImage: `
                  linear-gradient(
                    90deg,
                    rgba(5,10,20,.92),
                    rgba(5,10,20,.35)
                  ),
                  url("${stateImage}")
                `,
              }
            : {
                background:
                  "linear-gradient(135deg,#101a2d,#1d2550)",
              }
        }
      >

        <div>

          <span>
            EXPLORE STATE
          </span>


          <h1>
            {state.name}
          </h1>


          <p>
            {state.description ||
              "Discover beautiful places, culture, food and experiences."}
          </p>


          <div className="state-hero-meta">

            <span>

              <MapPin size={14} />

              India

            </span>


            <span>

              <CalendarDays size={14} />

              {places.length} destinations

            </span>

          </div>

        </div>

      </div>


      {/* =====================================
          DESTINATIONS
      ===================================== */}

      <div className="section-header state-place-heading">

        <div>

          <span className="section-eyebrow">
            DESTINATIONS
          </span>


          <h2 className="section-title">

            Popular Places in{" "}
            {state.name}

          </h2>


          <p className="section-subtitle">

            Explore destinations you can
            add to your trip.

          </p>

        </div>

      </div>


      {places.length > 0 ? (

        <div className="places-grid">

          {places.map((place) => (

            <PlaceCard
              key={place.id}
              place={place}
            />

          ))}

        </div>

      ) : (

        <div className="no-destinations">

          <h3>
            No destinations available yet
          </h3>

          <p>
            Destination information for{" "}
            {state.name} will be added soon.
          </p>

        </div>

      )}

    </div>

  );
}


export default StateDetails;