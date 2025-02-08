import React, { useState } from "react";
import { Box, Divider, TablePagination } from "@mui/material";
import { t } from "i18next";

interface CustomTablePaginationProps {
  data: any[];
  onPageChange?: (page: number) => void;
  onRowsPerPageChange?: (rowsPerPage: number) => void;
}

const CustomTablePagination: React.FC<CustomTablePaginationProps> = ({
  data,
  onPageChange,
  onRowsPerPageChange,
}) => {
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
    onPageChange?.(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(0);
    onRowsPerPageChange?.(newRowsPerPage);
  };

  return (
    <Box width="100%">
      <Divider />
      <TablePagination
        component="div"
        count={data.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage={t("rowsPerPage")}
        labelDisplayedRows={({ from, to, count }) =>
          `${from}-${to} ${t("of")} ${count !== -1 ? count : `${t("moreThan")} ${to}`}`
        }
      />
    </Box>
  );
};

export default CustomTablePagination;
