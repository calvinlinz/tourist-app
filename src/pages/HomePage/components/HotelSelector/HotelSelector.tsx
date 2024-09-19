import styles from "./HotelSelector.module.css";

export const HotelSelector = () => {
  return (
    <div className={styles.container}>
      <div className={styles.image}></div>

      <div className={styles.content}>
        <div className={styles.title}>Select a Hotel</div>
        <div className={styles.description}>
          We have found the best hotels for you to stay in.
        </div>
        <div className={styles.footer}>Select Hotel</div>
      </div>
    </div>
  );
};
