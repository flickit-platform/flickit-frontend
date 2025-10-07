import { RenderGeneralField } from "@/components/common/RenderGeneralField";
import { Text } from "@/components/common/Text";
import useGeneralInfoField from "@/hooks/useGeneralInfoField";
import { AssessmentKitInfoType, ILanguage } from "@/types";
import { Box, Grid, useTheme } from "@mui/material";
import { Fragment, useCallback } from "react";
import { Trans } from "react-i18next";
import { useParams } from "react-router-dom";
import { useTranslationUpdater } from "@/hooks/useTranslationUpdater";
import i18next, { t } from "i18next";
import LanguageMenu from "@/components/kit-designer/general/components/LanguageMenu";
import { useQuery } from "@/hooks/useQuery";
import { useServiceContext } from "@/providers/service-provider";
import { useConfigContext } from "@/providers/config-provider";

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
  const theme = useTheme();
  const { service } = useServiceContext();
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

  const addLanguageQuery = useQuery({
    service: (args, config) =>
      service.assessmentKit.info.addLanguage(args, config),
    runOnMount: false,
  });

  const {
    config: { languages },
  } = useConfigContext();

  const handleAddLanguage = (selectedLang: ILanguage) => {
    addLanguageQuery
      .query({
        assessmentKitId,
        data: { lang: selectedLang.code },
      })
      .then(() => fetchAssessmentKitInfoQuery.query());
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

            lang: {
              label: info?.mainLanguage?.title,
              value: info?.mainLanguage?.code,
            },
          };
          const selectedCodes = info.languages
            .map((lang) => {
              return lang.code;
            })
            .filter(Boolean) as string[];
          const selectedTitles = (info.languages ?? [])
            .map((l) => l?.title)
            .filter(Boolean)
            .join(i18next.language === "fa" ? "، " : ", ");

          return (
            <Fragment>
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
                  <Box width={name === "isPrivate" ? "120px" : "80px"}>
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
                      options={options}
                      label={<Trans i18nKey={label} />}
                      disabled={field?.disabled}
                    />
                  </Box>
                </Box>
              </Grid>
              {name === "summary" && (
                <Grid
                  item
                  xs={12}
                  md={6}
                  display="flex"
                  alignItems="center"
                  gap={1}
                >
                  <Box>
                    <Text variant="titleSmall" mt="2px" height="100%">
                      <Trans i18nKey={"common.supportedLanguages"} />
                    </Text>
                  </Box>
                  <Box
                    sx={{ display: "flex", width: "50%" }}
                    color="outline.variant"
                  >
                    <LanguageMenu
                      buttonColor="inherit"
                      labelColor={theme.palette.background.secondaryDark}
                      availableLanguages={languages}
                      selectedCodes={selectedCodes}
                      mainLanguageCode={info.mainLanguage?.code}
                      onSelect={handleAddLanguage}
                      buttonLabel={selectedTitles}
                      size="small"
                      followButtonWidth
                      fullWidth
                      buttonVariant="outlined"
                    />
                  </Box>
                </Grid>
              )}
            </Fragment>
          );
        })}
      </Grid>
    </Box>
  );
};

export default EditableKitDetail;
