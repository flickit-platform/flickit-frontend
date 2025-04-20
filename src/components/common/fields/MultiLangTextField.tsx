import { useState } from "react";
import Box from "@mui/material/Box";
import TextField, { TextFieldProps } from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import LanguageIcon from "@mui/icons-material/LanguageRounded";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import GlobePlus from "@/assets/svg/globePlus.svg";

interface MultiLangTextFieldProps extends Omit<TextFieldProps, "variant"> {
  name: string;
  translationValue?: string;
  onTranslationChange?: (e: { target: { value: string | undefined } }) => void;
  translationLabel?: string;
  showTranslation?: boolean;
  setShowTranslation?: (val: boolean) => void;
}

const MultiLangTextField = ({
  name,
  value,
  onChange,
  label,
  inputProps,
  translationValue,
  onTranslationChange,
  translationLabel = "Translation",
  showTranslation: controlledShow,
  setShowTranslation: controlledSetter,
  multiline = false,
  minRows,
  maxRows,
  ...rest
}: MultiLangTextFieldProps) => {
  const [internalShow, setInternalShow] = useState(false);

  const isControlled =
    controlledShow !== undefined && controlledSetter !== undefined;
  const showTranslation = isControlled ? controlledShow : internalShow;
  const setShowTranslation = isControlled ? controlledSetter : setInternalShow;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, width: "85%" }}>
      <Box sx={{ display: "flex", gap: 1 }}>
        <Box sx={{ flexGrow: 1 }}>
          <TextField
            {...rest}
            name={name}
            value={value}
            onChange={onChange}
            label={label}
            fullWidth
            inputProps={inputProps}
            multiline={multiline}
            minRows={minRows}
            maxRows={maxRows}
            sx={{
              "& .MuiOutlinedInput-root": {
                backgroundColor: "#fff",
                fontSize: 14,
                ...(multiline ? {} : { height: 40 }),
              },
              "& .MuiFormLabel-root": {
                fontSize: 14,
              },
              ...rest.sx,
            }}
          />
        </Box>

        {!showTranslation && (
          <IconButton
            onClick={() => setShowTranslation(true)}
            sx={{
              width: 40,
              height: 40,
              padding: 0,
              borderRadius: "50%",
              backgroundColor: "#F3F5F6",
            }}
          >
            <Box
              component="img"
              src={GlobePlus}
              alt="Add Translation"
              sx={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
              }}
            />
          </IconButton>
        )}
      </Box>

      {/* Translation field */}
      {showTranslation && (
        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
          {/* Lang icon in grey container */}
          <Box
            sx={{
              backgroundColor: "#F3F5F6",
              borderRadius: 2,
              px: 1,
              py: 0.5,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              minWidth: 40,
            }}
          >
            <LanguageIcon fontSize="small" color="info" />
            <Typography variant="caption" fontSize={10}>
              FA
            </Typography>
          </Box>

          <TextField
            fullWidth
            value={translationValue}
            onChange={onTranslationChange}
            label={translationLabel}
            inputProps={{
              style: {
                ...inputProps?.style,
                paddingLeft: 10,
              },
            }}
            multiline={multiline}
            minRows={minRows}
            maxRows={maxRows}
            sx={{
              "& .MuiOutlinedInput-root": {
                backgroundColor: "#fff",
                fontSize: 14,
                ...(multiline ? {} : { height: 40 }),
              },
              "& .MuiFormLabel-root": {
                fontSize: 14,
              },
              flexGrow: 1,
            }}
          />

          <IconButton
            size="small"
            onClick={() => {
              setShowTranslation(false);
              onTranslationChange?.({
                target: { value: undefined },
              });
            }}
            sx={{ mt: multiline ? 1 : 0 }}
          >
            <DeleteForeverOutlinedIcon color="error" />
          </IconButton>
        </Box>
      )}
    </Box>
  );
};

export default MultiLangTextField;
