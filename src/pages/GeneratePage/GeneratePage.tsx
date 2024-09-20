import styles from "./GeneratePage.module.css";
import HotelSlider from "./components/Slider/Slider";
import { useEffect, useRef, useState } from "react";
import { useItineraryContext } from "../../context/ItineraryContext";
import { generateTimeString, getDaysArray, numberOfDays } from "../../utils";
import { POI, SlideType } from "../../types";
import { useLocation, useNavigate } from "react-router-dom";
import NavBar from "../../components/NavBar/NavBar";
import { getGooglePlaceLocality } from "../../components/NavBar/components/ItineraryGenerator/utils";
import useSetup from "../../hooks/useSetup";
import { toast } from "react-toastify";
import { getAllDirections } from "../../components/Map/Directions/utils";
import { Button } from "@mui/material";
import Loading from "react-loading";
import ReactLoading from "react-loading";

type HotelsState = {
  place: google.maps.places.PlaceResult;
  hotels: POI[];
  categories: string[];
  prices: string[];
  days: Date[];
  dayEnd: string;
};

const GeneratePage = () => {
  const parentRef = useRef<HTMLDivElement>(null);
  const childRef = useRef<HTMLDivElement>(null);
  const { directionsService, selectedTravel } = useItineraryContext();
  const [slides, setSlides] = useState<SlideType[]>([]);
  const [isSameWidth, setIsSameWidth] = useState(false);
  const navigate = useNavigate();
  const { state } = useLocation();
  const { place, hotels, categories, prices, days, dayEnd }: HotelsState =
    JSON.parse(state);

  console.log({ place, hotels, categories, prices, days, dayEnd });

  const [location, setLocation] = useState<any>(null);
  const tripLocality = getGooglePlaceLocality(place);
  const handleGeneration = useSetup();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!state) {
      navigate("/");
    }
  }, []);
  const checkWidths = () => {
    if (parentRef.current === null || childRef.current === null) return;
    const parentWidth = parentRef.current.offsetWidth;
    const childWidth = childRef.current.offsetWidth;
    if (parentWidth - 20 <= childWidth) {
      setIsSameWidth(true);
    } else {
      setIsSameWidth(false);
    }
  };

  useEffect(() => {
    setLocation({
      location: tripLocality,
      hotel: hotels[0],
    });

    checkWidths();
    window.addEventListener("resize", checkWidths);
    return () => {
      window.removeEventListener("resize", checkWidths);
    };
  }, [slides]);

  if (!tripLocality) {
    return null;
  }

  return (
    <div className={styles.container}>
      <NavBar />
      {loading ? (
        <div className={styles.loadingCenter}>
          <ReactLoading
            type={"bubbles"}
            color={"#20CCFF"}
            height={"100px"}
            width={"100px"}
          />
        </div>
      ) : (
        <div className={styles.contentContainer} ref={parentRef}>
          <div className={styles.content} ref={childRef}>
            <div className={styles.text}>
              <h1>
                Trip to {tripLocality}
                {" - "}
                {location?.hotel ? location.hotel.name : ""}
              </h1>
              <div className={styles.inputs}></div>
            </div>

            <>
              <div className={styles.inputHeader}>
                <h2>Please select a hotel to stay at</h2>
                <Button
                  variant="outlined"
                  size="medium"
                  onClick={() => {
                    setLoading(true);
                    const formattedTimes = generateTimeString(
                      numberOfDays(days),
                      dayEnd
                    );
                    fetch(
                      `${process.env.REACT_APP_API_URL}itinerary?name=${
                        place.name
                      }&lat=${place?.geometry?.location?.lat}&lng=${
                        place?.geometry?.location?.lng
                      }&times=${formattedTimes}&travelMode=${selectedTravel}${
                        categories.length > 0
                          ? `&categories=${encodeURIComponent(
                              categories.join(",")
                            )}`
                          : ""
                      }${
                        prices.length > 0
                          ? `&prices=${encodeURIComponent(prices.join(","))}`
                          : ""
                      }`
                    )
                      .then((response) => response.json())
                      .then((data) => {
                        for (const itinerary of data) {
                          if (itinerary.itinerary.length < 3) {
                            toast.error(
                              "Unable to generate an itinerary for this location"
                            );
                            navigate("/");
                            return;
                          }
                        }
                        if (directionsService) {
                          Promise.all(
                            getAllDirections(
                              directionsService,
                              data,
                              selectedTravel
                            )
                          ).then((directions) => {
                            const dates = getDaysArray(days[0], days[1]);
                            if (
                              !handleGeneration({
                                directions,
                                place,
                                data,
                                dates,
                                hotel: location.hotel,
                              })
                            ) {
                              toast.error(
                                place.name +
                                  " does not support " +
                                  selectedTravel.toLowerCase() +
                                  " directions"
                              );
                              setLoading(false);
                            } else {
                              navigate("/itinerary");
                            }
                          });
                        }
                      })
                      .catch((error) => {
                        setLoading(false);
                      });
                  }}
                >
                  Generate
                </Button>
              </div>
              <HotelSlider
                hotels={hotels}
                location={tripLocality}
                showButtons={isSameWidth}
                setLocation={setLocation}
              />
            </>
          </div>
        </div>
      )}
    </div>
  );
};

export default GeneratePage;
