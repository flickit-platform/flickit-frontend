import { useMemo, useReducer, useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import i18next from "i18next";
import { useAssessmentContext } from "@/providers/assessment-provider";
import { ASSESSMENT_MODE } from "@/utils/enum-type";
import type { IQuestionInfo, TId } from "@/types";
import { useParams, useNavigate } from "react-router-dom";
import { questionActions, useQuestionDispatch } from "../../context";
import {
  IssueId,
  getFilterOptionsMeta,
  isQuestionMatchingAnyActiveFilter,
} from "./issues.registry";

type UIState = {
  isOpen: boolean;
  showIssueChips: boolean;
  activeFilters: Set<IssueId>;
};

type UIAction =
  | { type: "TOGGLE_SIDEBAR" }
  | { type: "TOGGLE_ISSUE_CHIPS" }
  | { type: "SET_FILTER_ENABLED"; id: IssueId; enabled: boolean };

const uiStateReducer = (state: UIState, action: UIAction): UIState => {
  switch (action.type) {
    case "TOGGLE_SIDEBAR":
      return { ...state, isOpen: !state.isOpen };
    case "TOGGLE_ISSUE_CHIPS":
      return { ...state, showIssueChips: !state.showIssueChips };
    case "SET_FILTER_ENABLED": {
      const next = new Set(state.activeFilters);
      action.enabled ? next.add(action.id) : next.delete(action.id);
      return { ...state, activeFilters: next };
    }
    default:
      return state;
  }
};

export function useSidebar(questions: IQuestionInfo[]) {
  const { t } = useTranslation();
  const { assessmentInfo } = useAssessmentContext();
  const isAdvancedMode =
    ASSESSMENT_MODE.ADVANCED === assessmentInfo?.mode?.code;

  const [uiState, dispatchUIState] = useReducer(uiStateReducer, {
    isOpen: true,
    showIssueChips: isAdvancedMode,
    activeFilters: new Set<IssueId>(),
  });

  const sidebarWidth = uiState.isOpen ? "33%" : 78;
  const isRTL = i18next.language === "fa";
  const dispatch = useQuestionDispatch();
  const navigate = useNavigate();
  const { spaceId, page, assessmentId, questionnaireId, questionIndex } =
    useParams();

  const urlSelectedIndex = useMemo(() => {
    const oneBased = Number(questionIndex) || 1;
    const zeroBased = Math.max(1, oneBased) - 1;
    return Math.min(zeroBased, Math.max(questions.length - 1, 0));
  }, [questionIndex, questions.length]);

  const selectedIndex = urlSelectedIndex;

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
      const q = questions[safeIndex];
      if (!q) return;

      navigate(buildQuestionUrl(safeIndex));
      dispatch(questionActions.setSelectedQuestion(q));
    },
    [questions, navigate, buildQuestionUrl, dispatch],
  );

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

  const hasActiveFilters = uiState.activeFilters.size > 0;

  const filteredQuestions = useMemo(() => {
    if (!hasActiveFilters) return questions;
    return questions.filter((q) =>
      isQuestionMatchingAnyActiveFilter(q, uiState.activeFilters),
    );
  }, [questions, uiState.activeFilters, hasActiveFilters]);

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

  const toggleSidebar = useCallback(
    () => dispatchUIState({ type: "TOGGLE_SIDEBAR" }),
    [],
  );
  const toggleIssueChips = useCallback(
    () => dispatchUIState({ type: "TOGGLE_ISSUE_CHIPS" }),
    [],
  );
  const setFilterEnabled = useCallback(
    (id: IssueId, enabled: boolean) =>
      dispatchUIState({ type: "SET_FILTER_ENABLED", id, enabled }),
    [],
  );

  const handleSelectItem = useCallback(
    (index: number) => {
      if (index === selectedIndex) return;
      selectByIndex(index);
    },
    [selectedIndex, selectByIndex],
  );

  const filterOptions = useMemo(
    () => getFilterOptionsMeta(uiState.activeFilters, t),
    [uiState.activeFilters, t],
  );

  const filterCheckboxes = useMemo(
    () =>
      filterOptions.map((opt) => ({
        key: opt.id,
        label: opt.label,
        checked: opt.checked,
        onChange: (checked: boolean) => setFilterEnabled(opt.id, checked),
      })),
    [filterOptions, setFilterEnabled],
  );

  return {
    uiState,
    sidebarWidth,
    isRTL,
    isAdvancedMode,
    completionPercent,
    hasActiveFilters,
    listItems,
    toggleSidebar,
    toggleIssueChips,
    handleSelectItem,
    filterCheckboxes,
  };
}
