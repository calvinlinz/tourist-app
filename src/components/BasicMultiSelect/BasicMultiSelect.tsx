import * as React from "react";
import { Theme, useTheme } from "@mui/material/styles";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

function getStyles(item: string, personName: string[], theme: Theme) {
  return {
    fontWeight:
      personName.indexOf(item) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

interface MultiSelectProps {
  items: any[];
  onChange: (value: any) => void;
  label?: string;
  width?: number;
}

export default function MultipleSelect({
  items,
  onChange,
  label,
  width,
}: MultiSelectProps) {
  const theme = useTheme();
  const [personName, setPersonName] = React.useState<string[]>([]);

  const handleChange = (event: SelectChangeEvent<typeof personName>) => {
    const {
      target: { value },
    } = event;
    const newValue = typeof value === "string" ? value.split(",") : value;
    onChange(newValue);
    setPersonName(newValue);
  };

  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: width ?? 200,
      },
    },
  };

  return (
    <div>
      <FormControl sx={{ m: 0, width: width ?? 200 }} size="small">
        <InputLabel id="demo-multiple-item-label">{label ?? "Item"}</InputLabel>
        <Select
          labelId="demo-multiple-item-label"
          id="demo-multiple-item"
          multiple
          value={personName}
          onChange={handleChange}
          input={<OutlinedInput label={label ?? "Item"} />}
          MenuProps={MenuProps}
        >
          {items.map((item, idx) => (
            <MenuItem
              key={item}
              value={item}
              style={getStyles(item, personName, theme)}
            >
              {item}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}
