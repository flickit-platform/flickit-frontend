import { useCallback } from "react";
import { useServiceContext } from "@/providers/service-provider";
import { useQuery } from "@/hooks/useQuery";
import {
  setSelectedQuestion,
  useQuestionContext,
  useQuestionDispatch,
} from "../context";
import type { QuestionIssue } from "../types";
import { IQuestionsModel } from "@/types";
import { useParams } from "react-router-dom";

type VariantKey = "evidences" | "comments";

type UseUpdateQuestionIssuesResult = {
  updateQuestionIssues: (args: {
    variant: VariantKey;
    delta?: number;
  }) => Promise<void>;
  loading: boolean;
  error: unknown;
};

export function useUpdateQuestionIssues(): UseUpdateQuestionIssuesResult {
  const { service } = useServiceContext();
  const { selectedQuestion } = useQuestionContext();
  const dispatch = useQuestionDispatch();
  const { assessmentId = "" } = useParams();

  const fetchQuestionIssues = useQuery<IQuestionsModel>({
    service: (args, config) =>
      service.assessments.questionnaire.getQuestionIssues(
        { assessmentId, questionId: selectedQuestion?.id },
        config,
      ),
    runOnMount: false,
  });

  const updateQuestionIssues = async(updatedData:any) => {
    if (!selectedQuestion) return;

    const res = await fetchQuestionIssues.query({
      questionId: selectedQuestion.id,
    });

    const issueRes: QuestionIssue = {
      ...res,
    };

    dispatch(
      setSelectedQuestion({
        ...updatedData,
        issues: issueRes,
      }),
    );
  };

  return {
    updateQuestionIssues,
    loading: fetchQuestionIssues.loading,
    error: fetchQuestionIssues.error,
  };
}
