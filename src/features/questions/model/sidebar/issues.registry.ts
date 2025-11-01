// src/features/questions/model/issueCatalog.ts
import type { IQuestionInfo } from "@/types";
import { IssueChipTone, IssueDefinition, QuestionIssue } from "../../types";

export const ISSUE_CATALOG = [
  {
    id: "lowconf",
    i18nKey: "questions_temp.lowConfidence",
    chipTone: "error",
    showAsChip: true,
    showInFilter: true,
    matches: (questionIssues: QuestionIssue) =>
      !!questionIssues.isAnsweredWithLowConfidence,
  },
  {
    id: "noevidence",
    i18nKey: "questions_temp.noEvidence",
    chipTone: "error",
    showAsChip: true,
    showInFilter: true,
    matches: (questionIssues: QuestionIssue) =>
      !!questionIssues.isAnsweredWithoutEvidences,
  },
  {
    id: "unresolved",
    i18nKey: "dashboard.unresolvedComments",
    chipTone: "error",
    showAsChip: true,
    showInFilter: true,
    matches: (questionIssues: QuestionIssue) =>
      (questionIssues.unresolvedCommentsCount ?? 0) > 0,
  },
  {
    id: "unapproved",
    i18nKey: "dashboard.unapprovedAnswer",
    chipTone: "tertiary",
    showAsChip: true,
    showInFilter: true,
    matches: (questionIssues: QuestionIssue) =>
      !!questionIssues.hasUnapprovedAnswer,
  },
  {
    id: "unanswered",
    i18nKey: "questions_temp.unanswered",
    chipTone: "error",
    showAsChip: false,
    showInFilter: true,
    matches: (questionIssues: QuestionIssue) =>
      !!questionIssues.isUnanswered,
  },
] as const satisfies Readonly<IssueDefinition[]>;

export type IssueId = (typeof ISSUE_CATALOG)[number]["id"];

export function getIssueChips(
  issues: QuestionIssue,
  t: (i18nKey: string) => string,
) {
  return ISSUE_CATALOG
    .filter((def) => def.showAsChip && def.matches(issues))
    .map((def) => ({
      id: def.id,
      label: t(def.i18nKey),
      tone: def.chipTone as IssueChipTone,
    }));
}

export function isQuestionMatchingAnyActiveFilter(
  question: IQuestionInfo,
  activeFilterIds: Set<IssueId>,
) {
  if (activeFilterIds.size === 0) return true;
  const questionIssues = (question.issues ?? {}) as QuestionIssue;
  for (const def of ISSUE_CATALOG) {
    if (activeFilterIds.has(def.id) && def.matches(questionIssues)) return true;
  }
  return false;
}

export function getFilterOptionsMeta(
  activeFilterIds: Set<IssueId>,
  t: (i18nKey: string) => string,
) {
  return ISSUE_CATALOG
    .filter((def) => def.showInFilter)
    .map((def) => ({
      id: def.id as IssueId,
      label: t(def.i18nKey),
      checked: activeFilterIds.has(def.id),
    }));
}
