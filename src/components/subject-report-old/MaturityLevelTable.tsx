import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Rating,
  styled,
  Typography,
  Box,
  Chip,
  Grid,
  TablePagination,
  Tooltip,
  Divider,
  Popover,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import { Trans } from "react-i18next";
import { farsiFontFamily, primaryFontFamily, theme } from "@/config/theme";
import FilterListIcon from "@mui/icons-material/FilterList";
import { generateColorFromString } from "@/config/styles";
import languageDetector from "@/utils/languageDetector";
import { uniqueId } from "lodash";
import { t } from "i18next";
import useDialog from "@/utils/useDialog";
import QuestionDetailsContainer from "./questionDetails-dialog/QuestionDetailsContainer";
import { styles } from "@styles";
import usePopover from "@/utils/usePopover";
import PopoverContent from "./PopoverContent";
import ScoreDisplay from "./ScoreDisplay";

interface TableData {
  items: Item[];
  page: number;
  size: number;
  sort: string;
  order: "asc" | "desc";
  total: number;
}

interface Item {
  questionnaire: { id: string; title: string };
  question: Question;
  answer: Answer;
}

interface Question {
  index: number;
  title: string;
  weight: number;
  evidenceCount: number;
}

interface Answer {
  index: number;
  title: string;
  isNotApplicable: boolean | null;
  missedScore: number;
  gainedScore: number;
  weightedScore: number;
  confidenceLevel: number;
}

interface TableColumn {
  field: keyof ItemColumnMapping;
  label: string;
  sortable: boolean;
  align?: "left" | "right" | "center";
  serverKey: keyof ItemServerFieldsColumnMapping;
  width?: string;
}

interface ItemServerFieldsColumnMapping {
  questionnaire: string;
  question: string;
  answer: string;
  weight: number;
  gainedScore: number;
  missedScore: number;
  weighted_score: number;
  confidence: number;
  evidence_count: number;
}

interface ItemColumnMapping {
  questionnaire: JSX.Element;
  question: string;
  answer: string;
  weight: number;
  gainedScore: number;
  missedScore: number;
  weightedScore: string | number;
  confidence: number;
  evidenceCount: number;
}

const columns: TableColumn[] = [
  {
    field: "questionnaire",
    serverKey: "questionnaire",
    label: "questionnaire",
    sortable: true,
    width: "20px",
  },
  {
    field: "question",
    serverKey: "question",
    label: "question",
    sortable: false,
    width: "250px",
  },
  {
    field: "answer",
    serverKey: "answer",
    label: "answer",
    sortable: false,
    width: "180px",
  },
  {
    field: "weight",
    serverKey: "weight",
    label: "weight",
    sortable: true,
    align: "center",
    width: "50px",
  },
  {
    field: "gainedScore",
    serverKey: "gainedScore",
    label: "gainedScore",
    sortable: false,
    align: "center",
    width: "60px",
  },
  {
    field: "confidence",
    serverKey: "confidence",
    label: "confidence",
    sortable: true,
    align: "center",
    width: "50px",
  },
  {
    field: "evidenceCount",
    serverKey: "evidence_count",
    label: "evidence",
    sortable: true,
    align: "center",
    width: "50px",
  },
];

const MaturityLevelTable = ({
  tempData,
  updateSortOrder,
  scoreState,
  setPage,
  page,
  rowsPerPage,
  setRowsPerPage,
}: {
  tempData: any;
  updateSortOrder: any;
  scoreState: any;
  setPage: any;
  page: number;
  rowsPerPage: number;
  setRowsPerPage: any;
}) => {
  const { gainedScore, maxPossibleScore, questionsCount } = scoreState;
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState<number | null>(null);
  const { anchorEl, handlePopoverOpen, handlePopoverClose, open } = usePopover();

  const handleQuestionClick = (index: number) => {
    setSelectedQuestionIndex(index);
    dialogProps.openDialog({
      type: "details",
      questionInfo: tempData.items[index],
      questionsInfo: tempData.items,
      index: index,
    });
  };

  const navigateToPreviousQuestion = () => {
    if (selectedQuestionIndex !== null && selectedQuestionIndex > 0) {
      const newIndex = selectedQuestionIndex - 1;
      setSelectedQuestionIndex(newIndex);
      dialogProps.openDialog({
        type: "details",
        questionInfo: tempData.items[newIndex],
        questionsInfo: tempData.items,
        index: selectedQuestionIndex - 1,
      });
    }
  };

  const navigateToNextQuestion = () => {
    if (selectedQuestionIndex !== null && selectedQuestionIndex < tempData.items.length - 1) {
      const newIndex = selectedQuestionIndex + 1;
      setSelectedQuestionIndex(newIndex);
      dialogProps.openDialog({
        type: "details",
        questionInfo: tempData.items[newIndex],
        questionsInfo: tempData.items,
        index: selectedQuestionIndex + 1,
      });
    }
  };

  const dialogProps = useDialog();
  const handleSort = (field: keyof ItemServerFieldsColumnMapping, order?: string) => {
    updateSortOrder(field, order);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const formatMaturityNumber = (num: any) => {
    if (num.toString().includes(".")) {
      return parseFloat(num).toFixed(1);
    } else {
      return num;
    }
  };

  const mapItemToRow = (item: Item): ItemColumnMapping => {
    const color = generateColorFromString(item.questionnaire?.title);

    return {
      questionnaire: (
        <Chip
          label={item?.questionnaire?.title}
          style={{
            backgroundColor: color.backgroundColor,
            color: color.color,
            fontFamily: languageDetector(item?.questionnaire?.title)
              ? farsiFontFamily
              : primaryFontFamily,
          }}
        />
      ),
      question: item.question.index
        ? item.question.index + ". " + item.question.title
        : "-",
      answer: item.answer.index
        ? item.answer.index + ". " + item.answer.title
        : item.answer.isNotApplicable
          ? t("notApplicable")
          : "-",
      weight: item.question.weight,
      gainedScore: item?.answer?.gainedScore,
      missedScore: item?.answer?.missedScore,
      weightedScore: item.answer.weightedScore?.toString()
        ? parseFloat(parseFloat(item.answer.weightedScore?.toString() ?? "").toFixed(2))
        : "",
      confidence: item.answer.confidenceLevel,
      evidenceCount: item.question.evidenceCount,
    };
  };

  return (
    <Box>
      <Grid
        container
        sx={{
          direction: theme.direction,
          mb: 2,
          whiteSpace: "nowrap",
          display: "flex",
          justifyContent: "center",
          px: 1,
        }}
      >
        <Grid
          item
          xs={12}
          sm={4}
          md={2}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Typography
            sx={{
              ...theme.typography.bodyMedium,
              textAlign: "center",
            }}
          >
            <Trans i18nKey={"maxPossibleScore"} />:
          </Typography>{" "}
          <Typography sx={{ ...theme.typography.semiBoldMedium }}>
            {formatMaturityNumber(maxPossibleScore)}
          </Typography>
        </Grid>
        <Grid
          item
          xs={12}
          sm={4}
          md={2}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Typography
            sx={{
              ...theme.typography.bodyMedium,
              textAlign: "center",
            }}
          >
            <Trans i18nKey={"gainedScore"} />:
          </Typography>{" "}
          <Typography sx={{ ...theme.typography.semiBoldMedium }}>
            {formatMaturityNumber(gainedScore)}
          </Typography>
        </Grid>
        <Grid
          item
          xs={12}
          sm={4}
          md={2}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Typography
            sx={{
              ...theme.typography.bodyMedium,
              textAlign: "center",
            }}
          >
            <Trans i18nKey={"questionsCount"} />:
          </Typography>{" "}
          <Typography sx={{ ...theme.typography.semiBoldMedium }}>
            {formatMaturityNumber(questionsCount)}
          </Typography>
        </Grid>
      </Grid>
      <TableContainer>
        <Table>
          <TableHead
            sx={{
              ...theme.typography.semiBoldMedium,
              backgroundColor: theme.palette.grey[100],
              width: "100%",
            }}
          >
            {" "}
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.field}
                  align={column.align ?? "left"}
                  sx={{
                    color:
                      tempData.sort === column.field
                        ? theme.palette.primary.main + " !important"
                        : "#939393 !important",
                    width: column.width ?? "auto",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    boxShadow:
                      "inset 0 1px 0 0 #C7CCD1, inset 0 -1px 0 0 #C7CCD1",
                    "&:first-child": {
                      borderEndStartRadius: "16px !important",
                      borderStartStartRadius: "16px !important",
                    },
                    "&:last-child": {
                      borderStartEndRadius: "16px !important",
                      borderEndEndRadius: "16px !important",
                    },
                  }}
                  onClick={
                    column.field === "gainedScore"
                      ? handlePopoverOpen
                      : undefined
                  }
                >
                  {column.sortable ? (
                    <TableSortLabel
                      active={tempData.sort === column.field}
                      direction={
                        tempData.sort === column.field ? tempData.order : "asc"
                      }
                      onClick={() =>
                        handleSort(
                          column.serverKey,
                          tempData.sort === column.field &&
                            tempData.order === "asc"
                            ? "desc"
                            : "asc",
                        )
                      }
                      sx={{
                        color:
                          tempData.sort === column.field
                            ? theme.palette.primary.main + " !important"
                            : "#939393 !important",
                        "& .MuiTableSortLabel-icon": {
                          opacity: 1,
                          color:
                            tempData.sort === column.field
                              ? theme.palette.primary.main + " !important"
                              : "#939393 !important",
                          transform:
                            tempData.sort === column.field &&
                            tempData.order === "asc"
                              ? "scaleY(-1)"
                              : "none",
                        },
                      }}
                      IconComponent={FilterListIcon}
                    >
                      <Trans i18nKey={column.label} />
                    </TableSortLabel>
                  ) : (
                    <Trans i18nKey={column.label} />
                  )}
                </TableCell>
              ))}
            </TableRow>
            <Popover
              open={open}
              anchorEl={anchorEl}
              onClose={handlePopoverClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "center",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "center",
              }}
            >
              <PopoverContent />
            </Popover>
          </TableHead>
          <TableBody>
            {tempData?.items.length > 0 ? (
              <>
                {tempData?.items.map((item: any, index: number) => {
                  const row = mapItemToRow(item);
                  return (
                    <TableRow
                      key={uniqueId()}
                      component="div"
                      onClick={() => handleQuestionClick(index)}
                      data-testid="open-question-details-dialog"
                    >
                      {columns.map((column) => (
                        <TableCell
                          key={column.field}
                          align={column.align ?? "left"}
                          title={
                            column.field === "questionnaire"
                              ? item.questionnaire
                              : column.field === "gainedScore"
                                ? ""
                                : row[column.field]?.toString()
                          }
                          sx={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            maxWidth: column.width ?? "100%",
                            textAlign:
                              column.serverKey === "question" ||
                              column.serverKey === "answer"
                                ? languageDetector(
                                    row[column.field]?.toString(),
                                  )
                                  ? "right"
                                  : "left"
                                : column.align,
                            direction:
                              column.serverKey === "question" ||
                              column.serverKey === "answer"
                                ? languageDetector(
                                    row[column.field]?.toString(),
                                  )
                                  ? "rtl"
                                  : "ltr"
                                : "unset",
                            fontFamily: languageDetector(
                              row[column.field]?.toString(),
                            )
                              ? farsiFontFamily
                              : primaryFontFamily,
                            cursor: "pointer",
                          }}
                        >
                          {column.field === "confidence" ? (
                            <CircleRating value={row.confidence} />
                          ) : column.field === "gainedScore" ? (
                            <ScoreDisplay
                              missedScore={row.missedScore}
                              gainedScore={row.gainedScore}
                            />
                          ) : (
                            row[column.field]
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  );
                })}
              </>
            ) : (
              <TableCell
                colSpan={columns.length}
                align="center"
                sx={{ textAlign: "center" }}
              >
                <Typography>
                  <Trans i18nKey="noQuestionAvailableForThisMaturity" />
                </Typography>
              </TableCell>
            )}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={questionsCount}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage={t("rowsPerPage")}
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to}  ${t("of")} ${count !== -1 ? count : `${t("moreThan")} ${to}`}`
          }
        />
      </TableContainer>
      <QuestionDetailsContainer
        {...dialogProps}
        onClose={() => dialogProps.onClose()}
        onPreviousQuestion={navigateToPreviousQuestion}
        onNextQuestion={navigateToNextQuestion}
      />
    </Box>
  );
};

const CircleIcon = styled("span")(({ theme }) => ({
  width: 16,
  height: 16,
  borderRadius: "100%",
  backgroundColor: "rgba(194, 204, 214, 0.5)",
}));

const ActiveCircleIcon = styled(CircleIcon)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
}));

export const CircleRating = (props: any) => {
  const { value, ...other } = props;

  return (
    <Rating
      {...other}
      data-testid={"rating-level-num"}
      value={value}
      max={5}
      readOnly
      size="small"
      icon={<ActiveCircleIcon />}
      emptyIcon={<CircleIcon />}
      sx={{
        display: "flex",
        gap: "4px",
      }}
    />
  );
};


export default MaturityLevelTable;
