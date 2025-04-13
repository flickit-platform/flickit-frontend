import React from 'react';
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import {theme} from "@config/theme";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";

const InputCustomEditor = (props: any) => {
    const {inputProps, hasError, name, data, inputHandler, value, handleDone, handleCancel} = props
    return (
        <OutlinedInput
            inputProps={inputProps}
            error={hasError}
            fullWidth
            name={name}
            onChange={(e) => inputHandler(e)}
            value={value}
            required={true}
            multiline={true}
            sx={{
                minHeight: "38px",
                borderRadius: "4px",
                paddingRight: "12px;",
                fontWeight: "700",
                fontSize: "0.875rem",
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
                            height: "36px",
                            margin: "3px",
                        }}
                        onClick={handleDone}
                    >
                        <CheckCircleOutlineRoundedIcon sx={{color: "#fff"}}/>
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
                            height: "36px",
                        }}
                        onClick={handleCancel}
                    >
                        <CancelRoundedIcon sx={{color: "#fff"}}/>
                    </IconButton>
                </InputAdornment>
            }
        />
    );
};

export default InputCustomEditor;