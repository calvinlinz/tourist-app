import styles from "./TripBox.module.css";
import DotDivider from "./components/DotDivider/DotDivider";

export default function TripBox(ref: any) {
  return (
    <div className={styles.container}>
      <div className={styles.photo}>
        <img src="./auckland.webp" alt="trip" className={styles.image} />
      </div>
      <div>
        <h2 className={styles.title}>Trip to Auckland</h2>
      </div>
      <div className={styles.text}>
        <span>18 Mar - 20 Mar</span>
        <DotDivider />
        <span>18 Places</span>
      </div>
    </div>
  );
}
