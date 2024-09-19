import React from "react";
import { removeLastTripFromLocalStorage } from "../components/Map/Directions/utils";
import { setInitialTrip } from "../components/NavBar/components/ItineraryGenerator/ItineraryGenerator";
import {
  updateItineraryTimings,
  getGooglePlaceLocality,
} from "../components/NavBar/components/ItineraryGenerator/utils";
import { getDaysArray } from "../utils";
import { ItineraryContext } from "../context/ItineraryContext";
import { Itinerary, POI } from "../types";

const useSetup = () => {
  const {
    setCurrentItinerary,
    setCurrentTrip,
    setSelectedDay,
    setHome,
    setCurrentItineraryName,
    setDates,
    setCurrentSavedItineraryIndex,
    setCurrentItineraryLocation,
  } = React.useContext(ItineraryContext);

  const handleGeneration = ({
    directions,
    place,
    data,
    dates,
    hotel,
  }: {
    directions: {
      day: number;
      directions: google.maps.DirectionsResult[];
    }[];
    place: google.maps.places.PlaceResult;
    data: Itinerary[];
    dates: Date[];
    hotel?: POI;
  }) => {
    if (directions[0].directions.length === 0) {
      removeLastTripFromLocalStorage();
      return false;
    } else {
      const dataWithDirections = data.map((day, dayIdx) => {
        return {
          ...day,
          itinerary: day.itinerary.map((poi, idx) => {
            return {
              ...poi,
              directions: directions[dayIdx].directions[idx],
            };
          }),
        };
      });
      setCurrentItinerary(updateItineraryTimings(dataWithDirections));
      setInitialTrip(dataWithDirections, setCurrentTrip);
      setSelectedDay(0);
      setHome(hotel?.name ?? place.name ?? "Home");
      const currentItineraryLocation = getGooglePlaceLocality(place);
      const currentItineraryName = "Trip to " + currentItineraryLocation;
      setCurrentItineraryName(currentItineraryName);
      setCurrentItineraryLocation(currentItineraryLocation);
      const trips = JSON.parse(localStorage.getItem("trips") || "[]");
      trips.push({
        name: currentItineraryName,
        location: currentItineraryLocation,
        trip: dataWithDirections,
        dates: dates,
        home: hotel?.name ?? place.name ?? "Home",
      });
      localStorage.setItem("trips", JSON.stringify(trips));
      setDates(dates);
      setCurrentSavedItineraryIndex(trips.length - 1);
      return true;
    }
  };
  return handleGeneration;
};

export default useSetup;
