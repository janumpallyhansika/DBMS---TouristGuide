export const createGoogleMapsUrl = ({
  source,
  destination
}) => {
  const origin = encodeURIComponent(source);
  const destinationPlace = encodeURIComponent(destination);

  return `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destinationPlace}&travelmode=driving`;
};

export const createMultiStopGoogleMapsUrl = ({
  source,
  destinations
}) => {
  if (!destinations || destinations.length === 0) {
    return null;
  }

  const origin = encodeURIComponent(source);

  const destination = encodeURIComponent(
    destinations[destinations.length - 1]
  );

  const waypoints = destinations
    .slice(0, -1)
    .map((place) => encodeURIComponent(place))
    .join('|');

  let url =
    `https://www.google.com/maps/dir/?api=1` +
    `&origin=${origin}` +
    `&destination=${destination}` +
    `&travelmode=driving`;

  if (waypoints) {
    url += `&waypoints=${waypoints}`;
  }

  return url;
};