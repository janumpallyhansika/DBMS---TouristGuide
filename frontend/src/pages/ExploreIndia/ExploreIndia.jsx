import { useEffect, useMemo, useState } from "react";
import { Search, MapPin } from "lucide-react";

import StateCard from "../../components/StateCard/StateCard";
import PlaceCard from "../../components/PlaceCard/PlaceCard";

import "./ExploreIndia.css";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000";

function ExploreIndia() {
  const [states, setStates] = useState([]);
  const [places, setPlaces] = useState([]);

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =====================================================
  // GET DATA FROM BACKEND
  // =====================================================

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError("");

        // -----------------------------
        // GET STATES
        // -----------------------------

        const statesResponse = await fetch(
          `${API_URL}/api/states`
        );

        if (!statesResponse.ok) {
          throw new Error("Failed to load states");
        }

        const statesData = await statesResponse.json();

        // -----------------------------
        // GET DESTINATIONS
        // -----------------------------

        const destinationsResponse = await fetch(
          `${API_URL}/api/destinations`
        );

        if (!destinationsResponse.ok) {
          throw new Error("Failed to load destinations");
        }

        const destinationsData =
          await destinationsResponse.json();

        // -----------------------------
        // SAVE DATA
        // -----------------------------

        setStates(statesData.states || []);

        setPlaces(
          destinationsData.destinations || []
        );

        console.log(
          "States loaded:",
          statesData.states
        );

        console.log(
          "Destinations loaded:",
          destinationsData.destinations
        );
      } catch (error) {
        console.error(
          "Explore India error:",
          error
        );

        setError(
          "Unable to load destinations. Make sure the backend is running."
        );
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // =====================================================
  // SEARCH DESTINATIONS
  // =====================================================

  const filteredPlaces = useMemo(() => {
    const text = search.trim().toLowerCase();

    if (!text) {
      return places;
    }

    return places.filter((place) => {
      const name = String(
        place.name || ""
      ).toLowerCase();

      const city = String(
        place.city || ""
      ).toLowerCase();

      const category = String(
        place.category || ""
      ).toLowerCase();

      const state = String(
        place.state_name || ""
      ).toLowerCase();

      return (
        name.includes(text) ||
        city.includes(text) ||
        category.includes(text) ||
        state.includes(text)
      );
    });
  }, [places, search]);

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="explore-page">
        <div className="explore-loading">
          <div className="loading-spinner"></div>

          <h2>
            Loading destinations...
          </h2>

          <p>
            Finding places and their images.
          </p>
        </div>
      </div>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error) {
    return (
      <div className="explore-page">
        <div className="explore-error">
          <MapPin size={40} />

          <h2>
            Something went wrong
          </h2>

          <p>
            {error}
          </p>
        </div>
      </div>
    );
  }

  // =====================================================
  // MAIN PAGE
  // =====================================================

  return (
    <div className="explore-page">

      {/* =================================================
          HEADER
          ================================================= */}

      <div className="explore-header">

        <div>
          <h1>
            Explore India
          </h1>

          <p>
            Discover amazing destinations
            across India
          </p>
        </div>

        {/* SEARCH */}

        <div className="explore-search">

          <Search size={20} />

          <input
            type="text"
            placeholder="Search destinations, cities..."
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
          />

        </div>

      </div>

      {/* =================================================
          STATES
          ================================================= */}

      <section className="explore-section">

        <div className="section-heading">

          <div>

            <h2>
              Explore by State
            </h2>

            <p>
              Discover destinations from
              different parts of India
            </p>

          </div>

        </div>

        <div className="states-grid">

          {states.map((state) => (
            <StateCard
              key={state.id}
              state={{
                ...state,
                image:
                  state.image_url ||
                  state.image ||
                  "",
              }}
            />
          ))}

        </div>

      </section>

      {/* =================================================
          DESTINATIONS
          ================================================= */}

      <section className="explore-section">

        <div className="section-heading">

          <div>

            <h2>
              Popular Destinations
            </h2>

            <p>
              Explore places worth visiting
              across India
            </p>

          </div>

          <span className="destination-count">
            {filteredPlaces.length} places
          </span>

        </div>

        {/* DESTINATION GRID */}

        {filteredPlaces.length > 0 ? (

          <div className="places-grid">

            {filteredPlaces.map((place) => (
              <PlaceCard
                key={place.id}
                place={{
                  ...place,
                  image:
                    place.image_url ||
                    place.image ||
                    "",
                }}
              />
            ))}

          </div>

        ) : (

          <div className="no-results">

            <Search size={40} />

            <h3>
              No destinations found
            </h3>

            <p>
              Try searching for another
              destination or city.
            </p>

          </div>

        )}

      </section>

    </div>
  );
}

export default ExploreIndia;