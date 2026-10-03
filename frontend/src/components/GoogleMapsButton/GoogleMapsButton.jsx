import { Navigation } from 'lucide-react';
import './GoogleMapsButton.css';

function GoogleMapsButton({
  origin,
  places = [],
  destination,
}) {
  const openGoogleMaps = () => {
    if (!places.length) {
      alert('No places available for this trip.');
      return;
    }

    const finalDestination =
      destination || places[places.length - 1];

    const waypoints = destination
      ? places
      : places.slice(0, -1);

    const params = new URLSearchParams();

    params.set('api', '1');

    params.set(
      'origin',
      origin || places[0]
    );

    params.set(
      'destination',
      finalDestination
    );

    params.set(
      'travelmode',
      'driving'
    );

    if (waypoints.length > 0) {
      params.set(
        'waypoints',
        waypoints.join('|')
      );
    }

    const googleMapsUrl =
      `https://www.google.com/maps/dir/?${params.toString()}`;

    window.open(
      googleMapsUrl,
      '_blank',
      'noopener,noreferrer'
    );
  };

  return (
    <button
      className="google-maps-button"
      onClick={openGoogleMaps}
      disabled={!places.length}
    >
      <Navigation size={17} />

      <span>
        Open Complete Trip in Google Maps
      </span>
    </button>
  );
}

export default GoogleMapsButton;