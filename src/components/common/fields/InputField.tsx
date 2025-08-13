import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import InputAdornment from "@mui/material/InputAdornment";
import TextField, { OutlinedTextFieldProps } from "@mui/material/TextField";
import { ReactNode, useState, useRef, useEffect, ChangeEvent } from "react";
import { useFormContext } from "react-hook-form";
import getFieldError from "@utils/getFieldError";
import { farsiFontFamily, primaryFontFamily } from "@/config/theme";
import { evidenceAttachmentInput } from "@utils/enumType";
import languageDetector from "@utils/languageDetector";
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
}

const InputFieldUC = (props: IInputFieldUCProps) => {
  const {
    name,
    required,
    InputLabelProps,
    type,
    minLength,
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
    ...rest
  } = props;
  const theme = useTheme();

  const inputRef = useRef<HTMLInputElement | null>(null);

  const {
    register,
    formState: { errors },
  } = useFormContext();

  const [showPassword, toggleShowPassword] = usePasswordFieldAdornment();
  const { hasError, errorMessage } = getFieldError(
    errors,
    name,
    minLength,
    maxLength,
    lng,
  );

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
      direction = rtl ? "rtl" : "ltr";
    } else {
      direction = isFarsiText ? "rtl" : "ltr";
    }
    inputEl.dir = direction;

    inputEl.style.fontFamily = isFarsiText
      ? farsiFontFamily
      : primaryFontFamily;
  }, [isFocused]);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    if (setValueCount) {
      setValueCount(value);
    }

    if (type !== "password") {
      const isFarsiText = languageDetector(value);
      const valueIsEmpty = value.length === 0;

      let direction;
      if (valueIsEmpty) {
        direction = rtl ? "rtl" : "ltr";
      } else {
        direction = isFarsiText ? "rtl" : "ltr";
      }

      event.target.dir = direction;
      event.target.style.fontFamily = isFarsiText
        ? farsiFontFamily
        : primaryFontFamily;
    }

    if (type === "password" && inputRef.current) {
      inputRef.current.focus();
    }
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
      message: t("errors.invalidEmail"),
    };
  }
  if (minLength) validationRules.minLength = minLength;
  if (maxLength) validationRules.maxLength = maxLength;

  return (
    <TextField
      {...rest}
      {...register(name, validationRules)}
      data-testid={`input-${name}`}
      type={showPassword ? "text" : type}
      fullWidth
      size="small"
      variant="outlined"
      inputRef={inputRef}
      placeholder={placeholder}
      onChange={handleInputChange}
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
        },
        "& .MuiFormHelperText-root": {
          textAlign:
            lng === "fa" || i18next.language === "fa" ? "right" : "left",
          ...styles.rtlStyle(lng === "fa" || i18next.language === "fa"),
        },
      }}
      InputLabelProps={{ ...InputLabelProps, required }}
      InputProps={
        type === "password"
          ? {
              endAdornment: (
                <InputAdornment
                  sx={{ cursor: "pointer" }}
                  position="end"
                  onClick={toggleShowPassword}
                  onMouseDown={(e: any) => {
                    e.preventDefault();
                  }}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </InputAdornment>
              ),
            }
          : {
              sx: inputStyle,
            }
      }
      error={hasError || error}
      helperText={(errorMessage as ReactNode) || helperText}
    />
  );
};

export const usePasswordFieldAdornment: () => [boolean, () => void] = () => {
  const [showPassword, setShowPassword] = useState(false);
  const toggleShowPassword = () => {
    setShowPassword((state) => !state);
  };
  return [showPassword, toggleShowPassword];
};

export { InputFieldUC, InputField };
