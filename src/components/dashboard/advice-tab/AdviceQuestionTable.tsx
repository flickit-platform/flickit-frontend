import { useMemo, memo } from "react";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
} from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import Chip from "@mui/material/Chip";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { Trans } from "react-i18next";

import languageDetector from "@/utils/language-detector";
import { farsiFontFamily, primaryFontFamily } from "@config/theme";

// Constants
const HEADER_BORDER_COLOR = "#66809950";
const ROW_BORDER_COLOR = "#66809920";
const ATTRIBUTE_COLORS = ["#D81E5B", "#F9A03F", "#0A2342"];
const ATTRIBUTE_BACKGROUNDS = ["#FDF1F5", "#FEF5EB", "#EDF4FC"];

const getFontFamily = (text?: string) =>
  languageDetector(text) ? farsiFontFamily : primaryFontFamily;

// Types
interface Questionnaire {
  title?: string;
}

interface Question {
  title?: string;
  index?: number;
}

interface Option {
  index?: number;
  title?: string;
}

interface Attribute {
  id?: string | number;
  title?: string;
}

export interface AdviceRow {
  id?: string | number;
  questionnaire?: Questionnaire;
  question?: Question;
  answeredOption?: Option;
  recommendedOption?: Option;
  attributes?: Attribute[];
}

interface AdviceQuestionTableProps {
  adviceResult: AdviceRow[];
}

// Column width configuration
const COLUMN_WIDTHS = {
  EXTRA_SMALL: {
    total: 11.5,
    index: 0.3,
    question: 5,
    currentState: 2,
    recommendedState: 2,
    attributes: 2.2,
  },
  MEDIUM: {
    total: 12,
    index: 0.3,
    questionnaire: 2,
    question: 3.5,
    currentState: 2,
    recommendedState: 2.2,
    attributes: 2.2,
  },
} as const;

const calculateWidthPercentage = (width: number, total: number) =>
  `${(width / total) * 100}%`;

// Component
const AdviceQuestionTable = ({
  adviceResult = [],
}: AdviceQuestionTableProps) => {
  const theme = useTheme();
  const isMediumScreen = useMediaQuery(theme.breakpoints.up("md"));

  const renderIndexCell = (
    _row: AdviceRow,
    _index: number,
    absoluteIndex: number,
  ) => (
    <Typography variant="semiBoldMedium" textAlign="center">
      {absoluteIndex}
    </Typography>
  );

  const renderQuestionnaireCell = (row: AdviceRow) => (
    <Box>
      <Typography
        variant="semiBoldMedium"
        sx={{
          fontFamily: getFontFamily(row.questionnaire?.title),
          textDecoration: "underline",
        }}
      >
        {row.questionnaire?.title}
      </Typography>
      <Typography
        component="div"
        variant="semiBoldMedium"
        sx={{ textDecoration: "underline" }}
      >
        Q.{row.question?.index}
      </Typography>
    </Box>
  );

  const renderQuestionCell = (row: AdviceRow) => (
    <Tooltip
      title={
        (row.question?.title?.length ?? 0) > 100 ? row.question?.title : ""
      }
    >
      <Typography
        variant="semiBoldMedium"
        sx={{
          fontFamily: getFontFamily(row.question?.title),
          display: "-webkit-box",
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
          textOverflow: "ellipsis",
          WebkitLineClamp: isMediumScreen ? 3 : 2,
        }}
      >
        {row.question?.title}
      </Typography>
    </Tooltip>
  );

  const renderOptionCell = (
    option?: Option,
    textAlign: "left" | "center" | "right" = "left",
  ) => (
    <Typography
      variant="bodyMedium"
      textAlign={textAlign}
      sx={{ fontFamily: getFontFamily(option?.title) }}
    >
      {option && `${option.index}. ${option.title}`}
    </Typography>
  );

  const renderAttributesCell = (row: AdviceRow) => (
    <Box
      sx={{
        display: "flex",
        gap: 0.5,
        flexWrap: "wrap",
        justifyContent: "center",
      }}
    >
      {(row.attributes ?? []).map((attribute, index) => (
        <Chip
          key={attribute.id ?? `${attribute.title}-${index}`}
          label={attribute.title}
          size="small"
          sx={(theme) => ({
            height: 24,
            borderRadius: "8px",
            px: 1,
            color: ATTRIBUTE_COLORS[index % 3],
            bgcolor: ATTRIBUTE_BACKGROUNDS[index % 3],
            "& .MuiChip-label": {
              ...theme.typography.labelSmall,
              fontFamily: getFontFamily(attribute.title),
              px: 0.5,
            },
          })}
        />
      ))}
    </Box>
  );

  const tableColumns = useMemo(() => {
    const baseColumns = [
      {
        key: "index" as const,
        header: "#",
        widthXs: calculateWidthPercentage(
          COLUMN_WIDTHS.EXTRA_SMALL.index,
          COLUMN_WIDTHS.EXTRA_SMALL.total,
        ),
        widthMd: calculateWidthPercentage(
          COLUMN_WIDTHS.MEDIUM.index,
          COLUMN_WIDTHS.MEDIUM.total,
        ),
        align: "center" as const,
        render: renderIndexCell,
      },
      {
        key: "questionnaire" as const,
        header: <Trans i18nKey="common.questionnaire" />,
        widthMd: calculateWidthPercentage(
          COLUMN_WIDTHS.MEDIUM.questionnaire,
          COLUMN_WIDTHS.MEDIUM.total,
        ),
        hideOnXs: true,
        align: "left" as const,
        render: renderQuestionnaireCell,
      },
      {
        key: "question" as const,
        header: <Trans i18nKey="common.question" />,
        widthXs: calculateWidthPercentage(
          COLUMN_WIDTHS.EXTRA_SMALL.question,
          COLUMN_WIDTHS.EXTRA_SMALL.total,
        ),
        widthMd: calculateWidthPercentage(
          COLUMN_WIDTHS.MEDIUM.question,
          COLUMN_WIDTHS.MEDIUM.total,
        ),
        align: "left" as const,
        render: renderQuestionCell,
      },
      {
        key: "currentState" as const,
        header: <Trans i18nKey="common.whatIsNow" />,
        widthXs: calculateWidthPercentage(
          COLUMN_WIDTHS.EXTRA_SMALL.currentState,
          COLUMN_WIDTHS.EXTRA_SMALL.total,
        ),
        widthMd: calculateWidthPercentage(
          COLUMN_WIDTHS.MEDIUM.currentState,
          COLUMN_WIDTHS.MEDIUM.total,
        ),
        align: "left" as const,
        render: (row: AdviceRow) =>
          renderOptionCell(row.answeredOption, "left"),
      },
      {
        key: "recommendedState" as const,
        header: <Trans i18nKey="common.whatShouldBe" />,
        widthXs: calculateWidthPercentage(
          COLUMN_WIDTHS.EXTRA_SMALL.recommendedState,
          COLUMN_WIDTHS.EXTRA_SMALL.total,
        ),
        widthMd: calculateWidthPercentage(
          COLUMN_WIDTHS.MEDIUM.recommendedState,
          COLUMN_WIDTHS.MEDIUM.total,
        ),
        align: "left" as const,
        render: (row: AdviceRow) =>
          renderOptionCell(row.recommendedOption, "left"),
      },
      {
        key: "attributes" as const,
        header: <Trans i18nKey="advice.affectedAttributes" />,
        widthXs: calculateWidthPercentage(
          COLUMN_WIDTHS.EXTRA_SMALL.attributes,
          COLUMN_WIDTHS.EXTRA_SMALL.total,
        ),
        widthMd: calculateWidthPercentage(
          COLUMN_WIDTHS.MEDIUM.attributes,
          COLUMN_WIDTHS.MEDIUM.total,
        ),
        align: "center" as const,
        render: renderAttributesCell,
      },
    ];

    return baseColumns.filter(
      (column) => !(column.hideOnXs && !isMediumScreen),
    );
  }, [isMediumScreen]);

  return (
    <>
      <TableContainer
        sx={{
          height: "100%",
          maxHeight: { xs: "unset", md: 320 },
          width: { xs: 600, sm: "unset" },
          overflow: "auto",
          borderRadius: 1,
        }}
      >
        <Table stickyHeader size="small" aria-label="advice-questions">
          <TableHead>
            <TableRow
              sx={{
                "& th": {
                  borderBottom: `1px solid ${HEADER_BORDER_COLOR}`,
                  backgroundColor: "background.containerHighest",
                  color: "background.onVariant",
                  fontWeight: 700,
                  py: 1,
                },
              }}
            >
              {tableColumns.map((column) => (
                <TableCell
                  key={column.key}
                  align={column.align}
                  sx={{
                    width: { xs: column.widthXs, md: column.widthMd },
                    minWidth: { xs: column.widthXs, md: column.widthMd },
                    display: column.hideOnXs
                      ? { xs: "none", md: "table-cell" }
                      : "table-cell",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent:
                        column.align === "center" ? "center" : "flex-start",
                      alignItems: "center",
                      width: "100%",
                    }}
                  >
                    {column.header}
                  </Box>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {adviceResult.map((row, rowIndex) => {
              const isLastRow = rowIndex === adviceResult.length - 1;

              return (
                <TableRow
                  key={row.id}
                  sx={{
                    "& td": {
                      borderBottom: isLastRow
                        ? "none"
                        : `1px solid ${ROW_BORDER_COLOR}`,
                      verticalAlign: "top",
                      py: 1,
                    },
                  }}
                >
                  {tableColumns.map((column) => (
                    <TableCell
                      key={column.key}
                      align={column.align}
                      sx={{
                        width: { xs: column.widthXs, md: column.widthMd },
                        minWidth: { xs: column.widthXs, md: column.widthMd },
                        display: column.hideOnXs
                          ? { xs: "none", md: "table-cell" }
                          : "table-cell",
                      }}
                    >
                      {column.render(row, rowIndex, rowIndex)}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default memo(AdviceQuestionTable);
