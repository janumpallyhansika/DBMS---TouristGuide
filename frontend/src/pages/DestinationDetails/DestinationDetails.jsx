import { useEffect, useState } from "react";

import {
  ArrowLeft,
  MapPin,
  Clock,
  CalendarDays,
  Map,
  Plus,
  Loader2,
} from "lucide-react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import "./DestinationDetails.css";


function DestinationDetails() {

  const navigate = useNavigate();

  const { destinationId } = useParams();

  const [destination, setDestination] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  // =====================================================
  // LOAD DESTINATION
  // =====================================================

  useEffect(() => {

    const loadDestination = async () => {

      try {

        setLoading(true);

        setError("");


        console.log(
          "Loading destination:",
          destinationId
        );


        const response = await fetch(
          `http://localhost:5000/api/destinations/${destinationId}`
        );


        const data =
          await response.json();


        console.log(
          "Destination API:",
          data
        );


        if (
          !response.ok ||
          !data.success
        ) {

          throw new Error(
            data.message ||
            "Unable to load destination"
          );

        }


        setDestination(
          data.destination
        );


      } catch (err) {

        console.error(
          "Destination loading error:",
          err
        );


        setError(
          err.message ||
          "Unable to load destination"
        );


      } finally {

        setLoading(false);

      }

    };


    if (destinationId) {

      loadDestination();

    }

  }, [destinationId]);


  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {

    return (

      <div className="destination-loading">

        <Loader2
          className="loading-icon"
          size={32}
        />

        <p>
          Loading destination...
        </p>

      </div>

    );

  }


  // =====================================================
  // ERROR
  // =====================================================

  if (
    error ||
    !destination
  ) {

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
            Destination not found
          </h2>


          <p>
            {error ||
              "The requested destination could not be found."}
          </p>

        </div>

      </div>

    );

  }


  // =====================================================
  // IMAGE
  // =====================================================

  const image =
    destination.image_url ||
    "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1600&q=80";


  // =====================================================
  // GOOGLE MAPS URL
  // =====================================================

  const googleMapsUrl =
    destination.latitude &&
    destination.longitude
      ? `https://www.google.com/maps/search/?api=1&query=${destination.latitude},${destination.longitude}`
      : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
          `${destination.name}, ${destination.city || ""}, ${
            destination.state_name || ""
          }, India`
        )}`;


  // =====================================================
  // PAGE
  // =====================================================

  return (

    <div className="page-inner destination-details-page">


      {/* =================================================
          BACK BUTTON
      ================================================= */}

      <button
        className="back-button"
        onClick={() =>
          navigate(-1)
        }
      >

        <ArrowLeft size={16} />

        Back

      </button>


      {/* =================================================
          HERO
      ================================================= */}

      <div
        className="destination-hero"
        style={{
          backgroundImage: `
            linear-gradient(
              90deg,
              rgba(5,10,20,.94),
              rgba(5,10,20,.40)
            ),
            url("${image}")
          `,
        }}
      >

        <div className="destination-hero-content">


          <span className="destination-category">

            {destination.category ||
              "Tourist Destination"}

          </span>


          <h1>
            {destination.name}
          </h1>


          <p className="destination-location">

            <MapPin size={17} />

            {destination.city ||
              "India"}

            {destination.state_name
              ? `, ${destination.state_name}`
              : ""}

          </p>


        </div>

      </div>


      {/* =================================================
          CONTENT GRID
      ================================================= */}

      <div className="destination-content-grid">


        {/* =================================================
            MAIN CONTENT
        ================================================= */}

        <div className="destination-main">


          {/* =================================================
              ABOUT
          ================================================= */}

          <section className="destination-section">

            <h2>
              About {destination.name}
            </h2>


            <p>

              {destination.description ||
                `Explore ${destination.name}, one of the notable tourist destinations in India.`}

            </p>

          </section>


          {/* =================================================
              QUICK INFORMATION
          ================================================= */}

          <section className="destination-section">

            <h2>
              Quick Information
            </h2>


            <div className="destination-info-grid">


              {/* Location */}

              <div className="destination-info-card">

                <MapPin size={20} />

                <div>

                  <span>
                    Location
                  </span>


                  <strong>

                    {destination.city ||
                      "India"}

                    {destination.state_name
                      ? `, ${destination.state_name}`
                      : ""}

                  </strong>

                </div>

              </div>


              {/* Visit Duration */}

              <div className="destination-info-card">

                <Clock size={20} />

                <div>

                  <span>
                    Estimated Visit
                  </span>


                  <strong>

                    {destination.estimated_hours
                      ? `${destination.estimated_hours} hours`
                      : "Not specified"}

                  </strong>

                </div>

              </div>


              {/* Best Time */}

              <div className="destination-info-card">

                <CalendarDays size={20} />

                <div>

                  <span>
                    Best Time
                  </span>


                  <strong>

                    {destination.best_time ||
                      "Throughout the year"}

                  </strong>

                </div>

              </div>


              {/* Coordinates */}

              <div className="destination-info-card">

                <Map size={20} />

                <div>

                  <span>
                    Coordinates
                  </span>


                  <strong>

                    {destination.latitude != null
                      ? destination.latitude
                      : "N/A"}

                    {destination.longitude != null
                      ? `, ${destination.longitude}`
                      : ""}

                  </strong>

                </div>

              </div>


            </div>

          </section>


          {/* =================================================
              GOOGLE MAPS
          ================================================= */}

          <section className="destination-section">

            <h2>
              Location
            </h2>


            <div className="destination-map-card">


              <div className="map-placeholder">

                <Map size={34} />


                <h3>
                  {destination.name}
                </h3>


                <p>

                  View this destination
                  on Google Maps.

                </p>


                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="maps-button"
                >

                  <Map size={17} />

                  View on Google Maps

                </a>

              </div>


            </div>

          </section>


        </div>


        {/* =================================================
            RIGHT SIDEBAR
        ================================================= */}

        <aside className="destination-sidebar">


          <div className="destination-action-card">


            <h3>
              Plan Your Visit
            </h3>


            <p>

              Add {destination.name}
              to your personalized
              IndiaGuide trip.

            </p>


            <button
              className="destination-add-button"
              onClick={() =>
                navigate("/plan-trip")
              }
            >

              <Plus size={18} />

              Add to My Trip

            </button>


          </div>


        </aside>


      </div>

    </div>

  );

}


export default DestinationDetails;