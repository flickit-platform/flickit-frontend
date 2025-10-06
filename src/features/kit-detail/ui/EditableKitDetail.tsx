import { RenderGeneralField } from "@/components/common/RenderGeneralField";
import { Text } from "@/components/common/Text";
import useGeneralInfoField from "@/hooks/useGeneralInfoField";
import { AssessmentKitInfoType, ILanguage } from "@/types";
import { Box, Divider } from "@mui/material";
import { useCallback, useState } from "react";
import { Trans } from "react-i18next";
import { useParams } from "react-router-dom";
import { styles } from "@styles";
import { useTranslationUpdater } from "@/hooks/useTranslationUpdater";

const generalFields = [
  {
    name: "title",
    label: "common.title",
    multiline: false,
    useRichEditor: false,
  },
  {
    name: "summary",
    label: "common.summary",
    multiline: true,
    useRichEditor: false,
  },
  { name: "about", label: "common.what", multiline: true, useRichEditor: true },
  { name: "goal", label: "common.when", multiline: true, useRichEditor: true },
  {
    name: "context",
    label: "common.who",
    multiline: true,
    useRichEditor: true,
  },
] as const;

const EditableKitDetail = (props: {
  fetchAssessmentKitInfoQuery: any;
  info: AssessmentKitInfoType;
}) => {
  const { fetchAssessmentKitInfoQuery, info } = props;
  const { assessmentKitId } = useParams();

  const {
    handleSaveEdit,
    editableFields,
    setEditableFields,
    langCode,
    toggleTranslation,
    showTranslations,
    updatedValues,
    setUpdatedValues,
  } = useGeneralInfoField({
    assessmentKitId: assessmentKitId,
    fetchAssessmentKitInfoQuery,
  });
  const handleFieldEdit = useCallback(
    (field: "title" | "summary" | "about" | "goal" | "context") => {
      setEditableFields((prev) => new Set(prev).add(field));
    },
    [],
  );
  const { updateTranslation } = useTranslationUpdater(langCode);
  const handleCancelTextBox = (field: any) => {
    editableFields.delete(field);
    setUpdatedValues((prev: any) => ({
      ...prev,
    }));
  };
  return (
    <Box
      display="flex"
      flexDirection="column"
      gap={4}
      sx={{
        background: "#fff",
        borderRadius: "12px",
        py: 2,
        px: 4,
      }}
    >
      {" "}
      {generalFields.map((field) => {
        const { name, label, multiline, useRichEditor } = field;
        const data = {
          title: info.title,
          summary: info.summary,
          about: info.about,
          metadata: info.metadata,
          translations: info.translations,
        };

        return (
          <Box
            key={name}
            display="flex"
            alignItems="flex-start"
            justifyContent="space-between"
            sx={{
              flexDirection: multiline ? "column" : "row",
            }}
          >
            <Text variant="titleSmall" minWidth="80px !important" mt="2px">
              <Trans i18nKey={label} />
            </Text>
            <Box
              sx={{
                display: "flex",
                width: "100%",
              }}
            >
              <RenderGeneralField
                field={name}
                data={data}
                editableFields={editableFields}
                langCode={langCode}
                updatedValues={updatedValues}
                setUpdatedValues={setUpdatedValues}
                showTranslations={showTranslations}
                toggleTranslation={toggleTranslation}
                handleFieldEdit={handleFieldEdit}
                multiline={multiline}
                useRichEditor={useRichEditor}
                updateTranslation={updateTranslation}
                handleSaveEdit={handleSaveEdit}
                handleCancelTextBox={handleCancelTextBox}
              />
            </Box>
          </Box>
        );
      })}
    </Box>
  );
};
export default EditableKitDetail;
