import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import Skeleton from "@mui/material/Skeleton";
import { Trans } from "react-i18next";
import { useServiceContext } from "@/providers/ServiceProvider";
import { IKitVersion, ILanguage } from "@/types/index";
import { useState, useEffect, useCallback, useMemo } from "react";
import { useQuery } from "@/utils/useQuery";
import QueryData from "@/components/common/QueryData";
import PermissionControl from "@/components/common/PermissionControl";
import LanguageSelectorChips from "./components/LanguageSelectorChips";
import { styles } from "@styles";
import { useConfigContext } from "@/providers/ConfgProvider";
import EditIcon from "@mui/icons-material/Edit";
import MultiLangTextField from "@/components/common/fields/MultiLangTextField";

type TranslationFields = "title" | "summary" | "about";

interface Translations {
  FA?: {
    title?: string;
    summary?: string;
    about?: string;
  };
}

interface UpdatedValues {
  title?: string;
  summary?: string;
  about?: string;
  translations: Translations;
}

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

  const [translatedLang, setTranslatedLang] = useState<ILanguage>();
  const [editableFields, setEditableFields] = useState<Set<string>>(new Set());
  const [updatedValues, setUpdatedValues] = useState<UpdatedValues>({
    title: undefined,
    summary: undefined,
    about: undefined,
    translations: { FA: {} },
  });
  const [showTranslations, setShowTranslations] = useState({
    title: false,
    summary: false,
    about: false,
  });

  const handleAddLanguage = useCallback(
    (lang: ILanguage) => {
      if (
        lang.code !== fetchAssessmentKitInfoQuery.data?.mainLanguage?.code &&
        languages.find((l) => l.code === lang.code)
      ) {
        setTranslatedLang(lang);
        addLanguageQuery.query({
          assessmentKitId: kitVersion.assessmentKit.id,
          data: { lang: lang.code },
        });
      }
    },
    [
      fetchAssessmentKitInfoQuery.data?.mainLanguage?.code,
      languages,
      kitVersion.assessmentKit.id,
    ],
  );

  const handleFieldEdit = useCallback(
    (field: TranslationFields) => {
      const newEditableFields = new Set(editableFields);
      newEditableFields.add(field);
      setEditableFields(newEditableFields);

      setUpdatedValues((prev) => ({
        ...prev,
        [field]: fetchAssessmentKitInfoQuery.data?.[field],
        translations: {
          FA: {
            ...prev.translations.FA,
            [field]:
              fetchAssessmentKitInfoQuery.data?.translations?.FA?.[field] ||
              undefined,
          },
        },
      }));
    },
    [editableFields, fetchAssessmentKitInfoQuery.data],
  );

  const handleSaveEdit = useCallback(() => {
    updateKitInfoQuery
      .query({
        assessmentKitId: kitVersion.assessmentKit.id,
        data: updatedValues,
      })
      .then(() => {
        fetchAssessmentKitInfoQuery.query();
        setEditableFields(new Set());
      });
  }, [kitVersion.assessmentKit.id, updatedValues]);

  const handleCancelEdit = useCallback(() => {
    setEditableFields(new Set());
  }, []);

  const handleTranslationChange = useCallback(
    (field: TranslationFields, value?: string) => {
      setUpdatedValues((prev) => ({
        ...prev,
        translations: {
          FA: {
            ...prev.translations.FA,
            [field]: value,
          },
        },
      }));
    },
    [],
  );

  const toggleTranslation = useCallback((field: TranslationFields) => {
    setShowTranslations((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  }, []);

  useEffect(() => {
    if (fetchAssessmentKitInfoQuery.data) {
      const defaultTranslatedLanguage =
        fetchAssessmentKitInfoQuery.data.languages?.find(
          (lang: ILanguage) =>
            lang.code !== fetchAssessmentKitInfoQuery.data.mainLanguage?.code,
        );
      setTranslatedLang(defaultTranslatedLanguage);

      const initialShowTranslations = {
        title: Boolean(
          fetchAssessmentKitInfoQuery.data.translations?.FA?.title,
        ),
        summary: Boolean(
          fetchAssessmentKitInfoQuery.data.translations?.FA?.summary,
        ),
        about: Boolean(
          fetchAssessmentKitInfoQuery.data.translations?.FA?.about,
        ),
      };
      setShowTranslations(initialShowTranslations);
    }
  }, [fetchAssessmentKitInfoQuery.data]);

  const renderEditableField = useCallback(
    (field: TranslationFields, value: string, multiline = false) => {
      if (editableFields.has(field)) {
        return (
          <Box sx={{ flexGrow: 1 }}>
            <MultiLangTextField
              name={field}
              value={updatedValues[field] || ""}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setUpdatedValues((prev) => ({
                  ...prev,
                  [field]: e.target.value,
                }))
              }
              label={field.charAt(0).toUpperCase() + field.slice(1)}
              translationValue={updatedValues.translations.FA?.[field]}
              onTranslationChange={(e: {
                target: { value: string | undefined };
              }) => handleTranslationChange(field, e.target.value)}
              showTranslation={showTranslations[field]}
              setShowTranslation={() => toggleTranslation(field)}
              fullWidth
              multiline={multiline}
              minRows={multiline ? 3 : undefined}
            />
          </Box>
        );
      }
      return (
        <>
          {multiline ? (
            <Typography
              sx={{ flexGrow: 1, mb: 0 }}
              textAlign="justify"
              dangerouslySetInnerHTML={{ __html: value || "" }}
            />
          ) : (
            <Typography sx={{ flexGrow: 1 }}>{value}</Typography>
          )}
          <IconButton onClick={() => handleFieldEdit(field)}>
            <EditIcon />
          </IconButton>
        </>
      );
    },
    [
      editableFields,
      updatedValues,
      showTranslations,
      handleFieldEdit,
      handleTranslationChange,
      toggleTranslation,
    ],
  );

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
          <Trans i18nKey="general" />
        </Typography>
      </Box>

      <Typography variant="bodyMedium">
        <Trans i18nKey="kitDesignerTab.generalDescription" />
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
                  <Trans i18nKey="kitDesignerTab.availableLanguages" />:
                </Typography>
                <LanguageSelectorChips
                  mainLanguage={data.mainLanguage}
                  translatedLanguage={translatedLang}
                  availableLanguages={languages}
                  onAddLanguage={handleAddLanguage}
                />
              </Box>

              <Divider sx={{ my: 1 }} />

              {/* Title field */}
              <Box sx={{ display: "flex", width: "100%" }} gap={2}>
                <Typography variant="semiBoldLarge">
                  <Trans i18nKey="title" />:
                </Typography>
                {renderEditableField("title", data.title)}
              </Box>

              {/* Summary field */}
              <Box sx={{ display: "flex", width: "100%" }} gap={2}>
                <Typography variant="semiBoldLarge">
                  <Trans i18nKey="summary" />:
                </Typography>
                {renderEditableField("summary", data.summary)}
              </Box>

              {/* About field */}
              <Box sx={{ ...styles.centerV, width: "100%" }} gap={1}>
                <Typography variant="semiBoldLarge">
                  <Trans i18nKey="about" />:
                </Typography>
                {renderEditableField("about", data.about, true)}
              </Box>
            </Stack>
          )}
        />
      </PermissionControl>

      <Box display="flex" justifyContent="end" alignItems="center" gap={2}>
        <Button
          variant="outlined"
          onClick={handleCancelEdit}
          disabled={updateKitInfoQuery.loading}
        >
          <Trans i18nKey="cancel" />
        </Button>
        <Button
          variant="contained"
          onClick={handleSaveEdit}
          disabled={updateKitInfoQuery.loading || editableFields.size === 0}
        >
          {updateKitInfoQuery.loading ? (
            <Trans i18nKey="saving" />
          ) : (
            <Trans i18nKey="saveChanges" />
          )}
        </Button>
      </Box>
    </>
  );
};

export default GeneralContent;
