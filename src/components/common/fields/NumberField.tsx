import * as React from "react";
import TextField, { TextFieldProps } from "@mui/material/TextField";

type NumberFieldValue = string | number;
export type NumberFieldProps = Omit<
  TextFieldProps,
  "type" | "inputMode" | "onChange" | "value"
> & {
  value: NumberFieldValue;
  onChange: (next: NumberFieldValue) => void;
  type: "float" | "int";
  min?: number;
  max?: number;
  allowEmpty?: boolean;
  acceptComma?: boolean;
  placeholder?: string;
};

export const NumberField: React.FC<NumberFieldProps> = ({
  value,
  onChange,
  type,
  min = Number.NEGATIVE_INFINITY,
  max = Number.POSITIVE_INFINITY,
  allowEmpty = true,
  acceptComma = true,
  placeholder,
  ...textFieldProps
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;

    if (acceptComma && value.includes(",")) value = value.replace(/,/g, ".");

    if (value === "") {
      if (allowEmpty) onChange(value);
      return;
    }
    if (min < 0 && value === "-") {
      onChange(value);
      return;
    }

    if (type === "float") {
      const isInterim =
      value === "." || value === "0." || (min < 0 && (value === "-." || value === "-0."));
      if (isInterim) {
        onChange(value);
        return;
      }

      const reFloat = /^-?(?:\d+(?:\.\d*)?|\.\d+)$/;
      if (!reFloat.test(value)) return;
    } else {
      const reInt = /^-?\d+$/; 
      if (!reInt.test(value)) return;
    }

    let n = Number(value);
    if (!Number.isFinite(n)) return;

    if (type === "int") n = Math.trunc(n);
    if (n < min) n = min;
    if (n > max) n = max;

    onChange(n);
  };

  const blockInvalidKeys = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const el = e.currentTarget;
    const key = e.key;
    const control = [
      "Backspace",
      "Delete",
      "Tab",
      "ArrowLeft",
      "ArrowRight",
      "Home",
      "End",
      "Enter",
    ];
    if (control.includes(key)) return;
    if (/^[0-9]$/.test(key)) return;
    if (key === "." && type === "float" && !el.value.includes(".")) return;
    if (
      key === "-" &&
      min < 0 &&
      el.selectionStart === 0 &&
      !el.value.startsWith("-")
    )
      return;
    e.preventDefault();
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasted = e.clipboardData.getData("text").replace(/,/g, ".");
    const re = type === "float" ? /^-?\d*\.?\d*$/ : /^-?\d*$/;
    if (!re.test(pasted)) {
      e.preventDefault();
      return;
    }
    const result =
      e.currentTarget.value.slice(0, e.currentTarget.selectionStart ?? 0) +
      pasted +
      e.currentTarget.value.slice(e.currentTarget.selectionEnd ?? 0);
    if (type === "float" && (result.match(/\./g)?.length ?? 0) > 1)
      e.preventDefault();
    if (type === "int" && /[.]/.test(pasted)) e.preventDefault();
  };

  return (
    <TextField
      {...textFieldProps}
      placeholder={placeholder}
      value={value ?? ""}
      onChange={handleChange}
      onKeyDown={blockInvalidKeys}
      onPaste={handlePaste}
      onWheel={(e) => (e.target as HTMLInputElement).blur()}
      type="number"
      inputMode={type === "float" ? "decimal" : "numeric"}
      inputProps={{
        ...(textFieldProps.inputProps || {}),
        step: type === "float" ? "any" : 1,
        min,
        max,
      }}
      sx={{
        width: 90,
        mt: 0.3,
        fontSize: 14,
        "& .MuiInputBase-root": { height: 36, fontSize: 14 },
        "& .MuiFormLabel-root": { fontSize: 14 },
        bgcolor: "background.containerLowest",
      }}
    />
  );
};
