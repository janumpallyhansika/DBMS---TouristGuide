import {
  Heart,
  MapPin,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import PlaceCard from "../../components/PlaceCard/PlaceCard";

import "./SavedPlaces.css";


const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000";


function SavedPlaces() {

  const [places, setPlaces] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  /* =========================================
     LOAD SAVED PLACES
  ========================================= */

  const loadSavedPlaces = async () => {

    try {

      setLoading(true);
      setError("");


      const token =
        localStorage.getItem("token");


      if (!token) {

        setError(
          "Please login to view your saved places."
        );

        setPlaces([]);

        return;
      }


      const response =
        await fetch(
          `${API_URL}/api/saved-places`,
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
          "Failed to load saved places."
        );
      }


      setPlaces(
        Array.isArray(data.places)
          ? data.places
          : []
      );


    } catch (err) {

      console.error(
        "Saved places error:",
        err
      );

      setError(
        err.message ||
        "Unable to load saved places."
      );

    } finally {

      setLoading(false);

    }
  };


  /* =========================================
     LOAD WHEN PAGE OPENS
  ========================================= */

  useEffect(() => {

    loadSavedPlaces();

  }, []);


  /* =========================================
     LOADING
  ========================================= */

  if (loading) {

    return (
      <div className="page-inner">

        <div className="saved-heading">

          <div className="saved-icon">
            <Heart size={21} />
          </div>

          <div>
            <span>SAVED</span>

            <h1>
              Saved Places
            </h1>

            <p>
              Loading your favorite destinations...
            </p>
          </div>

        </div>


        <div className="saved-empty">

          <Heart size={40} />

          <h2>
            Loading...
          </h2>

          <p>
            Please wait while we load your saved places.
          </p>

        </div>

      </div>
    );
  }


  /* =========================================
     ERROR
  ========================================= */

  if (error) {

    return (
      <div className="page-inner">

        <div className="saved-heading">

          <div className="saved-icon">
            <Heart size={21} />
          </div>

          <div>
            <span>SAVED</span>

            <h1>
              Saved Places
            </h1>

            <p>
              Your favorite destinations in one place.
            </p>
          </div>

        </div>


        <div className="saved-empty">

          <Heart size={40} />

          <h2>
            {error}
          </h2>

          <p>
            Login and try again to view your saved places.
          </p>

        </div>

      </div>
    );
  }


  /* =========================================
     EMPTY
  ========================================= */

  if (places.length === 0) {

    return (
      <div className="page-inner">

        <div className="saved-heading">

          <div className="saved-icon">
            <Heart size={21} />
          </div>

          <div>

            <span>SAVED</span>

            <h1>
              Saved Places
            </h1>

            <p>
              Your favorite destinations in one place.
            </p>

          </div>

        </div>


        <div className="saved-empty">

          <div className="saved-empty-icon">
            <Heart size={42} />
          </div>

          <h2>
            No Saved Places Yet
          </h2>

          <p>
            Explore India and save your favorite
            destinations using the heart button.
          </p>

        </div>

      </div>
    );
  }


  /* =========================================
     SAVED PLACES
  ========================================= */

  return (

    <div className="page-inner">

      {/* =====================================
          HEADER
      ===================================== */}

      <div className="saved-heading">

        <div className="saved-icon">

          <Heart
            size={21}
            fill="currentColor"
          />

        </div>


        <div>

          <span>
            SAVED
          </span>

          <h1>
            Saved Places
          </h1>

          <p>
            Your favorite destinations in one place.
          </p>

        </div>

      </div>


      {/* =====================================
          COUNT
      ===================================== */}

      <div className="saved-count">

        <MapPin size={16} />

        <span>
          {places.length}{" "}
          {places.length === 1
            ? "place"
            : "places"}{" "}
          saved
        </span>

      </div>


      {/* =====================================
          PLACES
      ===================================== */}

      <div className="places-grid">

        {places.map((place) => (

          <PlaceCard
            key={place.id}
            place={place}
          />

        ))}

      </div>

    </div>
  );
}


export default SavedPlaces;