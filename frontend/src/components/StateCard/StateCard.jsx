import { MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";

import stateImages from "../../data/stateImages";

import "./StateCard.css";

function StateCard({ state }) {
  const navigate = useNavigate();

  const image =
    state.image_url ||
    state.image ||
    stateImages[state.name] ||
    "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1000&q=80";

  const placeCount =
    state.places ??
    state.destination_count ??
    state.places_count ??
    0;

  const openState = () => {
    navigate(`/state/${state.id}`);
  };

  return (
    <div
      className="state-card"
      onClick={openState}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "Enter") {
          openState();
        }
      }}
    >
      <img
        src={image}
        alt={state.name}
        onError={(event) => {
          event.currentTarget.src =
            "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1000&q=80";
        }}
      />

      <div className="state-card-content">
        <h3>{state.name}</h3>

        <span>
          <MapPin size={12} />

          {placeCount > 0
            ? `${placeCount} places`
            : "Explore places"}
        </span>
      </div>
    </div>
  );
}

export default StateCard;