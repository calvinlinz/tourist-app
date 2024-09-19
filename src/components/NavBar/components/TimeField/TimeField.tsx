import { DateRangePicker } from "rsuite";
import styles from "./TimeField.module.css";
import { FaCalendar, FaClock } from "react-icons/fa";

interface Props {
  onDaysSelect: (days: any) => void;
}

const inputStyle = {
  borderColor: "transparent",
  borderRadius: "6px",
};

export const TimeField = ({ onDaysSelect }: Props) => {
  const { combine, beforeToday, allowedMaxDays } = DateRangePicker;

  return (
    <div className={styles.picker}>
      <DateRangePicker
        character=" - "
        style={inputStyle}
        size="md"
        format="HH"
        caretAs={FaClock}
        appearance="subtle"
        onChange={onDaysSelect}
        placeholder={"Time Frame"}
        showHeader={false}
      />
    </div>
  );
};
