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
      if (
        string === "." ||
        string === "0." ||
        (min < 0 && (string === "-." || string === "-0."))
      ) {
        onChange(string);
        return;
      }
      if (!/^-?\d*\.?\d*$/.test(string)) return;
    } else {
      if (!/^-?\d*$/.test(string)) return;
    }
    let num = Number(string);
    if (!Number.isFinite(num)) return;
    if (type === "int") num = Math.trunc(num);
    if (num < min) num = min;
    if (num > max) num = max;
    onChange(num);
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
