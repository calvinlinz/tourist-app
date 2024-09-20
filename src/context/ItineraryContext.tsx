import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { Itinerary, SwapDirections, SwapPOI, TravelMode, Trip } from "../types";
import ReactLoading from "react-loading";
import { updateTripLocalStorage } from "../utils";

interface ItineraryContextType {
  currentItinerary: Itinerary[];
  currentTrip: Trip | undefined;
  selectedDay: number;
  selectedTravel: TravelMode;
  home: string;
  swapPOI: SwapPOI | null;
  swapDirections: number | null;
  currentSwapDirectionsOptions: SwapDirections[];
  directionsService: google.maps.DirectionsService | null;
  dates: Date[];
  currentItineraryName: string;
  currentSavedItineraryIndex: number | undefined;
  currentItineraryLocation: string;
  currentRoute: google.maps.DirectionsResult | null;
  setCurrentItinerary: (itinerary: Itinerary[]) => void;
  setCurrentSavedItineraryIndex: (index: number | undefined) => void;
  setCurrentTrip: (trip: Trip | undefined) => void;
  setSelectedDay: (day: number) => void;
  setSelectedTravel: (travel: TravelMode) => void;
  setHome: (home: string) => void;
  setSwapPOI: (swap: SwapPOI | null) => void;
  setSwapDirections: (id: number | null) => void;
  setCurrentSwapDirectionsOptions: (options: SwapDirections[]) => void;
  setDirectionsService: (service: google.maps.DirectionsService) => void;
  setDates: (dates: Date[]) => void;
  setCurrentItineraryName: (name: string) => void;
  setCurrentItineraryLocation: (location: string) => void;
  setCurrentRoute: (route: google.maps.DirectionsResult) => void;
}

const defaultItineraryContext: ItineraryContextType = {
  currentItinerary: [],
  currentTrip: undefined,
  selectedDay: 0,
  selectedTravel: TravelMode.DRIVING,
  home: "",
  swapPOI: null,
  swapDirections: null,
  currentSwapDirectionsOptions: [],
  directionsService: null,
  dates: [],
  currentItineraryName: "",
  currentSavedItineraryIndex: undefined,
  currentItineraryLocation: "",
  currentRoute: null,
  setCurrentItinerary: () => {},
  setCurrentSavedItineraryIndex: () => {},
  setCurrentTrip: () => {},
  setSelectedDay: () => {},
  setSelectedTravel: () => {},
  setHome: () => {},
  setSwapPOI: () => {},
  setSwapDirections: () => {},
  setCurrentSwapDirectionsOptions: () => {},
  setDirectionsService: () => {},
  setDates: () => {},
  setCurrentItineraryName: () => {},
  setCurrentItineraryLocation: () => {},
  setCurrentRoute: () => {},
};

export const ItineraryContext = createContext<ItineraryContextType>(
  defaultItineraryContext
);

export const ItineraryProvider = ({
  children,
  isGoogleLoaded,
}: {
  children: ReactNode;
  isGoogleLoaded: boolean;
}) => {
  const [currentItinerary, setCurrentItinerary] = useState<Itinerary[]>([]);
  const [currentTrip, setCurrentTrip] = useState<Trip>();
  const [selectedDay, setSelectedDay] = useState<number>(0);
  const [selectedTravel, setSelectedTravel] = useState<TravelMode>(
    TravelMode.DRIVING
  );
  const [home, setHome] = useState<string>("");
  const [swapPOI, setSwapPOI] = useState<SwapPOI | null>(null);
  const [swapDirections, setSwapDirections] = useState<number | null>(null);
  const [currentSwapDirectionsOptions, setCurrentSwapDirectionsOptions] =
    useState<SwapDirections[]>([]);
  const [directionsService, setDirectionsService] =
    useState<google.maps.DirectionsService>();
  const [dates, setDates] = useState<Date[]>([]);
  const [currentItineraryName, setCurrentItineraryName] = useState<string>("");
  const [currentSavedItineraryIndex, setCurrentSavedItineraryIndex] = useState<
    number | undefined
  >();
  const [currentItineraryLocation, setCurrentItineraryLocation] =
    useState<string>("");
  const [currentRoute, setCurrentRoute] =
    useState<google.maps.DirectionsResult | null>(null);

  useEffect(() => {
    updateTripLocalStorage(currentItinerary, currentSavedItineraryIndex);
  }, [currentItinerary]);

  useEffect(() => {
    const initializeService = () => {
      if (isGoogleLoaded) {
        setDirectionsService(new google.maps.DirectionsService());
      }
    };
    initializeService();
  }, [isGoogleLoaded]);

  if (!directionsService) {
    return (
      <div className="fullPageLoading">
        <ReactLoading
          type={"bubbles"}
          color={"#20CCFF"}
          height={"10%"}
          width={"10%"}
        />
      </div>
    );
  }

  return (
    <ItineraryContext.Provider
      value={{
        currentItinerary,
        currentTrip,
        selectedDay,
        selectedTravel,
        home,
        swapPOI,
        swapDirections,
        currentSwapDirectionsOptions,
        directionsService,
        dates,
        currentItineraryName,
        currentSavedItineraryIndex,
        currentItineraryLocation,
        currentRoute,
        setCurrentItinerary,
        setCurrentTrip,
        setSelectedDay,
        setSelectedTravel,
        setHome,
        setSwapPOI,
        setSwapDirections,
        setCurrentSwapDirectionsOptions,
        setDirectionsService,
        setDates,
        setCurrentItineraryName,
        setCurrentSavedItineraryIndex,
        setCurrentItineraryLocation,
        setCurrentRoute,
      }}
    >
      {children}
    </ItineraryContext.Provider>
  );
};

export const useItineraryContext = () => {
  return useContext(ItineraryContext);
};
