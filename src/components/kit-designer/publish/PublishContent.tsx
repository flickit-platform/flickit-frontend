import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import PermissionControl from "../../common/PermissionControl";
import { Trans, useTranslation } from "react-i18next";
import { useServiceContext } from "@/providers/service-provider";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ICustomError } from "@/utils/custom-error";
import { IKitVersion } from "@/types/index";
import { DeleteConfirmationDialog } from "@/components/common/dialogs/DeleteConfirmationDialog";
import { useState } from "react";
import Tooltip from "@mui/material/Tooltip";
import { useQuery } from "@/hooks/useQuery";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import CircularProgress from "@mui/material/CircularProgress";
import showToast from "@/utils/toast-error";
import { styles } from "@styles";
import { Text } from "@/components/common/Text";
import useDialog from "@/hooks/useDialog";

const PublishContent = ({ kitVersion }: { kitVersion: IKitVersion }) => {
  const { service } = useServiceContext();
  const { kitVersionId = "", expertGroupId } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const deleteDialogProps = useDialog();
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
          <Text variant="headlineSmall" fontWeight="bold">
            <Trans i18nKey="kitDesigner.release" />
          </Text>
        </Box>
        <Text variant="bodyMedium">
          <Trans i18nKey="kitDesigner.publishDescription" />
        </Text>
        <Box justifyContent="space-between" mt={4} sx={{ ...styles.centerV }}>
          <Text variant="headlineSmall" fontWeight="bold">
            <Trans i18nKey="common.validation" />
          </Text>
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
              <Text variant="bodyMedium">
                <Trans i18nKey="common.loading" />
              </Text>
            </Box>
          ) : validateKitVersion?.data?.isValid ? (
            <Box
              gap={1}
              color="color(srgb 0.4176 0.72 0.6025)"
              sx={{ ...styles.centerV }}
            >
              <CheckCircleIcon color="inherit" />
              <Text variant="bodyMedium">
                <Trans i18nKey="kitDesigner.kitValidated" />{" "}
              </Text>
            </Box>
          ) : (
            <>
              <Box
                gap={1}
                color="color(srgb 0.7198 0.4168 0.4683)"
                sx={{ ...styles.centerV }}
              >
                <ErrorIcon color="inherit" />
                <Text variant="bodyMedium" fontWeight="bold">
                  <Trans i18nKey="kitDesigner.kitErrorsTitle" />{" "}
                </Text>
              </Box>
              <ul>
                {validateKitVersion?.data?.errors.map((error: string) => (
                  <li key={error}>
                    <Text variant="bodyMedium">{error}</Text>
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
              onClick={deleteDialogProps.openDialog}
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
          {...deleteDialogProps}
          onConfirm={handleDeleteDraft}
          content={{
            category: t("common.draft"),
          }}
        />
      </>
    </PermissionControl>
  );
};

export default PublishContent;
