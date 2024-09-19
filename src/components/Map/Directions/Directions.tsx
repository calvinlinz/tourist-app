import { useState, useEffect, useContext } from "react";
import { POI, TravelMode, Trip } from "../../../types";
import { useMapsLibrary, useMap } from "@vis.gl/react-google-maps";
import { ItineraryContext } from "../../../context/ItineraryContext";
import { directionsRendererOptions, getLatLngObject } from "./utils";

export default function Directions() {
  const map = useMap();
  const routesLibrary = useMapsLibrary("routes");
  const [directionsRenderer, setDirectionsRenderer] =
    useState<google.maps.DirectionsRenderer>();
  const {
    currentTrip,
    currentItinerary,
    selectedDay,
    swapDirections,
    currentSwapDirectionsOptions,
    setCurrentSwapDirectionsOptions,
    setSwapDirections,
    directionsService,
    currentRoute,
  } = useContext(ItineraryContext);

  useEffect(() => {
    if (!routesLibrary || !map) return;
    const directionsRenderer = new routesLibrary.DirectionsRenderer({ map });
    directionsRenderer.setOptions(directionsRendererOptions);
    setDirectionsRenderer(directionsRenderer);
  }, [routesLibrary, map]);

  useEffect(() => {
    if (
      !directionsService ||
      !directionsRenderer ||
      !currentItinerary ||
      swapDirections === null
    )
      return;

    const startingLocation =
      currentItinerary[selectedDay].itinerary[swapDirections - 1];
    const destination = currentItinerary[selectedDay].itinerary[swapDirections];
    const currentTravelMode =
      currentItinerary[selectedDay].itinerary[swapDirections].directions
        ?.request.travelMode;

    const getTravelModeDirections = async () => {
      if (
        currentSwapDirectionsOptions.some(
          (directions) => directions.index === swapDirections
        )
      )
        return;

      const newDirections: google.maps.DirectionsResult[] = [];
      const travelModes = Object.values(TravelMode).filter(
        (travelMode) => travelMode !== currentTravelMode
      );

      for (const travelMode of travelModes) {
        const request = {
          origin: getLatLngObject(startingLocation),
          destination: getLatLngObject(destination),
          travelMode: travelMode,
        };
        await directionsService
          .route(request)
          .then((res) => {
            newDirections.push(res);
          })
          .catch((e: any) => {
            console.log(e);
          });
      }
      const currentDirections = currentSwapDirectionsOptions.filter(
        (directions) => directions.index !== swapDirections
      );

      currentDirections.push({
        index: swapDirections,
        directions: newDirections,
      });

      setCurrentSwapDirectionsOptions(currentDirections);
      setSwapDirections(null);
    };
    getTravelModeDirections();
  }, [swapDirections]);

  useEffect(() => {
    if (!currentRoute || !directionsRenderer) {
      return;
    }
    directionsRenderer.setDirections(currentRoute);
  }, [currentRoute]);

  useEffect(() => {
    if (
      !directionsRenderer ||
      !currentTrip ||
      !map ||
      !currentItinerary[selectedDay].itinerary[0].directions
    ) {
      return;
    }
    const indexOfDestination = currentItinerary[
      selectedDay
    ].itinerary.findIndex((poi) => poi.order === currentTrip.destination.order);

    const directions =
      currentItinerary[selectedDay]?.itinerary[indexOfDestination].directions;

    const startLocation = directions?.routes[0].legs[0].start_location;
    const endLocation = directions?.routes[0].legs[0].end_location;

    if (!startLocation || !endLocation) return;

    const bounds = new google.maps.LatLngBounds(
      new google.maps.LatLng(
        Math.min(startLocation.lat(), endLocation.lat()),
        Math.min(startLocation.lng(), endLocation.lng())
      ),
      new google.maps.LatLng(
        Math.max(startLocation.lat(), endLocation.lat()),
        Math.max(startLocation.lng(), endLocation.lng())
      )
    );
    map.fitBounds(bounds);
    const currentZoom = map.getZoom();
    if (currentZoom) map.setZoom(currentZoom - 2);

    directionsRenderer.setDirections(directions);
  }, [directionsRenderer, currentTrip, currentItinerary]);

  return null;
}
