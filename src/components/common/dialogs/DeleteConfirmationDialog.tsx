import { Trans, useTranslation } from "react-i18next";
import { CEDialog, CEDialogActions } from "./CEDialog";
import Typography from "@mui/material/Typography";
import Warning from "@mui/icons-material/Warning";

interface IDeleteConfirmationDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  content: string;
  confirmButtonText?: string | null;
  cancelButtonText?: string | null;
}

export const DeleteConfirmationDialog = ({
  open,
  onClose,
  onConfirm,
  title,
  content,
  confirmButtonText,
  cancelButtonText,
}: IDeleteConfirmationDialogProps) => {
  const { t } = useTranslation();

  return (
    <CEDialog
      open={open}
      onClose={onClose}
      title={
        <>
          <Warning />
          <Trans i18nKey="warning" />
        </>
      }
      maxWidth="sm"
    >
      <Typography sx={{ color: "#0A2342" }}>
        <Trans
          i18nKey={content}
          values={{ title }}
          components={{
            title: <span style={{ fontWeight: "bold", color: "#B86A77" }} />,
          }}
        />
      </Typography>

      <CEDialogActions
        type="delete"
        loading={false}
        onClose={onClose}
        submitButtonLabel={confirmButtonText ?? t("confirm")}
        cancelLabel={cancelButtonText ?? t("cancel")}
        onSubmit={onConfirm}
      />
    </CEDialog>
  );
};
