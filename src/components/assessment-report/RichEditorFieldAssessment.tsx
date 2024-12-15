import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import InputLabel from "@mui/material/InputLabel";
import { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import getFieldError from "@utils/getFieldError";
import RichEditorAssessment from "./RichEditorAssessment";
import firstCharDetector from "@utils/firstCharDetector";

const RichEditorFieldAssessment = (props: any) => {
  const { name, rules = {}, defaultValue, required = false, ...rest } = props;
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      rules={{ ...rules, required }}
      shouldUnregister={true}
      defaultValue={defaultValue}
      render={({ field, fieldState, formState }) => {
        return (
          <RichEditorFieldBase
            {...rest}
            name={name}
            required={required}
            field={field}
            defaultValue={defaultValue}
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
    setLangDir,
    setNewAdvice,
    removeDescriptionAdvice,
  } = props;
  const [shrink, setShrink] = useState(() => Boolean(defaultValue));
  const [focus, setFocus] = useState(false);

  const {
    formState: { errors },
  } = useFormContext();
  const { hasError, errorMessage } = getFieldError(errors, name);
  const show_label = disable_label ? false : true;
  
  return (
    <FormControl
      fullWidth
      variant="outlined"
      onFocus={(e) => {
        if (e.target?.id === "proseMirror") {
          setFocus(true);
          setShrink(true);
        }
      }}
      onBlur={(e) => {
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
          marginTop: shrink ? 0 : 0.8,
        },
      }}
      error={hasError}
    >
      {show_label && (
        <InputLabel
          className={focus ? "Mui-focused" : ""}
          shrink={shrink}
          sx={{ background: "white", px: 0.2 }}
          required={required}
        >
          {label}
        </InputLabel>
      )}
      <RichEditorAssessment
        isEditable={true}
        className={
          "MuiInputBase-input MuiOutlinedInput-input MuiInputBase-inputSizeSmall" +
          (focus ? " Mui-focused" : "") +
          (hasError ? " Mui-error" : "")
        }
        defaultValue={defaultValue}
        field={field}
        checkLang={firstCharDetector(defaultValue.replace(/<[^>]*>/g, ""))}
        setLangDir={setLangDir}
        setNewAdvice={setNewAdvice}
        removeDescriptionAdvice={removeDescriptionAdvice}
      />
      <FormHelperText>{errorMessage as string}</FormHelperText>
    </FormControl>
  );
};

export default RichEditorFieldAssessment;
