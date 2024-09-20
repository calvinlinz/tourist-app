import PlaceLozenge from "../PlaceLozenge/PlaceLozenge";
import styles from "./SwapBox.module.css";
import { ItineraryContext } from "../../context/ItineraryContext";
import { FC, useContext, useEffect, useMemo, useRef, useState } from "react";
import KeyboardReturnOutlinedIcon from "@mui/icons-material/KeyboardReturnOutlined";
import { POI, SuggestedPOI } from "../../types";
import RestaurantOutlinedIcon from "@mui/icons-material/RestaurantOutlined";
import LocalActivityOutlinedIcon from "@mui/icons-material/LocalActivityOutlined";
import HikingOutlinedIcon from "@mui/icons-material/HikingOutlined";
import SportsFootballOutlinedIcon from "@mui/icons-material/SportsFootballOutlined";
import LocalMallOutlinedIcon from "@mui/icons-material/LocalMallOutlined";
import Rating from "@mui/material/Rating";
import ConfirmationBox from "./ConfirmationBox/ConfirmationBox";
import { toast } from "react-toastify";

export default function SwapBox() {
  const {
    currentItinerary,
    swapPOI,
    setCurrentItinerary,
    setCurrentTrip,
    setSwapPOI,
    currentTrip,
    selectedDay,
    currentSwapDirectionsOptions,
    setCurrentSwapDirectionsOptions,
  } = useContext(ItineraryContext);

  const [openConfirmation, setOpenConfirmation] = useState<any>();
  const handleConfirmation = (confirm: SuggestedPOI | null) => {
    if (confirm) {
      const existingItinerary = currentItinerary;
      const newItinerary = existingItinerary.map((item) =>
        item.day === selectedDay
          ? {
              ...item,
              itinerary: item.itinerary.map((poi: POI) =>
                poi.name === swapPOI?.poi.name
                  ? {
                      ...poi,
                      name: confirm.name,
                      latitude: Number(confirm.latitude),
                      longitude: Number(confirm.longitude),
                      category: confirm.category,
                    }
                  : poi
              ),
            }
          : item
      );
      const newPOI = newItinerary[selectedDay].itinerary.find(
        (poi: POI) => poi.name === confirm.name
      );

      const indexOfPOI = currentItinerary[selectedDay].itinerary.findIndex(
        (poi) => poi.name === openConfirmation.name
      );
      const newCurrentSwapDirectionsOptions =
        currentSwapDirectionsOptions.filter(
          (option) => option.index !== indexOfPOI
        );

      if (newPOI && currentTrip) {
        setCurrentItinerary(newItinerary);
        setCurrentTrip({
          origin: currentTrip.origin,
          destination: newPOI,
        });
        setSwapPOI(null);
        setCurrentSwapDirectionsOptions(newCurrentSwapDirectionsOptions);
        toast.success(
          "Successfully swapped " + swapPOI?.poi.name + " with " + confirm.name
        );
      }
    } else {
      console.log("CANCELLED");
    }

    setOpenConfirmation(false);
  };
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          {swapPOI && (
            <>
              <span>
                Places nearby <strong>{swapPOI.poi.name}</strong>
              </span>
              <KeyboardReturnOutlinedIcon
                onClick={() => setSwapPOI(null)}
                style={{ cursor: "pointer" }}
              />
            </>
          )}
        </div>
      </div>
      <div className={styles.scrollable}>
        {swapPOI?.nearby
          .filter((poi) => poi.name !== swapPOI?.poi.name)
          .slice(0, 10)
          .map((poi: POI) => {
            return (
              <PlaceLozenge
                swapPOI={true}
                key={poi.name}
                poi={poi}
                componentRef={null}
                rightComponent={
                  <Rating
                    name="half-rating-read"
                    defaultValue={Number(poi?.normalized_popularity)}
                    precision={0.5}
                    readOnly
                    size="small"
                  />
                }
                onClick={() => {
                  setOpenConfirmation(poi);
                }}
              />
            );
          })}
      </div>
      <ConfirmationBox
        open={openConfirmation}
        handleClose={handleConfirmation}
      />
      <div className={styles.footer}></div>
    </div>
  );
}
