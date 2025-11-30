import { useMemo, useCallback, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { setSelectedQuestion, useQuestionDispatch } from "../../context";
import type { IQuestionInfo } from "@/types";
import { useQuery } from "@/hooks/useQuery";
import { useServiceContext } from "@/providers/service-provider";

export type QuestionNavigator = {
  absoluteIndex: number;
  filteredIndex: number;
  isAtStart: boolean;
  isAtEnd: boolean;
  makeQuestionPath: (index: number) => string;
  selectAt: (index: number) => void;
  goPrevious: () => void;
  goNext: () => void;
  fetchQuestion: any;
};

function toAbsoluteIndexFromQuestion(
  q: Partial<IQuestionInfo> | undefined,
  questions: IQuestionInfo[],
) {
  if (q && typeof q.index === "number") {
    const z = Math.max(0, Math.min(questions.length - 1, q.index - 1));
    if (!q.id || questions[z]?.id === q.id) return z;
  }
  return questions.findIndex((x) => x?.id === q?.id);
}

export function useQuestionNavigator(
  questions: IQuestionInfo[],
  filteredQuestions: IQuestionInfo[] = questions,
  activeQuestion?: IQuestionInfo | null,
): QuestionNavigator {
  const { service } = useServiceContext();

  const dispatch = useQuestionDispatch();
  const navigate = useNavigate();
  const { spaceId, page, assessmentId, questionnaireId, questionIndex } =
    useParams();
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

  const filteredIndex = useMemo(() => {
    if (!activeQuestion || !filteredQuestions?.length) return -1;
    return filteredQuestions.findIndex(
      (q) => q?.id === activeQuestion.id || q?.index === activeQuestion.index,
    );
  }, [filteredQuestions, activeQuestion]);

  const isAtStart = filteredIndex === -1 || filteredIndex <= 0;
  const isAtEnd =
    filteredIndex === -1 || filteredIndex >= filteredQuestions?.length - 1;

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
    if (!questions.length) return;
    const safeIndex = Math.min(
      Math.max(index, 0),
      Math.max(questions.length - 1, 0),
    );
    const q = questions[safeIndex];
    if (!q) return;

    navigate(makeQuestionPath(safeIndex));
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
    if (!filteredQuestions?.length || !activeQuestion) return;
    const cur = filteredQuestions.findIndex(
      (q) => q?.index === activeQuestion.index || q?.id === activeQuestion.id,
    );
    if (cur <= 0) return;
    const prevObj = filteredQuestions[cur - 1];
    const abs = toAbsoluteIndexFromQuestion(prevObj, questions);
    if (abs < 0) return;
    selectAt(abs);
  }, [filteredQuestions, activeQuestion, questions, selectAt]);

  const goNext = useCallback(() => {
    if (!filteredQuestions?.length || !activeQuestion) return;
    const cur = filteredQuestions.findIndex(
      (q) => q?.index === activeQuestion.index || q?.id === activeQuestion.id,
    );

    if (cur === filteredQuestions?.length - 1) {
      navigate(makeReviewPath());
    }

    if (cur === -1 || cur >= filteredQuestions?.length - 1) return;
    const nextObj = filteredQuestions[cur + 1];
    const abs = toAbsoluteIndexFromQuestion(nextObj, questions);
    if (abs < 0) return;
    selectAt(abs);
  }, [filteredQuestions, activeQuestion]);

  return {
    absoluteIndex,
    filteredIndex,
    isAtStart,
    isAtEnd,
    makeQuestionPath,
    selectAt,
    goPrevious,
    goNext,
    fetchQuestion,
  };
}
