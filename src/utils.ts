import { Itinerary, SavedTrip, Slide, SlideType } from "./types";

export const numberOfDays = (dates: Date[]) => {
  const startDate = dates[0] instanceof Date ? dates[0] : new Date(dates[0]);
  const endDate = dates[1] instanceof Date ? dates[1] : new Date(dates[1]);
  const millisecondsPerDay = 1000 * 60 * 60 * 24;
  const differenceInMilliseconds = endDate.getTime() - startDate.getTime();
  const numberOfDays = Math.ceil(differenceInMilliseconds / millisecondsPerDay);
  return numberOfDays + 1;
};

export const getDaysArray = function (s: Date, e: Date) {
  const a = [];
  for (const d = new Date(s); d <= new Date(e); d.setDate(d.getDate() + 1)) {
    a.push(new Date(d));
  }
  return a;
};

export const convertTravelTimeToMinutes = (travelTime: Number) => {
  return Math.ceil(Number(travelTime));
};

export function generateTimeString(
  numberOfDays: any,
  dayLength: string = "afternoon"
) {
  console.log(dayLength);
  let timeString = "";
  for (let i = 0; i < numberOfDays; i++) {
    if (i > 0) {
      timeString += ", ";
    }
    timeString += dayLength === "afternoon" ? "9:00-17:00" : "9:00-21:00";
  }
  return timeString;
}

export function distance(coords1: any, coords2: any) {
  const { lat: lat1, lng: lng1 } = coords1;
  const { lat: lat2, lng: lng2 } = coords2;
  const degToRad = (x: any) => (x * Math.PI) / 180;
  const R = 6371;
  const halfDLat = degToRad(lat2 - lat1) / 2;
  const halfDLon = degToRad(lng2 - lng1) / 2;
  const a =
    Math.sin(halfDLat) * Math.sin(halfDLat) +
    Math.cos(degToRad(lat1)) *
      Math.cos(degToRad(lat2)) *
      Math.sin(halfDLon) *
      Math.sin(halfDLon);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function getTripSubtitle(slide: SlideType) {
  if ("trip" in slide) {
    const trip = slide.trip;
    const days = numberOfDays([
      new Date(trip.dates[0]),
      new Date(trip.dates[trip.dates.length - 1]),
    ]);

    const datesText =
      new Date(trip.dates[0]).toLocaleDateString("short") +
      " - " +
      new Date(trip.dates[trip.dates.length - 1]).toLocaleDateString();
    // const daysText = days === 1 ? days + " day" : days + " days";

    const numberOfPlaces = trip.trip.reduce(
      (acc: any, day: any) => acc + day.itinerary.length,
      0
    );

    const numberOfPlacesText =
      numberOfPlaces === 1
        ? numberOfPlaces + " place"
        : numberOfPlaces + " places";
    return datesText + " • " + numberOfPlacesText;
  } else {
    if (slide.children) {
      return slide.children.map((child) => child.name).join(", ");
    }
  }
}

export const getAllSlideIndexsInGroups = (groupedSlides: any[]) => {
  return groupedSlides
    .map((group: { name: string; idxs: number[] }) => group.idxs)
    .reduce((acc: number[], idxs: any) => [...acc, ...idxs], []);
};

export const updateTripLocalStorage = (
  updatedItinerary: Itinerary[],
  index: number | undefined
) => {
  const trips = JSON.parse(localStorage.getItem("trips") || "[]");
  const newTrips = [...trips];

  if (index === undefined || updatedItinerary.length === 0) {
    return;
  }
  newTrips[index] = {
    ...newTrips[index],
    trip: updatedItinerary,
  };

  localStorage.setItem("trips", JSON.stringify(newTrips));
};

export const getGroupNames = (): string[] => {
  const localTrips = localStorage.getItem("trips");
  const trips = localTrips ? JSON.parse(localTrips) : [];
  if (!localTrips) {
    return [];
  }
  return Array.from(
    new Set(
      trips
        .map((trip: SavedTrip) => trip.groupName)
        .filter(
          (groupName: string | null): groupName is string =>
            groupName !== null && groupName !== undefined
        )
    )
  );
};

export const getSlidesFromTrips = (trips: SavedTrip[]): Slide[] =>
  trips.map((trip, idx) => ({
    trip: trip,
    name: trip.name,
    clickEvent: () => {
      console.log("not implemented");
    },
    deleteEvent: () => {
      console.log("not implemented");
    },
    optionsEvent: (groupName: string) => {
      console.log("not implemented");
    },
    renameEvent: (name: string) => {
      console.log("not implemented");
    },
  }));

export const getAllSlides = (
  deleteEvent: (idx: number) => void,
  clickEvent: (idx: number) => void,
  optionsEvent: (groupName: string, idx: number) => void,
  renameEvent: (name: string, idx: number) => void
) => {
  return getSlidesFromTrips(getTripsFromLocalStorage()).map((slide, idx) => ({
    ...slide,
    deleteEvent: () => deleteEvent(idx),
    clickEvent: () => clickEvent(idx),
    optionsEvent: (groupName: string) => optionsEvent(groupName, idx),
    renameEvent: (name: string) => renameEvent(name, idx),
  }));
};

export const setTripsToLocalStorage = (trips: SavedTrip[]) => {
  localStorage.setItem("trips", JSON.stringify(trips));
};

export const getTripsFromLocalStorage = (): SavedTrip[] => {
  const localTrips = localStorage.getItem("trips");
  if (!localTrips) {
    return [];
  }
  return JSON.parse(localTrips);
};

export const deleteTripFromLocalStorage = (index: number) => {
  const currentTrips = getTripsFromLocalStorage();
  const deletedTrips = [...currentTrips];
  const slideToBeRemoved = deletedTrips[index];
  deletedTrips.splice(index, 1);
  setTripsToLocalStorage(deletedTrips);
  return slideToBeRemoved;
};

export const updateTripGroupToLocalStorage = (
  groupName: string,
  index: number
) => {
  const trips = getTripsFromLocalStorage();
  const trip = trips[index];
  trip.groupName = groupName;
  trips[index] = trip;
  setTripsToLocalStorage(trips);
};

export const convertJSONTripToTripObject = (trip: any): Itinerary[] => {
  console.log(trip);
  return trip.map((day: Itinerary) => ({
    day: day.day,
    itinerary: day.itinerary.map((poi) => ({
      ...poi,
      directions: {
        ...poi.directions,
        routes: poi.directions?.routes?.map((route) => ({
          ...route,
          legs: route.legs.map((leg: any) => ({
            ...leg,
            start_location: new google.maps.LatLng(
              leg.start_location.lat,
              leg.start_location.lng
            ),
            end_location: new google.maps.LatLng(
              leg.end_location.lat,
              leg.end_location.lng
            ),
          })),
        })),
      },
    })),
  }));
};
