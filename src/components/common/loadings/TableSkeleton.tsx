import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Skeleton from "@mui/material/Skeleton";


const MaturityLevelTableSkeleton = ({
  rows = 5,
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
