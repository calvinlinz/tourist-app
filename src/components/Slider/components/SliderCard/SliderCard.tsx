import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import styles from "./SliderCard.module.css";
import React, { useEffect } from "react";
import { Slide, SlideType } from "../../../../types";
import { getTripSubtitle } from "../../../../utils";
import ReactLoading from "react-loading";
import GroupPicker from "../GroupPicker/GroupPicker";
import FolderOutlinedIcon from "@mui/icons-material/FolderOutlined";
import FolderOffIcon from "@mui/icons-material/FolderOff";
import FmdGoodOutlinedIcon from "@mui/icons-material/FmdGoodOutlined";

import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { TextField } from "@mui/material";
interface SliderCardProps {
  slide: SlideType;
}

const SliderCard = ({ slide }: SliderCardProps) => {
  const [deleteVisiblity, setDeleteVisibility] = React.useState<boolean>(false);
  const [image, setImage] = React.useState<string | undefined>(undefined);
  const [rename, setRename] = React.useState<boolean>(false);
  const onMouseEnterHandler = () => {
    setDeleteVisibility(true);
  };

  const onMouseLeaveHandler = () => {
    setDeleteVisibility(false);
  };

  useEffect(() => {
    setImage(undefined);
    setRename(false);
    const getLocation = (slide: SlideType): string => {
      if ("trip" in slide) {
        return slide.trip.location;
      }
      return getLocation(slide.children[0]);
    };
    const getPhoto = async () => {
      const location = getLocation(slide);
      const response = await fetch(
        "https://api.flickr.com/services/rest/?method=flickr.photos.search&format=json&api_key=16b3eddfe71a34f0806e3801756df831&text=" +
          location +
          "&nojsoncallback=1&tags=" +
          location +
          ",cityscape&per_page=1&tag_mode=all&sort=relevance&media=photos&content_types=0&safe_search=1&has_geo=1"
      );
      const data = await response.json();
      const photo = data.photos.photo[0];
      if (data.photos.photo.length == 0) {
        const response = await fetch(
          "https://api.flickr.com/services/rest/?method=flickr.photos.search&format=json&api_key=16b3eddfe71a34f0806e3801756df831&text=" +
            location +
            "&nojsoncallback=1&per_page=1&tag_mode=all&sort=relevance&media=photos&content_types=0&safe_search=1"
        );
        const data = await response.json();
        const photo = data.photos.photo[0];
        setImage(
          photo
            ? `https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}.jpg`
            : "./city.jpeg"
        );
      } else {
        setImage(
          photo
            ? `https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}.jpg`
            : "./city.jpeg"
        );
      }
    };
    getPhoto();
  }, [slide]);

  const isSlide = (slide: SlideType): slide is Slide => {
    return "trip" in slide;
  };

  const onClickHandler = () => {
    slide.clickEvent();
    setRename(false);
  };

  return (
    <div
      className={styles.sliderCard}
      onMouseEnter={() => onMouseEnterHandler()}
      onMouseLeave={() => onMouseLeaveHandler()}
    >
      {image !== undefined ? (
        <div
          className={styles.sliderImage}
          style={{
            backgroundImage: `url(${image})`,
            backgroundSize: "cover",
          }}
          onClick={() => {
            onClickHandler();
          }}
        />
      ) : (
        <div className={styles.imageLoading} onClick={() => onClickHandler()}>
          <ReactLoading
            type={"spin"}
            color={"#20CCFF"}
            width={"30px"}
            height={"30px"}
          />
        </div>
      )}
      <div className={styles.tooltip}>
        <div className={styles.tooltipLeft}>
          {/* <div className={styles.slideType}>
            <FolderOutlinedIcon sx={{ width: 15, height: 15 }} htmlColor="#333" />
          </div> */}
        </div>
        <div className={styles.tooltipRight}>
          <div
            className={`${!deleteVisiblity ? styles.tagHide : ""} ${
              styles.tag
            } ${styles.tagClose}`}
            onClick={() => {
              setRename(!rename);
            }}
          >
            <EditOutlinedIcon sx={{ width: 15, height: 15 }} htmlColor="#333" />
          </div>
          {isSlide(slide) && slide.optionsEvent && (
            <div
              className={`${!deleteVisiblity ? styles.tagHide : ""} ${
                styles.tag
              } ${styles.tagClose}`}
            >
              <GroupPicker
                handleGroup={slide.optionsEvent}
                currentGroup={slide.trip.groupName}
              />
            </div>
          )}
          {isSlide(slide) && slide.deleteEvent && (
            <div
              className={`${!deleteVisiblity ? styles.tagHide : ""} ${
                styles.tag
              } ${styles.tagClose}`}
              onClick={() => {
                if (slide.deleteEvent) slide.deleteEvent();
              }}
            >
              &#10005;
            </div>
          )}
        </div>
      </div>
      <div
        className={styles.sliderCardText}
        onClick={() => {
          if (!rename) {
            onClickHandler();
          }
        }}
      >
        <div className={styles.title}>
          {!rename ? (
            <p>{slide.name}</p>
          ) : (
            <TextField
              hiddenLabel
              id="filled-hidden-label-small"
              defaultValue={slide.name}
              size="small"
              style={{ padding: "0px", border: 0 }}
              inputProps={{
                style: {
                  height: 20,
                  border: 0,
                },
              }}
              onKeyDown={(e: any) => {
                if (e.key === "Enter") {
                  slide.renameEvent(e.target.value);
                  setRename(false);
                }
              }}
            />
          )}
          {!isSlide(slide) &&(
            <FolderOutlinedIcon
              sx={{ width: 15, height: 15 }}
              htmlColor="#333"
            />
          )}
        </div>
        <p className={styles.subtitle}>{getTripSubtitle(slide)}</p>
      </div>
    </div>
  );
};

export default SliderCard;
