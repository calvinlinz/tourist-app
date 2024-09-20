export type Time = {
  text?: string | undefined;
  value?: number | undefined;
};

export enum TravelMode {
  /**
   * Specifies a bicycling directions request.
   */
  BICYCLING = "BICYCLING",
  /**
   * Specifies a driving directions request.
   */
  DRIVING = "DRIVING",
  /**
   * Specifies a transit directions request.
   */
  TRANSIT = "TRANSIT",
  /**
   * Specifies a walking directions request.
   */
  WALKING = "WALKING",
}
export type GroupedSlide = {
  name: string;
  children: Slide[];
  clickEvent: () => void;
  renameEvent: (name: string) => void;
};

export type SlideType = Slide | GroupedSlide;

export type Trip = {
  origin: POI;
  destination: POI;
};
export type SuggestedPOI = {
  [""]: string;
  address: string;
  category: string;
  description: string;
  hours_open: string;
  latitude: string;
  longitude: string;
  name: string;
  normalized_popularity: number;
  popularity: string;
  price: string;
  telephone: string;
};

export type POI = {
  id: number;
  order: number;
  arrival: string;
  latitude: number;
  leave: string;
  longitude: number;
  name: string;
  time_spent: string;
  travel_time: string;
  category: string;
  openingHours: any[];
  formattedOpeningHours: string;
  telephone: string;
  description: string;
  popularity: number;
  website: string;
  address: string;
  photos: string[];
  directions?: google.maps.DirectionsResult;
  normalized_popularity?: number;
};

export type Itinerary = {
  day: number;
  itinerary: POI[];
};

export type Point = google.maps.LatLngLiteral;

export type SwapDirections = {
  index: number;
  directions: google.maps.DirectionsResult[];
};

export type Slide = {
  name: string;
  trip: SavedTrip;
  groupName?: string | undefined;
  clickEvent: () => void;
  deleteEvent: () => void;
  optionsEvent: (groupName: string) => void;
  renameEvent: (name: string) => void;
};

export type SavedTrip = {
  name: string;
  trip: Itinerary[];
  dates: Date[];
  location: string;
  groupName: string | null;
  home: string;
};

export type SwapPOI = {
  poi: POI;
  nearby: any[];
};
