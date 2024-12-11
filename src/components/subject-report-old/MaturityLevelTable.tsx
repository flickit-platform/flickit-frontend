import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Paper,
  Rating,
  styled,
} from "@mui/material";
import { TablePagination } from "@mui/material";

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
}

interface ItemColumnMapping {
  questionnaire: string;
  weight: number;
  score: number;
  weightedScore: number;
  confidence: number;
  evidenceCount: number;
}

// Sample data
const sampleData: TableData = {
  items: [
    {
      questionnaire: "Software Quality Tunning",
      question: {
        index: 6,
        title: "Is the use of a load balancer supported in the architecture?",
        weight: 1,
        evidenceCount: 2,
      },
      answer: {
        index: 4,
        title: "Good",
        isNotApplicable: null,
        score: 1.0,
        weightedScore: 1.0,
        confidenceLevel: 4,
      },
    },
    {
      questionnaire: "Log and Monitoring",
      question: {
        index: 1,
        title:
          "Is a suitable technology (e.g. Logback, etc.) being utilized for logging?",
        weight: 1,
        evidenceCount: 1,
      },
      answer: {
        index: 1,
        title: "No",
        isNotApplicable: null,
        score: 0.5,
        weightedScore: 0.5,
        confidenceLevel: 2,
      },
    },
  ],
  page: 0,
  size: 4,
  sort: "evidenceCount",
  order: "desc",
  total: 15,
};

const columns: TableColumn[] = [
  { field: "questionnaire", label: "Questionnaire", sortable: true },
  { field: "weight", label: "Weight", sortable: true, align: "center" },
  { field: "score", label: "Score", sortable: true, align: "center" },
  {
    field: "weightedScore",
    label: "Weighted Score",
    sortable: true,
    align: "center",
  },
  {
    field: "confidence",
    label: "Confidence",
    sortable: false,
    align: "center",
  },
  {
    field: "evidenceCount",
    label: "Evidence Count",
    sortable: true,
    align: "center",
  },
];

const MaturityLevelTable: React.FC = () => {
  const [data, setData] = useState<TableData>(sampleData);
  const [order, setOrder] = useState<"asc" | "desc">("desc");
  const [orderBy, setOrderBy] =
    useState<keyof ItemColumnMapping>("evidenceCount");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(4);

  const handleSort = (field: keyof ItemColumnMapping) => {
    const isAsc = orderBy === field && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(field);
    // Add sorting logic for items
    const sortedItems = [...data.items].sort((a, b) => {
      const aValue =
        field === "confidence"
          ? a.answer.confidenceLevel
          : a.question[field as keyof Question] ||
            a.answer[field as keyof Answer];
      const bValue =
        field === "confidence"
          ? b.answer.confidenceLevel
          : b.question[field as keyof Question] ||
            b.answer[field as keyof Answer];
      return (Number(aValue) > Number(bValue) ? 1 : -1) * (isAsc ? 1 : -1);
    });
    setData({ ...data, items: sortedItems });
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

  const mapItemToRow = (item: Item): ItemColumnMapping => ({
    questionnaire: item.questionnaire,
    weight: item.question.weight,
    score: item.answer.score,
    weightedScore: item.answer.weightedScore,
    confidence: item.answer.confidenceLevel,
    evidenceCount: item.question.evidenceCount,
  });

  return (
    <div>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column.field} align={column.align || "left"}>
                  {column.sortable ? (
                    <TableSortLabel
                      active={orderBy === column.field}
                      direction={orderBy === column.field ? order : "asc"}
                      onClick={() => handleSort(column.field)}
                    >
                      {column.label}
                    </TableSortLabel>
                  ) : (
                    column.label
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.items
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((item, index) => {
                const row = mapItemToRow(item);
                return (
                  <TableRow key={index}>
                    {columns.map((column) => (
                      <TableCell
                        key={column.field}
                        align={column.align || "left"}
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
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

const CircleIcon = styled("span")(({ theme }) => ({
  width: 16,
  height: 16,
  borderRadius: "50%",
  backgroundColor: theme.palette.grey[200],
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
