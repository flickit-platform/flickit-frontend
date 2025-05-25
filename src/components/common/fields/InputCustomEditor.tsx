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
  return (
    <OutlinedInput
      inputProps={inputProps}
      error={hasError}
      fullWidth
      name={name}
      onChange={(e) => inputHandler(e)}
      value={value ?? ""}
      required={true}
      multiline={true}
      sx={{
        borderRadius: "4px",
        ...styles.rtlStyle(languageDetector(value)),
      }}
      endAdornment={
        <InputAdornment position="end">
          <IconButton
            title="Submit Edit"
            edge="end"
            sx={{
              background: theme.palette.primary.main,
              "&:hover": {
                background: theme.palette.primary.dark,
              },
              borderRadius: "3px",
              marginRight: !languageDetector(value) ? "0px" : "-12px",
            }}
            onClick={handleDone}
          >
            <CheckCircleOutlineRoundedIcon sx={{ color: "#fff" }} />
          </IconButton>
          <IconButton
            title="Cancel Edit"
            edge="end"
            sx={{
              background: theme.palette.primary.main,
              "&:hover": {
                background: theme.palette.primary.dark,
              },
              borderRadius: "4px",
              marginRight: !languageDetector(value) ? "-12px" : "0px",
              marginLeft: !languageDetector(value) ? "0px" : "-12px",

            }}
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
