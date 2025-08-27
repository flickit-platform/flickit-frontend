import React from "react";
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

const clamp01 = (n: number) => Math.max(0, Math.min(100, n || 0));

type Measure = {
  id: number;
  title: string;
  impactPercentage: number;
  gainedScorePercentage: number;
  missedScorePercentage: number;
};

const MeasuresTable: React.FC<{
  measures: Measure[];
  rtl?: boolean;
  lng: string;
}> = ({ measures, rtl, lng }) => {
  if (!measures || measures.length === 0) return null;

  const PCT = rtl ? "٪" : "%";
  const minus = "−";
  const plus = "+";
  const pct = (n: number) => `${Math.round(n)}${PCT}`;
  const fmtSigned = (n: number, positive: boolean) => {
    const v = Math.round(n);
    return rtl
      ? `${v}${PCT}${positive ? plus : minus}`
      : `${positive ? plus : minus}${v}${PCT}`;
  };

  const totals = measures.reduce(
    (acc, m) => {
      acc.impact += m.impactPercentage || 0;
      acc.gained += m.gainedScorePercentage || 0;
      acc.missed += m.missedScorePercentage || 0;
      return acc;
    },
    { impact: 0, gained: 0, missed: 0 },
  );

  return (
    <Box sx={{ maxWidth: 700, width: "100%", mx: "auto" }}>
      <TableContainer
        component={Paper}
        elevation={0}
        sx={{
          bgcolor: "transparent",
          borderRadius: 2,
          mt: 2,
          direction: rtl ? "rtl" : "ltr",
        }}
      >
        <Table size="small" aria-label="measures table">
          <TableHead>
            <TableRow sx={{ bgcolor: "background.containerHigher" }}>
              <TableCell
                sx={{ textAlign: rtl ? "right" : "left", whiteSpace: "nowrap" }}
              >
                <Typography
                  variant="labelMedium"
                  color="text.primary"
                  sx={rtlSx(rtl)}
                >
                  {t("assessmentReport.measureTitle", { lng })}
                </Typography>
              </TableCell>
              <TableCell align="center">
                <Typography
                  variant="labelMedium"
                  color="text.primary"
                  sx={rtlSx(rtl)}
                >
                  {t("assessmentReport.contributionToAttribute", { lng })}
                </Typography>
              </TableCell>
              <TableCell align="center">
                <Typography
                  variant="labelMedium"
                  color="primary"
                  sx={rtlSx(rtl)}
                >
                  {t("assessmentReport.gainedScore", { lng })}
                </Typography>
              </TableCell>
              <TableCell />
              <TableCell align="center">
                <Typography
                  variant="labelMedium"
                  color="error.light"
                  sx={rtlSx(rtl)}
                >
                  {t("assessmentReport.missedScore", { lng })}
                </Typography>
              </TableCell>
              <TableCell align="center" sx={{ display: "none" }}>
                <Typography
                  variant="labelMedium"
                  color="text.primary"
                  sx={rtlSx(rtl)}
                >
                  {t("common.questions", { lng })}
                </Typography>
              </TableCell>
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
              "& td:first-of-type": { textAlign: rtl ? "right" : "left" },
            }}
          >
            {measures.map((m) => {
              const gained = clamp01(m.gainedScorePercentage);
              const missed = clamp01(m.missedScorePercentage);
              return (
                <TableRow key={m.id}>
                  <TableCell>
                    <Typography
                      variant="bodySmall"
                      sx={rtlSx(languageDetector(m.title))}
                      noWrap
                      title={m.title}
                    >
                      {m.title}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Typography variant="bodySmall" sx={rtlSx(rtl)}>
                      {pct(m.impactPercentage)}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Typography
                      variant="bodySmall"
                      color="primary.main"
                      sx={rtlSx(rtl)}
                    >
                      {fmtSigned(gained, true)}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Box
                      position="relative"
                      height={24}
                      sx={{ transform: lng === "en" ? "scaleX(-1)" : "none" }}
                    >
                      <Box
                        position="absolute"
                        left="50%"
                        top={0}
                        bottom={0}
                        sx={{
                          borderLeft: "1px dashed",
                          borderColor: "divider",
                        }}
                      />
                      {missed > 0 && (
                        <Box
                          position="absolute"
                          left={`calc(50% - ${missed > 68 ? 68 : missed}px)`}
                          width={`${missed}px`}
                          maxWidth="68px"
                          top={6}
                          bottom={6}
                          sx={{
                            bgcolor: "error.light",
                            borderRadius: "4px 0 0 4px",
                          }}
                        />
                      )}
                      {gained > 0 && (
                        <Box
                          position="absolute"
                          left="50%"
                          width={`${gained}px`}
                          maxWidth="68px"

                          top={6}
                          bottom={6}
                          sx={{
                            bgcolor: "primary.main",
                            borderRadius: "0 4px 4px 0",
                          }}
                        />
                      )}
                    </Box>
                  </TableCell>

                  <TableCell>
                    <Typography
                      variant="bodySmall"
                      color="error.light"
                      sx={rtlSx(rtl)}
                    >
                      {fmtSigned(missed, false)}
                    </Typography>
                  </TableCell>

                  <TableCell sx={{ display: "none" }}>
                    <IconButton size="small">
                      <StickyNote2Outlined fontSize="small" color="primary" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>

          <TableFooter>
            <TableRow sx={{ bgcolor: "background.containerHigher" }}>
              <TableCell
                sx={{ textAlign: rtl ? "right" : "left", borderBottom: "none" }}
              >
                <Typography
                  variant="labelMedium"
                  color="text.primary"
                  sx={rtlSx(rtl)}
                >
                  {t("assessmentReport.total", { lng })}
                </Typography>
              </TableCell>
              <TableCell sx={{ textAlign: "center", borderBottom: "none" }}>
                <Typography
                  variant="labelMedium"
                  color="text.primary"
                  sx={rtlSx(rtl)}
                >
                  {pct(totals.impact)}
                </Typography>
              </TableCell>
              <TableCell sx={{ textAlign: "center", borderBottom: "none" }}>
                <Typography
                  variant="labelMedium"
                  color="primary.main"
                  sx={rtlSx(rtl)}
                >
                  {fmtSigned(totals.gained, true)}
                </Typography>
              </TableCell>
              <TableCell sx={{ borderBottom: "none" }} />
              <TableCell sx={{ textAlign: "center", borderBottom: "none" }}>
                <Typography
                  variant="labelMedium"
                  color="error.light"
                  sx={rtlSx(rtl)}
                >
                  {fmtSigned(totals.missed, false)}
                </Typography>
              </TableCell>
              <TableCell sx={{ borderBottom: "none" }} />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default MeasuresTable;
