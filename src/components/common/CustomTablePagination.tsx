import { useState } from "react";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import TablePagination from "@mui/material/TablePagination";
import { t } from "i18next";

interface CustomTablePaginationProps {
  data: any[];
  onPageChange?: (page: number) => void;
  onRowsPerPageChange?: (rowsPerPage: number) => void;
}

const labelDisplayedRows = ({ from, to, count }: any) => {
  const countText = count !== -1 ? count : `${t("common.moreThan")} ${to}`;
  return `${from}-${to} ${t("common.of")} ${countText}`;
};

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
        labelRowsPerPage={t("common.rowsPerPage")}
        labelDisplayedRows={labelDisplayedRows}
      />
    </Box>
  );
};

export default CustomTablePagination;
