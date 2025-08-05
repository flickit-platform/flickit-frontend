import { useCallback, useEffect, useState } from "react";
import showToast from "@utils/toastError";
import { useQuery } from "@utils/useQuery";
import { useServiceContext } from "@providers/ServiceProvider";
import { ILanguage } from "@/types";
import { kitActions, useKitDesignerContext } from "@providers/KitProvider";


export default function useEditableField(props: any){

  const { updatedValues, assessmentKitId, fetchAssessmentKitInfoQuery, setUpdatedValues, setShowTranslations } = props
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
      translations: {
        ...translations,
        [langCode]: {
          ...translations[langCode],
          metadata: {
            context: translations?.[langCode].context,
            goal: translations?.[langCode].goal,
          },
        },
      },
    };

    delete updatedValuesWithMetadata.goal;
    delete updatedValuesWithMetadata.context;

    updateKitInfoQuery
      .query({
        // assessmentKitId: kitVersion.assessmentKit.id,
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
        (lang: ILanguage) => lang.code !== data.mainLanguage?.code,
      );
      // setTranslatedLang(defaultTranslatedLanguage);
      dispatch(kitActions.setMainLanguage(data.mainLanguage));
      dispatch(kitActions.setTranslatedLanguage(defaultTranslatedLanguage));
      setShowTranslations({
        about: !!translations[langCode]?.about,
        goal: !!translations[langCode]?.metadata?.goal,
        context: !!translations[langCode]?.metadata?.context,
      });
      setUpdatedValues({
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

  return {
    handleSaveEdit,
    setEditableFields,
    editableFields,
    langCode
  }

}