import { useState } from "react";
import { Box, IconButton, TextField, TextFieldProps } from "@mui/material";
import LanguageIcon from "@mui/icons-material/LanguageRounded";
import AddLanguage from "@/assets/svg/add-language.svg";
import RemoveLanguage from "@/assets/svg/remove-language.svg";
import RichEditor from "../rich-editor/RichEditor";
import firstCharDetector from "@/utils/first-char-detector";
import { useKitDesignerContext } from "@/providers/kit-provider";
import languageDetector from "@/utils/language-detector";
import { farsiFontFamily, primaryFontFamily } from "@/config/theme";
import { t } from "i18next";
import { styles } from "@styles";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { Text } from "../Text";

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
  lang?: string;
  handleCancelTextBox?: any;
  handleSaveEdit?: any;
  bgcolor?: string;
}

const MultiLangTextField = ({
  name,
  value,
  onChange,
  label,
  inputProps,
  translationValue = "",
  onTranslationChange,
  translationLabel = t("common.translation") ?? "",
  showTranslation: controlledShow,
  setShowTranslation: controlledSetter,
  useRichEditor = false,
  multiline = false,
  minRows,
  maxRows,
  lang,
  handleCancelTextBox,
  handleSaveEdit,
  bgcolor,
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
            bgcolor: bgcolor ?? "background.containerLowest",
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
        <Box sx={{ ...styles.centerH }}>
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
                src={showTranslation ? RemoveLanguage : AddLanguage}
                alt="Toggle Translation"
                sx={{ width: "100%", height: "100%", objectFit: "contain" }}
              />
            </IconButton>
          )}
            <>
              {!!handleSaveEdit && <IconButton
                size="small"
                onClick={handleSaveEdit}
                color="success"
                sx={{ ...styles.fixedIconButtonStyle }}
                data-testid="check-icon-id"
              >
                <CheckRoundedIcon fontSize="small" />
              </IconButton> }
              {!!handleCancelTextBox && <IconButton
                size="small"
                onClick={() => handleCancelTextBox(name)}
                color="secondary"
                sx={{ ...styles.fixedIconButtonStyle }}
                data-testid="close-icon-id"
              >
                <CloseRoundedIcon fontSize="small" />
              </IconButton>}
            </>
        </Box>
      </Box>

      {/* Translation Field */}
      {!!langCode && showTranslation && (
        <Box sx={{ display: "flex", gap: 1, width: "100%" }}>
          <Box
            bgcolor="background.container"
            borderRadius={2}
            px={1}
            py={0.5}
            minWidth={40}
            sx={{ ...styles.centerCVH }}
          >
            <LanguageIcon fontSize="small" color="info" />
            <Text variant="caption" fontSize={10}>
              {langCode.toUpperCase()}
            </Text>
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
