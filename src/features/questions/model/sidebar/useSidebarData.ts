import { questionActions, useQuestionDispatch } from "../../context";
import type { IQuestionInfo, TId } from "@/types";
import { SidebarData } from "../../types";
import { useEffect, useMemo } from "react";
import { IssueId, isQuestionMatchingAnyActiveFilter } from "./issues.registry";

interface UseSidebarDataProps {
  questions: IQuestionInfo[];
  activeFilters: Set<IssueId>;
  selectedIndex: number;
}

export function useSidebarData({
  questions,
  activeFilters,
  selectedIndex,
}: UseSidebarDataProps): SidebarData {
  const dispatch = useQuestionDispatch();

  useEffect(() => {
    const current = questions[selectedIndex];
    if (current) dispatch(questionActions.setSelectedQuestion(current));
  }, [questions, selectedIndex, dispatch]);

  const completionPercent = useMemo(() => {
    if (!questions.length) return 0;
    const answeredCount = questions.reduce(
      (acc, q) => acc + Number(q.answer?.selectedOption != null),
      0,
    );
    return Math.ceil((answeredCount / questions.length) * 100);
  }, [questions]);

  const hasActiveFilters = activeFilters.size > 0;

  const filteredQuestions = useMemo(() => {
    if (!hasActiveFilters) return questions;
    return questions.filter((q) =>
      isQuestionMatchingAnyActiveFilter(q, activeFilters),
    );
  }, [questions, activeFilters, hasActiveFilters]);

  const activeQuestion = questions[selectedIndex];

  const listItems = useMemo(() => {
    const indexById = new Map<TId, number>();
    for (const [idx, q] of questions.entries()) {
      const id = q?.id;
      if (id) indexById.set(id, idx);
    }

    return filteredQuestions.map((question: any, i) => {
      const fullIndex =
        question.id == null
          ? questions.indexOf(question)
          : (indexById.get(question.id) ?? questions.indexOf(question));

      const isActive = question.id
        ? question.id === activeQuestion?.id
        : fullIndex === selectedIndex;

      return {
        key: question.id,
        idx: fullIndex,
        title: question.title,
        issues: question.issues,
        active: isActive,
      };
    });
  }, [filteredQuestions, questions, activeQuestion?.id, selectedIndex]);

  return {
    completionPercent,
    hasActiveFilters,
    listItems,
    filteredQuestions,
  };
}
