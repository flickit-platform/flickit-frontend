import { IQuestionInfo } from "@/types";

type SideBarProps = {
  questions: IQuestionInfo[];
};

type QuestionIssue = NonNullable<IQuestionInfo["issues"]>;

export type IssueChipTone = "error" | "tertiary";

export interface IssueDefinition {
  id: string;
  i18nKey: string;
  chipTone: IssueChipTone;
  showAsChip: boolean;
  showInFilter: boolean;
  matches: (questionIssues: QuestionIssue) => boolean;
}

type FilterKey =
  | "unanswered"
  | "unresolved"
  | "noevidence"
  | "unapproved"
  | "lowconf";

type HeaderProps = {
  title: string;
  open: boolean;
  onToggleOpen: () => void;
  showChips: boolean;
  onToggleChips: () => void;
  progress: number;
  onOpenFilter: (e: React.MouseEvent<HTMLElement>) => void;
  hasActiveFilters: boolean;
  isAdvancedMode: boolean;
};
