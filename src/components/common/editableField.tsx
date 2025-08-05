import { useCallback } from "react";
import MultiLangTextField from "@common/fields/MultiLangTextField";
import TitleWithTranslation from "@common/fields/TranslationText";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import EditIcon from "@mui/icons-material/Edit";
import { useTranslationUpdater } from "@/hooks/useTranslationUpdater";

export function useRenderEditableField(
 props: any){
  const  {
    field,
    data,
    editableFields,
    langCode,
    updatedValues,
    setUpdatedValues,
    showTranslations,
    toggleTranslation,
    handleFieldEdit,
    handleSaveEdit,
    handleCancelTextBox,
    multiline = false,
    useRichEditor = false,
} = props

  const { updateTranslation } = useTranslationUpdater(langCode);
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

      return isEditing ? (
        <Box sx={{ flexGrow: 1 }}>
          <MultiLangTextField
            name={field}
            value={updatedValues[field] ?? ""}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setUpdatedValues((prev: any) => ({
                ...prev,
                [field]: e.target.value,
              }))
            }
            label={""}
            translationValue={
              langCode
                ? (updatedValues.translations?.[langCode]?.[field] ?? "")
                : ""
            }
            onTranslationChange={updateTranslation(field, setUpdatedValues)}
            showTranslation={showTranslations[field]}
            setShowTranslation={() => toggleTranslation(field)}
            fullWidth
            multiline={multiline}
            minRows={multiline ? 3 : undefined}
            useRichEditor={useRichEditor}
            lang={langCode}
            handleSaveEdit={handleSaveEdit}
            handleCancelTextBox={handleCancelTextBox}
          />
        </Box>
      ) : (
        <>
          <TitleWithTranslation
            title={fieldValue ?? ""}
            translation={translationFieldValue}
            variant="semiBoldMedium"
            multiline
          />
          <IconButton
            onClick={() => handleFieldEdit(field)}
            sx={{ width: 40, height: 40, borderRadius: "50%", p: 0 }}
          >
            <EditIcon />
          </IconButton>
        </>
      );
    },
    [
      editableFields,
      updatedValues,
      showTranslations,
      langCode,
      updateTranslation,
      toggleTranslation,
      handleFieldEdit,
    ],
  )
  return renderField()
};