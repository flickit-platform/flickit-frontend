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
import { useKitDesignerContext } from "@/providers/KitProvider";
import languageDetector from "@/utils/languageDetector";
import { farsiFontFamily, primaryFontFamily } from "@/config/theme";
import { t } from "i18next";

interface MultiLangTextFieldProps extends Omit<TextFieldProps, "variant"> {
  name: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  translationValue?: string;
  onTranslationChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
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
  translationLabel = t("common.translation") ?? "",
  showTranslation: controlledShow,
  setShowTranslation: controlledSetter,
  useRichEditor = false,
  multiline = false,
  minRows,
  maxRows,
  ...rest
}: MultiLangTextFieldProps) => {
  const { kitState } = useKitDesignerContext();
  const langCode = kitState.translatedLanguage?.code;

  const [internalShow, setInternalShow] = useState(false);
  const showTranslation = controlledShow ?? internalShow;
  const setShowTranslation = controlledSetter ?? setInternalShow;

  const handleShowTranslation = (
    e: React.MouseEvent<HTMLButtonElement>,
    state: boolean,
  ) => {
    e.stopPropagation();
    setShowTranslation(state);
  };

  const renderInput = (
    val: string | undefined,
    handleChange:
      | ((e: React.ChangeEvent<HTMLInputElement>) => void)
      | undefined,
    labelText?: React.ReactNode,
    testId?: string,
  ) =>
    useRichEditor ? (
      <RichEditor
        isEditable
        field={{
          name,
          value: val,
          onChange: (v: string) =>
            handleChange?.({ target: { name, value: v } } as any),
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
        name={name}
        value={val}
        onChange={handleChange}
        label={labelText}
        inputProps={{
          ...inputProps,
          "data-testid": testId,
          style: {
            textAlign: languageDetector(val) ? "right" : "left",
            fontFamily: languageDetector(val)
              ? farsiFontFamily
              : primaryFontFamily,
            direction: languageDetector(val) ? "rtl" : "ltr",
          },
        }}
        multiline={multiline}
        minRows={minRows}
        maxRows={maxRows}
        fullWidth
        onClick={(e) => e.stopPropagation()}
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
    );

  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", gap: 2, width: "100%" }}
    >
      {/* Original Field */}
      <Box sx={{ display: "flex", gap: 1, width: "100%" }}>
        <Box sx={{ flexGrow: 1, width: "100%" }}>
          {renderInput(value, onChange, label, `${name}-id`)}
        </Box>

        {!!langCode && (
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
              alt="Toggle Translation"
              sx={{ width: "100%", height: "100%", objectFit: "contain" }}
            />
          </IconButton>
        )}
      </Box>

      {/* Translation Field */}
      {!!langCode && showTranslation && (
        <Box sx={{ display: "flex", gap: 1, width: "100%" }}>
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
              {langCode.toUpperCase()}
            </Typography>
          </Box>

          <Box sx={{ flexGrow: 1, width: "100%" }}>
            {renderInput(
              translationValue,
              onTranslationChange,
              translationLabel,
              `${name}-translation-id`,
            )}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default MultiLangTextField;
