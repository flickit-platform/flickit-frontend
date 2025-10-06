import { RenderGeneralField } from "@/components/common/RenderGeneralField";
import { Text } from "@/components/common/Text";
import useGeneralInfoField from "@/hooks/useGeneralInfoField";
import { AssessmentKitInfoType } from "@/types";
import { Box, Grid } from "@mui/material";
import { useCallback } from "react";
import { Trans } from "react-i18next";
import { useParams } from "react-router-dom";
import { useTranslationUpdater } from "@/hooks/useTranslationUpdater";
import { t } from "i18next";

const priceOptions = [
  { value: 0, label: t("common.free") },
  { value: 1, label: t("common.paid") },
];

const statusOptions = [
  { value: "true", label: t("common.published") },
  { value: "false", label: t("common.unpublished") },
];

const visibilityOptions = [
  { value: "true", label: t("common.public") },
  { value: "false", label: t("common.private") },
];

const generalFields = [
  {
    name: "title",
    label: "common.title",
    multiline: false,
    useRichEditor: false,
    type: "text" as const,
    options: [],
    md: 12,
    disabled: false,
  },
  {
    name: "summary",
    label: "common.summary",
    multiline: true,
    useRichEditor: false,
    type: "text" as const,
    options: [],
    md: 12,
    disabled: false,
  },
  {
    name: "lang",
    label: "common.language",
    multiline: false,
    useRichEditor: false,
    type: "select" as const,
    options: [],
    md: 6,
    disabled: false,
  },
  {
    name: "price",
    label: "common.price",
    multiline: false,
    useRichEditor: false,
    type: "radio" as const,
    options: priceOptions,
    md: 6,
    disabled: true,
  },

  {
    name: "isPrivate",
    label: "common.visibility",
    multiline: false,
    useRichEditor: false,
    type: "radio" as const,
    options: visibilityOptions,
    md: 6,
    disabled: false,
  },
  {
    name: "published",
    label: "common.status",
    multiline: false,
    useRichEditor: false,
    type: "radio" as const,
    options: statusOptions,
    md: 6,
    disabled: false,
  },
  {
    name: "about",
    label: "common.what",
    multiline: true,
    useRichEditor: true,
    type: "text" as const,
    options: [],
    md: 12,
    disabled: false,
  },
  {
    name: "goal",
    label: "common.when",
    multiline: true,
    useRichEditor: true,
    type: "text" as const,
    options: [],
    md: 12,
    disabled: false,
  },
  {
    name: "context",
    label: "common.who",
    multiline: true,
    useRichEditor: true,
    type: "text" as const,
    options: [],
    md: 12,
    disabled: false,
  },
] as const;

type FieldName =
  | "title"
  | "summary"
  | "lang"
  | "price"
  | "published"
  | "isPrivate"
  | "about"
  | "goal"
  | "context";

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

  const handleFieldEdit = useCallback((field: FieldName) => {
    setEditableFields((prev) => new Set(prev).add(field));
  }, []);

  const { updateTranslation } = useTranslationUpdater(langCode);

  const handleCancelTextBox = (field: FieldName) => {
    const newEditableFields = new Set(editableFields);
    newEditableFields.delete(field);
    setEditableFields(newEditableFields);

    setUpdatedValues((prev: any) => {
      const newValues = { ...prev };
      delete newValues[field];

      if (newValues.translations?.[langCode]) {
        delete newValues.translations[langCode][field];
      }

      return newValues;
    });
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      gap={3}
      sx={{ background: "#fff", borderRadius: "12px", py: 2, px: 4 }}
    >
      <Grid container spacing={2}>
        {generalFields.map((field) => {
          const {
            name,
            label,
            multiline,
            useRichEditor,
            md = 12,
            type,
            options,
          } = field;

          const data = {
            ...info,

            lang:
              {
                label: info?.mainLanguage?.title,
                value: info?.mainLanguage?.code,
              } ?? "",
          };

          const fieldOptions =
            name === "lang"
              ? (info?.languages ?? []).map((lng: any) => ({
                  value: lng?.code,
                  label: lng?.title,
                }))
              : (field.options as any);

          return (
            <Grid item xs={12} md={md} key={name}>
              <Box
                display="flex"
                justifyContent="space-between"
                sx={{
                  gap: 2,
                  flexDirection: {
                    xs: "column",
                    md: multiline ? "column" : "row",
                  },
                  alignItems: {
                    xs: "flex-start",
                    md: multiline ? "flex-start" : "center",
                  },
                }}
              >
                <Box width="80px">
                  <Text variant="titleSmall" mt="2px" height="100%">
                    <Trans i18nKey={label} />
                  </Text>
                </Box>
                <Box sx={{ display: "flex", width: "100%" }}>
                  <RenderGeneralField
                    field={name}
                    fieldType={type}
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
                    options={fieldOptions}
                    label={<Trans i18nKey={label} />}
                    disabled={field?.disabled}
                  />
                </Box>
              </Box>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default EditableKitDetail;
