import { useTranslation } from "react-i18next";
import { CEDialog, CEDialogActions } from "./CEDialog";
import { Text } from "../Text";
import i18next, { DefaultTFuncReturn } from "i18next";

interface IDeleteConfirmationDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  content?: {
    category?: DefaultTFuncReturn;
    title?: DefaultTFuncReturn;
    hideCategory?: boolean;
  };
  confirmButtonText?: string | null;
  cancelButtonText?: string | null;
}

export const DeleteConfirmationDialog = ({
  open,
  onClose,
  onConfirm,
  content,
  confirmButtonText,
  cancelButtonText,
}: IDeleteConfirmationDialogProps) => {
  const { t } = useTranslation();

  const getDialogTitle = () => {
    if (!content?.category) return t("common.delete");

    return t("common.deleteWithCategory", {
      category: content.category.toLocaleLowerCase(),
    });
  };

  const getDialogContent = () => {
    if (content?.title) {
      const categoryText =
        !content.hideCategory && content?.category
          ? (i18next.language === "en" ? "the " : "") +
            content.category.toLocaleLowerCase()
          : "";

      return t("common.deleteItemWithTitle", {
        category: categoryText,
        title: content.title,
      });
    }

    return t("common.deleteItemWithoutTitle", {
      category: content?.category,
    });
  };

  return (
    <CEDialog
      open={open}
      closeDialog={onClose}
      title={<>{getDialogTitle()}</>}
      maxWidth="sm"
      sx={{
        "& .MuiDialog-paper": {
          minWidth: "500px",
          width: "auto",
        },
      }}
    >
      <Text sx={{ color: "#0A2342" }}>{getDialogContent()}</Text>

      <CEDialogActions
        type="delete"
        loading={false}
        onClose={onClose}
        submitButtonLabel={confirmButtonText ?? t("common.confirm")}
        cancelLabel={cancelButtonText ?? t("common.cancel")}
        onSubmit={onConfirm}
      />
    </CEDialog>
  );
};
