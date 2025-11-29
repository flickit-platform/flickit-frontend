import type { IQuestionInfo, TId } from "@/types";
import { SidebarData } from "../../types";
import { useMemo } from "react";
import { IssueId } from "./issues.registry";

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
    return questions.map((question) => {
      const issues = question.issues ?? {};
  
      const updatedIssues = {
        ...issues,
        isUnanswered: activeFilters.has("unanswered")
          ? issues.isUnanswered
          : false,
        isAnsweredWithLowConfidence: activeFilters.has("lowconf")
          ? issues.isAnsweredWithLowConfidence
          : false,
        isAnsweredWithoutEvidences: activeFilters.has("noevidence")
          ? issues.isAnsweredWithoutEvidences
          : false,
        unresolvedCommentsCount: activeFilters.has("unresolved")
          ? issues.unresolvedCommentsCount
          : 0,
        hasUnapprovedAnswer: activeFilters.has("unapproved")
          ? issues.hasUnapprovedAnswer
          : false,
      };
  
      return {
        ...question,
        issues: updatedIssues,
      };
    });
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

  return {
    answeredCount,
    questionsCount,
    completionPercent,
    hasActiveFilters,
    filteredQuestionsList,
  };
}
