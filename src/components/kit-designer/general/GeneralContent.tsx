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
import { kitActions, useKitDesignerContext } from "@/providers/KitProvider";
import { useTranslationUpdater } from "@/hooks/useTranslationUpdater";
import TitleWithTranslation from "@/components/common/fields/TranslationText";
import showToast from "@/utils/toastError";

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
    multiline: false,
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

const GeneralContent = ({ kitVersion }: { kitVersion: IKitVersion }) => {
  const { kitState } = useKitDesignerContext();
  const langCode = kitState.translatedLanguage?.code ?? "";
  const { updateTranslation } = useTranslationUpdater(langCode);
  const { dispatch } = useKitDesignerContext();
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

  const [translatedLang, setTranslatedLang] = useState<ILanguage>();
  const [editableFields, setEditableFields] = useState<Set<string>>(new Set());
  const [updatedValues, setUpdatedValues] = useState<any>({
    title: "",
    summary: "",
    about: "",
    goal: undefined,
    context: undefined,
    translations: {},
  });

  const [showTranslations, setShowTranslations] = useState({
    title: false,
    summary: false,
    about: false,
    goal: false,
    context: false,
  });

  useEffect(() => {
    if (data) {
      const defaultTranslatedLanguage = data.languages?.find(
        (lang: ILanguage) => lang.code !== data.mainLanguage?.code,
      );
      setTranslatedLang(defaultTranslatedLanguage);
      dispatch(kitActions.setMainLanguage(data.mainLanguage));
      dispatch(kitActions.setTranslatedLanguage(defaultTranslatedLanguage));
      setShowTranslations({
        title: !!translations[langCode]?.title,
        summary: !!translations[langCode]?.summary,
        about: !!translations[langCode]?.about,
        goal: !!translations[langCode]?.metadata?.goal,
        context: !!translations[langCode]?.metadata?.context,
      });
      setUpdatedValues({
        title: data.title ?? "",
        summary: data.summary ?? "",
        about: data.about ?? "",
        goal: data?.metadata?.goal ?? "",
        context: data?.metadata?.context ?? "",
        translations: langCode
          ? {
              [langCode]: {
                ...translations[langCode],
                goal: data?.translations?.[langCode]?.metadata?.goal,
                context: data?.translations?.[langCode]?.metadata?.context,
              },
            }
          : {},
      });
    }
  }, [data, langCode, dispatch, translations]);

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

  const handleSaveEdit = useCallback(() => {
    const goal = updatedValues.goal;
    const context = updatedValues.context;

    const translationsObj: Record<string, any> =
      updatedValues.translations ?? {};

    const updatedValuesWithMetadata: any = {
      ...updatedValues,
      metadata: {
        goal,
        context,
      },
      translations: langCode
        ? {
            ...translationsObj,
            [langCode]: {
              ...translationsObj[langCode],
              metadata: {
                context: translationsObj?.[langCode]?.context,
                goal: translationsObj?.[langCode]?.goal,
              },
            },
          }
        : {},
    };

    try {
      const tForLang = updatedValuesWithMetadata.translations?.[langCode];
      if (tForLang) {
        const meta = tForLang.metadata ?? {};
        const cleanedMeta: Record<string, any> = {};
        if (meta.goal) cleanedMeta.goal = meta.goal;
        if (meta.context) cleanedMeta.context = meta.context;

        if (Object.keys(cleanedMeta).length > 0) {
          updatedValuesWithMetadata.translations[langCode].metadata =
            cleanedMeta;
        } else {
          delete updatedValuesWithMetadata.translations[langCode].metadata;
        }
      }
    } catch {
      // ignore
    }

    delete updatedValuesWithMetadata.goal;
    delete updatedValuesWithMetadata.context;

    updateKitInfoQuery
      .query({
        assessmentKitId: kitVersion.assessmentKit.id,
        data: updatedValuesWithMetadata,
      })
      .then(() => {
        fetchAssessmentKitInfoQuery.query();
        setEditableFields(new Set());
      })
      .catch((e) => showToast(e));
  }, [
    kitVersion.assessmentKit.id,
    updatedValues,
    updateKitInfoQuery,
    fetchAssessmentKitInfoQuery,
    langCode,
  ]);

  const handleCancelEdit = useCallback(() => {
    setEditableFields(new Set());
  }, []);

  const toggleTranslation = useCallback(
    (field: "title" | "summary" | "about" | "goal" | "context") => {
      setShowTranslations((prev) => ({
        ...prev,
        [field]: !prev[field],
      }));
    },
    [],
  );

  const renderEditableField = useCallback(
    (
      field: "title" | "summary" | "about" | "goal" | "context",
      data: any,
      multiline = false,
      useRichEditor = false,
    ) => {
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
                ? (updatedValues.translations?.[langCode]?.[field] ??
                  updatedValues.translations?.[langCode]?.metadata?.[field] ??
                  "")
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
      toggleTranslation,
      handleFieldEdit,
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
                      {renderEditableField(
                        name as any,
                        data,
                        multiline,
                        useRichEditor,
                      )}
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
          <Trans i18nKey="common.save" />
        </Button>
      </Box>
    </>
  );
};

export default GeneralContent;
