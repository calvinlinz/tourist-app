import { Link } from "react-router-dom";
import styles from "./NavBar.module.css";
import { useItineraryContext } from "../../context/ItineraryContext";
import TravelExploreIcon from "@mui/icons-material/TravelExplore";
export default function NavBar() {
  const { setSwapPOI, setCurrentSwapDirectionsOptions, setSwapDirections } =
    useItineraryContext();

  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <div className={styles.leftContent}>
          <Link
            to="/"
            onClick={() => {
              setCurrentSwapDirectionsOptions([]);
              setSwapPOI(null);
              setSwapDirections(null);
            }}
            reloadDocument={true}
          >
            <div className={styles.link}>
              <TravelExploreIcon fontSize="large" />
              <span>Trip Planner</span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
