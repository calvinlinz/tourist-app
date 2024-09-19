import Slider from "react-slick";

import styles from "./ImageSlider.module.css";
interface ImageSliderProps {
  images: string[];
  highlighted: boolean;
}
const ImageSlider = ({ images, highlighted }: ImageSliderProps) => {
  const settings = {
    dots: true,
    infinite: images.length > 1,
    draggable: true,
    arrows: false,
  };
  return (
    <div
      className={`${styles.container}             ${
        highlighted ? styles.highlighted : ""
      }`}
    >
      <Slider {...settings}>
        {images.map((image, index) => (
          <img
            key={index}
            src={image}
            height={200}
            width={250}
            style={{
              borderRadius: 10,
            }}
          />
        ))}
      </Slider>
    </div>
  );
};

export default ImageSlider;
