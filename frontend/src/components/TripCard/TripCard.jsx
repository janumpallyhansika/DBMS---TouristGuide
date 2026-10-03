import {
  CalendarDays,
  MapPin,
} from 'lucide-react';

import { useNavigate } from 'react-router-dom';

import './TripCard.css';

function TripCard({ trip }) {
  const navigate = useNavigate();

  return (
    <div className="trip-card">
      <img src={trip.image} alt={trip.destination} />

      <div className="trip-card-body">
        <span className="trip-status">
          {trip.status}
        </span>

        <h3>{trip.destination}</h3>

        <div className="trip-info">
          <span>
            <CalendarDays size={13} />
            {trip.days} Days
          </span>

          <span>
            <MapPin size={13} />
            {trip.places} Places
          </span>
        </div>

        <button
          className="secondary-button trip-view"
          onClick={() => navigate(`/trip/${trip.id}`)}
        >
          View Trip
        </button>
      </div>
    </div>
  );
}

export default TripCard;