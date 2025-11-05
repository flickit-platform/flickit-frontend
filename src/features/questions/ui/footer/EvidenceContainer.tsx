import React, { useState } from "react";
import { Box } from "@mui/material";
import { t } from "i18next";
import EvidenceItem from "@/features/questions/ui/footer/EvidenceItem";
import { DeleteConfirmationDialog } from "@common/dialogs/DeleteConfirmationDialog";

interface ConfirmDeleteDialogState {
  open: boolean;
  evidenceId: string | null;
  type: string | null;
}

interface EvidenceListProps {
  data: any[];
  deleteItemAndRefresh: (evidenceId: string, type: string) => Promise<any>;
  refreshTab: () => Promise<void>;
}

const INITIAL_DELETE_DIALOG_STATE: ConfirmDeleteDialogState = {
  open: false,
  evidenceId: null,
  type: null,
};

const EvidenceContainer: React.FC<EvidenceListProps> = ({
                                                     data: evidenceItems,
                                                     deleteItemAndRefresh,
                                                     refreshTab,
                                                     ...restProps
                                                   }) => {
  const [confirmDeleteDialog, setConfirmDeleteDialog] = useState<ConfirmDeleteDialogState>(
      INITIAL_DELETE_DIALOG_STATE
  );

  const handleConfirmDelete = async () => {
    const { evidenceId, type } = confirmDeleteDialog;

    if (!evidenceId || !type) {
      return;
    }

    const result = await deleteItemAndRefresh(evidenceId, type);

    if (result) {
      setConfirmDeleteDialog(INITIAL_DELETE_DIALOG_STATE);
    }
  };

  const handleCloseDialog = () => {
    setConfirmDeleteDialog((prev) => ({ ...prev, open: false }));
  };

  return (
      <Box sx={{ py: 2, px: 4 }}>
        {evidenceItems.map((item) => (
            <EvidenceItem
                key={item.id}
                {...item}
                {...restProps}
                setConfirmDeleteDialog={setConfirmDeleteDialog}
                refreshTab={refreshTab}
            />
        ))}

        <DeleteConfirmationDialog
            open={confirmDeleteDialog.open}
            onClose={handleCloseDialog}
            onConfirm={handleConfirmDelete}
            content={{
              category: t("questions.evidence"),
              title: "",
            }}
        />
      </Box>
  );
};

export default EvidenceContainer;