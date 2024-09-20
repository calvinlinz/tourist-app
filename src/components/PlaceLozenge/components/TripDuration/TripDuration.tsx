import React, { useContext, useEffect } from "react";
import styles from "./TripDuration.module.css";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import DirectionsWalkingIcon from "@mui/icons-material/DirectionsWalk";
import DirectionsBusIcon from "@mui/icons-material/DirectionsBus";
import DirectionsCyclingIcon from "@mui/icons-material/DirectionsBike";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { ItineraryContext } from "../../../../context/ItineraryContext";
import TripDurationDropDown from "./TripDurationDropDown/TripDurationDropDown";

interface TripDurationProps {
  index: number;
  hideIcon?: boolean;
}

export const iconStyle = {
  height: 15,
  width: 15,
};

export const travelModeMapping = {
  DRIVING: (
    <DirectionsCarIcon color="action" fontSize="small" style={iconStyle} />
  ),
  WALKING: (
    <DirectionsWalkingIcon
      color="action"
      fontSize="small"
      style={iconStyle}
    />
  ),
  TRANSIT: (
    <DirectionsBusIcon color="action" fontSize="small" style={iconStyle} />
  ),
  BICYCLING: (
    <DirectionsCyclingIcon
      color="action"
      fontSize="small"
      style={iconStyle}
    />
  ),
};

const TripDuration = ({ index, hideIcon }: TripDurationProps) => {
  const {
    selectedDay,
    setSwapDirections,
    currentSwapDirectionsOptions,
    setCurrentTrip,
    currentItinerary,
    setCurrentRoute,
  } = useContext(ItineraryContext);
  const [dropDownOpen, setDropDownOpen] = React.useState(false);
  const directions = currentItinerary[selectedDay].itinerary[index].directions;

  useEffect(() => {
    if (currentSwapDirectionsOptions.length === 0) {
      setDropDownOpen(false);
    }
  }, [currentSwapDirectionsOptions]);

  if (!directions) return null;

  const handleDropDown = () => {
    if (!dropDownOpen) {
      setSwapDirections(index);
      const currentTripDay = currentItinerary[selectedDay].itinerary;
      setCurrentTrip({
        origin: currentTripDay[index - 1],
        destination: currentTripDay[index],
      });
    } else {
      setSwapDirections(null);
    }
    setDropDownOpen(!dropDownOpen);
  };

  return (
    <div className={styles.travelMode}>
      <div className={styles.travelModeContent}>
        {!hideIcon && <MoreVertIcon color="action" fontSize="small" />}
        <div className={styles.content}>
          <div className={styles.contentLeft}>
            {travelModeMapping[directions.request.travelMode]}
            <span>{directions.routes[0].legs[0].duration?.text}</span>
            <span>{directions.routes[0].legs[0].distance?.text}</span>
            <ExpandMoreIcon
              style={{ ...iconStyle, cursor: "pointer" }}
              sx={{
                transform: dropDownOpen ? "scale(-1)" : "scale(1)",
                transition: ".5s",
              }}
              onClick={handleDropDown}
            />
          </div>
        </div>
      </div>
      <TripDurationDropDown
        index={index}
        open={dropDownOpen}
        handleClose={handleDropDown}
      />
    </div>
  );
};

export default TripDuration;
