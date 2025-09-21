import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { ICustomError } from "@/utils/custom-error";
import { useQuery } from "@/hooks/useQuery";
import { useServiceContext } from "@/providers/service-provider";
import { Trans } from "react-i18next";
import Warning from "@mui/icons-material/Warning";
import showToast from "@/utils/toast-error";
import { CEDialog } from "@/components/common/dialogs/CEDialog";

const ConfirmRemoveMemberDialog = (props: any) => {
  const {
    expandedRemoveDialog,
    onCloseRemoveDialog,
    assessmentId,
    assessmentName,
    setChangeData,
    inviteesMemberList,
  } = props;

  const { service } = useServiceContext();

  const deleteUserRole = useQuery({
    service: (args, config) =>
      service.assessments.member.removeUserRole({ assessmentId, args }, config),
    runOnMount: false,
  });

  const RemoveMembersInvitees = useQuery({
    service: (args, config) =>
      service.assessments.member.removeInvitee(
        args ?? { invitedId: "" },
        config,
      ),
    runOnMount: false,
  });

  const DeletePerson = async () => {
    try {
      if (expandedRemoveDialog.invited) {
        const invitedId = expandedRemoveDialog.id;
        await RemoveMembersInvitees.query({ invitedId });
        await inviteesMemberList.query();
        onCloseRemoveDialog();
      } else {
        await deleteUserRole.query(expandedRemoveDialog?.id);
        onCloseRemoveDialog();
        setChangeData((prev: boolean) => !prev);
      }
    } catch (e) {
      const err = e as ICustomError;
      showToast(err);
    }
  };

  return (
    <CEDialog
      open={expandedRemoveDialog.display}
      closeDialog={onCloseRemoveDialog}
      maxWidth={"sm"}
      fullWidth
      sx={{
        ".MuiDialog-paper::-webkit-scrollbar": {
          display: "none",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        },
      }}
      title={
        <>
          <Warning
            sx={{
              marginInlineStart: "unset",
              marginInlineEnd: 1,
            }}
          />
          <Trans i18nKey="common.warning" />
        </>
      }
    >
      <Typography color="#0A2342">
        {expandedRemoveDialog.invited ? (
          <Trans
            i18nKey="settings.areYouSureYouWantDeleteThisMemberInvited"
            values={{
              name: expandedRemoveDialog?.name,
            }}
          />
        ) : (
          <Trans
            i18nKey="settings.areYouSureYouWantDeleteThisMember"
            values={{
              name: expandedRemoveDialog?.name,
              assessment: assessmentName,
            }}
          />
        )}
      </Typography>

      <Box mt={2} alignSelf="flex-end" sx={{ display: "flex", gap: 2 }}>
        <Button onClick={onCloseRemoveDialog}>
          <Trans i18nKey="common.cancel" />
        </Button>
        <Button variant="contained" onClick={DeletePerson}>
          <Trans i18nKey="common.confirm" />
        </Button>
      </Box>
    </CEDialog>
  );
};

export default ConfirmRemoveMemberDialog;
