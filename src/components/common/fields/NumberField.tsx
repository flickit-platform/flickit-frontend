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
    let string = e.target.value;

    if (acceptComma) string = string.replace(/,/g, ".");

    if (string === "") {
      if (allowEmpty) onChange(string);
      return;
    }

    if (min < 0 && string === "-") {
      onChange(string);
      return;
    }

    if (type === "float") {
      if (string === "." || string === "0." || (min < 0 && (string === "-." || string === "-0."))) {
        onChange(string);
        return;
      }
      if (!/^-?\d*\.?\d*$/.test(string)) return;
    } else {
      // int
      if (!/^-?\d*$/.test(string)) return;
    }

    let num = Number(string);
    if (!Number.isFinite(num)) return;

    if (type === "int") num = Math.trunc(num);
    if (num < min) num = min;
    if (num > max) num = max;

    onChange(num);
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
