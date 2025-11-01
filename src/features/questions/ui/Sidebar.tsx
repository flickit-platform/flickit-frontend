import { useState, useMemo, useEffect, useCallback, memo } from "react";
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
} from "@mui/material";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { questionActions, useQuestionDispatch } from "../context";
import { Text } from "@/components/common/Text";
import { styles } from "@styles";
import { IQuestionInfo } from "@/types";
import i18next from "i18next";
import { useAssessmentContext } from "@/providers/assessment-provider";
import { ASSESSMENT_MODE } from "@/utils/enum-type";

type Props = {
  questions: IQuestionInfo[];
  selectedIndex?: number;
  onSelect?: (index: number) => void;
  showTooltipsWhenCollapsed?: boolean;
};

type ChipType = "error" | "tertiary";
type IssueLike = NonNullable<IQuestionInfo["issues"]>;

type ChipDef = {
  key: string;
  labelKey: string;
  type: ChipType;
  show: (issue: IssueLike) => boolean;
};

type ItemProps = {
  data: Partial<IQuestionInfo>;
  idx: number;
  active: boolean;
  open: boolean;
  showTooltipsWhenCollapsed: boolean;
  showChips: boolean;
  onSelect: (idx: number) => void;
};

const buildQuestionUrl = (ctx: {
  spaceId?: string;
  page?: string;
  assessmentId?: string;
  questionnaireId?: string;
  index: number;
}) =>
  `/${ctx.spaceId}/assessments/${ctx.page}/${ctx.assessmentId}/questionnaires_temp/${ctx.questionnaireId}/${ctx.index + 1}`;

const CHIP_DEFS: ChipDef[] = [
  {
    key: "lowconf",
    labelKey: "questions_temp.lowConfidence",
    type: "error",
    show: (i) => !!i.isAnsweredWithLowConfidence,
  },
  {
    key: "noevidence",
    labelKey: "questions_temp.noEvidence",
    type: "error",
    show: (i) => !!i.isAnsweredWithoutEvidences,
  },
  {
    key: "unresolved",
    labelKey: "dashboard.unresolvedComments",
    type: "error",
    show: (i) => (i.unresolvedCommentsCount ?? 0) > 0,
  },
  {
    key: "unapproved",
    labelKey: "dashboard.unapprovedAnswer",
    type: "tertiary",
    show: (i) => !!i.hasUnapprovedAnswer,
  },
];

const useIssueChips = (issues: IQuestionInfo["issues"], t: any) =>
  useMemo(() => {
    const isx = (issues ?? {}) as IssueLike;
    return CHIP_DEFS.filter((d) => d.show(isx)).map((d) => ({
      key: d.key,
      label: t(d.labelKey),
      type: d.type as ChipType,
    }));
  }, [issues]);

type HeaderProps = {
  title: string;
  open: boolean;
  onToggleOpen: () => void;
  showChips: boolean;
  onToggleChips: () => void;
  progress: number;
};

const SidebarHeader = memo(function SidebarHeader({
  title,
  open,
  onToggleOpen,
  showChips,
  onToggleChips,
  progress,
}: HeaderProps) {
  const { t } = useTranslation();
  const rtl = i18next.language == "fa";
  const { assessmentInfo } = useAssessmentContext();
  const isAdvanceMode = useMemo(() => {
    return ASSESSMENT_MODE.ADVANCED === assessmentInfo?.mode?.code;
  }, [assessmentInfo?.mode?.code]);

  return (
    <Box
      sx={{
        ...styles.centerVH,
        gap: 1.5,
        px: 3,
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
          {Boolean(isAdvanceMode) && (
            <Box>
              <Tooltip
                title={
                  showChips
                    ? t("questions_temp.hideIssues")
                    : t("questions_temp.displayIssues")
                }
              >
                <IconButton
                  size="small"
                  color="info"
                  onClick={onToggleChips}
                  aria-label={showChips ? t("common.hide") : t("common.show")}
                >
                  {showChips ? (
                    <VisibilityOffOutlinedIcon />
                  ) : (
                    <VisibilityOutlinedIcon />
                  )}
                </IconButton>
              </Tooltip>
              <IconButton size="small" color="info">
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
  data,
  idx,
  active,
  open,
  showTooltipsWhenCollapsed,
  showChips,
  onSelect,
}: ItemProps) {
  const { t } = useTranslation();
  const chips = useIssueChips(data.issues, t);
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
      {data.issues?.isUnanswered && (
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
          sx={{ paddingInlineStart: 1.5 }}
          primary={
            <Text variant="bodyMedium" textAlign="justify">
              {data.title}
            </Text>
          }
          secondary={
            showChips && chips.length ? (
              <Box sx={{ mt: 1, display: "flex", gap: 1, flexWrap: "wrap" }}>
                {chips.map((chip) => (
                  <Chip
                    key={chip.key}
                    size="small"
                    label={chip.label}
                    variant="filled"
                    sx={(theme) => {
                      const col = theme.palette[chip.type];
                      return {
                        borderRadius: 1,
                        bgcolor: col.bg,
                        color: col.main,
                        "& .MuiChip-label": { p: 0.5, lineHeight: 1.4 },
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

  if (open || !showTooltipsWhenCollapsed) return body;

  return (
    <Tooltip
      title={<Text variant="labelSmall">{data.title}</Text>}
      placement={rtl ? "left" : "right"}
    >
      <span>{body}</span>
    </Tooltip>
  );
});

export default function QuestionsSidebarInline({
  questions,
  selectedIndex,
  onSelect,
  showTooltipsWhenCollapsed = true,
}: Readonly<Props>) {
  const { t } = useTranslation();
  const dispatch = useQuestionDispatch();

  const [open, setOpen] = useState(true);
  const [showChips, setShowChips] = useState(false);
  const width = open ? "33%" : 72;

  const navigate = useNavigate();
  const { questionIndex, questionnaireId, assessmentId, page, spaceId } =
    useParams();

  useEffect(() => {
    dispatch(
      questionActions.setSelectedQuestion(
        questions[Number(questionIndex || 1) - 1],
      ),
    );
  }, [questionIndex, dispatch, questions]);

  const selectedFromUrl = useMemo(() => {
    const idx1 = Number(questionIndex) || 1;
    const zero = Math.max(1, idx1) - 1;
    return Math.min(zero, Math.max(questions.length - 1, 0));
  }, [questionIndex, questions.length]);

  const effectiveSelectedIndex =
    typeof selectedIndex === "number" ? selectedIndex : selectedFromUrl;

  const handleSelect = useCallback(
    (idx: number) => {
      if (idx === effectiveSelectedIndex) return;
      navigate(
        buildQuestionUrl({
          spaceId,
          page,
          assessmentId,
          questionnaireId,
          index: idx,
        }),
      );
      onSelect?.(idx);
    },
    [effectiveSelectedIndex, spaceId, page, assessmentId, questionnaireId],
  );

  const progress = useMemo(() => {
    const answeredLength = questions.filter((question) => {
      return (
        question.answer !== null && question.answer?.selectedOption !== null
      );
    }).length;
    return Math.ceil((answeredLength / questions.length) * 100);
  }, [questions]);
  return (
    <Paper
      elevation={0}
      sx={{
        ...styles.shadowStyle,
        width,
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
        open={open}
        onToggleOpen={() => setOpen((p) => !p)}
        showChips={showChips}
        onToggleChips={() => setShowChips((s) => !s)}
        progress={progress}
      />

      <List
        disablePadding
        sx={[
          {
            py: open ? 1 : 0.5,
            flex: 1,
            overflowY: "auto",
            scrollbarGutter: "stable",
            "& .MuiListItemButton-root": { borderRadius: 2, mx: 1, my: 0.5 },
          },
          !open && { "& .MuiListItemButton-root": { mx: 0.5, my: 0.25 } },
        ]}
      >
        {questions?.map((question, idx) => (
          <Box key={question.id ?? idx}>
            <QuestionItem
              data={{ title: question.title, issues: question.issues }}
              idx={idx}
              active={idx === effectiveSelectedIndex}
              open={open}
              showTooltipsWhenCollapsed={showTooltipsWhenCollapsed}
              showChips={showChips}
              onSelect={handleSelect}
            />
          </Box>
        ))}
      </List>
    </Paper>
  );
}
