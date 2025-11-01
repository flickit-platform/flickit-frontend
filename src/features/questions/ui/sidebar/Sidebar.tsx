import { memo, useMemo } from "react";
import {
  Box,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Paper,
  Chip,
  Checkbox,
  FormGroup,
  FormControlLabel,
} from "@mui/material";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import { useTranslation } from "react-i18next";
import i18next from "i18next";
import { Text } from "@/components/common/Text";
import { styles } from "@styles";
import { GenericPopover } from "@/components/common/PopOver";
import type { QuestionIssue, SideBarProps } from "../../types";
import { useSidebar } from "../../model/sidebar/useSidebar";
import { getIssueChips } from "../../model/sidebar/issues.registry";
import usePopover from "@/hooks/usePopover";

const SidebarHeader = memo(function SidebarHeader({
  title,
  open,
  onToggleOpen,
  showChips,
  onToggleChips,
  progress,
  onOpenFilter,
  hasActiveFilters,
  isAdvancedMode,
}: {
  title: string;
  open: boolean;
  onToggleOpen: () => void;
  showChips: boolean;
  onToggleChips: () => void;
  progress: number;
  onOpenFilter: (e: React.MouseEvent<HTMLElement>) => void;
  hasActiveFilters: boolean;
  isAdvancedMode: boolean;
}) {
  const { t } = useTranslation();
  const rtl = i18next.language === "fa";

  return (
    <Box
      sx={{
        ...styles.centerVH,
        gap: 1.5,
        px: 2,
        py: 1.5,
        position: "relative",
        "&::before": {
          content: '""',
          position: "absolute",
          bottom: 0,
          [rtl ? "right" : "left"]: 0,
          width: progress + "%",
          height: "4px",
          backgroundColor: "primary.main",
        },
        "&::after": {
          content: '""',
          position: "absolute",
          bottom: 0,
          [rtl ? "right" : "left"]: progress + "%",
          width: 100 - progress + "%",
          height: "4px",
          backgroundColor: "divider",
        },
      }}
    >
      <IconButton onClick={onToggleOpen} size="small" color="primary">
        <MenuRoundedIcon />
      </IconButton>

      {open && (
        <Box
          justifyContent="space-between"
          width="100%"
          sx={{ ...styles.centerV }}
        >
          <Text variant="semiBoldMedium">{title}</Text>

          {Boolean(isAdvancedMode) && (
            <Box display="flex" gap={0.75}>
              <Tooltip
                title={
                  showChips
                    ? t("questions_temp.hideIssues")
                    : t("questions_temp.displayIssues")
                }
              >
                <IconButton
                  size="small"
                  color={showChips ? "primary" : "info"}
                  onClick={onToggleChips}
                  aria-label={showChips ? t("common.hide") : t("common.show")}
                >
                  {!showChips ? (
                    <VisibilityOffOutlinedIcon />
                  ) : (
                    <VisibilityOutlinedIcon />
                  )}
                </IconButton>
              </Tooltip>

              <IconButton
                size="small"
                color={hasActiveFilters ? "primary" : "info"}
                onClick={onOpenFilter}
                aria-label={t("questions_temp.filter")}
              >
                <FilterAltOutlinedIcon />
              </IconButton>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
});

const QuestionItem = memo(function QuestionItem({
  title,
  issues,
  idx,
  active,
  open,
  showChips,
  onSelect,
}: {
  title: string;
  issues: QuestionIssue;
  idx: number;
  active: boolean;
  open: boolean;
  showChips: boolean;
  onSelect: (idx: number) => void;
}) {
  const { t } = useTranslation();
  const chips = useMemo(() => getIssueChips(issues, t), [issues, t]);
  const rtl = i18next.language === "fa";

  const badge = (
    <Box
      sx={{
        position: "relative",
        width: 32,
        height: open ? "100%" : 44,
        borderRadius: "8px",
        display: "grid",
        placeItems: "center",
        bgcolor: active ? "primary.main" : "background.states.selected",
      }}
    >
      {issues?.isUnanswered && (
        <Box
          component="span"
          sx={{
            position: "absolute",
            top: 0,
            [rtl ? "right" : "left"]: 0,
            width: 8,
            height: 8,
            borderRadius: "50%",
            bgcolor: "error.main",
          }}
        />
      )}
      <Text
        color={active ? "primary.contrastText" : "text.primary"}
        variant="bodyMedium"
      >
        {idx + 1}
      </Text>
    </Box>
  );

  const body = (
    <ListItemButton
      selected={open && active}
      onClick={() => onSelect(idx)}
      sx={{ alignItems: "stretch" }}
    >
      <ListItemIcon
        sx={{ minWidth: open ? 32 : 0, alignSelf: "stretch", display: "flex" }}
      >
        {badge}
      </ListItemIcon>

      {open && (
        <ListItemText
          disableTypography
          sx={{ paddingInlineStart: 1.5, mb: 0 }}
          primary={
            <Text variant="bodyMedium" textAlign="justify">
              {title}
            </Text>
          }
          secondary={
            showChips && chips.length ? (
              <Box sx={{ mt: 1, display: "flex", gap: 1, flexWrap: "wrap" }}>
                {chips.map((chip) => (
                  <Chip
                    key={chip.id}
                    size="small"
                    label={chip.label}
                    variant="filled"
                    sx={(theme) => {
                      const palette = theme.palette[chip.tone];
                      return {
                        borderRadius: 1,
                        bgcolor: palette.states?.selected,
                        color: palette.main,
                        "& .MuiChip-label": { p: 0.5 },
                      };
                    }}
                  />
                ))}
              </Box>
            ) : null
          }
        />
      )}
    </ListItemButton>
  );

  if (open) return body;

  return (
    <Tooltip
      title={<Text variant="labelSmall">{title}</Text>}
      placement={rtl ? "left" : "right"}
    >
      <span>{body}</span>
    </Tooltip>
  );
});

export default function Sidebar({ questions }: Readonly<SideBarProps>) {
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

      <GenericPopover
        id="questions-filter"
        open={isFilterPopoverOpen}
        anchorEl={anchorEl}
        onClose={closeFilterPopover}
        hideBackdrop
      >
        <FormGroup sx={{ gap: 1 }}>
          {filterCheckboxes.map((filter) => (
            <FormControlLabel
              key={filter.key}
              control={
                <Checkbox
                  sx={{ p: 0, width: 32, height: 32 }}
                  checked={filter.checked}
                  onChange={(e) => filter.onChange(e.target.checked)}
                />
              }
              label={
                <Text variant="bodyMedium" color="background.contrasrtText">
                  {" "}
                  {filter.label}
                </Text>
              }
            />
          ))}
        </FormGroup>
      </GenericPopover>

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
}
