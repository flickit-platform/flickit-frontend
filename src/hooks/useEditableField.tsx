import { useCallback, useState } from "react";
import showToast from "@utils/toastError";
import { useQuery } from "@utils/useQuery";
import { useServiceContext } from "@providers/ServiceProvider";


export default function useEditableField(props: any){

  const { updatedValues, langCode, assessmentKitId, fetchAssessmentKitInfoQuery } = props
  const { service } = useServiceContext();
  const [editableFields, setEditableFields] = useState<Set<string>>(new Set());

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

  return {
    handleSaveEdit,
    setEditableFields,
    editableFields,
  }

}