import { useReducer, useCallback, useRef } from "react";
import { QuestionIssue, SidebarUIState } from "../../types";
import { getIssueChips } from "./issues.registry";
import { useTranslation } from "react-i18next";

type UIState = {
  isOpen: boolean;
  showIssueChips: boolean;
  activeFilters: Set<string>;
};

type UIAction =
  | { type: "TOGGLE_SIDEBAR" }
  | { type: "TOGGLE_ISSUE_CHIPS" }
  | { type: "SET_FILTER_ENABLED"; id: string; enabled: boolean }
  | { type: "SET_SHOW_ISSUE_CHIPS"; value: boolean };

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
    case "SET_SHOW_ISSUE_CHIPS":
      return { ...state, showIssueChips: action.value };
    default:
      return state;
  }
};

export function useSidebarUIState(): SidebarUIState {
  const { t } = useTranslation();


  const [uiState, dispatchUIState] = useReducer(uiStateReducer, {
    isOpen: true,
    showIssueChips: true,
    activeFilters: new Set<string>(),
  });

  const userToggledRef = useRef(false);
  const toggleIssueChips = useCallback(() => {
    userToggledRef.current = true;
    dispatchUIState({ type: "TOGGLE_ISSUE_CHIPS" });
  }, []);


  const toggleSidebar = useCallback(
    () => dispatchUIState({ type: "TOGGLE_SIDEBAR" }),
    [],
  );

  const setFilterEnabled = useCallback(
    (id: string, enabled: boolean) =>
      dispatchUIState({ type: "SET_FILTER_ENABLED", id, enabled }),
    [],
  );

  const getIssueChipsForQuestion = useCallback(
    (issues: QuestionIssue) => getIssueChips(issues, t),
    [t],
  );

  return {
    ...uiState,
    toggleSidebar,
    toggleIssueChips,
    setFilterEnabled,
    getIssueChipsForQuestion,
  };
}
