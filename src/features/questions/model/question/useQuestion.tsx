import { useServiceContext } from "@/providers/service-provider";
import { useEffect } from "react";
import {
  setConfidenceLevels,
  setQuestions,
  setSelectedConfidence,
  useQuestionDispatch,
} from "../../context";
import { useParams } from "react-router-dom";
import { IQuestionsModel } from "@/types";
import { useQuery } from "@/hooks/useQuery";
import showToast from "@/utils/toast-error";
import { ICustomError } from "@/utils/custom-error";

export const useQuestions = () => {
  const { service } = useServiceContext();
  const dispatch = useQuestionDispatch();
  const { questionnaireId = "", assessmentId = "" } = useParams();
  const pageSize = 50;
  const questionsQuery = useQuery<IQuestionsModel>({
    service: (args, config) =>
      service.assessments.questionnaire.getQuestionnaireAnswers(
        {
          questionnaireId,
          assessmentId,
          page: args?.page ?? 0,
          size: pageSize,
        },
        config,
      ),
    runOnMount: false,
  });

  const confidenceQueryData = useQuery({
    service: (args, config) =>
      service.questions.info.getConfidenceLevels(args ?? {}, config),
    toastError: false,
    runOnMount: false,
  });

  useEffect(() => {
    questionsQuery
      .query({ page: 0 })
      .then((response) => {
        if (response) {
          const { items = [] } = response;
          dispatch(setQuestions(items));
        }
      })
      .catch((e) => {
        showToast(e as ICustomError);
      });
    dispatch(setSelectedConfidence(null));

    confidenceQueryData.query().then((response) => {
      if (response) {
        const { confidenceLevels = [] } = response;
        dispatch(setConfidenceLevels(confidenceLevels));
      }
    });
  }, [questionnaireId]);

  return { questionsQuery };
};
