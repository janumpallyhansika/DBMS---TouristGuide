import { useEffect } from "react";

import {
  APIProvider,
  Map,
  useMap,
  useMapsLibrary,
} from "@vis.gl/react-google-maps";

import "./TripMap.css";


// ==================================================
// DEFAULT INDIA CENTER
// ==================================================

const INDIA_CENTER = {
  lat: 20.5937,
  lng: 78.9629,
};


// ==================================================
// CLEAN LOCATION
// ==================================================

const normalizeLocation = (location) => {
  if (!location) {
    return "";
  }

  const value = String(location).trim();

  if (!value) {
    return "";
  }

  if (/,\s*india\s*$/i.test(value)) {
    return value;
  }

  return `${value}, India`;
};


// ==================================================
// ROUTE DISPLAY
// ==================================================

function RouteDisplay({
  startingLocation,
  destination,
  waypoints = [],
  onRouteInfo,
}) {
  const map = useMap();

  const routesLibrary =
    useMapsLibrary("routes");


  useEffect(() => {
    if (!map || !routesLibrary) {
      return;
    }


    let directionsService = null;
    let directionsRenderer = null;

    let cancelled = false;


    // ==================================================
    // CALCULATE ROUTE
    // ==================================================

    const calculateRoute = async () => {
      try {

        const cleanOrigin =
          normalizeLocation(
            startingLocation
          );

        const cleanDestination =
          normalizeLocation(
            destination
          );


        const cleanWaypoints =
          (waypoints || [])
            .map((place) =>
              normalizeLocation(place)
            )
            .filter(Boolean);


        console.log(
          "================================="
        );

        console.log(
          "GOOGLE MAPS ROUTE"
        );

        console.log(
          "Origin:",
          cleanOrigin
        );

        console.log(
          "Waypoints:",
          cleanWaypoints
        );

        console.log(
          "Destination:",
          cleanDestination
        );

        console.log(
          "================================="
        );


        // ==================================================
        // VALIDATION
        // ==================================================

        if (
          !cleanOrigin ||
          !cleanDestination
        ) {
          console.error(
            "Google Maps: origin or destination missing."
          );

          return;
        }


        // ==================================================
        // CREATE DIRECTIONS SERVICE
        // ==================================================

        directionsService =
          new routesLibrary.DirectionsService();


        directionsRenderer =
          new routesLibrary.DirectionsRenderer({
            map,
            suppressMarkers: false,
            preserveViewport: false,
            polylineOptions: {
              strokeColor: "#6366f1",
              strokeWeight: 5,
              strokeOpacity: 0.85,
            },
          });


        // ==================================================
        // CREATE WAYPOINTS
        // ==================================================

        const googleWaypoints =
          cleanWaypoints
            .filter(
              (place) =>
                place.toLowerCase() !==
                  cleanOrigin.toLowerCase() &&
                place.toLowerCase() !==
                  cleanDestination.toLowerCase()
            )
            .map((place) => ({
              location: place,
              stopover: true,
            }));


        // ==================================================
        // REQUEST ROUTE
        // ==================================================

        directionsService.route(
          {
            origin: cleanOrigin,

            destination:
              cleanDestination,

            waypoints:
              googleWaypoints,

            travelMode:
              "DRIVING",

            optimizeWaypoints:
              false,

            provideRouteAlternatives:
              false,
          },

          (result, status) => {

            if (cancelled) {
              return;
            }


            console.log(
              "Google Directions status:",
              status
            );


            // ==================================================
            // ROUTE FAILED
            // ==================================================

            if (
              status !== "OK" ||
              !result ||
              !result.routes ||
              result.routes.length === 0
            ) {

              console.warn(
                "Google Maps could not create a driving route."
              );

              console.warn(
                "This can happen when destinations are separated by sea or when Google does not support a continuous driving route."
              );


              if (onRouteInfo) {
                onRouteInfo({
                  distance:
                    "Route unavailable",

                  duration:
                    "Route unavailable",
                });
              }


              return;
            }


            // ==================================================
            // DISPLAY ROUTE
            // ==================================================

            directionsRenderer.setDirections(
              result
            );


            const route =
              result.routes[0];


            // ==================================================
            // CALCULATE TOTAL DISTANCE
            // ==================================================

            let totalDistanceMeters =
              0;


            // ==================================================
            // CALCULATE TOTAL TIME
            // ==================================================

            let totalDurationSeconds =
              0;


            if (
              route.legs &&
              route.legs.length > 0
            ) {

              route.legs.forEach(
                (leg) => {

                  if (
                    leg.distance &&
                    typeof leg.distance.value ===
                      "number"
                  ) {

                    totalDistanceMeters +=
                      leg.distance.value;
                  }


                  if (
                    leg.duration &&
                    typeof leg.duration.value ===
                      "number"
                  ) {

                    totalDurationSeconds +=
                      leg.duration.value;
                  }

                }
              );

            }


            // ==================================================
            // FORMAT DISTANCE
            // ==================================================

            let distanceText =
              "N/A";


            if (
              totalDistanceMeters > 0
            ) {

              const kilometers =
                totalDistanceMeters /
                1000;


              if (
                kilometers >= 1000
              ) {

                distanceText =
                  `${(
                    kilometers / 1000
                  ).toFixed(1)} thousand km`;

              } else {

                distanceText =
                  `${kilometers.toFixed(
                    1
                  )} km`;

              }

            }


            // ==================================================
            // FORMAT DURATION
            // ==================================================

            let durationText =
              "N/A";


            if (
              totalDurationSeconds > 0
            ) {

              const totalMinutes =
                Math.round(
                  totalDurationSeconds /
                    60
                );


              const hours =
                Math.floor(
                  totalMinutes / 60
                );


              const minutes =
                totalMinutes % 60;


              if (hours > 0) {

                durationText =
                  `${hours}h ${minutes}m`;

              } else {

                durationText =
                  `${minutes}m`;

              }

            }


            // ==================================================
            // SEND ROUTE INFO TO TRIP RESULT
            // ==================================================

            if (onRouteInfo) {

              onRouteInfo({
                distance:
                  distanceText,

                duration:
                  durationText,
              });

            }


            console.log(
              "================================="
            );

            console.log(
              "GOOGLE ROUTE CREATED"
            );

            console.log(
              "Distance:",
              distanceText
            );

            console.log(
              "Duration:",
              durationText
            );

            console.log(
              "Legs:",
              route.legs?.length || 0
            );

            console.log(
              "================================="
            );

          }
        );

      } catch (error) {

        console.error(
          "Google Maps route error:",
          error
        );


        if (onRouteInfo) {

          onRouteInfo({
            distance:
              "Route unavailable",

            duration:
              "Route unavailable",
          });

        }

      }
    };


    calculateRoute();


    // ==================================================
    // CLEANUP
    // ==================================================

    return () => {

      cancelled = true;


      if (directionsRenderer) {

        directionsRenderer.setMap(
          null
        );

      }

    };

  }, [
    map,
    routesLibrary,
    startingLocation,
    destination,
    JSON.stringify(waypoints),
  ]);


  return null;
}


// ==================================================
// TRIP MAP
// ==================================================

function TripMap({
  startingLocation,
  destination,
  waypoints = [],
  onRouteInfo,
}) {

  const apiKey =
    import.meta.env
      .VITE_GOOGLE_MAPS_API_KEY;


  // ==================================================
  // API KEY CHECK
  // ==================================================

  if (!apiKey) {

    return (
      <div className="trip-map-error">
        Google Maps API key is missing.
      </div>
    );

  }


  // ==================================================
  // GOOGLE MAP
  // ==================================================

  return (
    <div className="trip-map-container">

      <APIProvider
        apiKey={apiKey}
        libraries={["routes"]}
      >

        <Map
          defaultCenter={
            INDIA_CENTER
          }

          defaultZoom={5}

          mapId="DEMO_MAP_ID"

          gestureHandling="greedy"

          disableDefaultUI={false}

          mapTypeControl={true}

          fullscreenControl={true}

          streetViewControl={true}

          zoomControl={true}
        >

          <RouteDisplay
            startingLocation={
              startingLocation
            }

            destination={
              destination
            }

            waypoints={
              waypoints
            }

            onRouteInfo={
              onRouteInfo
            }
          />

        </Map>

      </APIProvider>

    </div>
  );
}


export default TripMap;