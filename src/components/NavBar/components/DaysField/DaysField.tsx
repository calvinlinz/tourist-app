import React, { useRef, useEffect, useState } from "react";
import { useMapsLibrary } from "@vis.gl/react-google-maps";
import { DateRangePicker, PickerHandle } from "rsuite";
import styles from "./DaysField.module.css";

interface Props {
  onDaysSelect: (days: any) => void;
  onClean: () => void;
}

const inputStyle = {
  borderColor: "transparent",
  borderRadius: "6px",
};

export const DaysField = ({ onDaysSelect }: Props) => {
  const { combine, beforeToday, allowedMaxDays } = DateRangePicker;

  return (
    <div className={styles.picker}>
      <DateRangePicker
        character=" - "
        style={inputStyle}
        size="md"
        format="dd-MM-yy"
        appearance="subtle"
        onChange={onDaysSelect}
        onClean={() => {
          console.log("exit");
        }}
        ranges={[]}
        placeholder={"Trip Dates"}
        showHeader={false}
        shouldDisableDate={combine(allowedMaxDays(7), beforeToday())}
      />
    </div>
  );
};
