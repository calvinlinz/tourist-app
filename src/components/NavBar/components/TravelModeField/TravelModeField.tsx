import styles from "./TravelModeField.module.css";
import React, { useContext } from "react";
import {
  Button,
  IconButton,
  Menu,
  MenuItem,
  SvgIconProps,
  Tooltip,
} from "@mui/material";
import { ItineraryContext } from "../../../../context/ItineraryContext";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import DirectionsWalkingIcon from "@mui/icons-material/DirectionsWalk";
import DirectionsBusIcon from "@mui/icons-material/DirectionsBus";
import DirectionsCyclingIcon from "@mui/icons-material/DirectionsBike";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { TravelMode } from "../../../../types";

export default function TravelModeField() {
  const { selectedDay, selectedTravel, setSelectedTravel } =
    useContext(ItineraryContext);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const formatMenuItemToCapitalized = (menuItem: string) => {
    const str = menuItem.toLowerCase();
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  const travelModeMapping: Record<string, React.ReactElement<SvgIconProps>> = {
    [TravelMode.DRIVING]: (
      <DirectionsCarIcon sx={{ width: 25, height: 25 }} color="action" />
    ),
    [TravelMode.WALKING]: (
      <DirectionsWalkingIcon sx={{ width: 25, height: 25 }} color="action" />
    ),
    [TravelMode.BICYCLING]: (
      <DirectionsCyclingIcon sx={{ width: 25, height: 25 }} color="action" />
    ),
  };

  return (
    <div className={styles.container}>
      <IconButton
        onClick={handleClick}
        size="small"
        aria-controls={open ? "account-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        sx={{
          border: "1px solid #C4C4C4",
          borderRadius: "4px",
          padding: "7px",
        }}
      >
        {travelModeMapping[selectedTravel]}
      </IconButton>

      {selectedDay != undefined && (
        <Menu
          anchorEl={anchorEl}
          id="account-menu"
          open={open}
          onClose={handleClose}
          onClick={handleClose}
          PaperProps={{
            elevation: 0,
            sx: {
              overflow: "visible",
              filter: "drop-shadow(0px 1px 2px rgba(0,0,0,0.32))",
              mt: 1.5,
              "& .MuiAvatar-root": {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              "&::before": {
                content: '""',
                display: "block",
                position: "absolute",
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: "background.paper",
                transform: "translateY(-50%) rotate(45deg)",
                zIndex: 0,
              },
            },
          }}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        >
          {Object.keys(travelModeMapping).map((travelMode: any, idx) => (
            <MenuItem
              key={idx}
              onClick={() => {
                setSelectedTravel(travelMode);
              }}
            >
              <div className={styles.menuItem}>
                {travelModeMapping[travelMode]}
                <span> {formatMenuItemToCapitalized(travelMode)}</span>
              </div>
            </MenuItem>
          ))}
        </Menu>
      )}
    </div>
  );
}
