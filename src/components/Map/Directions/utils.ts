import { Itinerary, POI, TravelMode } from "../../../types";

export const directionsRendererOptions = {
  suppressMarkers: true,
  preserveViewport: true,
  // polylineOptions: {
  //   icons: [
  //     {
  //       icon: {
  //         path: 3, // google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
  //         fillColor: "#A60E0D",
  //         fillOpacity: 1,
  //         scale: 5,
  //         strokeColor: "#EA4335",
  //         strokeOpacity: 1,
  //         strokeWeight: 2,
  //       },
  //     },
  //   ],
  //   strokeColor: "#86B9FF",
  //   strokeOpacity: 1,
  //   strokeWeight: 5,
  // },
};

export const getLatLngObject = (poi: POI) => {
  return {
    lat: poi.latitude,
    lng: poi.longitude,
  };
};

export const removeLastTripFromLocalStorage = () => {
  const localTrips = localStorage.getItem("trips");
  const trips = localTrips ? JSON.parse(localTrips) : [];
  trips.pop();
  console.log("Remove last")
  localStorage.setItem("trips", JSON.stringify(trips));
};

export const getAllDirections = (
  directionsService: google.maps.DirectionsService,
  fullItinerary: Itinerary[],
  travelMode: TravelMode
) => {
  const startingLocation = fullItinerary[0].itinerary[0];
  return fullItinerary.map((dayItinerary, dayIndex) => {
    const waypoints = dayItinerary.itinerary.map((poi) => ({
      location: getLatLngObject(poi),
    }));

    return directionsService
      .route({
        origin: getLatLngObject(startingLocation),
        destination: getLatLngObject(startingLocation),
        waypoints: waypoints,
        travelMode: travelMode,
      })
      .then((response: any) => {
        const directions = response.routes[0].legs.map((leg: any) => {
          let singleLegResponse = JSON.parse(JSON.stringify(response));
          singleLegResponse.routes[0].legs = [leg];
          return singleLegResponse;
        });
        return {
          day: dayIndex,
          directions: directions,
        };
      })
      .catch((e: any) => {
        return {
          day: dayIndex,
          directions: [],
        };
      });
  });
};

export const generateCompleteItinerary = (
  directionsService: google.maps.DirectionsService,
  currentItinerary: Itinerary[],
  selectedTravel: TravelMode
) => {
  if (!directionsService) return;
  const directionsPromises = getAllDirections(
    directionsService,
    currentItinerary,
    selectedTravel
  );
  Promise.all(directionsPromises).then((results) => {
    if (results[0].directions.length === 0) {
      return [];
    } else {
      return results;
    }
  });
};


