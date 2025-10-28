import {
  Box,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
  useMediaQuery,
  Paper,
} from "@mui/material";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import { useState, useMemo, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { questionActions, useQuestionDispatch } from "../context";
import { Text } from "@/components/common/Text";

type Question = { id?: string | number; title?: string };

type Props = {
  questions: Question[];
  selectedIndex?: number;
  onSelect?: (index: number) => void;
  initialOpen?: boolean;
  widthExpanded?: number;
  widthCollapsed?: number;
  rtl?: boolean;
  itemMinHeight?: number;
  showTooltipsWhenCollapsed?: boolean;
  basePath?: string;
};

export default function QuestionsSidebarInline({
  questions,
  selectedIndex,
  onSelect,
  initialOpen = true,
  widthExpanded = 280,
  widthCollapsed = 72,
  rtl = true,
  itemMinHeight = 64,
  showTooltipsWhenCollapsed = true,
}: Readonly<Props>) {
  const dispatch = useQuestionDispatch();
  const [open, setOpen] = useState(initialOpen);
  const isSmall = useMediaQuery("(max-width: 900px)");
  const width = open ? widthExpanded : widthCollapsed;
  const { t } = useTranslation();

  const navigate = useNavigate();
  const { questionIndex } = useParams();

  useEffect(() => {
    dispatch(
      questionActions.setSelectedQuestion(questions[Number(questionIndex) - 1]),
    );
  }, [questionIndex]);
  const selectedFromUrl = useMemo(() => {
    const idx1 = Number(questionIndex) || 1;
    const zero = Math.max(1, idx1) - 1;
    return Math.min(zero, Math.max(questions.length - 1, 0));
  }, [questionIndex, questions.length]);

  const effectiveSelectedIndex =
    typeof selectedIndex === "number" ? selectedIndex : selectedFromUrl;

  const handleSelect = (idx: number) => {
    const parts = location.pathname.split("/").filter(Boolean);
    const next = String(idx + 1);

    if (parts.length && /^\d+$/.test(parts[parts.length - 1])) {
      parts[parts.length - 1] = next;
    } else {
      parts.push(next);
    }

    navigate("/" + parts.join("/"));

    onSelect?.(idx);
  };

  return (
    <Paper
      elevation={0}
      sx={{
        width,
        overflow: "hidden",
        border: 0,
        borderInlineStart: "1px solid",
        borderColor: "divider",
        transition: (t) =>
          t.transitions.create("width", {
            duration: t.transitions.duration.short,
          }),
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          px: 1.5,
          py: 1,
          borderBottom: "1px solid",
          borderColor: "divider",
          justifyContent: open ? "space-between" : "center",
        }}
      >
        {open ? (
          <>
            <Text variant="subtitle2" fontWeight={700}>
              {t("common.questions")}
            </Text>
            <IconButton onClick={() => setOpen(false)} size="small">
              {rtl ? <ChevronRightRoundedIcon /> : <ChevronLeftRoundedIcon />}
            </IconButton>
          </>
        ) : (
          <IconButton onClick={() => setOpen(true)} size="small">
            <MenuRoundedIcon />
          </IconButton>
        )}
      </Box>

      <List
        disablePadding
        sx={[
          {
            py: open ? 1 : 0.5,
            flex: 1,
            overflowY: "auto",
            "& .MuiListItemButton-root": { borderRadius: 2, mx: 1, my: 0.5 },
          },
          !open && {
            "& .MuiListItemButton-root": { mx: 0.5, my: 0.25 },
          },
        ]}
      >
        {questions?.map((q, idx) => {
          const active = idx === effectiveSelectedIndex;

          const badge = (
            <Box
              sx={{
                width: 32,
                height: open ? "100%" : 44,
                borderRadius: 1,
                display: "grid",
                placeItems: "center",
                fontSize: 12.5,
                fontWeight: 700,
                border: "1px solid",
                borderColor: active ? "primary.main" : "divider",
                bgcolor: active ? "primary.main" : "transparent",
                color: active ? "primary.contrastText" : "text.primary",
              }}
            >
              {idx + 1}
            </Box>
          );

          const content = (
            <ListItemButton
              key={q.id ?? idx}
              selected={open && active}
              onClick={() => handleSelect(idx)}
              sx={{
                ...(open
                  ? { px: 1.25, minHeight: itemMinHeight }
                  : {
                      px: 0.5,
                      minHeight: Math.min(itemMinHeight, 44),
                      justifyContent: "center",
                    }),
                alignItems: "stretch",
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: open ? 36 : 0,
                  pr: 0,
                  alignSelf: "stretch",
                  display: "flex",
                }}
              >
                {badge}
              </ListItemIcon>

              {open && (
                <ListItemText
                  primary={<Text variant="body2" textAlign="justify">{q.title}</Text>}
                />
              )}
            </ListItemButton>
          );

          if (open || !showTooltipsWhenCollapsed) return content;

          return (
            <Tooltip
              key={q.id ?? idx}
              title={q.title || `سؤال ${idx + 1}`}
              placement={rtl ? "left" : "right"}
            >
              <span>{content}</span>
            </Tooltip>
          );
        })}
      </List>

      {isSmall && !open && (
        <Box sx={{ p: 1, display: "flex", justifyContent: "center" }}>
          <IconButton onClick={() => setOpen(true)} size="small">
            <MenuRoundedIcon />
          </IconButton>
        </Box>
      )}
    </Paper>
  );
}
