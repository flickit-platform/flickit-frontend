import { useMemo, useCallback, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { setSelectedQuestion, useQuestionDispatch } from "../../context";
import type { IQuestionInfo } from "@/types";
import { useQuery } from "@/hooks/useQuery";
import { useServiceContext } from "@/providers/service-provider";

export type QuestionNavigator = {
  absoluteIndex: number;
  isAtStart: boolean;
  isAtEnd: boolean;
  makeQuestionPath: (index: number) => string;
  selectAt: (index: number) => void;
  goPrevious: () => void;
  goNext: () => void;
  fetchQuestion: any;
};

export function useQuestionNavigator(
  questions: IQuestionInfo[],
  activeQuestion?: IQuestionInfo | null,
): QuestionNavigator {
  const { service } = useServiceContext();
  const dispatch = useQuestionDispatch();
  const navigate = useNavigate();
  const {
    spaceId,
    page,
    assessmentId = "",
    questionnaireId,
    questionIndex,
  } = useParams();
  const fetchQuestion = useQuery({
    service: (args, config) =>
      service.assessments.questionnaire.getQuestion(args, config),
    runOnMount: false,
  });

  const absoluteIndex = useMemo(() => {
    const oneBased = Number(questionIndex) || 1;
    const zeroBased = Math.max(1, oneBased) - 1;
    const isReviewPage = globalThis.location.pathname.includes("review")
      ? -10
      : zeroBased;
    return Math.min(zeroBased, Math.max(questions.length - 1, 0), isReviewPage);
  }, [questionIndex, questions.length]);

  const isAtStart = absoluteIndex <= 0;
  const isAtEnd = absoluteIndex >= questions?.length - 1;

  const makeQuestionPath = useCallback(
    (index: number) =>
      `/${spaceId}/assessments/${page}/${assessmentId}/questionnaires/${questionnaireId}/${index + 1}`,
    [spaceId, page, assessmentId, questionnaireId],
  );

  const makeReviewPath = useCallback(
    () =>
      `/${spaceId}/assessments/${page}/${assessmentId}/questionnaires/${questionnaireId}/review`,
    [spaceId, page, assessmentId, questionnaireId],
  );

  const selectAt = useCallback((index: number) => {
    const q = questions[index];
    if (!q) return;

    navigate(makeQuestionPath(index));
  }, []);

  useEffect(() => {
    if (questions[absoluteIndex]?.id) {
      fetchQuestion
        .query({ assessmentId, questionId: questions[absoluteIndex]?.id })
        .then((res: any) => {
          dispatch(setSelectedQuestion(res));
        });
    }
  }, [absoluteIndex]);

  const goPrevious = useCallback(() => {
    if (absoluteIndex <= 0) return;
    selectAt(absoluteIndex - 1);
  }, [activeQuestion, questions, selectAt]);

  const goNext = useCallback(() => {
    if (absoluteIndex === questions?.length - 1) {
      navigate(makeReviewPath());
    }

    if (absoluteIndex >= questions?.length - 1) return;

    selectAt(absoluteIndex + 1);
  }, [activeQuestion]);

  return {
    absoluteIndex,
    isAtStart,
    isAtEnd,
    makeQuestionPath,
    selectAt,
    goPrevious,
    goNext,
    fetchQuestion,
  };
}
