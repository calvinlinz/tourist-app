import { useContext, useMemo } from "react";
import {
  useMapsLibrary,
  Map,
  useMap,
  AdvancedMarker,
  Pin,
} from "@vis.gl/react-google-maps";
import HomeIcon from "@mui/icons-material/Home";

import styles from "./Markers.module.css";
import { ItineraryContext } from "../../../context/ItineraryContext";
import { toast } from "react-toastify";
import { getLatLngObject } from "../Directions/utils";

export default function Markers() {
  const {
    setCurrentTrip,
    currentItinerary,
    selectedDay,
    setSelectedDay,
    currentTrip,
  } = useContext(ItineraryContext);

  const pinClickHandler = (poi: any) => {
    const currentDay = currentItinerary[selectedDay].itinerary;
    const newPOIIsInCurrentDay = currentDay.some(
      (p: any) => p?.order === poi?.order
    );

    if (poi.order === 0) {
      const newCurrentTrip = {
        origin: currentDay[currentDay.length - 2],
        destination: currentDay[currentDay.length - 1],
      };
      setCurrentTrip(newCurrentTrip);
      return;
    }

    const day = currentItinerary.find((day: any) =>
      day.itinerary.some((p: any) => p?.order === poi?.order)
    );

    if (!day) return;

    const origin =
      poi.category === "-"
        ? day.itinerary[day.itinerary.length - 2]
        : day.itinerary.find((p: any) => p?.order === poi?.order - 1);

    const destination =
      poi.category === "-" ? day.itinerary[day.itinerary.length - 1] : poi;
    if (!origin || !destination) return;

    const newCurrentTrip = {
      origin,
      destination,
    };
    if (!newPOIIsInCurrentDay) {
      toast.info("Changed to Day " + (day.day + 1));
      setSelectedDay(day.day);
    }
    setCurrentTrip(newCurrentTrip);
  };

  const home = currentItinerary[0].itinerary[0];

  return (
    <>
      {currentItinerary[selectedDay].itinerary
        .filter((poi: any) => poi.name !== home.name)
        .map((poi: any, idx: number) => (
          <AdvancedMarker
            key={idx}
            position={getLatLngObject(poi)}
            onClick={() => pinClickHandler(poi)}
          >
            <Pin
              background={
                poi.order === currentTrip?.destination?.order
                  ? "#EA4335"
                  : "#22ccff"
              }
              borderColor={"#FFFFFF"}
              scale={1.4}
            >
              <span className={styles.marker}>{idx + 1}</span>
            </Pin>
          </AdvancedMarker>
        ))}
      <AdvancedMarker
        key={home.id}
        position={getLatLngObject(home)}
        onClick={() => pinClickHandler(home)}
      >
        <Pin background={"#4185F4"} borderColor={"#FFFFFF"} scale={1.5}>
          <HomeIcon fontSize="medium" htmlColor="#FFFFFF" />
        </Pin>
      </AdvancedMarker>
    </>
  );
}
