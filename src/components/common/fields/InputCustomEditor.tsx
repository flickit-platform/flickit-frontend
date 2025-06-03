import React from "react";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import { theme } from "@config/theme";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import { styles } from "@styles";
import languageDetector from "@/utils/languageDetector";

const InputCustomEditor = (props: any) => {
  const {
    inputProps,
    hasError,
    name,
    data,
    inputHandler,
    value,
    handleDone,
    handleCancel,
  } = props;

  const isRTL = languageDetector(value);

  const buttonStyle = {
    background: theme.palette.primary.main,
    "&:hover": { background: theme.palette.primary.dark },
    borderRadius: "6px",
    padding: "6px",
    mx: 0.1,
  };

  return (
    <OutlinedInput
      inputProps={inputProps}
      error={hasError}
      fullWidth
      name={name}
      onChange={inputHandler}
      value={value ?? ""}
      required
      multiline
      sx={{
        borderRadius: "6px",
        ...styles.rtlStyle(isRTL),
      }}
      endAdornment={
        <InputAdornment
          position="end"
          sx={{ gap: 0.5, mr: isRTL ? 0 : -1, ml: isRTL ? -1 : 0 }}
        >
          <IconButton
            title="Submit Edit"
            edge="end"
            sx={buttonStyle}
            onClick={handleDone}
          >
            <CheckCircleOutlineRoundedIcon sx={{ color: "#fff" }} />
          </IconButton>
          <IconButton
            title="Cancel Edit"
            edge="end"
            sx={buttonStyle}
            onClick={handleCancel}
          >
            <CancelRoundedIcon sx={{ color: "#fff" }} />
          </IconButton>
        </InputAdornment>
      }
    />
  );
};

export default InputCustomEditor;
