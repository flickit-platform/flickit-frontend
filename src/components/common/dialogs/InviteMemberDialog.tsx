import LoadingButton from "@mui/lab/LoadingButton";
import Button from "@mui/material/Button";
import Dialog, { DialogProps } from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Grid from "@mui/material/Grid";
import { PropsWithChildren, ReactElement } from "react";
import { Trans } from "react-i18next";
import { styles } from "@styles";
import useScreenResize from "@/hooks/useScreenResize";

interface ICEDialogProps extends Omit<DialogProps, "title"> {
  closeDialog?: () => void;
  title?: ReactElement;
  inviteButtonLabel?: string;
  loading?: boolean;
  onInvite: (...args: any) => any;
}

const InviteMemberDialog = (props: PropsWithChildren<ICEDialogProps>) => {
  const {
    onClose = () => {},
    closeDialog = onClose,
    title = <Trans i18nKey="common.inviteMember" />,
    children,
    inviteButtonLabel = "common.invite",
    onInvite,
    loading,
    ...rest
  } = props;
  const fullScreen = useScreenResize("sm");

  return (
    <Dialog
      onClose={closeDialog}
      fullWidth
      maxWidth="md"
      fullScreen={fullScreen}
      {...rest}
    >
      <DialogTitle textTransform={"uppercase"} sx={{ ...styles.centerV }}>
        {title}
      </DialogTitle>
      <DialogContent sx={{ display: "flex", flexDirection: "column" }}>
        {children}
      </DialogContent>
      <DialogActions
        sx={{
          marginTop: fullScreen ? "auto" : 4,
        }}
      >
        <Grid container spacing={2} justifyContent="flex-end">
          <Grid>
            <LoadingButton
              type="submit"
              variant="contained"
              loading={loading}
              onClick={(e: any) => {
                e.preventDefault();
                onInvite?.(e);
              }}
            >
              <Trans i18nKey={inviteButtonLabel as string} />
            </LoadingButton>
          </Grid>
          <Grid>
            <Button onClick={closeDialog as any}>
              <Trans i18nKey="common.cancel" />
            </Button>
          </Grid>
        </Grid>
      </DialogActions>
    </Dialog>
  );
};

export default InviteMemberDialog;
