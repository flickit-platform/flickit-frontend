import { IQuestionInfo } from "@/types";

type SideBarProps = {
  questions: IQuestionInfo[];
};

type QuestionIssue = NonNullable<IQuestionInfo["issues"]>;

type IssueChipTone = "error" | "tertiary";
interface IssueDefinition {
  id: string;
  i18nKey: string;
  chipTone: IssueChipTone;
  showAsChip: boolean;
  showInFilter: boolean;
  matches: (questionIssues: QuestionIssue) => boolean;
}

interface IIssueService {
  getIssueChips: (issues: QuestionIssue, t: TFunction) => IssueChip[];
  isQuestionMatchingAnyActiveFilter: (
    question: IQuestionInfo,
    activeFilters: Set<string>,
  ) => boolean;
  getFilterOptionsMeta: (
    activeFilters: Set<string>,
    t: TFunction,
  ) => FilterOption[];
  getAvailableFilters: () => string[];
}

interface SidebarNavigation {
  selectedIndex: number;
  selectByIndex: (index: number) => void;
  buildQuestionUrl: (index: number) => string;
}

interface SidebarUIState {
  isOpen: boolean;
  showIssueChips: boolean;
  activeFilters: Set<IssueId>;
  toggleSidebar: () => void;
  toggleIssueChips: () => void;
  setFilterEnabled: (id: string, enabled: boolean) => void;
  getIssueChipsForQuestion: (issues: QuestionIssue) => {
    id: IssueId;
    label: string;
    tone: IssueChipTone;
  }[];
}

interface SidebarData {
  completionPercent: number;
  hasActiveFilters: boolean;
  listItems: ListItem[];
  filteredQuestions: IQuestionInfo[];
}

interface IIssueFilter {
  getIssueChips(issues: QuestionIssue, t: TFunction): IssueChip[];
  isQuestionMatchingAnyActiveFilter(
    question: IQuestionInfo,
    activeFilters: Set<string>,
  ): boolean;
  getFilterOptionsMeta(
    activeFilters: Set<string>,
    t: TFunction,
  ): FilterOption[];
}
