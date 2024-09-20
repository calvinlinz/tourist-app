import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import styles from "./Slider.module.css";
import React, { useEffect, useState } from "react";
import SliderCard from "./components/SliderCard/SliderCard";
import { POI, SlideType } from "../../../../types";

export type HotelSlide = {
  hotel: POI;
  location: string;
  clickEvent: () => void;
};

interface SliderProps {
  hotels: POI[];
  location: string;
  showButtons: boolean;
  setLocation: (location: { location: string; hotel: POI }) => void;
}
const Slider = (props: SliderProps) => {
  const [hideLeft, setHideLeft] = useState(true);
  const [hideRight, setHideRight] = useState(false);
  const [highlighted, setHighlighted] = useState<number>(0);
  const [slides, setSlides] = useState<HotelSlide[]>([]);

  const fetchCompleteSlideData = () => {
    return props.hotels
      .filter((hotel) => hotel.photos.length > 0)
      .slice(0, 10)
      .map((hotel, idx) => {
        return {
          hotel,
          location: props.location,
          clickEvent: () => {
            setHighlighted(idx);
            props.setLocation({
              location: props.location,
              hotel: hotel,
            });
          },
        };
      });
  };

  useEffect(() => {
    setSlides(fetchCompleteSlideData());
  }, []);

  const slideLeft = () => {
    const slider = document.getElementById("slider");
    if (slider) {
      slider.scrollLeft = slider.scrollLeft - 500;
    }
  };

  const slideRight = () => {
    const slider = document.getElementById("slider");
    if (slider) {
      slider.scrollLeft = slider.scrollLeft + 500;
    }
  };

  useEffect(() => {
    const slider = document.getElementById("slider");
    if (slider) {
      slider.addEventListener("scroll", () => {
        if (slider.scrollLeft === 0) {
          setHideLeft(true);
        } else {
          setHideLeft(false);
        }
        if (slider.scrollLeft + slider.offsetWidth === slider.scrollWidth) {
          setHideRight(true);
        } else {
          setHideRight(false);
        }
      });
    }
  }, []);

  return (
    <div className={styles.trips}>
      <div className={styles.container}>
        {props.showButtons && !hideLeft && (
          <MdChevronLeft
            size={40}
            className={styles.sliderIconLeft}
            onClick={slideLeft}
          />
        )}
        <div id="slider">
          {slides.map((slide: any, idx: number) => (
            <SliderCard
              slide={slide}
              highlighted={highlighted === idx}
              key={idx}
            />
          ))}
        </div>
        {props.showButtons && !hideRight && (
          <MdChevronRight
            size={40}
            className={styles.sliderIconRight}
            onClick={slideRight}
          />
        )}
      </div>
    </div>
  );
};

export default Slider;
