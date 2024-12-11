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
} from "@mui/material";
import { Trans } from "react-i18next";

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
}

interface ItemServerFieldsColumnMapping {
  questionnaire: string;
  weight: number;
  score: number;
  weighted_score: number;
  confidence: number;
  evidence_count: number;
}

interface ItemColumnMapping {
  questionnaire: string;
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
    label: "Questionnaire",
    sortable: true,
  },
  {
    field: "weight",
    serverKey: "weight",
    label: "Weight",
    sortable: true,
    align: "center",
  },
  {
    field: "score",
    serverKey: "score",
    label: "Score",
    sortable: true,
    align: "center",
  },
  {
    field: "weightedScore",
    serverKey: "weighted_score",
    label: "Weighted Score",
    sortable: true,
    align: "center",
  },
  {
    field: "confidence",
    serverKey: "confidence",
    label: "Confidence",
    sortable: true,
    align: "center",
  },
  {
    field: "evidenceCount",
    serverKey: "evidence_count",
    label: "Evidence Count",
    sortable: true,
    align: "center",
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
                      active={tempData.sort === column.field}
                      direction={
                        tempData.sort === column.field ? tempData.order : "asc"
                      }
                      onClick={() =>
                        handleSort(
                          column.serverKey,
                          tempData.order === "asc" &&
                            tempData.sort === column.field
                            ? "desc"
                            : "asc",
                        )
                      }
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
                  <Trans i18nKey="noDataAvailable" />
                </Typography>
              </TableCell>
            )}
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
