import { POI } from "../../types";
import styles from "./PlaceLozenge.module.css";
import HomeIcon from "@mui/icons-material/Home";
import { ItineraryContext } from "../../context/ItineraryContext";
import { useContext, useEffect, useMemo, useRef } from "react";
import RestaurantOutlinedIcon from "@mui/icons-material/RestaurantOutlined";
import LocalActivityOutlinedIcon from "@mui/icons-material/LocalActivityOutlined";
import HikingOutlinedIcon from "@mui/icons-material/HikingOutlined";
import SportsFootballOutlinedIcon from "@mui/icons-material/SportsFootballOutlined";
import LocalMallOutlinedIcon from "@mui/icons-material/LocalMallOutlined";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import SyncAltIcon from "@mui/icons-material/SyncAlt";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import React from "react";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import LanguageIcon from "@mui/icons-material/Language";
import PlaceIcon from "@mui/icons-material/Place";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { toast } from "react-toastify";
import { NumberInput } from "../NumberInput/NumberInput";
import { updateItineraryTimings } from "../NavBar/components/ItineraryGenerator/utils";
import Loading from "react-loading";
interface PlaceLozengeProps {
  poi: POI;
  rightComponent?: React.ReactNode;
  onClick: () => void;
  setOpenCancelConfirmation?: (poi: POI) => void;
  swapPOI?: boolean;
  componentRef: any;
}
const iconSize = "small";

export default function PlaceLozenge(props: PlaceLozengeProps) {
  const {
    currentItinerary,
    home,
    currentTrip,
    setSwapPOI,
    setCurrentItinerary,
    selectedDay,
  } = useContext(ItineraryContext);
  const [swapLoad, setSwapLoad] = React.useState(false);
  const [stayDuration, setStayDuration] = React.useState<number>(
    Number(props.poi.time_spent)
  );
  if (props.swapPOI) {
    console.log(props.poi);
  }
  const hiddenInputRef = useRef<HTMLInputElement>(null);
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (hiddenInputRef.current) {
        hiddenInputRef.current.focus();
      }
    }
  };
  const { id } = props.poi;
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });
  const [hovered, setHovered] = React.useState(false);
  const timeoutRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isDestination = currentTrip?.destination.order === props.poi.order;
  const detailed =
    currentTrip?.destination?.order === props.poi.order &&
    props.setOpenCancelConfirmation &&
    currentTrip.destination.name !== currentItinerary[0].itinerary[0].name;
  const distanceRef = useRef(2);
  const categoryIconColor = !isDestination ? "black" : "#EA4335";

  const startingLocationOrders = useMemo(() => {
    return currentItinerary.map((day) => day.itinerary[0].order);
  }, [currentItinerary]);

  const updateStayDuration = (stayDuration: number) => {
    const newItinerary = currentItinerary.map((day) => ({
      day: day.day,
      itinerary:
        day.day === selectedDay
          ? day.itinerary.map((poi) => {
              if (poi.order === currentTrip?.destination.order) {
                return { ...poi, time_spent: String(stayDuration) };
              }
              return poi;
            })
          : day.itinerary,
    }));

    setCurrentItinerary(updateItineraryTimings(newItinerary));
  };

  const categoryToIcon: { [key: string]: any } = {
    ["-"]: <HomeIcon fontSize={iconSize} htmlColor={categoryIconColor} />,
    ["Dining & Drinking"]: (
      <RestaurantOutlinedIcon
        fontSize={iconSize}
        htmlColor={categoryIconColor}
      />
    ),
    ["Art & Entertainment"]: (
      <LocalActivityOutlinedIcon
        fontSize={iconSize}
        htmlColor={categoryIconColor}
      />
    ),
    ["Landmarks & Outdoors"]: (
      <HikingOutlinedIcon fontSize={iconSize} htmlColor={categoryIconColor} />
    ),
    ["Sports & Recreation"]: (
      <SportsFootballOutlinedIcon
        fontSize={iconSize}
        htmlColor={categoryIconColor}
      />
    ),
    ["Retail"]: (
      <LocalMallOutlinedIcon
        fontSize={iconSize}
        htmlColor={categoryIconColor}
      />
    ),
  };

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    width: "85%",
  };

  const onStayChangeHandler = (val: number) => {
    setStayDuration(val);
    updateStayDuration(val);
  };

  const arrivalObj = new Date(0, 0);
  arrivalObj.setMinutes(Number(props.poi.arrival));
  const arrivalString = arrivalObj.toTimeString().slice(0, 5);
  const departureObj = new Date(0, 0);
  departureObj.setMinutes(Number(props.poi.leave));
  const departureString = departureObj.toTimeString().slice(0, 5);

  const currentIndex = currentItinerary[selectedDay].itinerary.findIndex(
    (poi) => poi.id === props.poi.id
  );

  return (
    <div className={styles.test} style={style} ref={props.componentRef}>
      {props.setOpenCancelConfirmation && (
        <div className={styles.tags}>
          <div
            className={`${styles.tag} ${styles.tagMarker}`}
            style={
              props.poi.name !== currentItinerary[0].itinerary[0].name
                ? {
                    backgroundColor:
                      props.poi.name === currentItinerary[0].itinerary[0].name
                        ? "#4084F3"
                        : currentTrip?.destination.name === props.poi.name
                        ? "#EA4335"
                        : "#20CCFF",
                  }
                : { height: 22, background: "none", border: "none" }
            }
          >
            {props.poi.name !== currentItinerary[0].itinerary[0].name
              ? currentIndex
              : ""}
          </div>
          <div
            className={`${!hovered ? styles.tagHide : ""} ${styles.tag} ${
              styles.tagClose
            }`}
            onMouseEnter={() => {
              if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
              }
              setHovered(true);
            }}
            onMouseLeave={() => {
              timeoutRef.current = setTimeout(() => setHovered(false), 100);
            }}
            onClick={() => {
              if (props.setOpenCancelConfirmation)
                props.setOpenCancelConfirmation(props.poi);
            }}
            style={{
              display:
                props.poi.name === currentItinerary[0].itinerary[0].name
                  ? "none"
                  : "flex",
            }}
          >
            &#10005;
          </div>
        </div>
      )}
      <div
        className={`${styles.container}`}
        onClick={props.onClick}
        style={{
          borderRadius: detailed ? "5px 5px 0px 0px" : "5px",
          marginTop: props.setOpenCancelConfirmation ? "-22px" : "0px",
        }}
        onMouseEnter={() => {
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
          }
          setHovered(true);
        }}
        onMouseLeave={() => {
          timeoutRef.current = setTimeout(() => setHovered(false), 100);
        }}
      >
        <div className={styles.content}>
          <div className={styles.left}>
            <div className={styles.icon}>
              {categoryToIcon[props.poi?.category ?? ""] ? (
                categoryToIcon[props.poi.category]
              ) : (
                <RestaurantOutlinedIcon
                  fontSize={iconSize}
                  htmlColor={categoryIconColor}
                />
              )}
            </div>

            <div className={styles.header}>
              <div className={styles.name}>
                <span
                  style={{
                    color:
                      props.poi?.order === currentTrip?.destination.order &&
                      !props.swapPOI
                        ? "#EA4335"
                        : "#333333",
                  }}
                >
                  {props.poi?.name !== currentItinerary[0]?.itinerary[0].name
                    ? props.poi?.name
                    : home ?? props.poi?.name}
                </span>
                {!props.swapPOI && (
                  <a style={{ color: "#747474" }}>
                    {startingLocationOrders.includes(props.poi.order)
                      ? "Depart at " + departureString
                      : props.poi.name === currentItinerary[0].itinerary[0].name
                      ? "End at " + arrivalString
                      : arrivalString + " - " + departureString}
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className={styles.right}>
            {props.rightComponent
              ? props.rightComponent
              : props.poi?.name != currentItinerary[0].itinerary[0].name && (
                  <div className={styles.placeLozengeOptions}>
                    {!swapLoad ? (
                      <SyncAltIcon
                        fontSize="small"
                        color="action"
                        onClick={() => {
                          setSwapLoad(true);
                          fetch(
                            `${process.env.REACT_APP_API_URL}nearby?lat=${props.poi?.latitude}&lng=${props.poi?.longitude}&distance=${distanceRef.current}`
                          )
                            .then((response) => response.json())
                            .then((data) => {
                              if (data.length === 0)
                                throw new Error("No nearby POIs found");
                              setSwapPOI({
                                poi: props.poi,
                                nearby: data,
                              });
                              setSwapLoad(false);
                            })
                            .catch((error) => {
                              setSwapLoad(false);
                              toast.info("No nearby POIs found");
                            });
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          minWidth: 20,
                          height: 20,
                          display: "flex",
                          justifyItems: "center",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Loading
                          type={"spokes"}
                          color={"#6F7070"}
                          height={15}
                          width={15}
                        />
                      </div>
                    )}
                    <span
                      style={style}
                      {...listeners}
                      ref={setNodeRef}
                      {...attributes}
                    >
                      <DragIndicatorIcon
                        fontSize="small"
                        color="action"
                        style={{ cursor: "grab" }}
                      />
                    </span>
                  </div>
                )}
          </div>
        </div>
      </div>
      {
        <div
          className={`${styles.extended} ${
            !detailed && !props.swapPOI ? styles.hide : {}
          }
           ${
             props.poi.order === currentTrip?.destination.order
               ? styles.extendedSelected
               : ""
           }`}
        >
          <div className={styles.extendedContent}>
            {props.poi.description !== "" && (
              <span className={styles.description}>
                {props.poi.description}
              </span>
            )}
            <div className={styles.extendedFooter}>
              {props.poi.address && props.poi.address !== "-" && (
                <div className={styles.footerComponentCol}>
                  {props.swapPOI === undefined && (
                    <div className={styles.metric}>
                      <AccessTimeIcon
                        color="action"
                        sx={{ width: 15, height: 15 }}
                      />
                      <span>Stay </span>
                      {
                        <NumberInput
                          value={stayDuration || 0}
                          onChange={(event, val) => {
                            if (val !== null) onStayChangeHandler(val);
                          }}
                          onKeyDown={handleKeyDown}
                        />
                      }
                      <input
                        ref={hiddenInputRef}
                        style={{
                          position: "absolute",
                          opacity: 0,
                          pointerEvents: "none",
                        }}
                        aria-hidden="true"
                      />
                      <span> mins</span>
                    </div>
                  )}
                  <a
                    href={`https://maps.google.com/?q=${props.poi?.address}`}
                    target="_blank"
                    style={{ display: "flex", alignItems: "center", gap: 5 }}
                  >
                    <PlaceIcon sx={{ width: 15, height: 15 }} color="action" />
                    <span>{props.poi?.address}</span>
                  </a>
                  {props.poi.openingHours.length > 0 &&
                    props.poi.openingHours[0].length > 0 && (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 5,
                        }}
                      >
                        <AccessTimeIcon
                          sx={{ width: 15, height: 15 }}
                          color="action"
                        />
                        <span>{props.poi.formattedOpeningHours}</span>
                      </div>
                    )}
                </div>
              )}
            </div>
            <div className={styles.extendedFooter}>
              {props.poi.telephone !== "" && (
                <a
                  className={styles.footerComponent}
                  href={`tel:${props.poi.telephone}`}
                  target="_blank"
                >
                  <LocalPhoneIcon
                    sx={{ width: 15, height: 15 }}
                    color="action"
                  />
                  <span>{props.poi.telephone}</span>
                </a>
              )}
              {props.poi.website !== "" && (
                <a
                  className={styles.footerComponent}
                  href={props.poi.website}
                  target="_blank"
                >
                  <LanguageIcon sx={{ width: 15, height: 15 }} color="action" />
                  <span className={styles.shortenString}>
                    {props.poi.website?.replace(/(^\w+:|^)\/\//, "")}
                  </span>
                </a>
              )}
            </div>
          </div>
        </div>
      }
    </div>
  );
}
