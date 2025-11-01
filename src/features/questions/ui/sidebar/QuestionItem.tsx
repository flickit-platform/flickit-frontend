import { memo } from "react";
import {
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
} from "@mui/material";
import i18next from "i18next";
import { Text } from "@/components/common/Text";
import { QuestionBadge } from "./QuestionBadge";
import { QuestionChips } from "./QuestionChips";
import type { QuestionIssue } from "../../types";

interface QuestionItemProps {
  title: string;
  issues: QuestionIssue;
  idx: number;
  active: boolean;
  open: boolean;
  showChips: boolean;
  onSelect: (idx: number) => void;
}

export const QuestionItem = memo(({
  title,
  issues,
  idx,
  active,
  open,
  showChips,
  onSelect,
}: QuestionItemProps) => {
  const rtl = i18next.language === "fa";

  const badge = (
    <QuestionBadge
      index={idx}
      isActive={active}
      isUnanswered={issues?.isUnanswered}
      isOpen={open}
    />
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
            <QuestionChips issues={issues} show={showChips} />
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