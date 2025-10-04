import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import ExpertGroupsItem from "./ExpertGroupsItem";
import { DeleteConfirmationDialog } from "@common/dialogs/DeleteConfirmationDialog";
import { t } from "i18next";
import { useState } from "react";
import { ICustomError } from "@/utils/custom-error";
import showToast from "@/utils/toast-error";
import { useQueryDataContext } from "@common/QueryData";
import { useQuery } from "@/hooks/useQuery";
import { useServiceContext } from "@/providers/service-provider";
import { TId } from "@/types";

interface IExpertGroupsListProps {
  data: any;
}

const ExpertGroupsList = (props: IExpertGroupsListProps) => {
  const { data } = props;
  const { items = [] } = data;
  const { query: fetchExpertGroups } = useQueryDataContext();
  const { service } = useServiceContext();

  const [openDeleteDialog, setOpenDeleteDialog] = useState<{
    status: boolean;
    id: TId;
  }>({ status: false, id: "" });

  const deleteExpertGroupQuery = useQuery({
    service: (args, config) => service.expertGroups.info.remove(args, config),
    runOnMount: false,
    toastError: false,
  });

  const deleteExpertGroup = async () => {
    try {
      const {id} = openDeleteDialog
      await deleteExpertGroupQuery.query({ id });
      await fetchExpertGroups();
    } catch (e) {
      const err = e as ICustomError;
      if (err.response?.data?.hasOwnProperty("message")) {
        if (Array.isArray(err.response?.data?.message)) {
          showToast(err.response?.data?.message[0]);
        } else {
          showToast(err);
        }
      }
    }
  };
  return (
    <Box mt={2}>
      <Grid container spacing={3}>
        {items?.map((expertGroup: any) => {
          return (
            <Grid size={{xs: 12, sm: 6, lg: 4}} key={expertGroup.id}>
              <ExpertGroupsItem data={expertGroup} setOpenDeleteDialog={setOpenDeleteDialog} />
            </Grid>
          );
        })}
      </Grid>
      <DeleteConfirmationDialog
        open={openDeleteDialog.status}
        onClose={() =>
          setOpenDeleteDialog({ ...openDeleteDialog, status: false })
        }
        onConfirm={deleteExpertGroup}
        title="common.warning"
        content="expertGroups.areYouSureYouWantDeleteExpertGroup"
        confirmButtonText={t("common.continue")}
      />
    </Box>
  );
};

export default ExpertGroupsList;
