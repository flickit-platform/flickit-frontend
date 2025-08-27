import React from "react";
import { CEDialog, CEDialogActions } from "@common/dialogs/CEDialog";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import i18next, { t } from "i18next";
import { styles } from "@styles";

const QuestionReportDialog = ({ onClose, lng, ...rest }: any) => {
  const isRTL = lng === "fa" || (!lng && i18next.language === "fa");

  const close = ()=>{
    onClose()
  }

  return (
    <CEDialog
      {...rest}
      closeDialog={close}
      title={
        <Typography variant="semiBoldXLarge" fontFamily="inherit">
          test
        </Typography>
      }

    >
     <Box>test</Box>
      <CEDialogActions
        cancelLabel={t("common.cancel", { lng })}
        submitButtonLabel={
         t("common.confirm", { lng })
        }
        onClose={close}
        onSubmit={()=>{}}
        sx={{
          flexDirection: { xs: "column-reverse", sm: "row" },
          gap: 2,
          ...styles.rtlStyle(isRTL),
        }}
      />
    </CEDialog>
  );
};

export default QuestionReportDialog;
