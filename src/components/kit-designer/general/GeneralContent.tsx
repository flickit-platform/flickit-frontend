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
import toastError from "@/utils/toastError";
import { kitActions, useKitLanguageContext } from "@/providers/KitProvider";
import { useTranslationUpdater } from "@/hooks/useTranslationUpdater";

type TranslationFields = "title" | "summary" | "about";

interface UpdatedValues {
  title?: string;
  summary?: string;
  about?: string;
  translations: any;
}

const GeneralContent = ({ kitVersion }: { kitVersion: IKitVersion }) => {
  const { kitState } = useKitLanguageContext();
  const langCode = kitState.translatedLanguage?.code;

  const { updateTranslation } = useTranslationUpdater(langCode);

  const { dispatch } = useKitLanguageContext();
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
  const translations = data?.translations ?? {};
  const [firstTranslationKey] = Object.keys(translations);

  const [translatedLang, setTranslatedLang] = useState<ILanguage>();
  const [editableFields, setEditableFields] = useState<Set<string>>(new Set());
  const [updatedValues, setUpdatedValues] = useState<UpdatedValues>({
    title: undefined,
    summary: undefined,
    about: undefined,
    translations: undefined,
  });
  const [showTranslations, setShowTranslations] = useState({
    title: false,
    summary: false,
    about: false,
  });

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
          .then(() => {
            fetchAssessmentKitInfoQuery.query();
          });
      }
    },
    [data?.mainLanguage?.code, languages, kitVersion.assessmentKit.id],
  );

  const handleFieldEdit = useCallback(
    (field: TranslationFields) => {
      const newEditableFields = new Set(editableFields);
      newEditableFields.add(field);
      setEditableFields(newEditableFields);

      setUpdatedValues((prev) => ({
        ...prev,
        [field]: data?.[field],
        translations: langCode
          ? {
              [langCode]: {
                ...prev.translations?.[langCode],
                [field]: data?.translations?.[langCode]?.[field],
              },
            }
          : undefined,
      }));
    },
    [editableFields, data],
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
      })
      .catch((e) => {
        toastError(e);
      });
  }, [kitVersion.assessmentKit.id, updatedValues]);

  const handleCancelEdit = useCallback(() => {
    setEditableFields(new Set());
  }, []);

  const toggleTranslation = useCallback((field: TranslationFields) => {
    setShowTranslations((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  }, []);

  useEffect(() => {
    if (data) {
      const defaultTranslatedLanguage = data.languages?.find(
        (lang: ILanguage) => lang.code !== data.mainLanguage?.code,
      );
      setTranslatedLang(defaultTranslatedLanguage);

      dispatch(kitActions.setMainLanguage(data.mainLanguage));
      dispatch(kitActions.setTranslatedLanguage(defaultTranslatedLanguage));
      const currentTranslation = translations[firstTranslationKey] ?? {};

      setShowTranslations({
        title: !!currentTranslation.title,
        summary: !!currentTranslation.summary,
        about: !!currentTranslation.about,
      });
    }
  }, [data]);

  const renderEditableField = useCallback(
    (
      field: TranslationFields,
      value: string,
      multiline = false,
      useRichEditor = false,
    ) => {
      if (editableFields.has(field)) {
        return (
          <Box sx={{ flexGrow: 1 }}>
            <MultiLangTextField
              name={field}
              value={updatedValues[field]}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setUpdatedValues((prev) => ({
                  ...prev,
                  [field]: e.target.value,
                }))
              }
              label={field.charAt(0).toUpperCase() + field.slice(1)}
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
              dangerouslySetInnerHTML={{ __html: value }}
            />
          ) : (
            <Typography sx={{ flexGrow: 1 }}>{value}</Typography>
          )}
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
      handleFieldEdit,
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

              <Box sx={{ display: "flex", width: "100%" }} gap={2}>
                <Typography variant="semiBoldLarge">
                  <Trans i18nKey="title" />:
                </Typography>
                {renderEditableField("title", data.title)}
              </Box>

              <Box sx={{ display: "flex", width: "100%" }} gap={2}>
                <Typography variant="semiBoldLarge">
                  <Trans i18nKey="summary" />:
                </Typography>
                {renderEditableField("summary", data.summary)}
              </Box>

              <Box
                sx={{
                  display: "flex",
                  alignItems: !editableFields.has("about")
                    ? "center"
                    : "flex-start",
                  width: "100%",
                }}
                gap={1}
              >
                <Typography variant="semiBoldLarge">
                  <Trans i18nKey="about" />:
                </Typography>
                {renderEditableField("about", data.about, true, true)}
              </Box>
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
