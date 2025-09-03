import React, { useCallback, useMemo } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableFooter,
  Paper,
  IconButton,
} from "@mui/material";
import { t } from "i18next";
import { StickyNote2Outlined } from "@mui/icons-material";
import { rtlSx } from "./TreeMapSection";
import languageDetector from "@/utils/languageDetector";
import useDialog from "@utils/useDialog";
import QuestionReportDialog from "@/features/assessment-report/ui/sections/questionReportDialog";

type Measure = {
  id: number;
  title: string;
  impactPercentage: number;
  gainedScorePercentage: number;
  missedScorePercentage: number;
};

type Props = {
  measures: Measure[];
  selectedId?: number | null;
  isRTL?: boolean;
  locale: string;
  showQuestionColumn?: boolean;
};

const BAR_SEGMENT_MAX_WIDTH_PX = 68;

const clampPercentage = (n: number | undefined | null) => {
  const v = Number.isFinite(n as number) ? Number(n) : 0;
  return Math.max(0, Math.min(100, v));
};

const PERSIAN_PERCENT = "٪";
const LATIN_PERCENT = "%";
const getPercentSymbol = (isRTL?: boolean) =>
  isRTL ? PERSIAN_PERCENT : LATIN_PERCENT;
const formatRoundedPercent = (n: number, isRTL?: boolean) =>
  `${Math.round(n)}${getPercentSymbol(isRTL)}`;

const SignedPercent: React.FC<{
  value: number;
  positive?: boolean;
  isRTL?: boolean;
  color?: string;
}> = ({ value, positive = false, isRTL, color }) => {
  const rounded = Math.round(value);
  const minus = "−";
  const plus = "+";
  const sign = positive ? plus : minus;
  const pct = getPercentSymbol(isRTL);

  return (
    <Typography variant="bodySmall" sx={rtlSx(isRTL)} color={color}>
      {isRTL
        ? `${rounded}${pct}${rounded !== 0 ? sign : ""}`
        : `${rounded !== 0 ? sign : ""}${rounded}${pct}`}
    </Typography>
  );
};

const DivergingCenterBar: React.FC<{
  gainedPct: number;
  missedPct: number;
  invertForEnglish?: boolean;
}> = ({ gainedPct, missedPct, invertForEnglish }) => {
  const gainedW = Math.min(BAR_SEGMENT_MAX_WIDTH_PX, Math.max(0, gainedPct));
  const missedW = Math.min(BAR_SEGMENT_MAX_WIDTH_PX, Math.max(0, missedPct));

  return (
    <Box
      position="relative"
      height={24}
      sx={{ transform: invertForEnglish ? "scaleX(-1)" : "none" }}
    >
      <Box
        position="absolute"
        left="50%"
        top={0}
        bottom={0}
        sx={{ borderLeft: "1px dashed", borderColor: "divider" }}
      />
      {missedW > 0 && (
        <Box
          position="absolute"
          left={`calc(50% - ${missedW}px)`}
          width={`${missedW}px`}
          top={6}
          bottom={6}
          sx={{ bgcolor: "error.light", borderRadius: "4px 0 0 4px" }}
        />
      )}
      {gainedW > 0 && (
        <Box
          position="absolute"
          left="50%"
          width={`${gainedW}px`}
          top={6}
          bottom={6}
          sx={{ bgcolor: "primary.main", borderRadius: "0 4px 4px 0" }}
        />
      )}
    </Box>
  );
};

/* ---------- Column definition ---------- */
type Column = {
  id: string;
  align: "left" | "center" | "right";
  header: React.ReactNode;
  body: (m: Measure) => React.ReactNode;
  footer?: React.ReactNode;
};

const MeasuresTable: React.FC<Props> = ({
  measures,
  isRTL,
  locale,
  selectedId,
  showQuestionColumn,
}) => {
  const questionDialog = useDialog();
  if (!measures || measures.length === 0) return null;

  const totals = useMemo(
    () =>
      measures.reduce(
        (acc, m) => {
          acc.impactPct += m.impactPercentage || 0;
          acc.gainedPct += m.gainedScorePercentage || 0;
          acc.missedPct += m.missedScorePercentage || 0;
          return acc;
        },
        { impactPct: 0, gainedPct: 0, missedPct: 0 },
      ),
    [measures],
  );

  const openMeasureQuestionsDialog = useCallback(
    (measureId: number) =>
      questionDialog.openDialog({
        type: "create",
        data: { measureId, attributeId: selectedId ?? null },
      }),
    [questionDialog, selectedId],
  );

  const tableColumns: Column[] = useMemo(() => {
    const cols: Column[] = [
      {
        id: "measureTitle",
        align: isRTL ? "right" : "left",
        header: (
          <Typography
            variant="labelMedium"
            color="text.primary"
            sx={rtlSx(isRTL)}
          >
            {t("assessmentReport.measureTitle", { lng: locale })}
          </Typography>
        ),
        body: (m) => (
          <Typography
            variant="bodySmall"
            sx={rtlSx(languageDetector(m.title))}
            noWrap
            title={m.title}
          >
            {m.title}
          </Typography>
        ),
        footer: (
          <Typography
            variant="labelMedium"
            color="text.primary"
            sx={rtlSx(isRTL)}
          >
            {t("assessmentReport.total", { lng: locale })}
          </Typography>
        ),
      },
      {
        id: "contributionToAttribute",
        align: "center",
        header: (
          <Typography
            variant="labelMedium"
            color="text.primary"
            sx={rtlSx(isRTL)}
          >
            {t("assessmentReport.contributionToAttribute", { lng: locale })}
          </Typography>
        ),
        body: (m) => (
          <Typography variant="bodySmall" sx={rtlSx(isRTL)}>
            {formatRoundedPercent(m.impactPercentage, isRTL)}
          </Typography>
        ),
        footer: (
          <Typography
            variant="labelMedium"
            color="text.primary"
            sx={rtlSx(isRTL)}
          >
            {formatRoundedPercent(totals.impactPct, isRTL)}
          </Typography>
        ),
      },
      {
        id: "gainedPercent",
        align: "center",
        header: (
          <Typography variant="labelMedium" color="primary" sx={rtlSx(isRTL)}>
            {t("assessmentReport.gainedScore", { lng: locale })}
          </Typography>
        ),
        body: (m) => (
          <SignedPercent
            value={clampPercentage(m.gainedScorePercentage)}
            positive
            isRTL={isRTL}
            color="primary.main"
          />
        ),
        footer: (
          <SignedPercent
            value={totals.gainedPct}
            positive
            isRTL={isRTL}
            color="primary.main"
          />
        ),
      },
      {
        id: "divergingBar",
        align: "center",
        header: <></>,
        body: (m) => (
          <DivergingCenterBar
            gainedPct={clampPercentage(m.gainedScorePercentage)}
            missedPct={clampPercentage(m.missedScorePercentage)}
            invertForEnglish={locale === "en"}
          />
        ),
      },
      {
        id: "missedPercent",
        align: "center",
        header: (
          <Typography
            variant="labelMedium"
            color="error.light"
            sx={rtlSx(isRTL)}
          >
            {t("assessmentReport.missedScore", { lng: locale })}
          </Typography>
        ),
        body: (m) => (
          <SignedPercent
            value={clampPercentage(m.missedScorePercentage)}
            positive={false}
            isRTL={isRTL}
            color="error.light"
          />
        ),
        footer: (
          <SignedPercent
            value={totals.missedPct}
            positive={false}
            isRTL={isRTL}
            color="error.light"
          />
        ),
      },
    ];

    if (showQuestionColumn) {
      cols.push({
        id: "questions",
        align: "center",
        header: (
          <Typography
            variant="labelMedium"
            color="text.primary"
            sx={rtlSx(isRTL)}
          >
            {t("common.questions", { lng: locale })}
          </Typography>
        ),
        body: (m) => (
          <IconButton
            size="small"
            onClick={() => openMeasureQuestionsDialog(m.id)}
          >
            <StickyNote2Outlined fontSize="small" color="primary" />
          </IconButton>
        ),
      });
    }

    return cols;
  }, [
    isRTL,
    locale,
    totals.gainedPct,
    totals.missedPct,
    totals.impactPct,
    showQuestionColumn,
    openMeasureQuestionsDialog,
  ]);

  return (
    <Box sx={{ maxWidth: 700, width: "100%", mx: "auto" }}>
      <TableContainer
        component={Paper}
        elevation={0}
        sx={{
          bgcolor: "transparent",
          borderRadius: 2,
          mt: 2,
          direction: isRTL ? "rtl" : "ltr",
        }}
      >
        <Table size="small" aria-label="measures table">
          <TableHead>
            <TableRow sx={{ bgcolor: "background.containerHigher" }}>
              {tableColumns.map((col) => (
                <TableCell key={col.id} sx={{ textAlign: col.align }}>
                  {col.header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody
            sx={{
              "& td": {
                textAlign: "center",
                verticalAlign: "middle",
                borderBottom: "none",
              },
              "& td > *": { mx: "auto" },
              "& td:first-of-type": { textAlign: isRTL ? "right" : "left" },
            }}
          >
            {measures.map((m) => (
              <TableRow key={m.id}>
                {tableColumns.map((col) => (
                  <TableCell key={col.id} align={col.align}>
                    {col.body(m)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>

          <TableFooter>
            <TableRow
              sx={{
                bgcolor: "background.containerHigher",
                "& td": {
                  textAlign: "center",
                  verticalAlign: "middle",
                },
                "& td > *": { mx: "auto" },
                "& td:first-of-type": { textAlign: isRTL ? "right" : "left" },
              }}
            >
              {tableColumns.map((col) => (
                <TableCell
                  key={col.id}
                  align={col.align}
                  sx={{ borderBottom: "none" }}
                >
                  {col.footer ?? null}
                </TableCell>
              ))}
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>

      {questionDialog.open && (
        <QuestionReportDialog {...questionDialog} lng={locale} />
      )}
    </Box>
  );
};

export default MeasuresTable;
