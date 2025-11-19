import { useTranslation } from "react-i18next";
import i18next from "i18next";
import { useMemo, useCallback } from "react";
import { useSidebarUIState } from "./useSidebarUIState";
import { useSidebarData } from "./useSidebarData";

import type { IQuestionInfo } from "@/types";
import { getFilterOptionsMeta } from "./issues.registry";
import { useQuestionNavigator } from "./useQuestionNavigator";
import { useAssessmentContext } from "@/providers/assessment-provider";
import { useAssessmentMode } from "@/hooks/useAssessmentMode";

export function useSidebar(questions: IQuestionInfo[]) {
  const { t } = useTranslation();
  const { permissions } = useAssessmentContext();
  const { isAdvanced } = useAssessmentMode();

  const navigation = useQuestionNavigator(questions);
  const uiState = useSidebarUIState();
  const data = useSidebarData({
    questions,
    activeFilters: uiState.activeFilters,
    selectedIndex: navigation.absoluteIndex,
  });

  const sidebarWidth = uiState.isOpen ? "33%" : 78;
  const isRTL = i18next.language === "fa";

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
        onChange: (checked: boolean) =>
          uiState.setFilterEnabled(opt.id, checked),
      })),
    [filterOptions, uiState.setFilterEnabled],
  );

  const handleSelectItem = useCallback(
    (index: number) => {
      if (index === navigation.absoluteIndex) return;
      navigation.selectAt(index);
    },
    [navigation.absoluteIndex],
  );

  const displayFilter = useMemo(() => {
    return permissions?.viewDashboard && isAdvanced;
  }, [isAdvanced, permissions]);

  const displayChips = useMemo(() => {
    return uiState.showIssueChips && displayFilter;
  }, [isAdvanced, uiState.showIssueChips]);

  return {
    uiState,

    ...data,

    sidebarWidth,
    isRTL,

    displayFilter,
    displayChips,

    toggleSidebar: uiState.toggleSidebar,
    toggleIssueChips: uiState.toggleIssueChips,
    handleSelectItem,

    filterCheckboxes,
  };
}
