import { PropsWithChildren } from "react";
import { styles } from "@styles";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import useScreenResize from "@utils/useScreenResize";
import Dialog, { DialogProps } from "@mui/material/Dialog";
import DialogActions, { DialogActionsProps } from "@mui/material/DialogActions";
import Grid from "@mui/material/Grid";
import LoadingButton from "@mui/lab/LoadingButton";
import Button from "@mui/material/Button";
import { Trans } from "react-i18next";
import { TDialogContextType } from "@/types/index";
import { t } from "i18next";
import { Box, IconButton } from "@mui/material";
import { Close } from "@mui/icons-material";

interface ICEDialogProps extends Omit<DialogProps, "title"> {
  closeDialog?: () => void;
  title: JSX.Element | null;
  style?: any;
  titleStyle?: any;
  contentStyle?: any;
}

export const CEDialog = (props: PropsWithChildren<ICEDialogProps>) => {
  const {
    closeDialog,
    title,
    children,
    style,
    titleStyle,
    contentStyle,
    ...rest
  } = props;
  const fullScreen = useScreenResize("sm");

  return (
    <Dialog
      onClose={closeDialog}
      fullWidth
      maxWidth="md"
      data-testid="delete-confirmation-modal"
      fullScreen={fullScreen}
      {...rest}
    >
      {title && (
        <DialogTitle
          justifyContent="space-between"
          sx={{
            ...styles.centerV,
            ...titleStyle,
          }}
        >
          <Box sx={{ ...styles.centerVH }}>{title}</Box>
          <IconButton
            aria-label="close"
            onClick={closeDialog}
            edge="end"
            size="small"
            sx={{ ml: 2, color: "primary.contrastText" }}
            data-testid="close-btn"
          >
            <Close />
          </IconButton>
        </DialogTitle>
      )}
      <DialogContent
        style={style}
        sx={{ display: "flex", flexDirection: "column", ...contentStyle }}
      >
        {children}
      </DialogContent>
    </Dialog>
  );
};

interface ICEDialogActionsProps extends PropsWithChildren<DialogActionsProps> {
  loading?: boolean;
  closeDialog?: () => void;
  onClose?: () => void;
  type?: {} | TDialogContextType;
  submitButtonLabel?: string | null;
  submitAndViewButtonLabel?: string;
  hasViewBtn?: boolean;
  hideSubmitButton?: boolean;
  hideCancelButton?: boolean;
  onSubmit?: (e: any, shouldView?: boolean) => any;
  onBack?: () => void;
  hasBackBtn?: boolean;
  backType?: any;
  cancelLabel?: string | null;
  disablePrimaryButton?: boolean;
  hasContinueBtn?: boolean;
}

export const CEDialogActions = (props: ICEDialogActionsProps) => {
  const {
    type,
    loading,
    closeDialog,
    onClose = closeDialog,
    onSubmit,
    onBack,
    hasBackBtn,
    hasViewBtn,
    hideSubmitButton = false,
    hideCancelButton = false,
    submitButtonLabel = type === "update"
      ? t("common.update")
      : t("common.create"),
    cancelLabel = "common.cancel",
    submitAndViewButtonLabel,
    backType = "contained",
    disablePrimaryButton = false,
    hasContinueBtn,
    children,
  } = props;
  const fullScreen = useScreenResize("sm");
  if (!onClose) {
    throw new Error("onClose or closeDialog not provided for CEDialogActions");
  }

  return (
    <DialogActions
      sx={{
        flexDirection: { xs: "column", sm: "row" },
        gap: { xs: 4, sm: "unset" },
        marginTop: fullScreen ? "auto" : 3,
        marginLeft: 0,
        fontFamily: "inherit",
      }}
    >
      <Grid container spacing={2} justifyContent="flex-end">
        {!hideCancelButton && (
          <Grid item>
            <Button
              onClick={onClose}
              data-cy="cancel"
              data-testid="cancel"
              sx={{ fontFamily: "inherit" }}
            >
              <Trans i18nKey={cancelLabel ?? ""} />
            </Button>
          </Grid>
        )}
        {hasBackBtn && (
          <Grid item>
            <Button data-cy="back" variant={backType} onClick={onBack}>
              <Trans i18nKey="common.back" />
            </Button>
          </Grid>
        )}
        {!hideSubmitButton && (
          <Grid item>
            <LoadingButton
              data-testid="submit"
              type="submit"
              data-cy="submit"
              variant="contained"
              loading={loading}
              onClick={(e: any) => {
                if (hasContinueBtn) {
                  onClose();
                }
                e.preventDefault();
                onSubmit?.(e);
              }}
              sx={{ fontFamily: "inherit" }}
              disabled={disablePrimaryButton}
            >
              <Trans i18nKey={submitButtonLabel as string} />
            </LoadingButton>
          </Grid>
        )}
        {hasViewBtn && (
          <Grid item>
            <LoadingButton
              data-testid="submit-and-view"
              type="submit"
              variant="contained"
              color="success"
              loading={loading}
              data-cy="submit-and-view"
              onClick={(e: any) => {
                e.preventDefault();
                onSubmit?.(e, true);
              }}
            >
              {submitAndViewButtonLabel ?? (
                <Trans
                  i18nKey={`${submitButtonLabel} ${t("common.andView")}`}
                />
              )}
            </LoadingButton>
          </Grid>
        )}
        {hasContinueBtn && (
          <Grid item>
            <LoadingButton
              data-testid="submit-and-countinue"
              type="submit"
              variant="contained"
              loading={loading}
              data-cy="submit-and-countinue"
              onClick={(e: any) => {
                e.preventDefault();
                onSubmit?.(e, true);
              }}
              disabled={disablePrimaryButton}
            >
              <Trans
                i18nKey={`${submitButtonLabel} ${t("common.andContinue")}`}
              />
            </LoadingButton>
          </Grid>
        )}
        {children && <Grid item>{children}</Grid>}
      </Grid>
    </DialogActions>
  );
};
