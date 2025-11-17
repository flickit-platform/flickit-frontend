import { ReactElement, useState } from "react";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import TableSortLabel from "@mui/material/TableSortLabel";
import Box from "@mui/material/Box";
import { useTheme } from "@mui/material";
import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid";
import TablePagination from "@mui/material/TablePagination";
import Popover from "@mui/material/Popover";
import { Trans } from "react-i18next";
import { farsiFontFamily, primaryFontFamily } from "@/config/theme";
import FilterListIcon from "@mui/icons-material/FilterList";
import { generateColorFromString } from "@/config/styles";
import languageDetector from "@/utils/language-detector";
import { t } from "i18next";
import useDialog from "@/hooks/useDialog";
import QuestionDetailsContainer from "./question-details/QuestionDetailsContainer";
import PopoverContent from "./PopoverContent";
import ScoreDisplay from "./ScoreDisplay";
import usePopover from "@/hooks/usePopover";
import { styles } from "@styles";
import { CircleRating } from "./CircleRating";
import { Text } from "../common/Text";
import {
  setQuestions,
  setSelectedQuestion,
  useQuestionContext,
  useQuestionDispatch,
} from "@/features/questions/context";

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
  gainedScorePercentage: number;
  missedScorePercentage: number;
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

export interface ItemServerFieldsColumnMapping {
  questionnaire: string;
  question: string;
  gained_score: number;
  missedScore: number;
  weighted_score: number;
  confidence: number;
  evidence_count: number;
}

interface ItemColumnMapping {
  questionnaire: ReactElement;
  question: string;
  gainedScore: number;
  missedScore: number;
  gainedScorePercentage: number;
  missedScorePercentage: number;
  weightedScore: string | number;
  confidence: number;
  evidenceCount: number;
  isNotApplicable: boolean | null;
}

const columns: TableColumn[] = [
  {
    field: "questionnaire",
    serverKey: "questionnaire",
    label: "common.questionnaire",
    sortable: true,
    width: "130px",
  },
  {
    field: "question",
    serverKey: "question",
    label: "common.question",
    sortable: false,
    width: "300px",
  },
  {
    field: "gainedScore",
    serverKey: "gained_score",
    label: "common.score",
    sortable: true,
    align: "center",
    width: "285px",
  },
  {
    field: "confidence",
    serverKey: "confidence",
    label: "common.confidence",
    sortable: true,
    align: "center",
    width: "20px",
  },
  {
    field: "evidenceCount",
    serverKey: "evidence_count",
    label: "common.evidence",
    sortable: true,
    align: "center",
    width: "20px",
  },
];

const MaturityLevelTable = ({
  data,
  updateSortOrder,
  scoreState,
  setPage,
  page,
  rowsPerPage,
  setRowsPerPage,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
}: {
  data: any;
  updateSortOrder: any;
  scoreState: any;
  setPage: any;
  page: number;
  rowsPerPage: number;
  setRowsPerPage: any;
  sortBy: any;
  setSortBy: any;
  sortOrder: any;
  setSortOrder: any;
}) => {
  const theme = useTheme();
  const { questions } = useQuestionContext();
  const dispatch = useQuestionDispatch();
  const { gainedScore, maxPossibleScore, questionsCount } = scoreState;
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState<
    number | null
  >(null);
  const { anchorEl, handlePopoverOpen, handlePopoverClose, open } =
    usePopover();

  const dialogProps = useDialog();

  const handleQuestionClick = (index: number) => {
    setSelectedQuestionIndex(index);
    dispatch(setSelectedQuestion({ ...questions[index], readonly: true }));
    dialogProps.openDialog({});
  };

  const navigateToPreviousQuestion = () => {
    if (selectedQuestionIndex !== null && selectedQuestionIndex > 0) {
      const newIndex = selectedQuestionIndex - 1;
      setSelectedQuestionIndex(newIndex);
      dispatch(setSelectedQuestion({ ...questions[newIndex], readonly: true }));
    }
  };

  const navigateToNextQuestion = () => {
    if (
      selectedQuestionIndex !== null &&
      selectedQuestionIndex < questions.length - 1
    ) {
      const newIndex = selectedQuestionIndex + 1;
      setSelectedQuestionIndex(newIndex);
      dispatch(setSelectedQuestion({ ...questions[newIndex], readonly: true }));
    }
  };

  const getSortOrder = (
    currentSort: string,
    currentOrder: string,
    columnField: string,
  ) => {
    if (currentSort === columnField && currentOrder === "asc") {
      return "desc";
    }
    return "asc";
  };

  const getCellTitle = (
    column: TableColumn,
    item: any,
    row: ItemColumnMapping,
  ) => {
    if (column.field === "questionnaire") {
      return item.questionnaire?.title;
    }
    if (column.field === "gainedScore") {
      return "";
    }
    return row[column.field]?.toString();
  };

  const getCellContent = (column: TableColumn, row: ItemColumnMapping) => {
    if (column.field === "confidence") {
      return <CircleRating value={row.confidence} />;
    }
    if (column.field === "gainedScore") {
      if (row.isNotApplicable) {
        return <p>NA</p>;
      } else {
        return <ScoreDisplay data={row} />;
      }
    }
    return row[column.field];
  };

  const getCellDirection = (column: TableColumn, row: ItemColumnMapping) => {
    if (column.serverKey === "question") {
      return languageDetector(row[column.field]?.toString()) ? "rtl" : "ltr";
    }
    return "unset";
  };

  const getCellTextAlign = (column: TableColumn, row: ItemColumnMapping) => {
    if (column.serverKey === "question") {
      return languageDetector(row[column.field]?.toString()) ? "right" : "left";
    }
    return column.align;
  };

  const handleSort = (
    field: keyof ItemServerFieldsColumnMapping,
    order?: "asc" | "desc",
  ) => {
    setSortBy(field);
    setSortOrder(order);
    updateSortOrder(field, order);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const formatMaturityNumber = (num: any) => {
    if (num?.toString().includes(".")) {
      return parseFloat(num).toFixed(1);
    } else {
      return num;
    }
  };

  const handleSortChange = (sortBy: any, sortOrder: any) => {
    setSortBy(sortBy);
    setSortOrder(sortOrder);
    updateSortOrder(sortBy, sortOrder);
    handlePopoverClose();
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
      gainedScore: item?.answer?.gainedScore,
      missedScore: item?.answer?.missedScore,
      weightedScore: item.answer.weightedScore?.toString()
        ? parseFloat(
            parseFloat(item.answer.weightedScore?.toString() ?? "").toFixed(2),
          )
        : "",
      confidence: item.answer.confidenceLevel,
      evidenceCount: item.question.evidenceCount,
      isNotApplicable: item.answer.isNotApplicable,
      missedScorePercentage: item?.answer?.missedScorePercentage,
      gainedScorePercentage: item.answer.gainedScorePercentage,
    };
  };

  const renderGridHeader = () => (
    <Grid
      container
      whiteSpace="nowrap"
      mb={2}
      px={1}
      sx={{
        ...styles.centerH,
        direction: theme.direction,
      }}
    >
      {[
        { label: "subject.maxPossibleScore", value: maxPossibleScore, id: 1 },
        { label: "subject.gainedScores", value: gainedScore, id: 2 },
        { label: "common.questions", value: questionsCount, id: 3 },
      ].map((item) => (
        <Grid
          size={{ xs: 12, sm: 4, md: 2 }}
          key={item.id}
          sx={{
            ...styles.centerVH,
            gap: 1,
          }}
        >
          <Text sx={{ textAlign: "center" }} variant="bodyMedium">
            <Trans i18nKey={item.label} />:
          </Text>
          <Text variant="semiBoldMedium">
            {formatMaturityNumber(item.value)}
          </Text>
        </Grid>
      ))}
    </Grid>
  );

  // Extracted Table Header
  const renderTableHeader = () => (
    <TableHead
      sx={{
        ...theme.typography.semiBoldMedium,
        backgroundColor: "grey.100",
        width: "100%",
      }}
    >
      <TableRow>
        {columns.map((column) => {
          const isActive =
            data.sort === column.field ||
            (data.sort === "missedScore" && column.field === "gainedScore");
          const direction = isActive ? data.order : "asc";

          return (
            <TableCell
              key={column.field}
              align={column.align ?? "left"}
              sx={{
                py: "4px !important",
                color: isActive
                  ? "primary.main" + " !important"
                  : "#939393 !important",
                width: column.width ?? "auto",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                boxShadow: `inset 0 1px 0 0 #C7CCD1, inset 0 -1px 0 0 #C7CCD1`,
                "&:first-of-type": {
                  borderEndStartRadius: "8px !important",
                  borderStartStartRadius: "8px !important",
                },
                "&:last-child": {
                  borderStartEndRadius: "8px !important",
                  borderEndEndRadius: "8px !important",
                },
                textAlign: "center",
                borderBottom: "none",
              }}
              onClick={
                column.field === "gainedScore" ? handlePopoverOpen : undefined
              }
            >
              {column.sortable ? (
                <TableSortLabel
                  active={isActive}
                  direction={direction}
                  onClick={() =>
                    column.field === "gainedScore"
                      ? handlePopoverOpen
                      : handleSort(
                          column.serverKey,
                          getSortOrder(data.sort, data.order, column.field),
                        )
                  }
                  sx={{
                    color: isActive
                      ? "primary.main" + " !important"
                      : "#939393 !important",
                    "& .MuiTableSortLabel-icon": {
                      opacity: 1,
                      color: isActive
                        ? "primary.main" + " !important"
                        : "#939393 !important",
                      transform: direction === "asc" ? "scaleY(-1)" : "none",
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
          );
        })}
      </TableRow>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handlePopoverClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        transformOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <PopoverContent
          onSortChange={handleSortChange}
          sortBy={sortBy}
          sortOrder={sortOrder}
        />
      </Popover>
    </TableHead>
  );

  // Extracted Table Body
  const renderTableBody = () => (
    <TableBody>
      {questions.length > 0 ? (
        questions.map((item: any, index: number) => {
          const row = mapItemToRow(item);
          return (
            <TableRow
              key={item.id}
              onClick={() => handleQuestionClick(index)}
              data-testid="open-question-details-dialog"
              sx={{
                "&:hover": {
                  bgcolor: "action.hover",
                },
                cursor: "pointer",
              }}
            >
              {columns.map((column) => (
                <TableCell
                  key={column.field}
                  align={column.align ?? "left"}
                  title={getCellTitle(column, item, row)}
                  sx={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    maxWidth: column.width ?? "100%",
                    textAlign: getCellTextAlign(column, row),
                    direction: getCellDirection(column, row),
                    fontFamily: languageDetector(row[column.field]?.toString())
                      ? farsiFontFamily
                      : primaryFontFamily,
                    cursor: "pointer",
                  }}
                >
                  {getCellContent(column, row)}
                </TableCell>
              ))}
            </TableRow>
          );
        })
      ) : (
        <TableRow>
          <TableCell
            colSpan={columns.length}
            align="center"
            sx={{ textAlign: "center" }}
          >
            <Text>
              <Trans i18nKey="subject.noQuestionAvailableForThisMaturity" />
            </Text>
          </TableCell>
        </TableRow>
      )}
    </TableBody>
  );

  return (
    <Box>
      {renderGridHeader()}
      <TableContainer>
        <Table>
          {renderTableHeader()}
          {renderTableBody()}
        </Table>
        <TablePagination
          component="div"
          count={questionsCount}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage={t("common.rowsPerPage")}
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to}  ${t("common.of")} ${count !== -1 ? count : `${t("common.moreThan")} ${to}`}`
          }
        />
      </TableContainer>
      {dialogProps.open && (
        <QuestionDetailsContainer
          {...dialogProps}
          onClose={() => dialogProps.onClose()}
          onPreviousQuestion={navigateToPreviousQuestion}
          onNextQuestion={navigateToNextQuestion}
        />
      )}
    </Box>
  );
};

export default MaturityLevelTable;
