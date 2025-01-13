import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Skeleton,
} from "@mui/material";

const MaturityLevelTableSkeleton = ({
  rows = 10,
  columns = 7,
}: {
  rows?: number;
  columns?: number;
}) => {
  return (
    <TableContainer>
      <Table>
        <TableBody>
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <TableRow key={rowIndex}>
              {Array.from({ length: columns }).map((_, colIndex) => (
                <TableCell key={colIndex} align="center">
                  <Skeleton width="90%" height="20px" />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default MaturityLevelTableSkeleton;
