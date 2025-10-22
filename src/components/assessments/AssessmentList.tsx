import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import AssessmentCard from "./AssessmentCard";
import { IAssessment, TId, TQueryFunction } from "@/types/index";
import { TDialogProps } from "@/hooks/useDialog";
import { DeleteConfirmationDialog } from "../common/dialogs/DeleteConfirmationDialog";
import { useState } from "react";
import showToast from "@/utils/toast-error";
import { ICustomError } from "@/utils/custom-error";
import { useTranslation } from "react-i18next";
interface IAssessmentListProps {
  data: IAssessment[];
  space: any;
  dialogProps: TDialogProps;
  fetchAssessments: any;
  deleteAssessment: TQueryFunction<any, TId>;
}

const AssessmentsList = (props: IAssessmentListProps) => {
  const { data, space, dialogProps, fetchAssessments, deleteAssessment } =
    props;
  const { t } = useTranslation();
  const handleConfirmDelete = async () => {
    if (deleteDialog.assessmentId) {
      try {
        await deleteAssessment(deleteDialog.assessmentId);
        setDeleteDialog({
          open: false,
          assessmentId: 0,
          assessmentTitle: "",
        });
      } catch (error) {
        const err = error as ICustomError;
        showToast(err);
      }
    }
  };
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    assessmentId: TId;
    assessmentTitle: string;
  }>({
    open: false,
    assessmentId: 0,
    assessmentTitle: "",
  });

  return (
    <Box>
      <Grid container spacing={3}>
        {data.map((item) => {
          return (
            <AssessmentCard
              item={{ ...item, space }}
              key={item?.id}
              onDelete={(assessmentId, assessmentTitle) =>
                setDeleteDialog({
                  open: true,
                  assessmentId,
                  assessmentTitle,
                })
              }
              dialogProps={dialogProps}
              fetchAssessments={fetchAssessments}
            />
          );
        })}
      </Grid>
      <DeleteConfirmationDialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog((prev) => ({ ...prev, open: false }))}
        onConfirm={handleConfirmDelete}
        content={{
          category: t("common.assessment"),
          title: deleteDialog.assessmentTitle,
        }}
      />
    </Box>
  );
};

export { AssessmentsList };
