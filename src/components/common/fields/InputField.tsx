import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import InputAdornment from "@mui/material/InputAdornment";
import TextField, { OutlinedTextFieldProps } from "@mui/material/TextField";
import { ReactNode, useState, useRef, useEffect, ChangeEvent } from "react";
import { useFormContext } from "react-hook-form";
import getFieldError from "@utils/getFieldError";
import { primaryFontFamily, theme } from "@/config/theme";
import { evidenceAttachmentInput } from "@utils/enumType";
import languageDetector from "@utils/languageDetector";

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
    ...rest
  } = props;

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
  );

  useEffect(() => {
    if (isFocused && inputRef.current) {
      inputRef.current.focus();
    } else {
      inputRef.current?.blur();
    }
  }, [isFocused]);

  useEffect(() => {
    if (inputRef.current) {
      const inputValue = inputRef.current.value;
      const isFarsiText = languageDetector(inputValue);
      inputRef.current.style.fontFamily = isFarsiText
        ? "VazirMatn"
        : primaryFontFamily;
    }
  }, [inputRef.current?.value, isFocused]);

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
        ? "VazirMatn"
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
        ? { paddingLeft: {sm : "80px"}, minHeight: "110px" }
        : { paddingRight: {sm : "80px"}, minHeight: "110px" };
  }

  return (
    <TextField
      {...rest}
      {...register(name, { required, minLength, maxLength })}
      data-testid={`input-${name}`}
      type={showPassword ? "text" : type}
      fullWidth
      size="small"
      variant="outlined"
      inputRef={inputRef}
      onChange={handleInputChange}
      sx={{
        "& ::placeholder": { ...theme.typography.bodyMedium },
        background: pallet?.background,
        borderRadius: borderRadius,
        "& .MuiOutlinedInput-root": {
          "& fieldset": {
            borderColor: pallet?.borderColor,
            borderRadius: borderRadius,
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
