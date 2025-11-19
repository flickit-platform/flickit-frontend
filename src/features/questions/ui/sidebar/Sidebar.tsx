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
import { useAssessmentMode } from "@/hooks/useAssessmentMode";
import SidebarEmptyState from "../../assets/empty-state.svg";
import { Text } from "@/components/common/Text";

const EmptyState: React.FC<{ title: string }> = ({ title }) => (
  <Box p={8} gap={2} sx={{ ...styles.centerCVH }}>
    <Box
      component="img"
      src={SidebarEmptyState}
      alt="empty state"
      sx={{ width: "100%", maxWidth: 80 }}
    />
    <Text variant="bodyLarge" color="disabled.on" textAlign="center">
      {title}
    </Text>
  </Box>
);

const SidebarContent = memo(({ questions }: Readonly<SideBarProps>) => {
  const { t } = useTranslation();

  const {
    uiState,
    sidebarWidth,
    completionPercent,
    hasActiveFilters,
    filteredQuestionsList,
    filterCheckboxes,
    toggleSidebar,
    toggleIssueChips,
    handleSelectItem,
    displayChips,
    displayFilter,
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
        minHeight: "540px",
        height: "fit-content",
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
        displayFilter={displayFilter}
      />

      <QuestionsFilter
        anchorEl={anchorEl}
        open={isFilterPopoverOpen}
        onClose={closeFilterPopover}
        filters={filterCheckboxes}
      />

      {filteredQuestionsList.length > 0 ? (
        <List
          disablePadding
          sx={[
            {
              py: uiState.isOpen ? 1 : 0.5,
              flex: 1,
              scrollbarGutter: "stable",
            },
          ]}
        >
          {filteredQuestionsList.map((item) => (
            <Box key={item.key} sx={{ ...styles.centerCV }}>
              <QuestionItem
                {...item}
                open={uiState.isOpen}
                showChips={displayChips}
                onSelect={handleSelectItem}
              />
            </Box>
          ))}
        </List>
      ) : (
        <EmptyState title={t("questions_temp.questionsEmptyState")} />
      )}
    </Paper>
  );
});

export default function Sidebar(props: Readonly<SideBarProps>) {
  return <SidebarContent {...props} />;
}
