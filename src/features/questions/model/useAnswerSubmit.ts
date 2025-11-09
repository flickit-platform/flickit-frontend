import { useCallback } from "react";
import { useParams } from "react-router-dom";
import {
  useQuestionContext,
  useQuestionDispatch,
  questionActions,
} from "../context";
import { useServiceContext } from "@/providers/service-provider";
import { useQuery } from "@/hooks/useQuery";
import { IQuestionsModel } from "@/types";

type OptionLike =
  | { id?: string | number; title?: string; index?: number }
  | null
  | undefined;

export function useAnswerSubmit() {
  const { service } = useServiceContext();
  const { assessmentId = "", questionnaireId } = useParams();
  const { selectedQuestion, questions = [] } = useQuestionContext();
  const dispatch = useQuestionDispatch();

  const submitAnswer = useQuery({
    service: (args, config) => service.assessments.answer.submit(args, config),
    runOnMount: false,
  });

  const approveAnswerQuery = useQuery({
    service: (args, config) =>
      service.assessments.answer.approve(
        args ?? { assessmentId, data: { questionId: selectedQuestion.id } },
        config,
      ),
    runOnMount: false,
  });

  const fetchQuestionIssues = useQuery<IQuestionsModel>({
    service: (args, config) =>
      service.assessments.questionnaire.getQuestionIssues(
        { assessmentId, questionId: selectedQuestion?.id },
        config,
      ),
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

      const {
        value,
        notApplicable,
        confidenceLevelId,
        submitOnAnswerSelection,
      } = params ?? {};
      const shouldAttach =
        !!value?.id || !!submitOnAnswerSelection || !!notApplicable;

      const payload = {
        assessmentId,
        data: {
          questionnaireId,
          questionId: selectedQuestion.id,
          answerOptionId: value?.id ?? null,
          isNotApplicable: !!notApplicable,
          confidenceLevelId: shouldAttach ? (confidenceLevelId ?? null) : null,
        },
      };

      const res = await submitAnswer.query(payload);
      const issueRes = await fetchQuestionIssues.query();
      const server = res?.data;
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
              ? {
                  id: value.id ?? null,
                  index: (value as any)?.index,
                  title: (value as any)?.title,
                }
              : null),
          confidenceLevel: serverAnswer?.selectedOption
            ? (serverAnswer?.confidenceLevel ??
              (shouldAttach && confidenceLevelId != null
                ? { id: confidenceLevelId }
                : (q?.answer?.confidenceLevel ?? null)))
            : null,
          isNotApplicable: serverAnswer?.isNotApplicable ?? !!notApplicable,
          approved: serverAnswer?.approved ?? q?.answer?.approved,
        };

        updatedItem = {
          ...q,
          answer: { ...(q.answer ?? null), ...nextAnswer },
          issues: {
            ...issueRes,
          },
          counts: {
            ...q.counts,
            ...serverQuestion?.counts,
          },
        };

        return updatedItem;
      });

      dispatch(questionActions.setSelectedQuestion(updatedItem));
      dispatch(questionActions.setQuestions(nextQuestions));

      return res;
    },
    [
      assessmentId,
      questionnaireId,
      selectedQuestion?.id,
      questions,
      submitAnswer,
      dispatch,
    ],
  );

  const approve = useCallback(async () => {
    if (!selectedQuestion?.id) return;

    const res = await approveAnswerQuery.query();
    const issueRes = await fetchQuestionIssues.query();

    const nextQuestions = questions.map((q: any) => {
      if (q?.id !== selectedQuestion?.id) return q;

      const updatedItem = {
        ...q,
        issues: {
          ...issueRes,
        },
      };

      return updatedItem;
    });

    dispatch(
      questionActions.setSelectedQuestion({
        ...selectedQuestion,
        issues: {
          ...issueRes,
        },
      }),
    );

    dispatch(questionActions.setQuestions(nextQuestions));
    return res;
  }, [assessmentId, questionnaireId, selectedQuestion?.id]);
  return {
    submit,
    isLoading: submitAnswer.loading,
    approve,
    error: submitAnswer.error,
  };
}
