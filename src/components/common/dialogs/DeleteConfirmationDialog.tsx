import { useTranslation } from "react-i18next";
import { CEDialog, CEDialogActions } from "./CEDialog";
import { Text } from "../Text";
import i18next from "i18next";

interface IContent {
  category?: string;
  title?: string;
  hideCategory?: boolean;
  lng?: string;
}
interface IDeleteConfirmationDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  content?: IContent;
  confirmButtonText?: string | null;
  cancelButtonText?: string | null;
}

export const getDeleteContent = (content?: IContent) => {
  const { t } = useTranslation();

  if (content?.title) {
    const categoryText =
      !content.hideCategory && content?.category
        ? (i18next.language === "en" &&
          (content.lng === undefined || content.lng === "en")
            ? "the "
            : "") + content.category.toLocaleLowerCase()
        : "";

    return t("common.deleteItemWithTitle", {
      category: categoryText,
      title: content.title,
      lng: content?.lng,
    });
  }

  return t("common.deleteItemWithoutTitle", {
    category: content?.category,
    lng: content?.lng,
  });
};

export const getDeleteTitle = (content?: IContent) => {
  const { t } = useTranslation();

  if (!content?.category) return t("common.delete");

  return t("common.deleteWithCategory", {
    category: content.category.toLocaleLowerCase(),
    lng: content?.lng,
  });
};

export const DeleteConfirmationDialog = ({
  open,
  onClose,
  onConfirm,
  content,
  confirmButtonText,
  cancelButtonText,
}: IDeleteConfirmationDialogProps) => {
  const { t } = useTranslation();

  return (
    <CEDialog
      open={open}
      closeDialog={onClose}
      title={<>{getDeleteTitle(content)}</>}
      maxWidth="sm"
      sx={{
        "& .MuiDialog-paper": {
          minWidth: "500px",
          width: "auto",
        },
      }}
    >
      <Text sx={{ color: "#0A2342" }}>{getDeleteContent(content)}</Text>
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
