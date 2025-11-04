import { useMemo, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { questionActions, useQuestionDispatch } from "../../context";
import type { IQuestionInfo } from "@/types";
import { SidebarNavigation } from "../../types";

export function useSidebarNavigation(
  questions: IQuestionInfo[],
): SidebarNavigation {
  const dispatch = useQuestionDispatch();
  const navigate = useNavigate();
  const { spaceId, page, assessmentId, questionnaireId, questionIndex } =
    useParams();

  const selectedIndex = useMemo(() => {
    const oneBased = Number(questionIndex) || 1;
    const zeroBased = Math.max(1, oneBased) - 1;
    return Math.min(zeroBased, Math.max(questions.length - 1, 0));
  }, [questionIndex, questions.length]);

  const buildQuestionUrl = useCallback(
    (index: number) =>
      `/${spaceId}/assessments/${page}/${assessmentId}/questionnaires_temp/${questionnaireId}/${index + 1}`,
    [spaceId, page, assessmentId, questionnaireId],
  );

  const selectByIndex = useCallback(
    (index: number) => {
      if (!questions.length) return;
      const safeIndex = Math.min(
        Math.max(index, 0),
        Math.max(questions.length - 1, 0),
      );
      const question = questions[safeIndex];
      if (!question) return;

      navigate(buildQuestionUrl(safeIndex));
      dispatch(questionActions.setSelectedQuestion(question));
    },
    [questions, navigate, buildQuestionUrl, dispatch],
  );

  return {
    selectedIndex,
    selectByIndex,
    buildQuestionUrl,
  };
}
