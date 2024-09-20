import { useContext } from "react";
import { ItineraryContext } from "../../../../context/ItineraryContext";

import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import BasicSelect from "../../../BasicMenu/BasicMenu";

export default function DaysPicker() {
  const { currentItinerary, setSelectedDay, setCurrentTrip, dates } =
    useContext(ItineraryContext);

  const clickHandler = (idx: number) => {
    setSelectedDay(idx);
    setCurrentTrip({
      origin: currentItinerary[idx].itinerary[0],
      destination: currentItinerary[idx].itinerary[1],
    });
  };
  return (
    <BasicSelect
      icon={
        <CalendarMonthIcon sx={{ width: 25, height: 25 }}></CalendarMonthIcon>
      }
      items={dates}
      onClick={clickHandler}
    />
  );
}
