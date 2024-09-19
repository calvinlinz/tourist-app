import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import styles from "./Slider.module.css";
import React, { useEffect, useState } from "react";
import { Slide, SlideType } from "../../types";
import SliderCard from "./components/SliderCard/SliderCard";

interface SliderProps {
  slides: SlideType[];
  showButtons: boolean;
}

const Slider = (props: SliderProps) => {
  const [slidesWithImages, setSlidesWithImages] = useState([]);
  const [hideLeft, setHideLeft] = useState(true);
  const [hideRight, setHideRight] = useState(false);
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
    <div className={styles.container}>
      {props.showButtons && !hideLeft && (
        <MdChevronLeft
          size={40}
          className={styles.sliderIconLeft}
          onClick={slideLeft}
        />
      )}
      <div id="slider">
        {props.slides.map((slide: any, idx: number) => (
          <SliderCard slide={slide} key={idx} />
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
  );
};

export default Slider;
