import React from "react";
import { CEDialog } from "@common/dialogs/CEDialog";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

const QuestionReportDialog = ({ openDialog }:{ openDialog: any } ) => {
  return (
    <CEDialog
      key={1}
      closeDialog={close}
       open={openDialog}
      title={
        <Typography variant="semiBoldXLarge" fontFamily="inherit">
          test
        </Typography>
      }

    >
     <Box>test</Box>
    </CEDialog>
  );
};

export default QuestionReportDialog;
