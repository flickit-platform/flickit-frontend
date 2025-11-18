import { setFilteredQuestions, useQuestionDispatch } from "../../context";
import type { IQuestionInfo, TId } from "@/types";
import { SidebarData } from "../../types";
import { useEffect, useMemo } from "react";
import { IssueId, isQuestionMatchingAnyActiveFilter } from "./issues.registry";
import { useQuestionNavigator } from "./useQuestionNavigator";

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
  const navigation = useQuestionNavigator(questions);

  const answeredCount = useMemo(() => {
    if (!questions.length) return 0;
    const answeredCount = questions.reduce(
      (acc, question) => acc + Number(question.answer?.selectedOption != null),
      0,
    );
    return answeredCount;
  }, [questions]);

  const questionsCount = useMemo(() => {
    return questions.length;
  }, [questions]);

  const completionPercent = useMemo(() => {
    if (!questions.length) return 0;
    const answeredCount = questions.reduce(
      (acc, question) => acc + Number(question.answer?.selectedOption != null),
      0,
    );
    return Math.ceil((answeredCount / questions.length) * 100);
  }, [questions]);

  const hasActiveFilters = activeFilters.size > 0;

  const filteredQuestions = useMemo(() => {
    if (!hasActiveFilters) return questions;
    return questions.filter((question) =>
      isQuestionMatchingAnyActiveFilter(question, activeFilters),
    );
  }, [questions, activeFilters, hasActiveFilters]);

  const activeQuestion = questions[selectedIndex];

  const filteredQuestionsList = useMemo(() => {
    const indexById = new Map<TId, number>();
    for (const [idx, question] of questions.entries()) {
      const id = question?.id;
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
        index: question.index,
        title: question.title,
        issues: question.issues,
        active: isActive,
      };
    });
  }, [filteredQuestions, questions, activeQuestion?.id, selectedIndex]);

  useEffect(() => {
    dispatch(setFilteredQuestions(filteredQuestionsList));

    if (activeFilters.size > 0) {
      const index = filteredQuestions.findIndex(
        (res) => res.index == selectedIndex + 1,
      );
      if (filteredQuestions.length > 0 && index === -1) {
        navigation.selectAt(filteredQuestions[0].index - 1);
      }
    }
  }, [filteredQuestions]);

  return {
    answeredCount,
    questionsCount,
    completionPercent,
    hasActiveFilters,
    filteredQuestionsList,
  };
}
