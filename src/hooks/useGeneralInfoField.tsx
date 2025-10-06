import { useCallback, useEffect, useState } from "react";
import showToast from "@/utils/toast-error";
import { useQuery } from "@/hooks/useQuery";
import { useServiceContext } from "@/providers/service-provider";
import { ILanguage } from "@/types";
import { kitActions, useKitDesignerContext } from "@/providers/kit-provider";

export default function useGeneralInfoField(props: any) {
  const { assessmentKitId, fetchAssessmentKitInfoQuery, setTranslatedLang } =
    props;

  const [updatedValues, setUpdatedValues] = useState<any>({
    title: "",
    summary: "",
    about: "",
    goal: undefined,
    context: undefined,
    lang: "",
    price: 0,
    published: "",
    isPrivate: "",
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

  const handleSaveEdit = (field?: string, value?: string) => {
    let updateData: any = {};

    if (
      field &&
      (field === "lang" ||
        field === "price" ||
        field === "published" ||
        field === "isPrivate")
    ) {
      updateData[field] = value !== undefined ? value : updatedValues[field];
    } else {
      const goal = updatedValues.goal;
      const context = updatedValues.context;

      const translations: Record<string, any> =
        updatedValues.translations ?? {};

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
              },
            }
          : {}),
      };

      delete updatedValuesWithMetadata.goal;
      delete updatedValuesWithMetadata.context;

      updateData = updatedValuesWithMetadata;
    }

    updateKitInfoQuery
      .query({
        assessmentKitId: assessmentKitId,
        data: updateData,
      })
      .then(() => {
        fetchAssessmentKitInfoQuery.query();
        if (
          !field ||
          field === "title" ||
          field === "summary" ||
          field === "about" ||
          field === "goal" ||
          field === "context"
        ) {
          setEditableFields(new Set());
        }
      })
      .catch((e) => showToast(e));
  };

  useEffect(() => {
    if (data) {
      const defaultTranslatedLanguage = data.languages?.find(
        (lang: ILanguage) => lang.code !== data.mainLanguage?.code,
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
        lang: data.lang ?? "",
        price: data.price ?? "",
        published: data.published ?? "",
        isPrivate: data.isPrivate ?? "",
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
    updatedValues,
  };
}
