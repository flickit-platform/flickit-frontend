import { Trans, useTranslation } from "react-i18next";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Skeleton from "@mui/material/Skeleton";
import TextField from "@mui/material/TextField";
import Snackbar from "@mui/material/Snackbar";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Share from "@mui/icons-material/Share";
import LinkIcon from "@mui/icons-material/Link";
import { CEDialog, CEDialogActions } from "../common/dialogs/CEDialog";
import { useEffect, useState } from "react";
import { styles } from "@/config/styles";
import LoadingButton from "@mui/lab/LoadingButton";
import stringAvatar from "@/utils/stringAvatar";
import { useQuery } from "@/utils/useQuery";
import { useParams } from "react-router-dom";
import { useServiceContext } from "@/providers/ServiceProvider";
import toastError from "@/utils/toastError";
import { ICustomError } from "@/utils/CustomError";
import QueryBatchData from "../common/QueryBatchData";

interface IDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  fetchGraphicalReportUsers: any;
}

export const ShareDialog = ({
  open,
  onClose,
  title,
  fetchGraphicalReportUsers,
}: IDialogProps) => {
  const { t } = useTranslation();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [value, setValue] = useState("");
  const { assessmentId = "" } = useParams();
  const { service } = useServiceContext();

  const grantReportAccess = useQuery({
    service: (args, config) => service.assessments.member.grantReportAccess(args, config),
    runOnMount: false,
  });

  useEffect(() => {
    if (open) {
      fetchGraphicalReportUsers.query();
    }
  }, [open]);

  const handleAddClick = async () => {
    try {
      await grantReportAccess
        .query({
          email: value,
          assessmentId,
        })
        .then(() => {
          fetchGraphicalReportUsers.query();
          setValue("");
        });
    } catch (error) {
      const err = error as ICustomError;
      toastError(err);
    }
  };

  const handleCopyClick = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setSnackbarOpen(true);
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <CEDialog
      open={open}
      onClose={onClose}
      title={
        <>
          <Share />
          <Trans i18nKey="shareReport" values={{ title }} />
        </>
      }
      maxWidth="sm"
    >
      <Grid
        container
        display="flex"
        alignItems="center"
        sx={{ ...styles.formGrid }}
      >
        <Grid item xs={9.7}>
          <TextField
            placeholder={t("shareReportViaEmail").toString()}
            label={<Trans i18nKey="email" />}
            name="value"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            fullWidth
            size="small"
          />
        </Grid>
        <Grid item xs={0.5}></Grid>
        <Grid item xs={1.8}>
          <LoadingButton variant="contained" onClick={handleAddClick}>
            <Trans i18nKey="add" />
          </LoadingButton>
        </Grid>
      </Grid>
      <Box sx={{ my: 2 }}>
        <Typography variant="bodyMedium" color="disabled">
          <Trans i18nKey="onlyThesePeopleHaveAccess" />
        </Typography>
        <Divider sx={{ mt: 1 }} />
      </Box>
      <QueryBatchData
        queryBatchData={[fetchGraphicalReportUsers]}
        renderLoading={() => {
          return (
            <>
              {[1, 2, 3].map((number) => {
                return (
                  <Skeleton
                    key={number}
                    variant="rectangular"
                    sx={{ borderRadius: 2, height: "30px", mb: 1 }}
                  />
                );
              })}
            </>
          );
        }}
        render={([graphicalReportUsers]) => {
          return (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {[
                ...graphicalReportUsers.users,
                ...graphicalReportUsers.invitees,
              ].map((member: any) => {
                const { displayName, id, pictureLink, email } = member;
                return (
                  <Box
                    key={id}
                    sx={{
                      ...styles.centerV,
                      gap: 1,
                    }}
                  >
                    <Avatar
                      {...stringAvatar(displayName?.toUpperCase())}
                      src={pictureLink}
                      sx={{ width: 24, height: 24, fontSize: 12 }}
                    ></Avatar>
                    {email}
                    {graphicalReportUsers.invitees.includes(member) && (
                      <Chip label={t("invited")} size="small" />
                    )}
                  </Box>
                );
              })}
            </Box>
          );
        }}
      />
      <CEDialogActions
        type="delete"
        loading={false}
        onClose={onClose}
        hideSubmitButton
        hideCancelButton
      >
        <LoadingButton
          startIcon={<LinkIcon fontSize="small" />}
          onClick={handleCopyClick}
        >
          <Trans i18nKey="copyReportLink" />
        </LoadingButton>

        <LoadingButton variant="contained" onClick={onClose} sx={{ mx: 1 }}>
          <Trans i18nKey="close" />
        </LoadingButton>
      </CEDialogActions>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        message={t("linkCopied")}
      />
    </CEDialog>
  );
};
