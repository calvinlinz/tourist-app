import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import styles from "./TripDurationDropdown.module.css";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DrivingCarIcon from "@mui/icons-material/DirectionsCar";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { iconStyle } from "../TripDuration";
import { Divider } from "@mui/material";
import TripDurationDropDownItem from "./TripDurationDropDownItem/TripDurationDropDownItem";
import { ItineraryContext } from "../../../../../context/ItineraryContext";
import ReactLoading from "react-loading";

interface TripDurationDropDownProps {
  index: number;
  open: boolean;
  handleClose: () => void;
}

const TripDurationDropDown = ({
  index,
  open,
  handleClose,
}: TripDurationDropDownProps) => {
  const { currentSwapDirectionsOptions, swapDirections } =
    useContext(ItineraryContext);
  const [loading, setLoading] = useState(true);
  const currentDayDirectionOptions = currentSwapDirectionsOptions.find(
    (directions) => directions.index === index
  );
  const currentPOIOptions = currentDayDirectionOptions?.directions;

  useEffect(() => {
    if (!open) {
      setLoading(true);
      return;
    }
    if (currentPOIOptions) {
      setLoading(false);
    }
  }, [swapDirections, open,currentDayDirectionOptions]);

  return (
    <div
      className={`${styles.container} ${!open ? styles.containerClose : ""}`}
    >
      <Divider orientation="horizontal" />
      <div className={styles.items}>
        {loading ? (
          <div className={styles.loading}>
            <ReactLoading
              type={"bubbles"}
              color={"#20CCFF"}
              height={"20%"}
              width={"20%"}
            />
          </div>
        ) : (
          currentPOIOptions?.length !== undefined &&
          currentPOIOptions?.length > 0 &&
          currentPOIOptions
            ?.sort(
              (a, b) =>
                a.routes[0].legs[0].duration?.value ??
                0 - (b.routes[0].legs[0].duration?.value ?? 0)
            )
            .map((directions) => (
              <TripDurationDropDownItem
                index={index}
                directions={directions}
                handleClose={handleClose}
              />
            ))
        )}
      </div>
    </div>
  );
};

export default TripDurationDropDown;
