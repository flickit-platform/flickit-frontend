import { useMemo } from "react";
import { Box } from "@mui/material";
import {
  CalendarMonthOutlined,
  DesignServicesOutlined,
  EmojiObjectsOutlined,
  ArrowForward,
} from "@mui/icons-material";
import { t } from "i18next";
import { IGraphicalReport } from "@/types";
import { getReadableDate } from "@/utils/readableDate";
import { ChipItem } from "@/components/common/fields/ChipsRow";
import { blue } from "@/config/colors";

export const useReportChips = (
  graphicalReport: IGraphicalReport,
  lng: string,
  rtl: boolean,
) => {
  const infoItems: ChipItem[] = useMemo(
    () => [
      {
        key: "kit",
        label: (
          <Box
            display="inline-flex"
            alignItems="center"
            gap={0.25}
            fontSize="10px"
          >
            <DesignServicesOutlined fontSize="inherit" color="primary" />
            {t("assessmentReport.kitWithTitle", {
              lng,
              title: graphicalReport?.assessment.assessmentKit.title,
            })}
          </Box>
        ),
      },
      {
        key: "qna",
        label: (
          <Box
            display="inline-flex"
            alignItems="center"
            gap={0.25}
            fontSize="10px"
          >
            <EmojiObjectsOutlined fontSize="inherit" color="primary" />
            {t("assessmentReport.questionsAndAnswer", {
              lng,
              count: graphicalReport?.assessment.assessmentKit.questionsCount,
            })}
          </Box>
        ),
      },
      {
        key: "date",
        label: (
          <Box
            display="inline-flex"
            alignItems="center"
            gap={0.25}
            fontSize="10px"
          >
            <CalendarMonthOutlined fontSize="inherit" color="primary" />
            {getReadableDate(graphicalReport?.assessment?.creationTime)}
          </Box>
        ),
      },
    ],
    [graphicalReport, lng],
  );

  const gotoItems: ChipItem[] = useMemo(
    () => [
      {
        key: "how-calculated",
        label: (
          <Box display="inline-flex" alignItems="center" gap={0.5}>
            {t("assessmentReport.howWasThisScoreCalculated", { lng })}
            <ArrowForward
              fontSize="small"
              color="primary"
              sx={{ transform: `scaleX(${rtl ? -1 : 1})` }}
            />
          </Box>
        ),
        color: blue[95],
      },
      {
        key: "how-to-improve",
        label: (
          <Box display="inline-flex" alignItems="center" gap={0.5}>
            {t("assessmentReport.howCanTheCurrentSituationBeImproved", { lng })}
            <ArrowForward
              fontSize="small"
              color="primary"
              sx={{ transform: `scaleX(${rtl ? -1 : 1})` }}
            />
          </Box>
        ),
        color: blue[95],
      },
    ],
    [lng, rtl],
  );

  return { infoItems, gotoItems };
};
