import { ArrowUpRight } from 'lucide-react';

import './DestinationCard.css';

function DestinationCard({ destination }) {
  return (
    <div className="destination-card">
      <img
        src={destination.image}
        alt={destination.name}
      />

      <div className="destination-overlay">
        <div>
          <h3>{destination.name}</h3>
          <p>{destination.state}</p>
        </div>

        <div className="destination-arrow">
          <ArrowUpRight size={16} />
        </div>
      </div>
    </div>
  );
}

export default DestinationCard;