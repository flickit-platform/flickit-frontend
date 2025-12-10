import { useState } from "react";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Box from "@mui/material/Box";
import { useTheme } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";
import getFieldError from "@/utils/get-field-error";
import RichEditor from "../rich-editor/RichEditor";
import firstCharDetector from "@/utils/first-char-detector";

const RichEditorField = (props: any) => {
  const {
    name,
    rules = {},
    defaultValue,
    required = false,
    showEditorMenu,
    ...rest
  } = props;
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      rules={{ ...rules, required }}
      shouldUnregister={true}
      defaultValue={defaultValue}
      render={({ field }) => {
        return (
          <RichEditorFieldBase
            {...rest}
            name={name}
            required={required}
            field={field}
            defaultValue={defaultValue}
            showEditorMenu={showEditorMenu}
          />
        );
      }}
    />
  );
};

const RichEditorFieldBase = (props: any) => {
  const {
    defaultValue,
    name,
    field,
    required,
    label,
    disable_label,
    placeholder,
    type,
    showEditorMenu,
    bgcolor,
    menuProps,
    richEditorProps,
  } = props;

  const theme = useTheme();
  const [shrink, setShrink] = useState(() => Boolean(defaultValue));
  const [focus, setFocus] = useState(false);
  const [hover, setHover] = useState(false);

  const {
    formState: { errors },
  } = useFormContext();
  const { hasError, errorMessage } = getFieldError(errors, name);
  const show_label = !disable_label;

  const safeDefaultValue = (defaultValue || "") as string;

  return (
    <FormControl
      fullWidth
      variant="outlined"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocus={(e) => {
        if (e.target?.id === "proseMirror") {
          setFocus(true);
          setShrink(true);
        }
      }}
      onBlurCapture={() => {
        setHover(false);
      }}
      onBlur={(e) => {
        setHover(false);
        if (!field?.value) {
          setFocus(false);
          setShrink(false);
          field.onBlur();
        }
      }}
      sx={{
        position: "relative",
        minHeight: "54px",
        "& .MuiInputBase-input": {
          marginTop: 0,
        },
      }}
      error={hasError}
    >
      {show_label && menuProps?.variant !== "inline" && (
        <InputLabel
          className={focus ? "Mui-focused" : ""}
          shrink={shrink}
          sx={{
            bgcolor: !bgcolor ? "background.containerLowest" : bgcolor,
            px: 0.2,
          }}
          required={required}
        >
          {label}
        </InputLabel>
      )}

      <RichEditor
        isEditable={true}
        className={
          "MuiInputBase-input MuiOutlinedInput-input MuiInputBase-inputSizeSmall" +
          (focus ? " Mui-focused" : "") +
          (hasError ? " Mui-error" : "")
        }
        defaultValue={safeDefaultValue}
        field={field}
        checkLang={firstCharDetector(safeDefaultValue.replace(/<[^<>]+>/g, ""))}
        placeholder={placeholder}
        type={type}
        showEditorMenu={showEditorMenu || hover}
        bgcolor={bgcolor}
        menuProps={menuProps}
        richEditorProps={richEditorProps}
      />

      {hasError && errorMessage && (
        <Box
          sx={{
            position: "absolute",
            bottom: 4,
            left: 12,
            right: 12,
            pointerEvents: "none",
            fontSize: "0.75rem",
            lineHeight: 1.4,
            color: theme.palette.error.main,
          }}
        >
          {errorMessage as string}
        </Box>
      )}
    </FormControl>
  );
};

export default RichEditorField;
