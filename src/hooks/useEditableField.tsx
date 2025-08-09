import { useCallback, useEffect, useState } from "react";
import showToast from "@utils/toastError";
import { useQuery } from "@utils/useQuery";
import { useServiceContext } from "@providers/ServiceProvider";
import { ILanguage } from "@/types";
import { kitActions, useKitDesignerContext } from "@providers/KitProvider";

export default function useEditableField(props: any){

  const { assessmentKitId, fetchAssessmentKitInfoQuery, setTranslatedLang } = props

  const [updatedValues, setUpdatedValues] = useState<any>({
    title: "",
    summary: "",
    about: "",
    goal: undefined,
    context: undefined,
    translations: undefined,
  });

  const [showTranslations, setShowTranslations] = useState({
    title: false,
    summary: false,
    about: false,
    goal: false,
    context: false,
  });

  const { service } = useServiceContext();
  const [editableFields, setEditableFields] = useState<Set<string>>(new Set());
  const data = fetchAssessmentKitInfoQuery.data;
  const translations = data?.translations ?? {};
  const { kitState, dispatch } = useKitDesignerContext();
  const langCode = kitState.translatedLanguage?.code ?? "";

  const updateKitInfoQuery = useQuery({
    service: (args, config) =>
      service.assessmentKit.info.updateStats(args, config),
    runOnMount: false,
  });

  const handleSaveEdit = () => {
    const goal = updatedValues.goal;
    const context = updatedValues.context;

    const translations: Record<string, any> = updatedValues.translations ?? {};

    const updatedValuesWithMetadata = {
      ...updatedValues,
      metadata: {
        goal,
        context,
      },
      ...(langCode
        ? {
          translations: {
            ...translations,
            [langCode]: {
              ...translations[langCode],
              metadata: {
                context: translations?.[langCode]?.context,
                goal: translations?.[langCode]?.goal,
              },
            },
          }
        } : {})
    };

    delete updatedValuesWithMetadata.goal;
    delete updatedValuesWithMetadata.context;

    updateKitInfoQuery
      .query({
        assessmentKitId: assessmentKitId,
        data: updatedValuesWithMetadata,
      })
      .then(() => {
        fetchAssessmentKitInfoQuery.query();
        setEditableFields(new Set());
      })
      .catch((e) => showToast(e));
  }

  useEffect(() => {
    if (data) {
      const defaultTranslatedLanguage = data.languages?.find(
        (lang: ILanguage) => lang.code !== data.mainLanguage?.code
      );

      setTranslatedLang?.(defaultTranslatedLanguage);

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
  }, [data, langCode]);

  const toggleTranslation = useCallback(
    (field: "title" | "summary" | "about" | "goal" | "context") => {
      setShowTranslations((prev: any) => ({
        ...prev,
        [field]: !prev[field],
      }));
    },
    [],
  );

  return {
    handleSaveEdit,
    setEditableFields,
    editableFields,
    langCode,
    toggleTranslation,
    showTranslations,
    setUpdatedValues,
    updatedValues
  }

}