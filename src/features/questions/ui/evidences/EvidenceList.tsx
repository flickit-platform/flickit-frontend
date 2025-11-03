import React, { useState } from "react";
import EvidenceItem from "@/features/questions/ui/evidences/EvidenceItem";
import { DeleteConfirmationDialog } from "@common/dialogs/DeleteConfirmationDialog";
import { t } from "i18next";
import { Box } from "@mui/material";

const EvidenceList = (props: any) => {
  const { data: evidenceItems, deleteItemAndRefresh, refreshTab } = props
  const [confirmDeleteDialog, setConfirmDeleteDialog] = useState<{
    open: boolean;
    evidenceId: string | null;
    type: string | null
  }>({
    open: false,
    evidenceId: null,
    type: null
  });

  const handleConfirmDeleteDialog = async () => {
    const { evidenceId, type } = confirmDeleteDialog;
    if (!evidenceId || !type) return;
    const result = deleteItemAndRefresh(evidenceId, type)
    if(result){
      setConfirmDeleteDialog({
        open: false,
        evidenceId: null,
        type: null
      })
    }

  };

    return (
        <Box sx={{py: 2, px: 4}}>
          {evidenceItems. map((item: any) => {
            return <EvidenceItem key={item.id} {...item} refreshTab={refreshTab} setConfirmDeleteDialog={setConfirmDeleteDialog}/>
          })}
          <DeleteConfirmationDialog
            open={confirmDeleteDialog.open}
            onClose={() => setConfirmDeleteDialog((prev) => ({ ...prev, open: false }))}
            onConfirm={handleConfirmDeleteDialog}
            content={{
              category: t("questions.evidence"),
              title: ""
            }}
          />
        </Box>
    );
};

export default EvidenceList;