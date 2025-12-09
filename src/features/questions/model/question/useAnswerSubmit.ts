import { useCallback, useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  useQuestionContext,
  useQuestionDispatch,
  setSelectedQuestion,
  addAnswerHistory,
} from "../../context";
import { useServiceContext } from "@/providers/service-provider";
import { useQuery } from "@/hooks/useQuery";
import { useAuthContext } from "@/providers/auth-provider";
import { IQuestionsModel } from "@/types";
import showToast from "@/utils/toast-error";
import { ICustomError } from "@/utils/custom-error";
import { useAssessmentContext } from "@/providers/assessment-provider";
import { useAssessmentMode } from "@/hooks/useAssessmentMode";

type OptionLike =
  | { id?: string | number; title?: string; index?: number }
  | null
  | undefined;

const MIN_LOADING_MS = 500;

export function useAnswerSubmit() {
  const { isAdvanced } = useAssessmentMode();

  const { permissions } = useAssessmentContext();
  const { service } = useServiceContext();
  const { assessmentId = "", questionnaireId } = useParams();
  const { selectedQuestion, questions = [] } = useQuestionContext();
  const dispatch = useQuestionDispatch();
  const { userInfo } = useAuthContext();
  const [delayedLoading, setDelayedLoading] = useState(false);

  const fetchQuestionIssues = useQuery<IQuestionsModel>({
    service: (args, config) =>
      service.assessments.questionnaire.getQuestionIssues(
        { assessmentId, questionId: selectedQuestion?.id },
        config,
      ),
    runOnMount: false,
  });

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

  const loadingTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (loadingTimeoutRef.current) {
        globalThis.clearTimeout(loadingTimeoutRef.current);
      }
    };
  }, []);

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

      setDelayedLoading(true);
      const startedAt = Date.now();

      try {
        let server;
        let serverQuestion;
        let serverAnswer;
        if (isAdvanced) {
          const res = await submitAnswer.query(payload);
          server = res?.data;
          serverQuestion = server?.question ?? server?.result ?? server;
          serverAnswer = serverQuestion?.answer;
        }

        let updatedItem: any = null;

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
          confidenceLevel:
            serverAnswer?.selectedOption || value?.id
              ? (serverAnswer?.confidenceLevel ??
                (shouldAttach && confidenceLevelId != null
                  ? { id: confidenceLevelId }
                  : (selectedQuestion?.answer?.confidenceLevel ?? null)))
              : null,
          isNotApplicable: serverAnswer?.isNotApplicable ?? !!notApplicable,
          approved:
            serverAnswer?.approved ?? selectedQuestion?.answer?.approved,
        };
        let resIssues = selectedQuestion.issues;

        if (permissions?.viewDashboard) {
          await fetchQuestionIssues
            .query({
              questionId: selectedQuestion.id,
            })
            .then((res) => {
              resIssues = res;
            });
        }
        updatedItem = {
          ...selectedQuestion,
          answer: { ...(selectedQuestion.answer ?? null), ...nextAnswer },
          counts: {
            ...selectedQuestion.counts,
            ...serverQuestion?.counts,
            answerHistories: selectedQuestion.counts.answerHistories + 1,
          },
          issues: {
            ...resIssues,
            isUnanswered: Boolean(!value?.id),
          },
        };

        console.log(selectedQuestion.answer)
        const newAnswerHistory = {
          createdBy: {
            id: userInfo.id,
            pictureLink: userInfo.pictureLink,
            displayName: userInfo.displayName,
          },
          answer: {
            ...updatedItem?.answer,
            confidenceLevel: {
              ...updatedItem?.answer.confidenceLevel,
              title: "Fairly unsure",
            },
          },
          creationTime: new Date().toISOString(),
        };
        dispatch(setSelectedQuestion(updatedItem));
        dispatch(addAnswerHistory(newAnswerHistory));
        if (!isAdvanced) {
          await submitAnswer.query(payload);
        }
      } catch (err) {
        showToast(err as ICustomError);
      } finally {
        const elapsed = Date.now() - startedAt;
        const remaining = MIN_LOADING_MS - elapsed;

        if (remaining > 0) {
          loadingTimeoutRef.current = window.setTimeout(() => {
            setDelayedLoading(false);
          }, remaining);
        } else {
          setDelayedLoading(false);
        }
      }
    },
    [
      assessmentId,
      questionnaireId,
      selectedQuestion?.id,
      questions,
      submitAnswer,
      dispatch,
      userInfo.id,
      userInfo.pictureLink,
      userInfo.displayName,
    ],
  );

  const approve = useCallback(async () => {
    if (!selectedQuestion?.id) return;
    const res = await approveAnswerQuery.query().then(async () => {
      let resIssues = selectedQuestion.issues;
      if (permissions?.viewDashboard) {
        await fetchQuestionIssues
          .query({
            questionId: selectedQuestion.id,
          })
          .then((res) => {
            resIssues = res;
          });
      }
      const updatedItem = {
        ...selectedQuestion,
        issues: resIssues,
      };
      dispatch(setSelectedQuestion(updatedItem));
    });

    return res;
  }, [approveAnswerQuery, selectedQuestion]);

  return {
    submit,
    isLoading: submitAnswer.loading || delayedLoading,
    isLoadingApprove: approveAnswerQuery.loading,
    approve,
    error: submitAnswer.error,
  };
}
