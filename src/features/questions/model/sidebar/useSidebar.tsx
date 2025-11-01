import { useTranslation } from "react-i18next";
import i18next from "i18next";
import { useMemo, useCallback } from "react";
import { useSidebarNavigation } from "./useSidebarNavigation";
import { useSidebarUIState } from "./useSidebarUIState";
import { useSidebarData } from "./useSidebarData";

import type { IQuestionInfo } from "@/types";
import { getFilterOptionsMeta } from "./issues.registry";

export function useSidebar(questions: IQuestionInfo[]) {
  const { t } = useTranslation();

  const navigation = useSidebarNavigation(questions);
  const uiState = useSidebarUIState();
  const data = useSidebarData({
    questions,
    activeFilters: uiState.activeFilters,
    selectedIndex: navigation.selectedIndex,
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
      if (index === navigation.selectedIndex) return;
      navigation.selectByIndex(index);
    },
    [navigation.selectedIndex, navigation.selectByIndex],
  );

  return {
    uiState,

    ...data,

    sidebarWidth,
    isRTL,
    isAdvancedMode: uiState.showIssueChips,

    toggleSidebar: uiState.toggleSidebar,
    toggleIssueChips: uiState.toggleIssueChips,
    handleSelectItem,

    filterCheckboxes,
  };
}
