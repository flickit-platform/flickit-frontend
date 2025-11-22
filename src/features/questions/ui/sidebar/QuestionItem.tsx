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
import languageDetector from "@/utils/language-detector";

interface QuestionItemProps {
  title: string;
  issues: QuestionIssue;
  idx: number;
  active: boolean;
  open: boolean;
  showChips: boolean;
  onSelect: (idx: number) => void;
}

export const QuestionItem = memo(
  ({
    title,
    issues,
    idx,
    active,
    open,
    showChips,
    onSelect,
  }: QuestionItemProps) => {
    const uiLang = i18next.language;
    const isUILangRTL = uiLang === "fa";
    const isTitleRTL = languageDetector(title);

    const paddingSide: "paddingInlineStart" | "paddingInlineEnd" =
      (isTitleRTL && isUILangRTL) || (!isTitleRTL && uiLang === "en")
        ? "paddingInlineStart"
        : "paddingInlineEnd";

    const badge = (
      <QuestionBadge
        index={idx}
        isActive={active}
        isUnanswered={issues?.isUnanswered}
        isOpen={open}
      />
    );

    const listItem = (
      <ListItemButton
        selected={open && active}
        onClick={() => onSelect(idx)}
        sx={{
          alignItems: "stretch",
          justifyContent: open ? "initial" : "center",
        }}
      >
        <ListItemIcon
          sx={{
            minWidth: open ? 32 : 0,
            alignSelf: "stretch",
            display: "flex",
          }}
        >
          {badge}
        </ListItemIcon>

        {open && (
          <ListItemText
            disableTypography
            sx={{
              mb: 0,
              textAlign:isTitleRTL ? "right":"left",
              direction: isTitleRTL ? "rtl" : "ltr",
              [paddingSide]: 1.5,
            }}
            primary={
              <Text variant="bodyMedium" textAlign="justify">
                {title}
              </Text>
            }
            secondary={<QuestionChips issues={issues} show={showChips} />}
          />
        )}
      </ListItemButton>
    );

    if (open) return listItem;

    return (
      <Tooltip
        title={<Text variant="labelSmall">{title}</Text>}
        placement={isUILangRTL ? "left" : "right"}
      >
        <span>{listItem}</span>
      </Tooltip>
    );
  },
);
