import styles from "./ItineraryBox.module.css";
import DaysPicker from "./components/DayPicker/DaysPicker";
import { ItineraryContext } from "../../context/ItineraryContext";
import { useContext, useMemo, useState } from "react";
import DraggableList from "../NavBar/components/DraggableList/DraggableList";

export default function ItineraryBox() {
  const {
    currentItinerary,
    selectedDay,
  } = useContext(ItineraryContext);

  return (
    <div className={styles.container}>
      <div className={styles.scrollable}>
        {currentItinerary.some(
          (itinerary) => itinerary.day === selectedDay
        ) && (
          <DraggableList
            itinerary={currentItinerary[selectedDay]?.itinerary}
          />
        )}
      </div>
    </div>
  );
}
