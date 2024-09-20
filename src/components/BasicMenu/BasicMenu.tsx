import styles from "./BasicMenu.module.css";
import React, { useContext } from "react";
import { Button, IconButton, Menu, MenuItem } from "@mui/material";
import { ItineraryContext } from "../../context/ItineraryContext";

interface BasicMenuProps {
  icon: any;
  items: any[];
  onClick: (index: number) => void;
}

export default function BasicMenu(props: BasicMenuProps) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className={styles.container}>
      <IconButton
        onClick={handleClick}
        size="small"
        aria-controls={open ? "account-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
      >
        {props.icon}
      </IconButton>
      {
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
          {props.items.map((day, idx) => (
            <MenuItem onClick={() => props.onClick(idx)} key={idx}>
              {day instanceof Date ? day.toDateString() : day}
            </MenuItem>
          ))}
        </Menu>
      }
    </div>
  );
}

/*
   setSelectedDay(idx);
                setCurrentTrip({
                  origin: currentItinerary[idx].itinerary[0],
                  destination: currentItinerary[idx].itinerary[1],
                })
                  */
