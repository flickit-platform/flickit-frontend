import { Trans, useTranslation } from "react-i18next";
import { DialogProps, Snackbar } from "@mui/material";
import { CEDialog, CEDialogActions } from "../common/dialogs/CEDialog";
import { useState } from "react";
import { LoadingButton } from "@mui/lab";
import { useServiceContext } from "@/providers/ServiceProvider";

interface IDialogProps extends DialogProps {
  open: boolean;
  onClose: () => void;
  context?: any;
}

export const QuestionDetailsDialog = (props: IDialogProps) => {
  const { onClose: closeDialog, context = {}, ...rest } = props;
  const { type, data = {} } = context;
  const { t } = useTranslation();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const { service } = useServiceContext();

  const handleCopyClick = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setSnackbarOpen(true);
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <CEDialog
      {...rest}
      closeDialog={closeDialog}
      title={
        <>
          <Trans i18nKey="question" />
        </>
      }
    >
      <CEDialogActions
        type="delete"
        loading={false}
        onClose={closeDialog}
        hideSubmitButton
        hideCancelButton
      >
        <LoadingButton onClick={handleCopyClick}>
          <Trans i18nKey="question" />
        </LoadingButton>

        <LoadingButton variant="contained" onClick={closeDialog} sx={{ mx: 1 }}>
          <Trans i18nKey="done" />
        </LoadingButton>
      </CEDialogActions>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        message={t("linkCopied")}
      />
    </CEDialog>
  );
};
