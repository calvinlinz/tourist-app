import React, { useEffect } from "react";
import DividingLine from "../DividingLine/DividingLine";
import styles from "./UserPreferences.module.css";
import { Itinerary, POI, SavedTrip, Trip } from "../../../../types";
import RestaurantOutlinedIcon from "@mui/icons-material/RestaurantOutlined";
import LocalActivityOutlinedIcon from "@mui/icons-material/LocalActivityOutlined";
import HikingOutlinedIcon from "@mui/icons-material/HikingOutlined";
import SportsFootballOutlinedIcon from "@mui/icons-material/SportsFootballOutlined";
import LocalMallOutlinedIcon from "@mui/icons-material/LocalMallOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import EventOutlinedIcon from "@mui/icons-material/EventOutlined";
import MultipleSelect from "../../../BasicMultiSelect/BasicMultiSelect";
import TravelModeField from "../TravelModeField/TravelModeField";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { FormControl, InputLabel, MenuItem } from "@mui/material";
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

const dividingLineProps = {
  width: 1,
  height: 30,
  color: "rgb(177 177 177 / 20%)",
};

const iconStyle = {
  width: 25,
  height: 25,
};

const FOURSQUARE_CATEGORIES: { [key: string]: JSX.Element } = {
  "Dining & Drinking": <RestaurantOutlinedIcon sx={iconStyle} />,
  "Art & Entertainment": <LocalActivityOutlinedIcon sx={iconStyle} />,
  "Landmarks & Outdoors": <HikingOutlinedIcon sx={iconStyle} />,
  "Sports & Recreation": <SportsFootballOutlinedIcon sx={iconStyle} />,
  Retail: <LocalMallOutlinedIcon sx={iconStyle} />,
  "Community & Government": <PeopleOutlinedIcon sx={iconStyle} />,
  Events: <EventOutlinedIcon sx={iconStyle} />,
};

interface UserPreferencesProps {
  categoryRef: React.MutableRefObject<string[]>;
  priceRef: React.MutableRefObject<number>;
  dayLengthRef: React.MutableRefObject<string>;
}

export const UserPreferences = (props: UserPreferencesProps) => {
  const [dayEnd, setDayEnd] = React.useState(1);
  const [price, setPrice] = React.useState(
    props.priceRef.current === 0 ? undefined : props.priceRef.current
  );

  const handleChange = (event: any) => {
    setDayEnd(event.target.value);
    props.dayLengthRef.current =
      event.target.value === 1 ? "afternoon" : "evening";
  };

  const handleChangePrice = (event: any) => {
    setPrice(event.target.value);
    props.priceRef.current = event.target.value;
  };
  return (
    <div className={styles.content}>
      <div className={styles.fields}>
        <MultipleSelect
          items={Object.keys(FOURSQUARE_CATEGORIES)}
          onChange={(value: any[]) => {
            props.categoryRef.current = value;
          }}
          label="Category"
          width={250}
        />
        <DividingLine {...dividingLineProps} />

        <FormControl sx={{ m: 0, width: 200 }} size="small">
          <InputLabel id="demo-item-label">{"Day End"}</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={dayEnd}
            label="Day End"
            onChange={handleChange}
          >
            <MenuItem value={1}>Afternoon</MenuItem>
            <MenuItem value={2}>Evening</MenuItem>
          </Select>
        </FormControl>
        <DividingLine {...dividingLineProps} />
        <FormControl sx={{ m: 0, width: 100 }} size="small">
          <InputLabel id="demo-item-label">{"Price"}</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={price}
            label="Price"
            onChange={handleChangePrice}
            placeholder="Price"
          >
            <MenuItem value={1}>$</MenuItem>
            <MenuItem value={2}>$$</MenuItem>
            <MenuItem value={3}>$$$</MenuItem>
            <MenuItem value={4}>$$$$</MenuItem>
          </Select>
        </FormControl>
        <DividingLine {...dividingLineProps} />
        <TravelModeField />
      </div>
    </div>
  );
};
