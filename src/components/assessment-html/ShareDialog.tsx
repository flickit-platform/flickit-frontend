import { Trans, useTranslation } from "react-i18next";
import {
  Avatar,
  Box,
  Grid,
  Skeleton,
  TextField,
  Snackbar,
  Divider,
  Typography,
} from "@mui/material";
import { Share, Link as LinkIcon } from "@mui/icons-material";
import { CEDialog, CEDialogActions } from "../common/dialogs/CEDialog";
import { useEffect, useState } from "react";
import { styles } from "@/config/styles";
import { LoadingButton } from "@mui/lab";
import QueryData from "../common/QueryData";
import stringAvatar from "@/utils/stringAvatar";
import { useQuery } from "@/utils/useQuery";
import { Link, useParams } from "react-router-dom";
import { useServiceContext } from "@/providers/ServiceProvider";

interface IDialogProps {
  open: boolean;
  onClose: () => void;
  fetchData: any;
  title: string;
}

export const ShareDialog = ({
  open,
  onClose,
  fetchData,
  title,
}: IDialogProps) => {
  const { t } = useTranslation();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [value, setValue] = useState("");
  const { assessmentId = "" } = useParams();
  const { service } = useServiceContext();

  const inviteMemberToAssessment = useQuery({
    service: (args, config) => service.inviteMemberToAssessment(args, config),
    runOnMount: false,
  });

  useEffect(() => {
    if (open) {
      fetchData.query();
    }
  }, [open]);

  const handleAddClick = async () => {
    await inviteMemberToAssessment
      .query({
        email: value,
        assessmentId,
        roleId: 0,
      })
      .then(() => {
        fetchData.query();
        setValue("");
      });
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
          <Trans i18nKey="shareReportWithTitle" values={{ title }} />
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
      <QueryData
        {...fetchData}
        renderLoading={() => {
          return (
            <>
              {[1, 2, 3].map((item) => {
                return (
                  <Skeleton
                    key={item}
                    variant="rectangular"
                    sx={{ borderRadius: 2, height: "30px", mb: 1 }}
                  />
                );
              })}
            </>
          );
        }}
        render={(data) => {
          const { items } = data;
          return (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {items.map((member: any) => {
                const { displayName, id, pictureLink, email } = member;
                return (
                  displayName && (
                    <Box
                      key={id}
                      sx={{
                        ...styles.centerV,
                        gap: 1,
                      }}
                    >
                      <Avatar
                        {...stringAvatar(displayName.toUpperCase())}
                        src={pictureLink}
                        sx={{ width: 24, height: 24, fontSize: 12 }}
                      ></Avatar>

                      {email}
                    </Box>
                  )
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
