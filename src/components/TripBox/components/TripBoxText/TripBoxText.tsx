import { Itinerary, POI } from "../../../../types";
import DotDivider from "../DotDivider/DotDivider";
import styles from "./TripBoxText.module.css";

export default function TripBoxText(itinerary: Itinerary[]) {
  const getNumberOfPlaces = () => {
    return itinerary
      .filter((itinerary) =>
        itinerary.itinerary.filter((poi: POI) => poi.category !== "-")
      )
      .map((itinerary) => itinerary.itinerary.length)
      .reduce((acc, curr) => acc + curr, 0);
  };

  return (
    <div className={styles.text}>
      <span>18 Mar - 20 Mar</span>
      <DotDivider />
      <span>{getNumberOfPlaces()}</span>
    </div>
  );
}
