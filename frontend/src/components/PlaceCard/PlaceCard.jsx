import {
  MapPin,
  Heart,
  ArrowUpRight,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import "./PlaceCard.css";


const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000";


function PlaceCard({ place }) {

  const navigate = useNavigate();


  /* =========================================
     STATE
  ========================================= */

  const [imageError, setImageError] =
    useState(false);

  const [isSaved, setIsSaved] =
    useState(false);

  const [saving, setSaving] =
    useState(false);


  /* =========================================
     IMAGE
  ========================================= */

  const image =
    place?.image ||
    place?.image_url ||
    "";


  /* =========================================
     GET TOKEN
  ========================================= */

  const getToken = () => {
    return localStorage.getItem("token");
  };


  /* =========================================
     CHECK WHETHER PLACE IS SAVED
  ========================================= */

  useEffect(() => {

    const checkSavedStatus = async () => {

      if (!place?.id) {
        return;
      }


      const token =
        getToken();


      /*
        User may not be logged in.
        In that case we simply show
        the normal heart.
      */

      if (!token) {
        return;
      }


      try {

        const response =
          await fetch(
            `${API_URL}/api/saved-places/check/${place.id}`,
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


        if (
          response.ok &&
          data.success
        ) {

          setIsSaved(
            Boolean(data.saved)
          );
        }

      } catch (error) {

        console.error(
          "Check saved place error:",
          error
        );
      }
    };


    checkSavedStatus();

  }, [place?.id]);


  /* =========================================
     OPEN DESTINATION
  ========================================= */

  const openDestination = () => {

    if (place?.id) {

      navigate(
        `/destination/${place.id}`
      );

    }
  };


  /* =========================================
     TOGGLE SAVED PLACE
  ========================================= */

  const toggleSavedPlace = async (
    event
  ) => {

    /*
      Very important:
      Prevent the card itself from opening.
    */

    event.stopPropagation();


    if (!place?.id) {
      return;
    }


    const token =
      getToken();


    /* =======================================
       LOGIN CHECK
    ======================================= */

    if (!token) {

      alert(
        "Please login to save places."
      );

      return;
    }


    /* =======================================
       PREVENT DOUBLE CLICK
    ======================================= */

    if (saving) {
      return;
    }


    try {

      setSaving(true);


      /* =====================================
         REMOVE PLACE
      ===================================== */

      if (isSaved) {

        const response =
          await fetch(
            `${API_URL}/api/saved-places/${place.id}`,
            {
              method: "DELETE",

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
            "Unable to remove saved place."
          );
        }


        setIsSaved(false);


        return;
      }


      /* =====================================
         SAVE PLACE
      ===================================== */

      const response =
        await fetch(
          `${API_URL}/api/saved-places`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",

              Authorization:
                `Bearer ${token}`,
            },

            body: JSON.stringify({
              destinationId:
                Number(place.id),
            }),
          }
        );


      const data =
        await response.json();


      if (!response.ok) {

        throw new Error(
          data.message ||
          "Unable to save place."
        );
      }


      setIsSaved(true);


    } catch (error) {

      console.error(
        "Save place error:",
        error
      );


      alert(
        error.message ||
        "Unable to update saved place."
      );

    } finally {

      setSaving(false);
    }
  };


  /* =========================================
     RENDER
  ========================================= */

  return (

    <div
      className="place-card"
      onClick={openDestination}
    >

      {/* =====================================
          IMAGE
      ===================================== */}

      <div className="place-image-wrapper">

        {!imageError && image ? (

          <img
            src={image}
            alt={
              place?.name ||
              "Destination"
            }
            onError={() => {
              setImageError(true);
            }}
          />

        ) : (

          <div className="place-image-fallback">

            <MapPin size={38} />

            <span>
              India
            </span>

          </div>

        )}


        {/* ===================================
            SAVE HEART
        =================================== */}

        <button
          type="button"
          className={
            `place-heart ${
              isSaved
                ? "saved"
                : ""
            }`
          }
          onClick={toggleSavedPlace}
          disabled={saving}
          aria-label={
            isSaved
              ? "Remove from saved places"
              : "Save place"
          }
        >

          <Heart
            size={16}
            fill={
              isSaved
                ? "currentColor"
                : "none"
            }
          />

        </button>

      </div>


      {/* =====================================
          CONTENT
      ===================================== */}

      <div className="place-content">

        <div className="place-category">

          {place?.category ||
            "Destination"}

        </div>


        <h3>

          {place?.name ||
            "Unknown Place"}

        </h3>


        <p>

          <MapPin size={13} />

          {place?.city ||
            place?.state_name ||
            "India"}

        </p>


        <div className="place-bottom">

          <span>

            ★ {place?.rating ||
              "4.5"}

          </span>


          <button
            type="button"
            onClick={(event) => {

              event.stopPropagation();

              openDestination();

            }}
            aria-label="Open destination"
          >

            <ArrowUpRight
              size={15}
            />

          </button>

        </div>

      </div>

    </div>
  );
}


export default PlaceCard;