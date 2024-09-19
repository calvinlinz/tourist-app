import { Input } from "rsuite";
import styles from './InputField.module.css'


export interface InputFieldProps {
  inputRef: React.Ref<any> | undefined;
  width?: string;
  placeholder?: string;
}


const inputStyle = {
  borderColor: "transparent",
  borderRadius: "10px",
};

function InputField(props: InputFieldProps) {
  return (
    <div
      style={{
        display: "inline-block",
        verticalAlign: "middle",
        width: props.width,
        zIndex: 0,
        borderRadius: "10px",
      }}
    >
      <Input
        style={inputStyle}
        inputRef={props.inputRef}
        placeholder={props.placeholder}
      />
    </div>
  );
}

export default InputField;
