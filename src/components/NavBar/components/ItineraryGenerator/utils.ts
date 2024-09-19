import { Itinerary } from "../../../../types";

export const updateItineraryTimings = (data: Itinerary[]) => {
  return data.map((day: Itinerary, index: number) => {
    let previousDepartureTime: number | null = null;
    const updatedItinerary = day.itinerary.map((poi, idx) => {
      const travelTime: number =
        (poi.directions?.routes[0].legs[0].duration?.value ?? 0) / 60;

      const arrivalTime: number =
        idx === 0
          ? Number(poi.arrival)
          : Number(previousDepartureTime) + Number(travelTime);

      const departureTime: number =
        Number(arrivalTime) + Number(poi.time_spent);

      previousDepartureTime = departureTime;

      return {
        ...poi,
        arrival: arrivalTime.toFixed(0),
        leave: departureTime.toFixed(0),
        travel_time: travelTime.toFixed(0),
      };
    });
    return {
      day: day.day,
      itinerary: updatedItinerary,
    };
  });
};

export const getGooglePlaceLocality = (
  place: google.maps.places.PlaceResult
) => {
  const locality = place.address_components?.find((component) =>
    component.types.includes("locality")
  );
  if (!locality) {
    return (
      place.address_components?.find((component) =>
        component.types.includes("administrative_area_level_1")
      )?.long_name ?? ""
    );
  }
  return locality?.long_name ?? "";
};

export const getUserPreferencesParams = (
  categories: string[],
  price: number
) => {
  return `${
    categories.length > 0
      ? `&categories=${encodeURIComponent(categories.join(","))}`
      : ""
  }${price ? `&max_price=${encodeURIComponent(price)}` : ""}`;
};
