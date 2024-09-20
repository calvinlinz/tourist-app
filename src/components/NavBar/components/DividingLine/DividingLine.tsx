import styles from "./DividingLine.module.css";

interface DividngLineType {
  width: number;
  height: number;
  color?: string;
}

export default function DividingLine(props: DividngLineType) {
  return (
    <div
      className={styles.container}
      style={{ width: props.width, height: props.height, background: props.color}}
    ></div>
  );
}
