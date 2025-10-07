import { useCallback } from "react";
import MultiLangTextField from "@common/fields/MultiLangTextField";
import TitleWithTranslation from "@common/fields/TranslationText";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import SelectLanguage from "@/features/kit-detail/ui/SelectLanguage";
import { EditOutlined } from "@mui/icons-material";
import { Text } from "./Text";

export function RenderGeneralField(props: any) {
  const {
    field,
    data,
    editableFields,
    langCode,
    updatedValues,
    setUpdatedValues,
    showTranslations,
    toggleTranslation,
    handleFieldEdit,
    updateTranslation,
    handleSaveEdit,
    handleCancelTextBox,
    multiline = false,
    useRichEditor = false,
    fieldType = "text",
    options = [],
    disabled,
  } = props;

  const renderField = useCallback(() => {
    const isEditing = editableFields.has(field);
    const isMetadataField = field === "goal" || field === "context";

    const fieldValue = isMetadataField
      ? (data.metadata?.[field] ?? "")
      : (data[field] ?? "");

    let translationFieldValue = "";

    if (langCode) {
      if (isMetadataField) {
        translationFieldValue =
          data?.translations?.[langCode]?.metadata?.[field] ?? "";
      } else {
        translationFieldValue = data?.translations?.[langCode]?.[field] ?? "";
      }
    }
    return { isEditing, fieldValue, translationFieldValue };
  }, [editableFields, field, data, langCode]);

  const { isEditing, fieldValue, translationFieldValue } = renderField();

  const handleFieldChange = useCallback(
    (newValue: string) => {
      setUpdatedValues((prev: any) => ({
        ...prev,
        [field]: newValue,
      }));

      if (handleSaveEdit) {
        setTimeout(() => {
          handleSaveEdit(field, newValue);
        }, 0);
      }
    },
    [field, setUpdatedValues, handleSaveEdit],
  );

  if (fieldType === "radio" || fieldType === "select") {
    const v = updatedValues[field];
    const currentValue = v == null || v === "" ? fieldValue : v;
    if (fieldType === "radio") {
      return (
        <Box flexGrow={1}>
          <FormControl component="fieldset" fullWidth disabled={disabled}>
            <RadioGroup
              row
              value={currentValue}
              onChange={(e) => handleFieldChange(String(e.target.value))}
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 2,
              }}
            >
              {options.map((option: any) => {
                const val = String(option.value);
                return (
                  <FormControlLabel
                    key={val}
                    value={val}
                    control={<Radio size="small" />}
                    label={<Text variant="bodyMedium" color="background.secondaryDark">{option.label}</Text>}
                    sx={{
                      m: 0,
                    }}
                  />
                );
              })}
            </RadioGroup>
          </FormControl>
        </Box>
      );
    }

    if (fieldType === "select") {
      return (
        <Box display="flex" width="70%" gap={2} alignItems="center">
          <SelectLanguage
            handleChange={handleFieldChange}
            mainLanguage={currentValue}
            languages={options}
          />
        </Box>
      );
    }
  }

  const currentValue = updatedValues[field] ?? fieldValue;
  const currentTranslationValue = langCode
    ? (updatedValues.translations?.[langCode]?.[field] ?? "")
    : "";

  return isEditing ? (
    <Box flexGrow={1}>
      <MultiLangTextField
        name={field}
        value={currentValue}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setUpdatedValues((prev: any) => ({
            ...prev,
            [field]: e.target.value,
          }))
        }
        label={""}
        translationValue={currentTranslationValue}
        onTranslationChange={updateTranslation(field, setUpdatedValues)}
        showTranslation={showTranslations[field]}
        setShowTranslation={() => toggleTranslation(field)}
        fullWidth
        multiline={multiline}
        minRows={multiline ? 3 : undefined}
        useRichEditor={useRichEditor}
        lang={langCode}
        handleSaveEdit={() => handleSaveEdit()}
        handleCancelTextBox={handleCancelTextBox}
      />
    </Box>
  ) : (
    <Box display="flex" width="100%" gap={2} alignItems="flex-start">
      <TitleWithTranslation
        title={fieldValue ?? ""}
        translation={translationFieldValue}
        variant="semiBoldMedium"
        multiline={useRichEditor}
      />
      <IconButton onClick={() => handleFieldEdit(field)}>
        <EditOutlined fontSize="small" color="primary" />
      </IconButton>
    </Box>
  );
}
