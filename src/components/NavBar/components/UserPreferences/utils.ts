import { Itinerary } from "../../../../types";

export const updateItineraryTimings = (data: Itinerary[], directions: any[]) => {
  return data.map((day: Itinerary, index: number) => {
    let previousDepartureTime: number | null = null;

    const updatedItinerary = day.itinerary.map((poi, idx) => {
      const travelTime: number =
        (directions[index].directions[idx].routes[0].legs[0].duration?.value ??
          0) / 60;

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
