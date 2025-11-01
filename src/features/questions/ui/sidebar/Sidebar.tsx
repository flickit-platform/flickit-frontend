import { memo } from "react";
import { Paper, List, Box } from "@mui/material";
import { useTranslation } from "react-i18next";
import { styles } from "@styles";
import { useSidebar } from "../../model/sidebar/useSidebar";
import usePopover from "@/hooks/usePopover";
import type { SideBarProps } from "../../types";
import { SidebarHeader } from "./SidebarHeader";
import { QuestionsFilter } from "./QuestionsFilter";
import { QuestionItem } from "./QuestionItem";

const SidebarContent = memo(({ questions }: Readonly<SideBarProps>) => {
  const { t } = useTranslation();

  const {
    uiState,
    sidebarWidth,
    isAdvancedMode,
    completionPercent,
    hasActiveFilters,
    listItems,
    filterCheckboxes,
    toggleSidebar,
    toggleIssueChips,
    handleSelectItem,
  } = useSidebar(questions);

  const {
    anchorEl,
    open: isFilterPopoverOpen,
    handlePopoverOpen: openFilterPopover,
    handlePopoverClose: closeFilterPopover,
  } = usePopover();

  return (
    <Paper
      elevation={0}
      sx={{
        ...styles.shadowStyle,
        bgcolor: (theme) => theme.palette.background.background,
        width: sidebarWidth,
        boxSizing: "border-box",
        flex: "0 0 auto",
        overflow: "hidden",
        transition: (t) =>
          t.transitions.create("width", {
            duration: t.transitions.duration.short,
          }),
        display: "flex",
        flexDirection: "column",
      }}
    >
      <SidebarHeader
        title={t("questions_temp.questionsList", { count: questions.length })}
        open={uiState.isOpen}
        onToggleOpen={toggleSidebar}
        showChips={uiState.showIssueChips}
        onToggleChips={toggleIssueChips}
        progress={completionPercent}
        onOpenFilter={openFilterPopover}
        hasActiveFilters={hasActiveFilters}
        isAdvancedMode={isAdvancedMode}
      />

      <QuestionsFilter
        anchorEl={anchorEl}
        open={isFilterPopoverOpen}
        onClose={closeFilterPopover}
        filters={filterCheckboxes}
      />

      <List
        disablePadding
        sx={[
          {
            py: uiState.isOpen ? 1 : 0.5,
            flex: 1,
            scrollbarGutter: "stable",
            "& .MuiListItemButton-root": { my: 1 },
          },
        ]}
      >
        {listItems.map((item) => (
          <Box key={item.key} sx={{ ...styles.centerCVH }}>
            <QuestionItem
              {...item}
              open={uiState.isOpen}
              showChips={uiState.showIssueChips}
              onSelect={handleSelectItem}
            />
          </Box>
        ))}
      </List>
    </Paper>
  );
});

export default function Sidebar(props: Readonly<SideBarProps>) {
  return <SidebarContent {...props} />;
}
