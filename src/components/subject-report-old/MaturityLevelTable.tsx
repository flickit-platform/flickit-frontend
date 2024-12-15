import React, { useEffect, useState } from "react";
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
} from "@mui/material";
import { Trans } from "react-i18next";
import { theme } from "@/config/theme";
import FilterListIcon from "@mui/icons-material/FilterList";
import { chipColorPalette } from "@/config/styles";

interface TableData {
  items: Item[];
  page: number;
  size: number;
  sort: string;
  order: "asc" | "desc";
  total: number;
}

interface Item {
  questionnaire: string;
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
  score: number;
  weightedScore: number;
  confidenceLevel: number; // 1 to 5
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
  score: number;
  weighted_score: number;
  confidence: number;
  evidence_count: number;
}

interface ItemColumnMapping {
  questionnaire: JSX.Element;
  question: string;
  answer: string;
  weight: number;
  score: number;
  weightedScore: number;
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
    width: "260px",
  },
  {
    field: "answer",
    serverKey: "answer",
    label: "answer",
    sortable: false,
    width: "200px",
  },
  {
    field: "weight",
    serverKey: "weight",
    label: "weight",
    sortable: true,
    align: "center",
    width: "60px",
  },
  {
    field: "score",
    serverKey: "score",
    label: "score",
    sortable: true,
    align: "center",
    width: "60px",
  },
  {
    field: "weightedScore",
    serverKey: "weighted_score",
    label: "weightedScore",
    sortable: true,
    align: "center",
    width: "60px",
  },
  {
    field: "confidence",
    serverKey: "confidence",
    label: "confidence",
    sortable: true,
    align: "center",
    width: "60px",
  },
  {
    field: "evidenceCount",
    serverKey: "evidence_count",
    label: "evidence",
    sortable: true,
    align: "center",
    width: "60px",
  },
];

const MaturityLevelTable = ({
  tempData,
  updateSortOrder,
}: {
  tempData: any;
  updateSortOrder: any;
}) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(50);

  const handleSort = (
    field: keyof ItemServerFieldsColumnMapping,
    order?: string,
  ) => {
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

  const generateColorFromString = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash); // DJB2 hash function
    }
    // Select a chip based on hash
    const chipIndex =
      (Math.abs(hash) % Object.keys(chipColorPalette).length) + 1;
    return chipColorPalette[`chip${chipIndex}`];
  };

  const mapItemToRow = (item: Item): ItemColumnMapping => {
    const color = generateColorFromString(item.questionnaire);

    return {
      questionnaire: (
        <Chip
          label={item.questionnaire}
          style={{ backgroundColor: color.backgroundColor, color: color.color }}
        />
      ),
      question: item.question.index
        ? item.question.index + ". " + item.question.title
        : "-",
      answer: item.answer.index
        ? item.answer.index + ". " + item.answer.title
        : "-",
      weight: item.question.weight,
      score: item.answer.score,
      weightedScore: item.answer.weightedScore,
      confidence: item.answer.confidenceLevel,
      evidenceCount: item.question.evidenceCount,
    };
  };
  return (
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
                align={column.align || "left"}
                sx={{
                  color:
                    tempData.sort === column.field
                      ? theme.palette.primary.main + " !important"
                      : "#939393 !important",
                  width: column.width || "auto",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  boxShadow:
                    "inset 0 1px 0 0 #C7CCD1, inset 0 -1px 0 0 #C7CCD1", // Set boxShadow for top and bottom only
                  "&:first-child": {
                    borderRadius: "16px 0px 0px 16px !important",
                  },
                  "&:last-child": {
                    borderRadius: "0px 16px 16px 0px !important",
                  },
                }}
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
        </TableHead>
        <TableBody>
          {tempData?.items.length > 0 ? (
            <>
              {tempData?.items
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((item: any, index: number) => {
                  const row = mapItemToRow(item);
                  return (
                    <TableRow key={index}>
                      {columns.map((column) => (
                        <TableCell
                          key={column.field}
                          align={column.align || "left"}
                          sx={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            maxWidth: column.width || "100%",
                            textAlign: column.align
                          }}
                        >
                          {column.field === "confidence" ? (
                            <CircleRating value={row.confidence} />
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
    </TableContainer>
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

const CircleRating = (props: any) => {
  const { value, ...other } = props;

  return (
    <Rating
      {...other}
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
