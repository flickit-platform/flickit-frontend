import React from 'react';
import { Box } from '@mui/material';
import MaturityLevelTable from './MaturityLevelTable';
import QueryBatchData from '../common/QueryBatchData';
import TableSkeleton from "../common/loadings/TableSkeleton";

interface ImpactTableProps {
  fetchAffectedQuestionsOnAttributeQueryData: any; 
  fetchScoreState: any; 
  updateSortOrder: (newSort: string, newOrder: string) => void;
  page: number;
  setPage: (page: number) => void;
  rowsPerPage: number;
  setRowsPerPage: (rowsPerPage: number) => void;
  sortBy: string | null;
  setSortBy: (sortBy: string | null) => void;
  sortOrder: "asc" | "desc" | null;
  setSortOrder: (sortOrder: "asc" | "desc" | null) => void;
}

const ImpactTable: React.FC<ImpactTableProps> = ({
  fetchAffectedQuestionsOnAttributeQueryData,
  fetchScoreState,
  updateSortOrder,
  page,
  setPage,
  rowsPerPage,
  setRowsPerPage,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
}) => {
  return (
    <Box>
      <QueryBatchData
        queryBatchData={[fetchAffectedQuestionsOnAttributeQueryData, fetchScoreState]}
        loadingComponent={<TableSkeleton />}
        render={([affectedQuestionsOnAttribute = {}, scoreState = {}]) => {
          return (
            <MaturityLevelTable
              tempData={affectedQuestionsOnAttribute}
              scoreState={scoreState}
              updateSortOrder={updateSortOrder}
              setPage={setPage}
              page={page}
              rowsPerPage={rowsPerPage}
              setRowsPerPage={setRowsPerPage}
              sortBy={sortBy}
              setSortBy={setSortBy}
              sortOrder={sortOrder}
              setSortOrder={setSortOrder}
            />
          );
        }}
      />
    </Box>
  );
};

export default ImpactTable;