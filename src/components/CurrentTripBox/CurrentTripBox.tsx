import React, { useContext, useEffect, useMemo, useState, useRef } from "react";
import styles from "./CurrentTripBox.module.css";
import { ItineraryContext } from "../../context/ItineraryContext";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import DaysPicker from "../ItineraryBox/components/DayPicker/DaysPicker";
import { IconButton } from "@mui/material";

export default function CurrentTripBox() {
  const {
    currentItinerary,
    selectedDay,
    dates,
    currentItineraryLocation,
    setCurrentTrip,
    currentTrip,
  } = useContext(ItineraryContext);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(-1);
  const animationRef = useRef<number | null>(null);
  const currentPOIIndex = useRef<number>(0);

  const animationHandler = () => {
    setIsPlaying((prev) => !prev);
  };
  useEffect(() => {
    if (isPlaying) {
      if (
        currentPOIIndex.current >=
        currentItinerary[selectedDay].itinerary.length - 1
      ) {
        currentPOIIndex.current = 0;
        setCurrentTime(
          Number(currentItinerary[selectedDay].itinerary[0].leave)
        );
      }
      if (currentTime === -1) {
        setCurrentTime(
          Number(currentItinerary[selectedDay].itinerary[0].leave)
        );
      }
      updateAnimation();
    } else if (animationRef.current !== null) {
      cancelAnimationFrame(animationRef.current);
    }
  }, [isPlaying]);

  const updateAnimation = () => {
    setCurrentTime((prevTime) => {
      const newTime = prevTime + 1;
      const currentPOI =
        currentItinerary[selectedDay].itinerary[currentPOIIndex.current];
      const nextPOI =
        currentItinerary[selectedDay].itinerary[currentPOIIndex.current + 1];

      if (nextPOI && newTime >= Number(nextPOI.arrival)) {
        currentPOIIndex.current++;
        setCurrentTrip({
          origin: currentPOI,
          destination: nextPOI,
        });
      }

      if (
        currentPOIIndex.current >=
        currentItinerary[selectedDay].itinerary.length - 1
      ) {
        setCurrentTime((prev) =>
          Number(
            currentItinerary[selectedDay].itinerary[
              currentItinerary[selectedDay].itinerary.length - 1
            ].arrival
          )
        );
        setIsPlaying(false);
        return prevTime;
      }

      return newTime;
    });

    animationRef.current = requestAnimationFrame(updateAnimation);
  };

  useEffect(() => {
    if (!isPlaying) {
      setCurrentTime(-1);
      currentPOIIndex.current = 0;
    }
  }, [currentTrip]);

  const formatTime = (minutes: number) => {
    if (minutes === -1) return "";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${" "} - ${hours.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.dateHeader}>
          <div className={styles.title}>
            <h1>
              {currentItineraryLocation ? currentItineraryLocation : "Unnamed"}
            </h1>
          </div>
          <div className={styles.date}>
            <DaysPicker />
          </div>
        </div>
        <div className={styles.dateHeader}>
          <div className={styles.metric}>
            <h3 className={styles.timeLabel} onClick={animationHandler}>
              {isPlaying ? "Pause Timelapse" : "Play Timelapse"}{" "}
            </h3>
            <h3 className={styles.time}>{formatTime(currentTime)}</h3>
          </div>
          <h3>
            Day {selectedDay + 1} - {dates[selectedDay]?.toDateString()}
          </h3>
        </div>
      </div>
    </div>
  );
}
