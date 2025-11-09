import { useCallback } from "react";
import { useParams } from "react-router-dom";
import {
  useQuestionContext,
  useQuestionDispatch,
  questionActions,
} from "../context";
import { useServiceContext } from "@/providers/service-provider";
import { useQuery } from "@/hooks/useQuery";

type OptionLike =
  | { id?: string | number; title?: string; index?: number }
  | null
  | undefined;

const LOW_CONFIDENCE_THRESHOLD = 2; 

export function useAnswerSubmit() {
  const { service } = useServiceContext();
  const { assessmentId, questionnaireId } = useParams();
  const { selectedQuestion, questions = [] } = useQuestionContext();
  const dispatch = useQuestionDispatch();

  const submitAnswer = useQuery({
    service: (args, config) => service.assessments.answer.submit(args, config),
    runOnMount: false,
  });

  const submit = useCallback(
    async (params: {
      value?: OptionLike;
      notApplicable?: boolean;
      confidenceLevelId?: number | null;
      submitOnAnswerSelection?: boolean;
    }) => {
      if (!selectedQuestion?.id) return;

      const { value, notApplicable, confidenceLevelId, submitOnAnswerSelection } = params ?? {};
      const shouldAttach =
        !!value?.id || !!submitOnAnswerSelection || !!notApplicable;

      const payload = {
        assessmentId,
        data: {
          questionnaireId,
          questionId: selectedQuestion.id,
          answerOptionId: value?.id ?? null,
          isNotApplicable: !!notApplicable,
          confidenceLevelId: shouldAttach ? confidenceLevelId ?? null : null,
        },
      };

      const res = await submitAnswer.query(payload);

      const server = (res as any)?.data;
      const serverQuestion = server?.question ?? server?.result ?? server;
      const serverAnswer = serverQuestion?.answer;

      const qid = payload.data.questionId;
      let updatedItem: any = null;

      const nextQuestions = questions.map((q: any) => {
        if (q?.id !== qid) return q;

        const nextAnswer = {
          selectedOption:
            serverAnswer?.selectedOption ??
            (value
              ? { id: value.id ?? null, index: (value as any)?.index, title: (value as any)?.title }
              : null),
          confidenceLevel:
            serverAnswer?.confidenceLevel ??
            (shouldAttach && confidenceLevelId != null ? { id: confidenceLevelId } : q?.answer?.confidenceLevel ?? null),
          isNotApplicable:
            serverAnswer?.isNotApplicable ?? !!notApplicable,
          approved:
            serverAnswer?.approved ?? q?.answer?.approved,
        };

        const evidencesCount =
          serverQuestion?.counts?.evidences ?? q?.counts?.evidences ?? 0;

        const answered = !!nextAnswer.selectedOption || !!nextAnswer.isNotApplicable;
        const confId = nextAnswer.confidenceLevel?.id as number | undefined;

        const nextIssues = {
          isUnanswered: !answered,
          isAnsweredWithLowConfidence:
            answered && confId != null ? confId <= LOW_CONFIDENCE_THRESHOLD : false,
          isAnsweredWithoutEvidences: answered && evidencesCount === 0,
          unresolvedCommentsCount:
            serverQuestion?.issues?.unresolvedCommentsCount ??
            q?.issues?.unresolvedCommentsCount ??
            0,
          hasUnapprovedAnswer:
            nextAnswer.approved === false,
        };

        updatedItem = {
          ...q,
          answer: { ...(q.answer ?? null), ...nextAnswer },
          issues: {
            ...(q.issues ?? {}),
            ...(serverQuestion?.issues ?? {}),
            ...nextIssues,
          },
          counts: {
            ...(q.counts ?? {}),
            ...(serverQuestion?.counts ?? {}),
          },
        };

        return updatedItem;
      });

      if (updatedItem && questionActions.setSelectedQuestion) {
        dispatch(questionActions.setSelectedQuestion(updatedItem));
      }
      dispatch(questionActions.setQuestions(nextQuestions));

      return res;
    },
    [assessmentId, questionnaireId, selectedQuestion?.id, questions, submitAnswer, dispatch],
  );

  return {
    submit,
    isSubmitting: submitAnswer.loading,
    error: submitAnswer.error,
  };
}
