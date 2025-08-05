import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Skeleton from "@mui/material/Skeleton";
import { Trans } from "react-i18next";
import { useServiceContext } from "@/providers/ServiceProvider";
import { IKitVersion, ILanguage } from "@/types/index";
import { useState, useCallback, useMemo } from "react";
import { useQuery } from "@/utils/useQuery";
import QueryData from "@/components/common/QueryData";
import PermissionControl from "@/components/common/PermissionControl";
import LanguageSelectorChips from "./components/LanguageSelectorChips";
import { styles } from "@styles";
import { useConfigContext } from "@/providers/ConfgProvider";
import { renderEditableField } from "@common/editableField";
import useEditableField from "@/hooks/useEditableField";

const generalFields = [
  { name: "title", label: "common.title", multiline: false, useRichEditor: false },
  { name: "summary", label: "common.summary", multiline: false, useRichEditor: false },
  { name: "about", label: "common.what", multiline: true, useRichEditor: true },
  { name: "goal", label: "common.when", multiline: true, useRichEditor: true },
  { name: "context", label: "common.who", multiline: true, useRichEditor: true },
] as const;

const GeneralContent = ({ kitVersion }: { kitVersion: IKitVersion }) => {

  const { service } = useServiceContext();
  const {
    config: { languages },
  } = useConfigContext();

  const updateKitInfoQuery = useQuery({
    service: (args, config) =>
      service.assessmentKit.info.updateStats(args, config),
    runOnMount: false,
  });

  const fetchAssessmentKitInfoQuery = useQuery({
    service: (args, config) =>
      service.assessmentKit.info.getInfo(
        args ?? { assessmentKitId: kitVersion.assessmentKit.id },
        config,
      ),
    runOnMount: true,
  });

  const addLanguageQuery = useQuery({
    service: (args, config) =>
      service.assessmentKit.info.addLanguage(args, config),
    runOnMount: false,
  });

  const data = fetchAssessmentKitInfoQuery.data;

  const [translatedLang, setTranslatedLang] = useState<ILanguage>();

  const {handleSaveEdit, editableFields, setEditableFields, langCode, toggleTranslation, showTranslations, updatedValues, setUpdatedValues} = useEditableField({setTranslatedLang, assessmentKitId : kitVersion.assessmentKit.id, fetchAssessmentKitInfoQuery})

  const handleAddLanguage = useCallback(
    (lang: ILanguage) => {
      if (
        data?.mainLanguage?.code !== lang.code &&
        languages.find((l) => l.code === lang.code)
      ) {
        setTranslatedLang(lang);
        addLanguageQuery
          .query({
            assessmentKitId: kitVersion.assessmentKit.id,
            data: { lang: lang.code },
          })
          .then(() => fetchAssessmentKitInfoQuery.query());
      }
    },
    [
      data?.mainLanguage?.code,
      languages,
      kitVersion.assessmentKit.id,
      addLanguageQuery,
      fetchAssessmentKitInfoQuery,
    ],
  );

  const handleFieldEdit = useCallback(
    (field: "title" | "summary" | "about" | "goal" | "context") => {
      setEditableFields((prev) => new Set(prev).add(field));
    },
    [],
  );

  const handleCancelEdit = useCallback(() => {
    setEditableFields(new Set());
  }, []);

  const skeletonItems = useMemo(
    () =>
      [1, 2, 3].map((number) => (
        <Skeleton
          key={number}
          variant="rectangular"
          sx={{ borderRadius: 2, height: "30px", mb: 1 }}
        />
      )),
    [],
  );

  return (
    <>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="headlineSmall" fontWeight="bold">
          <Trans i18nKey="common.general" />
        </Typography>
      </Box>

      <Typography variant="bodyMedium">
        <Trans i18nKey="kitDesigner.generalDescription" />
      </Typography>

      <Divider sx={{ my: 2 }} />

      <PermissionControl
        error={[fetchAssessmentKitInfoQuery.errorObject?.response?.data]}
      >
        <QueryData
          {...fetchAssessmentKitInfoQuery}
          renderLoading={() => <>{skeletonItems}</>}
          render={(data) => (
            <Stack spacing={2}>
              <Box sx={{ ...styles.centerV }} gap={2}>
                <Typography variant="semiBoldLarge">
                  <Trans i18nKey="kitDesigner.availableLanguages" />:
                </Typography>
                <LanguageSelectorChips
                  mainLanguage={data.mainLanguage}
                  translatedLanguage={translatedLang}
                  availableLanguages={languages}
                  onAddLanguage={handleAddLanguage}
                />
              </Box>

              <Divider sx={{ my: 1 }} />

              {generalFields.map(
                ({ name, label, multiline, useRichEditor }) => (
                  <Box
                    key={name}
                    sx={{
                      display: "flex",
                      width: "100%",
                      flexDirection: multiline ? "column" : "row",
                    }}
                    gap={multiline ? 0 : 2}
                  >
                    <Typography variant="semiBoldLarge">
                      <Trans i18nKey={label} />:
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        width: "100%",
                      }}
                    >
                      {renderEditableField({
                        name,
                        data,
                        editableFields,
                        langCode,
                        updatedValues,
                        setUpdatedValues,
                        showTranslations,
                        toggleTranslation,
                        handleFieldEdit,
                        multiline,
                        useRichEditor,
                      })}
                    </Box>
                  </Box>
                ),
              )}
            </Stack>
          )}
        />
      </PermissionControl>

      <Box
        display="flex"
        justifyContent="end"
        alignItems="center"
        gap={2}
        mt={2}
      >
        <Button
          variant="outlined"
          onClick={handleCancelEdit}
          disabled={updateKitInfoQuery.loading || editableFields.size === 0}
        >
          <Trans i18nKey="common.cancel" />
        </Button>
        <Button
          variant="contained"
          onClick={handleSaveEdit}
          disabled={updateKitInfoQuery.loading || editableFields.size === 0}
        >
          {updateKitInfoQuery.loading ? (
            <Trans i18nKey="saving" />
          ) : (
            <Trans i18nKey="common.saveChanges" />
          )}
        </Button>
      </Box>
    </>
  );
};

export default GeneralContent;
