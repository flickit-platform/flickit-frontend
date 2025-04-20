import { useState } from "react";
import {
  Box,
  IconButton,
  Typography,
  TextField,
  TextFieldProps,
} from "@mui/material";
import LanguageIcon from "@mui/icons-material/LanguageRounded";
import GlobePlus from "@/assets/svg/globePlus.svg";
import GlobeSub from "@/assets/svg/globeSub.svg";
import RichEditor from "../rich-editor/RichEditor";
import firstCharDetector from "@utils/firstCharDetector";

interface MultiLangTextFieldProps extends Omit<TextFieldProps, "variant"> {
  name: string;
  value?: string;
  onChange?: (e: any) => void;
  translationValue?: string;
  onTranslationChange?: (e: { target: { value: string | undefined } }) => void;
  translationLabel?: string;
  showTranslation?: boolean;
  setShowTranslation?: (val: boolean) => void;
  useRichEditor?: boolean;
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
  useRichEditor = false,
  ...rest
}: MultiLangTextFieldProps) => {
  const [internalShow, setInternalShow] = useState(false);
  const showTranslation = controlledShow ?? internalShow;
  const setShowTranslation = controlledSetter ?? setInternalShow;

  const handleChange = (e: any) => {
    const newValue = e.target.value === "" ? undefined : e.target.value;
    onChange?.({ target: { value: newValue } });
  };

  const renderInput = (
    val: string | undefined,
    handleChange: any,
    labelText?: React.ReactNode,
  ) =>
    useRichEditor ? (
      <RichEditor
        isEditable
        field={{
          name,
          value: val,
          onChange: (v: string) => handleChange?.({ target: { value: v } }),
          onBlur: () => {},
          ref: () => {},
        }}
        defaultValue={val}
        placeholder={typeof labelText === "string" ? labelText : undefined}
        checkLang={firstCharDetector(val?.replace(/<[^<>]+>/g, "") ?? "")}
        showEditorMenu={false}
      />
    ) : (
      <TextField
        {...rest}
        fullWidth
        value={val}
        onChange={handleChange}
        label={labelText}
        inputProps={inputProps}
        onClick={(e) => e.stopPropagation()}
        sx={{
          "& .MuiOutlinedInput-root": {
            backgroundColor: "#fff",
            fontSize: 14,
            height: useRichEditor || rest.multiline ? "auto" : 40,
          },
          "& .MuiFormLabel-root": { fontSize: 14 },
          ...rest.sx,
        }}
      />
    );

  const handleShowTranslation = (e: any, state: boolean) => {
    e.stopPropagation();
    setShowTranslation(state);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {/* Original Field */}
      <Box sx={{ display: "flex", gap: 1 }}>
        <Box sx={{ flexGrow: 1 }}>
          {renderInput(value, handleChange, label)}
        </Box>

        <IconButton
          onClick={(e) => handleShowTranslation(e, !showTranslation)}
          sx={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            p: showTranslation ? 1 : 0,
          }}
        >
          <Box
            component="img"
            src={showTranslation ? GlobeSub : GlobePlus}
            alt="Add Translation"
            sx={{ width: "100%", height: "100%", objectFit: "contain" }}
          />
        </IconButton>
      </Box>

      {/* Translation Field */}
      {showTranslation && (
        <Box sx={{ display: "flex", gap: 1 }}>
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

          <Box sx={{ flexGrow: 1 }}>
            {renderInput(
              translationValue,
              onTranslationChange,
              translationLabel,
            )}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default MultiLangTextField;
