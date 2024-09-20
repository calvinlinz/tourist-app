import { useContext, useEffect, useMemo, useRef, useState } from "react";
import {
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { POI, TravelMode } from "../../../../types";
import PlaceLozenge from "../../../PlaceLozenge/PlaceLozenge";
import styles from "./DraggableList.module.css";
import { ItineraryContext } from "../../../../context/ItineraryContext";
import ConfirmationBox from "../../../ItineraryBox/ConfirmationBox/ConfirmationBox";
import { toast } from "react-toastify";
import TripDuration from "../../../PlaceLozenge/components/TripDuration/TripDuration";
import ReactLoading from "react-loading";
import React from "react";
import { getLatLngObject } from "../../../Map/Directions/utils";
import { updateItineraryTimings } from "../ItineraryGenerator/utils";

interface DraggableListProps {
  itinerary: POI[];
}

const DraggableList = (props: DraggableListProps) => {
  const {
    currentItinerary,
    setCurrentItinerary,
    setCurrentTrip,
    currentTrip,
    selectedDay,
    currentSwapDirectionsOptions,
    setCurrentSwapDirectionsOptions,
    directionsService,
    selectedTravel,
  } = useContext(ItineraryContext);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const placeLozengeRefs = useRef<React.RefObject<HTMLDivElement>[]>(
    currentItinerary[selectedDay].itinerary.map(() => React.createRef())
  );

  useEffect(() => {
    const currentTripDestinationOrder = currentItinerary[
      selectedDay
    ].itinerary.findIndex((item) => item.id === currentTrip?.destination.id);

    if (
      currentTripDestinationOrder !== undefined &&
      placeLozengeRefs.current[currentTripDestinationOrder] !== undefined
    ) {
      placeLozengeRefs.current[
        currentTripDestinationOrder
      ]?.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "nearest",
      });
    }
  }, [currentTrip]);

  const [openConfirmation, setOpenConfirmation] = useState<POI | null>(null);
  const handleConfirmation = (openConfirmation: POI | null) => {
    if (!openConfirmation) {
      setOpenConfirmation(null);
      return;
    }

    const indexOfPOI = currentItinerary[selectedDay].itinerary.findIndex(
      (poi) => poi.name === openConfirmation.name
    );
    const newCurrentSwapDirectionsOptions = currentSwapDirectionsOptions.filter(
      (option) => option.index !== indexOfPOI
    );

    const newItinerary = currentItinerary.map((item) => {
      if (item.day === selectedDay) {
        const deletedItinerary = item.itinerary.filter(
          (poi: POI) => poi.name !== openConfirmation?.name
        );
        const deletedAndReorderedItinerary = deletedItinerary.map((poi: POI) =>
          poi.order > openConfirmation.order
            ? { ...poi, order: poi.order - 1 }
            : poi
        );

        return { ...item, itinerary: deletedAndReorderedItinerary };
      }
      return item;
    });

    const deletedPOI = newItinerary[selectedDay].itinerary.find(
      (poi: POI) => poi.name === openConfirmation?.name
    );
    const nextPOI = newItinerary[selectedDay].itinerary.find(
      (poi: POI) => poi.order === openConfirmation.order
    );
    if (deletedPOI === undefined && currentTrip && nextPOI && indexOfPOI) {
      setCurrentItinerary(newItinerary);
      setCurrentTrip({
        origin: currentTrip.origin,
        destination: nextPOI,
      });
      setOpenConfirmation(null);
      toast.success(
        "Successfully deleted " + openConfirmation?.name + " from the itinerary"
      );
      setCurrentSwapDirectionsOptions(newCurrentSwapDirectionsOptions);
    } else {
      setOpenConfirmation(null);
      toast.success(
        "Failed to delete " + openConfirmation?.name + " from the itinerary"
      );
    }
  };

  const getDirections = async (
    origin: POI,
    destination: POI,
    travelMode: TravelMode = selectedTravel
  ): Promise<google.maps.DirectionsResult> => {
    try {
      const result = await directionsService?.route({
        origin: getLatLngObject(origin),
        destination: getLatLngObject(destination),
        travelMode,
      });
      if (!result) throw Error("No result");
      return result;
    } catch (error) {
      throw error;
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const storedItinerary = currentItinerary;
      const storedCurrentSwapDirectionsOptions = currentSwapDirectionsOptions;
      const storedCurrentTrip = currentTrip;
      try {
        const oldIndex = props.itinerary.findIndex(
          (item) => item.id === active.id
        );
        const newIndex = props.itinerary.findIndex(
          (item) => item.id === over.id
        );
        const itinerary = arrayMove(props.itinerary, oldIndex, newIndex);
        const newFullItinerary = currentItinerary?.map((item) =>
          item.day === selectedDay
            ? {
                ...item,
                itinerary,
              }
            : item
        );

        const previousDayLengths = currentItinerary
          .slice(0, selectedDay)
          .map((item) => item.itinerary.length)
          .reduce((acc, curr) => acc + curr, 0);

        const reorderedItinerary = newFullItinerary?.map((item) =>
          item.day === selectedDay
            ? {
                ...item,
                itinerary: itinerary.map((poi, index) => ({
                  ...poi,
                  order: previousDayLengths + index,
                })),
              }
            : item
        );

        const reorderedItinerarySelectedDay = reorderedItinerary[selectedDay];
        const newOrigin = reorderedItinerarySelectedDay?.itinerary.find(
          (poi) => poi.order === currentTrip?.origin.order
        );
        const newDestination = reorderedItinerarySelectedDay?.itinerary.find(
          (poi) => poi.order === currentTrip?.destination.order
        );

        setCurrentItinerary(reorderedItinerary);
        if (newOrigin && newDestination) {
          setCurrentTrip({
            origin: newOrigin,
            destination: newDestination,
          });
        }
        const updatedDirectionsItinerary = await Promise.all(
          reorderedItinerary?.map(async (dayDirections) =>
            dayDirections.day === selectedDay
              ? {
                  ...dayDirections,
                  itinerary: await Promise.all(
                    dayDirections.itinerary.map(async (poi: POI, idx: number) =>
                      idx === oldIndex || idx === newIndex
                        ? {
                            ...poi,
                            directions: await getDirections(
                              reorderedItinerarySelectedDay.itinerary[idx - 1],
                              reorderedItinerarySelectedDay.itinerary[idx]
                            ),
                          }
                        : poi
                    )
                  ),
                }
              : dayDirections
          )
        );
        setCurrentSwapDirectionsOptions([]);
        setCurrentItinerary(updateItineraryTimings(updatedDirectionsItinerary));
      } catch (error) {
        toast.error("Failed to reorder itinerary");
        setCurrentItinerary(storedItinerary);
        setCurrentSwapDirectionsOptions(storedCurrentSwapDirectionsOptions);
        setCurrentTrip(storedCurrentTrip);
      }
    }
  };

  const updateCurrentTrip = (poi: POI) => {
    if (selectedDay !== undefined) {
      const nextPOI = poi.order - 1;
      const origin = currentItinerary[selectedDay].itinerary.find(
        (poi) => poi.order === nextPOI
      );
      if (
        poi.name === currentTrip?.destination.name &&
        origin?.name === currentTrip?.origin.name
      ) {
        return;
      } else if (origin) {
        setCurrentTrip({
          origin: origin,
          destination: poi,
        });
      } else {
        console.log("failed");
      }
    }
  };

  const isLoading =
    currentItinerary.length === 0 ||
    !currentItinerary[selectedDay].itinerary[0].directions;

  return (
    <>
      {isLoading ? (
        <div className={styles.loading}>
          <ReactLoading
            type={"bubbles"}
            color={"#20CCFF"}
            height={"20%"}
            width={"20%"}
          />
        </div>
      ) : (
        <div className={styles.container}>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            modifiers={[restrictToVerticalAxis]}
          >
            <SortableContext
              items={props.itinerary}
              strategy={verticalListSortingStrategy}
            >
              {props.itinerary.map((poi, idx) => (
                <React.Fragment key={poi.id}>
                  {idx !== 0 && (
                    <div className={styles.tripDurationWrapper}>
                      <TripDuration index={idx} />
                    </div>
                  )}
                  <PlaceLozenge
                    poi={poi}
                    onClick={() => updateCurrentTrip(poi)}
                    setOpenCancelConfirmation={setOpenConfirmation}
                    componentRef={placeLozengeRefs.current[idx]}
                  />
                </React.Fragment>
              ))}
            </SortableContext>
          </DndContext>
          <ConfirmationBox
            open={openConfirmation}
            handleClose={handleConfirmation}
          />
        </div>
      )}
    </>
  );
};

export default DraggableList;
