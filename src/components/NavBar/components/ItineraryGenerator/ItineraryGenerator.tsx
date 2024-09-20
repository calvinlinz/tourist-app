import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ItineraryContext } from "../../../../context/ItineraryContext";
import {
  generateTimeString,
  numberOfDays,
  getDaysArray,
} from "../../../../utils";
import { DaysField } from "../DaysField/DaysField";
import DividingLine from "../DividingLine/DividingLine";
import styles from "./ItineraryGenerator.module.css";
import SearchIcon from "@mui/icons-material/Search";
import { Itinerary, Trip } from "../../../../types";
import ReactLoading from "react-loading";
import { getAllDirections } from "../../../Map/Directions/utils";
import { getUserPreferencesParams } from "./utils";
import { GoogleAddressField } from "../GoogleAddressField/GoogleAddressField";
import useSetup from "../../../../hooks/useSetup";

export const setInitialTrip = (
  data: Itinerary[],
  setTrip: (trip: Trip) => void
) => {
  const origin = data[0].itinerary[0];
  const destination = data[0].itinerary[1];
  setTrip({
    origin,
    destination,
  });
};

const divingLineProps = {
  width: 1,
  height: 30,
  color: "rgb(177 177 177 / 20%)",
};

interface ItineraryGeneratorProps {
  categoryRef: React.MutableRefObject<string[]>;
  priceRef: React.MutableRefObject<number>;
  dayLengthRef: React.MutableRefObject<string>;
}

export const ItineraryGenerator = ({
  categoryRef,
  priceRef,
  dayLengthRef,
}: ItineraryGeneratorProps) => {
  const { directionsService, selectedTravel } =
    React.useContext(ItineraryContext);
  const navigate = useNavigate();
  const daysRef = React.useRef<any>();
  const [ready, setReady] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const googleAddressFieldInputRef = React.useRef<any>();
  const [place, setPlace] = useState<any>();
  const handleGeneration = useSetup();

  const imageButtonHandler = () => {
    const address_components = place?.address_components;
    setSearchLoading(true);
    if (!place.name || !daysRef.current) {
      toast.error("An error has occured");
      return;
    }
    if (address_components) {
      const isSpecific =
        address_components[0].types.includes("route") ||
        address_components[0].types.includes("street_number");
      if (!isSpecific) {
        fetch(
          `${
            process.env.REACT_APP_API_URL
          }hotels?lat=${place?.geometry?.location?.lat()}&lng=${place?.geometry?.location?.lng()}`
        )
          .then((response) => response.json())
          .then((hotels) => {
            navigate("/generate", {
              state: JSON.stringify({
                place,
                hotels,
                categories: categoryRef.current,
                prices: priceRef.current,
                days: daysRef.current,
                dayEnd: dayLengthRef.current,
              }),
            });
          })
          .catch((error) => {
            setSearchLoading(false);
          });
      } else {
        const formattedTimes = generateTimeString(
          numberOfDays(daysRef.current),
          dayLengthRef.current
        );
        fetch(
          `${process.env.REACT_APP_API_URL}itinerary?name=${
            place.name
          }&lat=${place?.geometry?.location?.lat()}&lng=${place?.geometry?.location?.lng()}&times=${formattedTimes}&travelMode=${selectedTravel}${getUserPreferencesParams(
            categoryRef.current,
            priceRef.current
          )}`
        )
          .then((response) => response.json())
          .then((data) => {
            for (const itinerary of data) {
              if (itinerary.itinerary.length < 3) {
                toast.error(
                  "Unable to generate an itinerary for these parameters"
                );
                setReady(false);
                setSearchLoading(false);
                return;
              }
            }
            if (directionsService) {
              Promise.all(
                getAllDirections(directionsService, data, selectedTravel)
              ).then((directions) => {
                const dates = getDaysArray(
                  daysRef.current[0],
                  daysRef.current[1]
                );
                if (
                  !handleGeneration({
                    directions,
                    place,
                    data,
                    dates,
                  })
                ) {
                  toast.error(
                    place.name +
                      " does not support " +
                      selectedTravel.toLowerCase() +
                      " directions"
                  );
                } else {
                  navigate("/itinerary");
                }
                setSearchLoading(false);
              });
            }
          })
          .catch((error) => {
            setSearchLoading(false);
          });
      }
    }
  };

  return (
    <div className={styles.content}>
      <div className={styles.fields}>
        <GoogleAddressField
          options={{
            fields: ["address_components", "name", "geometry"],
          }}
          onPlaceSelect={(place) => {
            if (!place?.geometry?.location) {
              return;
            }
            setPlace(place);
            if (daysRef.current && place?.name) {
              setReady(true);
            }
          }}
          inputRef={googleAddressFieldInputRef}
          placeholder="Enter a location"
          width="100%"
        />
        <DaysField
          onDaysSelect={(dates) => {
            if (!dates) {
              setReady(false);
              return;
            }
            daysRef.current = dates;
            if (daysRef.current && place?.name) {
              setReady(true);
            }
          }}
          onClean={() => {
            daysRef.current = undefined;
            setReady(false);
          }}
        />
      </div>
      <div className={`${styles.search} ${!ready ? styles.hide : ""}`}>
        <DividingLine {...divingLineProps} />
        {!searchLoading ? (
          <div className={styles.iconContainer}>
            <SearchIcon
              onClick={imageButtonHandler}
              style={{
                borderRadius: "10px",
                padding: "5px",
                cursor: "pointer",
                transition: "0.1s",
                background: "#FFFFFF",
              }}
              htmlColor={!ready ? "red" : "#44bb69"}
              width={"12px"}
              height={"12px"}
            />
          </div>
        ) : (
          <div className={styles.iconContainer}>
            <div className="loading">
              <ReactLoading
                type={"spin"}
                color={"#20CCFF"}
                width={"20px"}
                height={"20px"}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
