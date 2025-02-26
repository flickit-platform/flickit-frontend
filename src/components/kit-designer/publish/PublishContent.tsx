import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import PermissionControl from "../../common/PermissionControl";
import { Trans } from "react-i18next";
import { useServiceContext } from "@/providers/ServiceProvider";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ICustomError } from "@/utils/CustomError";
import toastError from "@/utils/toastError";
import { IKitVersion } from "@/types";
import { DeleteConfirmationDialog } from "@/components/common/dialogs/DeleteConfirmationDialog";
import { useState } from "react";
import { Tooltip } from "@mui/material";
import { useQuery } from "@/utils/useQuery";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import CircularProgress from "@mui/material/CircularProgress";

const PublishContent = ({ kitVersion }: { kitVersion: IKitVersion }) => {
  const { service } = useServiceContext();
  const { kitVersionId = "", expertGroupId } = useParams();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const navigate = useNavigate();

  const handlePublish = async () => {
    try {
      const data = { kitVersionId };
      await service.activateKit({ kitVersionId }, data, undefined);
    } catch (e) {
      const err = e as ICustomError;
      toastError(err);
    }
  };

  const validateKitVersion = useQuery({
    service: (args = { kitVersionId }, config) =>
      service.validateKitVersion(args, config),
  });

  const handleDeleteDraft = async () => {
    try {
      await service.deleteKitVersion({ kitVersionId });
      navigate(`/user/expert-groups/${expertGroupId}/`);
    } catch (e) {
      const err = e as ICustomError;
      toastError(err);
    }
  };

  return (
    <PermissionControl>
      <>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="headlineSmall" fontWeight="bold">
            <Trans i18nKey="release" />
          </Typography>
        </Box>
        <Typography variant="bodyMedium">
          <Trans i18nKey="publishDescription" />
        </Typography>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mt={4}
        >
          <Typography variant="headlineSmall" fontWeight="bold">
            <Trans i18nKey="validation" />
          </Typography>
        </Box>
        <Divider sx={{ my: 1 }} />
        <Box
          mt={2}
          p={2}
          bgcolor={
            validateKitVersion.loading
              ? "grey.200"
              : validateKitVersion?.data?.isValid
                ? "color(srgb 0.9502 0.995 0.9804)"
                : "color(srgb 0.9959 0.9514 0.9609)"
          }
          borderRadius={1}
          color={
            validateKitVersion.loading
              ? "text.primary"
              : validateKitVersion?.data?.isValid
                ? "color(srgb 0.4176 0.72 0.6025)"
                : "color(srgb 0.7198 0.4168 0.4683)"
          }
          maxHeight={500}
          overflow="auto"
        >
          {validateKitVersion.loading ? (
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              gap={1}
            >
              <CircularProgress size={24} />
              <Typography variant="bodyMedium">
                <Trans i18nKey="loading" />
              </Typography>
            </Box>
          ) : validateKitVersion?.data?.isValid ? (
            <Box
              display="flex"
              alignItems="center"
              gap={1}
              color="color(srgb 0.4176 0.72 0.6025)"
            >
              <CheckCircleIcon color="inherit" />
              <Typography variant="bodyMedium">
                <Trans i18nKey="kitValidated" />{" "}
              </Typography>
            </Box>
          ) : (
            <>
              <Box
                display="flex"
                alignItems="center"
                gap={1}
                color="color(srgb 0.7198 0.4168 0.4683)"
              >
                <ErrorIcon color="inherit" />
                <Typography variant="bodyMedium" fontWeight="bold">
                  <Trans i18nKey="kitErrorsTitle" />{" "}
                </Typography>
              </Box>
              <ul>
                {validateKitVersion?.data?.errors.map((error: string) => (
                  <li key={error}>
                    <Typography variant="bodyMedium">{error}</Typography>
                  </li>
                ))}
              </ul>
            </>
          )}
        </Box>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mt={2}
        >
          <Box display="flex" gap={2}>
            <Button
              color="secondary"
              variant="outlined"
              onClick={() => setDeleteDialogOpen(true)}
            >
              <Trans i18nKey="deleteDraft" />
            </Button>
            <Tooltip title={<Trans i18nKey="releaseNote" />}>
              <Button
                variant="outlined"
                component={Link}
                to={`/user/expert-groups/${expertGroupId}/`}
              >
                <Trans i18nKey="close" />
              </Button>
            </Tooltip>
          </Box>
          <Tooltip
            disableHoverListener={validateKitVersion?.data?.isValid}
            title={<Trans i18nKey="validateReleaseTooltip" />}
          >
            <div>
              <Button
                disabled={!validateKitVersion?.data?.isValid}
                variant="contained"
                onClick={handlePublish}
                component={Link}
                to={`/user/expert-groups/${expertGroupId}/assessment-kits/${kitVersion.assessmentKit.id}`}
              >
                <Trans i18nKey="release" />
              </Button>
            </div>
          </Tooltip>
        </Box>
        <DeleteConfirmationDialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          onConfirm={handleDeleteDraft}
          title="warning"
          content="deleteDraftConfirmationMessage"
        />
      </>
    </PermissionControl>
  );
};

export default PublishContent;
