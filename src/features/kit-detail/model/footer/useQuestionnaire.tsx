import { useMemo } from "react";
import { useQuery } from "@/hooks/useQuery";
import { useServiceContext } from "@/providers/service-provider";
import { TId } from "@/types";
import { QuestionnaireDetails } from "../types";

export function useQuestionnaire(
  assessmentKitId: string | undefined,
  questionnaireId?: TId,
) {
  const { service } = useServiceContext();

  const fetcQuestionnaireDetailslQuery = useQuery<QuestionnaireDetails>({
    service: (args, config) =>
      service.assessmentKit.details.getQuestionnaire(
        args ?? { assessmentKitId, questionnaireId },
        config,
      ),
    runOnMount: true,
  });

  const derived = useMemo(() => {
    const questionnaireDetails = fetcQuestionnaireDetailslQuery.data;

    return {
      questionnaireDetails,
    } as const;
  }, [fetcQuestionnaireDetailslQuery.data]);

  return {
    fetcQuestionnaireDetailslQuery,
    ...derived,
  } as const;
}
