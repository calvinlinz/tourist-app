import styles from "./CurrentTripLozenge.module.css";
import { useContext } from "react";
import { ItineraryContext } from "../../../context/ItineraryContext";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import HomeIcon from "@mui/icons-material/Home";

export default function CurrentTripLozenge() {
  const { currentItinerary, home, currentTrip } = useContext(ItineraryContext);
  if (currentItinerary.length === 0) return null;
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.poi}>
          <div className={styles.icon}>
            <div className={`${styles.tag} ${styles.tagOrigin}`}>
              {currentItinerary[0].itinerary[0].name ===
              currentTrip?.origin.name ? (
                <HomeIcon sx={{ width: 12.5, height: 12.5 }} />
              ) : (
                currentTrip?.origin.order
              )}
            </div>
          </div>
          <div className={styles.location}>
            <span className={styles.name}>
              {currentItinerary[0].itinerary[0].name ===
              currentTrip?.origin.name
                ? home
                : currentTrip?.origin.name}
            </span>
            <a>Previous Location</a>
          </div>
        </div>
        <div className={styles.middle}>
          <div className={styles.icon}>
            <ArrowForwardIcon fontSize={"small"} />
          </div>
        </div>
        <div className={styles.poi}>
          <div className={styles.icon}>
            <div className={`${styles.tag} ${styles.tagDestination}`}>
              {currentItinerary[0].itinerary[0].name ===
              currentTrip?.destination.name ? (
                <HomeIcon sx={{ width: 12.5, height: 12.5 }} />
              ) : (
                currentTrip?.destination.order
              )}{" "}
            </div>
          </div>
          <div className={styles.location}>
            <span className={styles.name}>{currentTrip?.destination.name}</span>
            <a>Selected Location</a>
          </div>
        </div>
      </div>
    </div>
  );
}
