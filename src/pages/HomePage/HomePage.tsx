import styles from "./HomePage.module.css";
import Slider from "../../components/Slider/Slider";
import { useEffect, useRef, useState } from "react";
import React from "react";
import { ItineraryContext } from "../../context/ItineraryContext";
import {
  convertJSONTripToTripObject,
  deleteTripFromLocalStorage,
  getAllSlides,
  getGroupNames,
  getTripsFromLocalStorage,
  setTripsToLocalStorage,
  updateTripGroupToLocalStorage,
} from "../../utils";
import { SavedTrip, Slide, SlideType } from "../../types";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import NavBar from "../../components/NavBar/NavBar";
import {
  ItineraryGenerator,
  setInitialTrip,
} from "../../components/NavBar/components/ItineraryGenerator/ItineraryGenerator";
import UndoIcon from "@mui/icons-material/Undo";
import Loading from "react-loading";
import { UserPreferences } from "../../components/NavBar/components/UserPreferences/UserPreferences";

const HomePage = () => {
  const parentRef = useRef<HTMLDivElement>(null);
  const childRef = useRef<HTMLDivElement>(null);
  const [slides, setSlides] = useState<SlideType[]>([]);
  const [isSameWidth, setIsSameWidth] = useState(false);
  const [slidesHeader, setSlidesHeader] = useState<string>("Saved Trips");

  const categoryRef = React.useRef<string[]>([]);
  const priceRef = React.useRef<number>(0);
  const dayLengthRef = React.useRef<string>("afternoon");

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const {
    setCurrentItinerary,
    setCurrentTrip,
    setSelectedDay,
    setHome,
    setCurrentItineraryName,
    setDates,
    setCurrentSavedItineraryIndex,
    setCurrentItineraryLocation,
  } = React.useContext(ItineraryContext);

  const renameEvent = (name: string, index: number) => {
    const trips = getTripsFromLocalStorage();
    const newTrips = trips.map((trip, idx) => ({
      ...trip,
      name: idx === index ? name : trip.name,
    }));
    setTripsToLocalStorage(newTrips);

    if (slidesHeader === "Saved Trips") {
      setSlides(fetchCompleteSlideData());
    } else {
      const allIndividualSlides = getAllSlides(
        deleteEvent,
        clickEvent,
        optionsEvent,
        renameEvent
      );
      const groups = getGroupSlides(
        allIndividualSlides,
        setSlides,
        setSlidesHeader
      );
      const groupName = trips[index].groupName;
      const currentGroup = groups.find((group) => group.name === groupName);
      if (currentGroup) {
        setSlides(currentGroup.children);
      } else {
        setSlides(fetchCompleteSlideData());
      }
    }
  };

  const clickEvent = (index: number) => {
    const localTrips = localStorage.getItem("trips");
    const trips: SavedTrip[] = localTrips ? JSON.parse(localTrips) : [];
    if (!localTrips) {
      setSlides([]);
      setSlidesHeader("Saved Trips");
      return;
    }
    const clickedTrip = trips[index];
    if ("trip" in clickedTrip) {
      const trip = clickedTrip;
      setCurrentItinerary(convertJSONTripToTripObject(trip.trip));
      setInitialTrip(trip.trip, setCurrentTrip);
      setSelectedDay(0);
      setHome(trip.home);
      setDates(trip.dates.map((date: any) => new Date(date)));
      setCurrentItineraryName(trip.name);
      setCurrentItineraryLocation(trip.location);
      setCurrentSavedItineraryIndex(index);
      navigate("/itinerary");
      toast.info("Trip loaded successfully");
    }
  };

  const optionsEvent = (groupName: string, tripIndex: number) => {
    updateTripGroupToLocalStorage(groupName, tripIndex);
    const allIndividualSlides = getAllSlides(
      deleteEvent,
      clickEvent,
      optionsEvent,
      renameEvent
    );

    const nonGroupedSlides = allIndividualSlides
      .filter((slide, idx) => !slide.trip.groupName)
      .reverse();

    const groups = getGroupSlides(
      allIndividualSlides,
      setSlides,
      setSlidesHeader
    );
    setSlides([...groups, ...nonGroupedSlides]);
    setSlidesHeader("Saved Trips");
  };

  const deleteEvent = (index: number) => {
    const deletedTrip = deleteTripFromLocalStorage(index);
    const allIndividualSlides = getAllSlides(
      deleteEvent,
      clickEvent,
      optionsEvent,
      renameEvent
    );

    const nonGroupedSlides = allIndividualSlides
      .filter((slide, idx) => !slide.trip.groupName)
      .reverse();

    const groups = getGroupSlides(
      allIndividualSlides,
      setSlides,
      setSlidesHeader
    );

    if ("trip" in deletedTrip) {
      const groupName = deletedTrip.groupName;
      if (groupName) {
        const group = groups.find((group) => group.name === groupName);
        if (group && group?.children.length > 0) {
          setSlides(group.children);
          setSlidesHeader(group.name);
        } else {
          setSlidesHeader("Saved Trips");
          setSlides([...groups, ...nonGroupedSlides]);
        }
      } else {
        setSlidesHeader("Saved Trips");
        setSlides([...groups, ...nonGroupedSlides]);
      }
    }
    toast.success("Deleted " + deletedTrip.name);
  };

  const getGroupSlides = (
    allIndividualSlidesWithEvents: Slide[],
    setSlides: (slides: SlideType[]) => void,
    setSlidesHeader: (header: string) => void
  ) =>
    getGroupNames().map((groupName: string) => ({
      name: groupName,
      children: allIndividualSlidesWithEvents.filter(
        (slide) => slide.trip.groupName === groupName
      ),
      clickEvent: () => {
        setSlides(
          allIndividualSlidesWithEvents.filter(
            (slide) => slide.trip.groupName === groupName
          )
        );
        setSlidesHeader(groupName);
      },
      renameEvent: (name: string) => {
        const tripsAfterRename = getTripsFromLocalStorage().map((trip) => ({
          ...trip,
          groupName: trip.groupName === groupName ? name : trip.groupName,
        }));
        setTripsToLocalStorage(tripsAfterRename);

        const updatedSlides = getAllSlides(
          deleteEvent,
          clickEvent,
          optionsEvent,
          renameEvent
        );
        const slidesNotInGroups = updatedSlides
          .filter((slide) => !slide.trip.groupName)
          .reverse();

        const groups = getGroupSlides(
          updatedSlides,
          setSlides,
          setSlidesHeader
        );
        setSlides([...groups, ...slidesNotInGroups]);
      },
    }));

  const fetchCompleteSlideData = () => {
    const allIndividualSlides = getAllSlides(
      deleteEvent,
      clickEvent,
      optionsEvent,
      renameEvent
    );

    const slidesNotInGroups = allIndividualSlides
      .filter((slide, idx) => !slide.trip.groupName)
      .reverse();

    const groups = getGroupSlides(
      allIndividualSlides,
      setSlides,
      setSlidesHeader
    );
    return [...groups, ...slidesNotInGroups];
  };

  useEffect(() => {
    setSlidesHeader("Saved Trips");
    setSlides(fetchCompleteSlideData());
  }, []);

  const checkWidths = () => {
    if (parentRef.current === null || childRef.current === null) return;
    const parentWidth = parentRef.current.offsetWidth;
    const childWidth = childRef.current.offsetWidth;
    if (parentWidth <= childWidth) {
      setIsSameWidth(true);
    } else {
      setIsSameWidth(false);
    }
  };

  useEffect(() => {
    checkWidths();
    window.addEventListener("resize", checkWidths);
    return () => {
      window.removeEventListener("resize", checkWidths);
    };
  }, [slides]);

  return (
    <div className={styles.container}>
      <NavBar />
      {!loading ? (
        <div className={styles.contentContainer} ref={parentRef}>
          <div className={styles.content} ref={childRef}>
            <div className={styles.text}>
              <h1>Welcome to Trip Planner</h1>
              <p style={{ padding: "5px 0 0 0" }}>
                We are proudly New Zealand owned. Please consider visiting the{" "}
                {""}
                <a
                  href="https://www.newzealand.com/nz/"
                  style={{ color: "blue" }}
                >
                  NZ tourism webpage
                </a>{" "}
                to learn more about travelling to New Zealand.
              </p>
            </div>

            <div className={styles.inputHeader}>
              <h2>Enter trip details</h2>
              <div className={styles.inputs}>
                <div className={styles.searchContent}>
                  <ItineraryGenerator
                    categoryRef={categoryRef}
                    priceRef={priceRef}
                    dayLengthRef={dayLengthRef}
                  />
                </div>
              </div>
            </div>
            <div className={styles.inputHeader}>
              <span>Optional user preferences</span>
              <UserPreferences
                categoryRef={categoryRef}
                priceRef={priceRef}
                dayLengthRef={dayLengthRef}
              />
            </div>

            {slides.length > 0 && (
              <>
                <div className={styles.savedItineraries}>
                  <div className={styles.savedItinerariesHeader}>
                    <h2>{slidesHeader}</h2>
                    {!("children" in slides[0]) &&
                      slidesHeader !== "Saved Trips" && (
                        <div
                          className={styles.backButton}
                          onClick={() => {
                            setSlides(fetchCompleteSlideData());
                            setSlidesHeader("Saved Trips");
                          }}
                        >
                          <UndoIcon className={styles.back}></UndoIcon>
                        </div>
                      )}
                  </div>
                </div>
                <div className={styles.trips}>
                  <Slider slides={slides} showButtons={isSameWidth} />
                </div>
              </>
            )}
          </div>
        </div>
      ) : (
        <div className={styles.loading}>
          <Loading type="spin" color="#20CCFF" width="50px" height="50px" />
        </div>
      )}
    </div>
  );
};

export default HomePage;
