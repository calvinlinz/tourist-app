import { useContext, useEffect, useState } from "react";
import CurrentTripBox from "../../components/CurrentTripBox/CurrentTripBox";
import ItineraryBox from "../../components/ItineraryBox/ItineraryBox";
import TourismMap from "../../components/Map/Map";
import NavBar from "../../components/NavBar/NavBar";
import { ItineraryContext } from "../../context/ItineraryContext";
import styles from "./MainPage.module.css";
import MenuOpenOutlinedIcon from "@mui/icons-material/MenuOpenOutlined";
import { Icon, makeStyles, styled } from "@mui/material";
import SwapBox from "../../components/SwapBox/SwapBox";
import { useNavigate, useLocation } from "react-router-dom";
import CurrentTripLozenge from "../../components/CurrentTripBox/CurrentTripLozenge/CurrentTripLozenge";

export default function MainPage() {
  const { currentItinerary, swapPOI } = useContext(ItineraryContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (currentItinerary.length === 0) {
      navigate("/");
    }
  }, []);
  return (
    <>
      <NavBar />
      <div className={`${styles.container}`}>
        <div className={`${styles.content}`}>
          <div
            className={`${styles.left} ${
              currentItinerary.length === 0 ? styles.hide : ""
            }`}
          >
            <div className={currentItinerary ? styles.sideBarContent : ""}>
              <CurrentTripBox />
              {swapPOI ? <SwapBox /> : <ItineraryBox />}
            </div>
          </div>
          <div className={`${styles.right}`}>
            <div className={styles.currentTripNavigator}>
              <CurrentTripLozenge />
            </div>
            <TourismMap />
          </div>
        </div>
      </div>
    </>
  );
}
