import TextField, { OutlinedTextFieldProps } from "@mui/material/TextField";
import { ReactNode, useRef, useEffect, ChangeEvent } from "react";
import { useFormContext } from "react-hook-form";
import getFieldError from "@/utils/get-field-error";
import { farsiFontFamily, primaryFontFamily } from "@/config/theme";
import { evidenceAttachmentInput } from "@/utils/enum-type";
import languageDetector from "@/utils/language-detector";
import i18next, { t } from "i18next";
import { styles } from "@styles";
import { useTheme } from "@mui/material";

const InputField = () => {
  return <TextField />;
};

interface IInputFieldUCProps extends Omit<OutlinedTextFieldProps, "variant"> {
  name: string;
  minLength?: number;
  maxLength?: number;
  isFocused?: boolean;
  pallet?: any;
  borderRadius?: string;
  setValueCount?: any;
  hasCounter?: boolean;
  isFarsi?: boolean;
  isEditing?: boolean;
  valueCount?: string;
  rtl?: boolean;
  error?: boolean;
  placeholder?: any;
  lng?: string;
  stylesProps?: any;
}

const InputFieldUC = (props: IInputFieldUCProps) => {
  const {
    name,
    required,
    InputLabelProps,
    minLength = 3,
    maxLength,
    helperText,
    isFocused,
    pallet,
    borderRadius,
    setValueCount,
    hasCounter,
    isFarsi,
    isEditing,
    valueCount,
    rtl,
    error,
    placeholder,
    lng,
    stylesProps,
    ...rest
  } = props;
  const theme = useTheme();

  const inputRef = useRef<HTMLInputElement | null>(null);

  const { register, getFieldState, formState } = useFormContext();

  const fieldState = getFieldState(name, formState);
  const showErrorAfterSubmit = formState.submitCount > 0 && !!fieldState.error;

  const { errorMessage } = getFieldError(
    formState.errors,
    name,
    minLength,
    maxLength,
    lng,
  );
  const effectiveHelperText: ReactNode = showErrorAfterSubmit
    ? (errorMessage as ReactNode)
    : helperText;

  useEffect(() => {
    if (isFocused && inputRef.current) {
      inputRef.current.focus();
    } else {
      inputRef.current?.blur();
    }
  }, [isFocused]);

  useEffect(() => {
    const inputEl = inputRef.current;
    if (!inputEl) return;

    const inputValue = inputEl.value;
    const isFarsiText = languageDetector(inputValue);
    const valueIsEmpty = inputValue.length === 0;

    let direction: "rtl" | "ltr";
    if (valueIsEmpty) {
      direction = i18next.language === "fa" ? "rtl" : "ltr";
    } else {
      direction = isFarsiText ? "rtl" : "ltr";
    }
    inputEl.dir = direction;

    inputEl.style.fontFamily = isFarsiText
      ? farsiFontFamily
      : primaryFontFamily;
  }, [isFocused, rtl]);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    if (setValueCount) {
      setValueCount(value);
    }

    const isFarsiText = languageDetector(value);
    const valueIsEmpty = value.length === 0;

    const direction = valueIsEmpty
      ? rtl
        ? "rtl"
        : "ltr"
      : isFarsiText
        ? "rtl"
        : "ltr";

    event.target.dir = direction;
    event.target.style.fontFamily = isFarsiText
      ? farsiFontFamily
      : primaryFontFamily;
  };

  let inputStyle = {};
  if (hasCounter) {
    inputStyle =
      isFarsi || rtl
        ? { paddingLeft: { sm: "80px" }, minHeight: "110px" }
        : { paddingRight: { sm: "80px" }, minHeight: "110px" };
  }

  const validationRules: any = { required };
  if (name === "email") {
    validationRules.pattern = {
      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      message: t("errors.invalidEmail", { lng }),
    };
  }
  if (minLength) validationRules.minLength = minLength;
  if (maxLength) validationRules.maxLength = maxLength;

  const registered = register(name, {
    ...validationRules,
    onChange: handleInputChange,
  });

  const mergedInputRef = (el: HTMLInputElement | null) => {
    inputRef.current = el;
    registered.ref(el);
  };

  return (
    <TextField
      {...rest}
      {...registered}
      data-testid={`input-${name}`}
      fullWidth
      size="small"
      variant="outlined"
      inputRef={mergedInputRef}
      placeholder={placeholder}
      sx={{
        "& ::placeholder": { ...theme.typography.bodyMedium },
        bgcolor: pallet?.background,
        borderRadius: borderRadius,
        "& .MuiOutlinedInput-root": {
          "& ::placeholder": {
            ...theme.typography.bodyMedium,
            textAlign: languageDetector(placeholder) ? "right" : "left",
            fontFamily: "inherit",
          },
          "& fieldset": {
            borderColor: pallet?.borderColor,
            borderRadius: borderRadius,
            textAlign: "initial",
          },
          "&:hover fieldset": {
            borderColor: pallet?.borderHover,
          },
          "&.Mui-focused fieldset": {
            borderColor: pallet?.borderColor,
          },
          paddingTop:
            isEditing && name === "evidenceDetail"
              ? evidenceAttachmentInput.paddingTop
              : "",
          paddingBottom:
            name === "evidence" ? evidenceAttachmentInput.paddingBottom : "",
          ...stylesProps,
        },
        "& .MuiFormHelperText-root": {
          textAlign:
            lng === "fa" || (!lng && i18next.language === "fa")
              ? "right"
              : "left",
          ...styles.rtlStyle(
            lng === "fa" || (!lng && i18next.language === "fa"),
          ),
        },
      }}
      InputLabelProps={{ ...InputLabelProps, required }}
      InputProps={{ sx: inputStyle }}
      error={showErrorAfterSubmit || !!error}
      helperText={effectiveHelperText}
    />
  );
};

export { InputFieldUC, InputField };
