import React, { useState } from "react";
import EvidenceItem from "@/features/questions/ui/evidences/EvidenceItem";
import { DeleteConfirmationDialog } from "@common/dialogs/DeleteConfirmationDialog";
import { t } from "i18next";
import showToast from "@utils/toast-error";
import { ICustomError } from "@utils/custom-error";
import { Box } from "@mui/material";

const EvidenceList = (props: any) => {
  const { data: evidenceItems, deleteEvidence, setCacheData, evidencesQueryData, commentesQueryData } = props

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
    try {
      await deleteEvidence.query({ id: evidenceId });
      setConfirmDeleteDialog({ open: false, evidenceId: null, type: null });
      setCacheData((prev: any) => ({
        ...prev,
        [type]: prev[type]?.filter((item: any) => item.id !== evidenceId) ?? [],
      }));
      const queryMap: Record<string, any> = {
        evidence: evidencesQueryData,
        comments: commentesQueryData,
      };

      const queryToRun = queryMap[type];
      if (queryToRun) {
        await queryToRun.query();
      }
    } catch (e) {
      const err = e as ICustomError;
      showToast(err);
    }
  };

    return (
        <Box>
          {evidenceItems. map((item: any) => {
            return <EvidenceItem key={item.id} {...item} setConfirmDeleteDialog={setConfirmDeleteDialog}/>
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