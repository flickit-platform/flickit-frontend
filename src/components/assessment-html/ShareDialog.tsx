import { useTranslation } from "react-i18next";
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
import { useEffect, useMemo, useState } from "react";
import LoadingButton from "@mui/lab/LoadingButton";
import stringAvatar from "@/utils/stringAvatar";
import { useQuery } from "@/utils/useQuery";
import { useParams } from "react-router-dom";
import { useServiceContext } from "@/providers/ServiceProvider";
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
import { VISIBILITY } from "@/utils/enumType";
import { IGraphicalReport, IUserPermissions } from "@/types";
import { FormProvider, useForm } from "react-hook-form";
import { InputFieldUC } from "../common/fields/InputField";
import showToast from "@/utils/toastError";
import { styles } from "@styles";
import { v3Tokens } from "@/config/tokens";

interface IDialogProps extends IGraphicalReport {
  open: boolean;
  onClose: () => void;
  assessme: string;
  fetchGraphicalReportUsers: any;
  visibility: VISIBILITY;
  permissions: IUserPermissions;
}

export const ShareDialog = ({
  open,
  onClose,
  fetchGraphicalReportUsers,
  visibility,
  permissions,
  linkHash,
  lang,
}: IDialogProps) => {
  const { t } = useTranslation();
  const { assessmentId = "" } = useParams();
  const { service } = useServiceContext();
  const { open: menuOpened, openMenu, closeMenu, anchorEl } = useMenu();
  const [access, setAccess] = useState<VISIBILITY>(visibility);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const methods = useForm();
  const { reset, handleSubmit } = methods;

  const lng = lang?.code?.toLowerCase();

  const accessOptions = useMemo(
    () => ({
      [VISIBILITY.RESTRICTED]: {
        title: t("assessmentReport.accessRestricted", { lng }),
        titleMenu: t("assessmentReport.accessRestricted", { lng }),
        description: t("assessmentReport.accessRestrictedDescription", { lng }),
        icon: <LockOutlinedIcon />,
        bgColor: v3Tokens.surface.variant
      },
      [VISIBILITY.PUBLIC]: {
        title: t("assessmentReport.accessAnyone", { lng }),
        titleMenu: t("assessmentReport.accessAnyoneWithLink", { lng }),
        description: t("assessmentReport.accessAnyoneDescription", { lng }),
        icon: <Language />,
        bgColor: v3Tokens.primary.bgVar
      },
    }),
    [lng],
  );

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
        window.history.replaceState({}, "", finalPath);
    } catch (error) {
      showToast(error as ICustomError);
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
        const newPath = `${basePath}${linkHash}/`;
        window.history.pushState({}, "", newPath);
      }
    }
  }, [open]);

  const onSubmit = async (data: any) => {
    try {
      await grantReportAccess.query({ email: data.email, assessmentId });
      fetchGraphicalReportUsers.query();
      reset();
    } catch (error) {
      showToast(error as ICustomError);
    }
  };

  const handleCopyClick = async () => {
    try {
      navigator.clipboard.writeText(window.location.href);
      setSnackbarOpen(true);
    } catch (error) {
      showToast(error as ICustomError);
    }
  };

  const handleCloseSnackbar = () => setSnackbarOpen(false);
  const current = accessOptions[access];

  return (
    <CEDialog
      open={open}
      closeDialog={onClose}
      title={
        <Box sx={{ ...styles.centerV }} gap={1}>
          <Share />
          {t("assessmentReport.shareReport", { lng })}
        </Box>
      }
      maxWidth="sm"
      sx={{ ...styles.rtlStyle(lng === "fa") }}
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
                    placeholder={t("assessmentReport.shareReportViaEmail", { lng })}
                    fullWidth
                    required
                  />
                </Grid>
                <Grid item xs={0.5}></Grid>
                <Grid item xs={1.8}>
                  <LoadingButton
                    variant="contained"
                    type="submit"
                    sx={{ fontFamily: "inherit" }}
                  >
                    {t("common.add", { lng })}
                  </LoadingButton>
                </Grid>
              </Grid>
            </form>
          </FormProvider>

          <Box mt={3}>
            <Typography
              variant="bodyMedium"
              color="rgba(61, 77, 92, 0.5)"
              fontFamily="inherit"
            >
              {t("assessmentReport.peopleWithAccess", { lng })}
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
                <Box display="flex" flexDirection="column" gap={2}>
                  {[
                    ...graphicalReportUsers.users,
                    ...graphicalReportUsers.invitees,
                  ].map((member: any) => {
                    const { displayName, id, pictureLink, email } = member;
                    return (
                      <Box key={id} sx={{ ...styles.centerV }} gap={1}>
                        <Avatar
                          {...stringAvatar(displayName?.toUpperCase())}
                          src={pictureLink}
                          sx={{ width: 24, height: 24, fontSize: 12 }}
                        />
                        {email}
                        {graphicalReportUsers.invitees.includes(member) && (
                          <Chip
                            label={t("common.invited", { lng })}
                            size="small"
                            sx={{
                              ".MuiChip-label": {
                                fontFamily: "inherit",
                              },
                            }}
                          />
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

      <Box mt={3}>
        <Typography
          variant="bodyMedium"
          color="rgba(61, 77, 92, 0.5)"
          fontFamily="inherit"
        >
          {t("assessmentReport.accessStatus", { lng })}
        </Typography>
        <Divider sx={{ mt: 1 }} />
      </Box>
      <Tooltip
        disableHoverListener={permissions.canManageVisibility}
        title={t("notification.youDontHavePermission", { lng })}
        sx={{ fontFamily: "inherit" }}
      >
        <div>
          <Box
            mt={1}
            gap={1}
            sx={{
              ...styles.centerV,
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
                color={permissions.canManageVisibility ? "unset" : "#B0B0B0"}
                gap={1}
                sx={{
                  ...styles.centerV,
                  cursor: permissions.canManageVisibility
                    ? "pointer"
                    : "default",
                }}
                variant="semiBoldMedium"
                fontFamily="inherit"
              >
                {current?.title}
                {permissions.canManageVisibility && (
                  <>
                    {menuOpened ? (
                      <ArrowDropUp sx={{ color: "background.onVariant" }} />
                    ) : (
                      <ArrowDropDown sx={{ color: "background.onVariant" }} />
                    )}
                  </>
                )}
              </Typography>

              <Typography
                variant="bodySmall"
                color="background.onVariant"
                fontFamily="inherit"
              >
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
                      ...styles.centerV,
                      justifyContent: "space-between",
                      gap: 2,
                    }}
                  >
                    <Typography
                      variant="bodyMedium"
                      sx={{ ...styles.rtlStyle(lng === "fa") }}
                    >
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
          startIcon={
            <LinkIcon
              fontSize="small"
              sx={{
                ...styles.iconDirectionStyle(lng),
              }}
            />
          }
          onClick={() => handleCopyClick()}
          variant="outlined"
          sx={{ fontFamily: "inherit" }}
        >
          {t("assessmentReport.copyReportLink", { lng })}
        </LoadingButton>

        <LoadingButton
          variant="contained"
          onClick={onClose}
          sx={{ mx: 1, fontFamily: "inherit" }}
        >
          {t("common.done", { lng })}
        </LoadingButton>
      </CEDialogActions>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        message={t("common.linkCopied", { lng })}
        sx={{ fontFamily: "inherit" }}
      />
    </CEDialog>
  );
};
