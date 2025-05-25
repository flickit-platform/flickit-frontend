import { Trans, useTranslation } from "react-i18next";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Skeleton from "@mui/material/Skeleton";
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
import IconButton from "@mui/material/IconButton";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import useMenu from "@/utils/useMenu";
import { Menu, MenuItem, Tooltip } from "@mui/material";
import {
  ArrowDropDown,
  ArrowDropUp,
  Check,
  Language,
} from "@mui/icons-material";
import { t } from "i18next";
import { VISIBILITY } from "@/utils/enumType";
import { IUserPermissions } from "@/types";
import { FormProvider, useForm } from "react-hook-form";
import { InputFieldUC } from "../common/fields/InputField";

interface IDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  fetchGraphicalReportUsers: any;
  visibility: VISIBILITY;
  permissions: IUserPermissions;
}

const accessOptions = {
  [VISIBILITY.RESTRICTED]: {
    title: t("accessRestricted"),
    titleMenu: t("accessRestricted"),
    description: t("accessRestrictedDescription"),
    icon: <LockOutlinedIcon />,
    bgColor: "#E2E5E9",
  },
  [VISIBILITY.PUBLIC]: {
    title: t("accessAnyone"),
    titleMenu: t("accessAnyoneWithLink"),
    description: t("accessAnyoneDescription"),
    icon: <Language />,
    bgColor: "#D5E5F6",
  },
};

export const ShareDialog = ({
  open,
  onClose,
  title,
  fetchGraphicalReportUsers,
  visibility,
  permissions,
}: IDialogProps) => {
  const { t } = useTranslation();
  const { assessmentId = "", linkHash = "" } = useParams();
  const { service } = useServiceContext();
  const { open: menuOpened, openMenu, closeMenu, anchorEl } = useMenu();
  const [access, setAccess] = useState<VISIBILITY>(visibility);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const methods = useForm();
  const { reset, handleSubmit } = methods;

  const getBasePath = (path: string): string => {
    const baseRegex = /^(.*\/graphical-report)(?:\/.*)?$/;
    const baseMatch = baseRegex.exec(path);
    return baseMatch?.[1]
      ? baseMatch[1] + "/"
      : path.endsWith("/")
        ? path
        : path + "/";
  };

  const PublishReportStatus = useQuery({
    service: (args, config) =>
      service.assessments.report.updateVisibilityStatus(args, config),
    runOnMount: false,
  });

  const handleSelect = async (newAccess: VISIBILITY) => {
    try {
      const response = await PublishReportStatus.query({
        data: { visibility: newAccess },
        assessmentId,
      });
      const currentPath = window.location.pathname;
      const basePath = getBasePath(currentPath);
      let finalPath = basePath;

      if (newAccess === VISIBILITY.PUBLIC && response?.linkHash) {
        const expectedPath = `${basePath}${response.linkHash}/`;
        if (currentPath !== expectedPath) finalPath = expectedPath;
      }

      if (window.location.pathname !== finalPath)
        window.history.pushState({}, "", finalPath);
    } catch (error) {
      toastError(error as ICustomError);
    }

    setAccess(newAccess);
    closeMenu();
  };

  const grantReportAccess = useQuery({
    service: (args, config) =>
      service.assessments.member.grantReportAccess(args, config),
    runOnMount: false,
  });

  useEffect(() => {
    if (open) {
      fetchGraphicalReportUsers.query();
      reset();
      const currentPath = window.location.pathname;
      const basePath = getBasePath(currentPath);

      if (access === VISIBILITY.PUBLIC) {
        PublishReportStatus.query({
          data: { visibility: VISIBILITY.PUBLIC },
          assessmentId,
        }).then((response) => {
          const newPath = `${basePath}${response?.linkHash}/`;
          window.history.pushState({}, "", newPath);
        });
      }
    }
  }, [open]);

  const onSubmit = async (data: any) => {
    try {
      await grantReportAccess.query({ email: data.email, assessmentId });
      fetchGraphicalReportUsers.query();
      reset();
    } catch (error) {
      toastError(error as ICustomError);
    }
  };

  const handleCopyClick = async () => {
    try {
      navigator.clipboard.writeText(window.location.href);
      setSnackbarOpen(true);
    } catch (error) {
      toastError(error as ICustomError);
    }
  };

  const handleCloseSnackbar = () => setSnackbarOpen(false);
  const current = accessOptions[access];

  return (
    <CEDialog
      open={open}
      onClose={onClose}
      title={
        <Box sx={{ ...styles.centerV, gap: 1 }}>
          <Share />
          <Trans i18nKey="shareReportWithTitle" values={{ title }} />
        </Box>
      }
      maxWidth="sm"
    >
      {access === VISIBILITY.RESTRICTED && permissions.canShareReport && (
        <>
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid
                container
                display="flex"
                alignItems="flex-start"
                sx={{ ...styles.formGrid }}
              >
                <Grid item xs={9.7}>
                  <InputFieldUC
                    name="email"
                    size="small"
                    placeholder={t("shareReportViaEmail") ?? ""}
                    fullWidth
                    required
                  />
                </Grid>
                <Grid item xs={0.5}></Grid>
                <Grid item xs={1.8}>
                  <LoadingButton variant="contained" type="submit">
                    <Trans i18nKey="add" />
                  </LoadingButton>
                </Grid>
              </Grid>
            </form>
          </FormProvider>

          <Box sx={{ mt: 3 }}>
            <Typography variant="bodyMedium" color="rgba(61, 77, 92, 0.5)">
              <Trans i18nKey="peopleWithAccess" />
            </Typography>
            <Divider sx={{ my: 1 }} />
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
        </>
      )}

      <Box sx={{ mt: 3 }}>
        <Typography variant="bodyMedium" color="rgba(61, 77, 92, 0.5)">
          <Trans i18nKey="accessStatus" />
        </Typography>
        <Divider sx={{ mt: 1 }} />
      </Box>
      <Tooltip
        disableHoverListener={permissions.canManageVisibility}
        title={<Trans i18nKey="youDontHavePermission" />}
      >
        <div>
          <Box
            mt={1}
            sx={{
              ...styles.centerV,
              gap: 1,
              pointerEvents: permissions.canManageVisibility ? "auto" : "none",
            }}
          >
            <IconButton
              color={access === VISIBILITY.PUBLIC ? "primary" : "default"}
              sx={{
                backgroundColor: current?.bgColor,
                marginInlineEnd: 1,
              }}
              size="small"
              onClick={openMenu}
            >
              {current?.icon}
            </IconButton>

            <Box>
              <Typography
                onClick={openMenu}
                sx={{
                  ...styles.centerV,
                  cursor: permissions.canManageVisibility
                    ? "pointer"
                    : "default",
                  gap: 1,
                  color: permissions.canManageVisibility ? "unset" : "#B0B0B0",
                }}
                variant="semiBoldMedium"
              >
                {current?.title}
                {permissions.canManageVisibility && (
                  <>
                    {menuOpened ? (
                      <ArrowDropUp sx={{ color: "#6C8093" }} />
                    ) : (
                      <ArrowDropDown sx={{ color: "#6C8093" }} />
                    )}
                  </>
                )}
              </Typography>

              <Typography variant="bodySmall" color="#6C8093">
                {current?.description}
              </Typography>
            </Box>

            <Menu
              anchorEl={anchorEl}
              open={menuOpened}
              onClose={closeMenu}
              disablePortal={!permissions.canManageVisibility}
            >
              {Object.values(VISIBILITY).map((key) => {
                const isSelected = access === key;
                return (
                  <MenuItem
                    key={key}
                    selected={isSelected}
                    onClick={() => handleSelect(key)}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      flexDirection: "row",
                      gap: 2,
                    }}
                  >
                    <Typography variant="bodyMedium">
                      {accessOptions[key].titleMenu}
                    </Typography>
                    {isSelected && (
                      <Check sx={{ color: "primary.main" }} fontSize="small" />
                    )}
                  </MenuItem>
                );
              })}
            </Menu>
          </Box>
        </div>
      </Tooltip>

      <CEDialogActions
        type="delete"
        loading={false}
        onClose={onClose}
        hideSubmitButton
        hideCancelButton
      >
        <LoadingButton
          startIcon={<LinkIcon fontSize="small" />}
          onClick={() => handleCopyClick()}
          variant="outlined"
        >
          <Trans i18nKey="copyReportLink" />
        </LoadingButton>

        <LoadingButton variant="contained" onClick={onClose} sx={{ mx: 1 }}>
          <Trans i18nKey="done" />
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
