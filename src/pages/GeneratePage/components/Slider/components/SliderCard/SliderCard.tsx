import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import styles from "./SliderCard.module.css";
import React, { useEffect } from "react";

import ReactLoading from "react-loading";
import GroupPicker from "../GroupPicker/GroupPicker";
import FolderOutlinedIcon from "@mui/icons-material/FolderOutlined";
import FolderOffIcon from "@mui/icons-material/FolderOff";
import FmdGoodOutlinedIcon from "@mui/icons-material/FmdGoodOutlined";
import LanguageIcon from "@mui/icons-material/Language";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import PlaceIcon from "@mui/icons-material/Place";
import ImageNotSupportedIcon from "@mui/icons-material/ImageNotSupported";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { Rating, TextField } from "@mui/material";
import { SlideType, Slide } from "../../../../../../types";
import { getTripSubtitle } from "../../../../../../utils";
import { HotelSlide } from "../../Slider";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ImageSlider from "../ImageSlider/ImageSlider";

interface SliderCardProps {
  slide: HotelSlide;
  highlighted: boolean;
}

const SliderCard = ({ slide, highlighted }: SliderCardProps) => {
  const onClickHandler = () => {
    slide.clickEvent();
  };
  return (
    <div
      className={`${styles.sliderCard} ${
        highlighted ? styles.highlighted : ""
      }`}
      onClick={() => onClickHandler()}
    >
      {slide.hotel.photos.length > 0 ? (
        <ImageSlider images={slide.hotel.photos} highlighted={highlighted} />
      ) : (
        <div className={styles.imageLoading} onClick={() => onClickHandler()}>
          <ImageNotSupportedIcon />
        </div>
      )}

      <div className={styles.sliderCardText}>
        <div className={styles.content}>
          <div className={styles.title}>
            <p>{slide.hotel.name}</p>
          </div>
          <Rating
            name="half-rating-read"
            defaultValue={Number(slide.hotel.popularity)}
            precision={0.5}
            readOnly
            size="small"
          />
          {slide.hotel.description && (
            <p className={styles.subtitle}>{slide.hotel.description}</p>
          )}

          <a
            className={`${styles.footerComponent}`}
            href={`https://maps.google.com/?q=${slide.hotel.address}`}
            target="_blank"
          >
            <PlaceIcon sx={{ width: 15, height: 15 }} color="action" />
            <span className={styles.shortenString}>{slide.hotel.address}</span>
          </a>
          {slide.hotel.telephone && (
            <a
              className={`${styles.footerComponent} `}
              href={`tel:${slide.hotel.telephone}`}
              target="_blank"
            >
              <LocalPhoneIcon sx={{ width: 15, height: 15 }} color="action" />
              <span className={styles.shortenString}>
                {slide.hotel.telephone}
              </span>
            </a>
          )}
          {slide.hotel.website && (
            <a
              className={`${styles.footerComponent}`}
              href={slide.hotel.website}
              target="_blank"
            >
              <LanguageIcon sx={{ width: 15, height: 15 }} color="action" />
              <span className={styles.shortenString}>
                {slide.hotel.website.replace(/(^\w+:|^)\/\//, "")}
              </span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default SliderCard;
