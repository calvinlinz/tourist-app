import React, { useContext } from "react";
import styles from "./TripDurationDropDownItem.module.css";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import DirectionsWalkingIcon from "@mui/icons-material/DirectionsWalk";
import DirectionsBusIcon from "@mui/icons-material/DirectionsBus";
import DirectionsCyclingIcon from "@mui/icons-material/DirectionsBike";
import { iconStyle } from "../../TripDuration";
import { toast } from "react-toastify";
import { ItineraryContext } from "../../../../../../context/ItineraryContext";
import { updateItineraryTimings } from "../../../../../NavBar/components/ItineraryGenerator/utils";

interface TripDurationDropDownItemProps {
  directions: google.maps.DirectionsResult;
  index: number;
  handleClose: () => void;
}

const TripDurationDropDownItem = ({
  directions,
  handleClose,
  index,
}: TripDurationDropDownItemProps) => {
  const {
    selectedDay,
    currentSwapDirectionsOptions,
    setCurrentSwapDirectionsOptions,
    setCurrentItinerary,
    currentItinerary,
  } = useContext(ItineraryContext);
  const travelMode = directions.request.travelMode;
  const travelModeMapping = {
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

  const handleSwapDirections = () => {
    const newCurrentItinerary = currentItinerary?.map((dayDirections) => {
      if (dayDirections.day === selectedDay) {
        return {
          day: selectedDay,
          itinerary: dayDirections.itinerary.map((poi, idx) => {
            if (index === idx) {
              console.log("changing directions");
              return {
                ...poi,
                directions: directions,
              };
            }
            return poi;
          }),
        };
      }
      return dayDirections;
    });

    if (!newCurrentItinerary) {
      toast.error("Failed to change directions");
      return;
    }
    setCurrentItinerary(updateItineraryTimings(newCurrentItinerary));
    const newDirectionOptions = currentSwapDirectionsOptions.filter(
      (option) => option.index !== index
    );
    setCurrentSwapDirectionsOptions(newDirectionOptions);
    toast.success("Successfully Changed Directions");
    handleClose();
  };

  return directions.routes.length > 0 ? (
    <div className={styles.container} onClick={handleSwapDirections}>
      <div className={styles.placeholder}></div>
      {travelModeMapping[travelMode]}
      <span>{directions.routes[0].legs[0].duration?.text}</span>
      <span>{directions.routes[0].legs[0].distance?.text}</span>
    </div>
  ) : null;
};

export default TripDurationDropDownItem;
