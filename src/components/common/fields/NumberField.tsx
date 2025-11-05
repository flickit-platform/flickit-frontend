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
};

export const NumberField: React.FC<NumberFieldProps> = ({
  value,
  onChange,
  type,
  min = Number.NEGATIVE_INFINITY,
  max = Number.POSITIVE_INFINITY,
  allowEmpty = true,
  acceptComma = true,
  ...textFieldProps
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let s = e.target.value;

    if (acceptComma) s = s.replace(/,/g, ".");

    if (s === "") {
      if (allowEmpty) onChange(s);
      return;
    }

    if (min < 0 && s === "-") {
      onChange(s);
      return;
    }

    if (type === "float") {
      if (s === "." || s === "0." || (min < 0 && (s === "-." || s === "-0."))) {
        onChange(s);
        return;
      }
      if (!/^-?\d*\.?\d*$/.test(s)) return;
    } else {
      // int
      if (!/^-?\d*$/.test(s)) return;
    }

    let num = Number(s);
    if (!Number.isFinite(num)) return;

    if (type === "int") num = Math.trunc(num);
    if (num < min) num = min;
    if (num > max) num = max;

    onChange(String(num));
  };

  return (
    <TextField
      {...textFieldProps}
      value={value ?? ""}
      onChange={handleChange}
      type="text"
      inputMode={type === "float" ? "decimal" : "numeric"}
      sx={{
        mt: 0.3,
        fontSize: 14,
        "& .MuiInputBase-root": { height: 36, fontSize: 14 },
        "& .MuiFormLabel-root": { fontSize: 14 },
        bgcolor: "background.containerLowest",
      }}
    />
  );
};
