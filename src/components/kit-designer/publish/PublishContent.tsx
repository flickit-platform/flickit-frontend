import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import PermissionControl from "../../common/PermissionControl";
import { Trans } from "react-i18next";
import { useServiceContext } from "@/providers/ServiceProvider";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ICustomError } from "@/utils/CustomError";
import { IKitVersion } from "@/types/index";
import { DeleteConfirmationDialog } from "@/components/common/dialogs/DeleteConfirmationDialog";
import { useState } from "react";
import Tooltip from "@mui/material/Tooltip";
import { useQuery } from "@/utils/useQuery";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import CircularProgress from "@mui/material/CircularProgress";
import languageDetector from "@utils/languageDetector";
import { farsiFontFamily, primaryFontFamily } from "@config/theme";
import showToast from "@/utils/toastError";
import { styles } from "@styles";

const PublishContent = ({ kitVersion }: { kitVersion: IKitVersion }) => {
  const { service } = useServiceContext();
  const { kitVersionId = "", expertGroupId } = useParams();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const navigate = useNavigate();

  const handlePublish = async () => {
    try {
      const data = { kitVersionId };
      await service.kitVersions.info.activate(
        { kitVersionId },
        data,
        undefined,
      );
    } catch (e) {
      const err = e as ICustomError;
      showToast(err);
    }
  };

  const validateKitVersion = useQuery({
    service: (args, config) =>
      service.kitVersions.info.validate(args ?? { kitVersionId }, config),
  });

  const handleDeleteDraft = async () => {
    try {
      await service.kitVersions.info.remove({ kitVersionId });
      navigate(`/user/expert-groups/${expertGroupId}/`);
    } catch (e) {
      const err = e as ICustomError;
      showToast(err);
    }
  };

  return (
    <PermissionControl>
      <>
        <Box justifyContent="space-between" sx={{ ...styles.centerV }}>
          <Typography variant="headlineSmall" fontWeight="bold">
            <Trans i18nKey="kitDesigner.release" />
          </Typography>
        </Box>
        <Typography variant="bodyMedium">
          <Trans i18nKey="kitDesigner.publishDescription" />
        </Typography>
        <Box justifyContent="space-between" mt={4} sx={{ ...styles.centerV }}>
          <Typography variant="headlineSmall" fontWeight="bold">
            <Trans i18nKey="common.validation" />
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
            <Box gap={1} sx={{ ...styles.centerVH }}>
              <CircularProgress size={24} />
              <Typography variant="bodyMedium">
                <Trans i18nKey="common.loading" />
              </Typography>
            </Box>
          ) : validateKitVersion?.data?.isValid ? (
            <Box
              gap={1}
              color="color(srgb 0.4176 0.72 0.6025)"
              sx={{ ...styles.centerV }}
            >
              <CheckCircleIcon color="inherit" />
              <Typography variant="bodyMedium">
                <Trans i18nKey="kitDesigner.kitValidated" />{" "}
              </Typography>
            </Box>
          ) : (
            <>
              <Box
                gap={1}
                color="color(srgb 0.7198 0.4168 0.4683)"
                sx={{ ...styles.centerV }}
              >
                <ErrorIcon color="inherit" />
                <Typography variant="bodyMedium" fontWeight="bold">
                  <Trans i18nKey="kitDesigner.kitErrorsTitle" />{" "}
                </Typography>
              </Box>
              <ul>
                {validateKitVersion?.data?.errors.map((error: string) => (
                  <li key={error}>
                    <Typography
                      variant="bodyMedium"
                      sx={{
                        fontFamily: languageDetector(error)
                          ? farsiFontFamily
                          : primaryFontFamily,
                      }}
                    >
                      {error}
                    </Typography>
                  </li>
                ))}
              </ul>
            </>
          )}
        </Box>
        <Box justifyContent="space-between" mt={2} sx={{ ...styles.centerV }}>
          <Box display="flex" gap={2}>
            <Button
              color="secondary"
              variant="outlined"
              onClick={() => setDeleteDialogOpen(true)}
            >
              <Trans i18nKey="kitDesigner.deleteDraft" />
            </Button>
            <Tooltip title={<Trans i18nKey="kitDesigner.releaseNote" />}>
              <Button
                variant="outlined"
                component={Link}
                to={`/user/expert-groups/${expertGroupId}/`}
              >
                <Trans i18nKey="common.close" />
              </Button>
            </Tooltip>
          </Box>
          <Tooltip
            disableHoverListener={validateKitVersion?.data?.isValid}
            title={<Trans i18nKey="kitDesigner.validateReleaseTooltip" />}
          >
            <div>
              <Button
                disabled={!validateKitVersion?.data?.isValid}
                variant="contained"
                onClick={handlePublish}
                component={Link}
                to={`/user/expert-groups/${expertGroupId}/assessment-kits/${kitVersion.assessmentKit.id}`}
              >
                <Trans i18nKey="kitDesigner.release" />
              </Button>
            </div>
          </Tooltip>
        </Box>
        <DeleteConfirmationDialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          onConfirm={handleDeleteDraft}
          title="common.warning"
          content="kitDesigner.deleteDraftConfirmationMessage"
        />
      </>
    </PermissionControl>
  );
};

export default PublishContent;
