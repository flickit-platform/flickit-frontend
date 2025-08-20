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
import React, { useEffect, useMemo, useState } from "react";
import LoadingButton from "@mui/lab/LoadingButton";
import stringAvatar from "@/utils/stringAvatar";
import { useQuery } from "@/utils/useQuery";
import { useParams } from "react-router-dom";
import { useServiceContext } from "@/providers/ServiceProvider";
import { ICustomError } from "@/utils/CustomError";
import QueryBatchData from "../common/QueryBatchData";
import { VISIBILITY } from "@/utils/enumType";
import { IGraphicalReport, IUserPermissions } from "@/types";
import { FormProvider, useForm } from "react-hook-form";
import { InputFieldUC } from "../common/fields/InputField";
import showToast from "@/utils/toastError";
import { styles } from "@styles";
import Radio from "@mui/material/Radio";
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import uniqueId from "@utils/uniqueId";

interface IDialogProps extends IGraphicalReport {
  open: boolean;
  onClose: () => void;
  assessme: string;
  fetchGraphicalReportUsers: any;
  visibility: VISIBILITY;
  permissions: IUserPermissions;
  assessment: any;
}

export const ShareDialog = ({
  open,
  onClose,
  fetchGraphicalReportUsers,
  visibility,
  permissions,
  linkHash,
  lang,
  assessment
}: IDialogProps) => {
  const { t } = useTranslation();
  const { assessmentId = "" } = useParams();
  const { service } = useServiceContext();
  const [access, setAccess] = useState<VISIBILITY>(visibility);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const methods = useForm();
  const { reset, handleSubmit } = methods;
  const { space: { isDefault } } = assessment
  const lng = lang?.code?.toLowerCase();

  const accessOptionsNew = useMemo(
    () => ({
      [VISIBILITY.RESTRICTED]: {
        title: t("assessmentReport.restrictedShareTitle", { lng }),
        description: t("assessmentReport.restrictedShareDescription", { lng }),
      },
      [VISIBILITY.PUBLIC]: {
        title: t("assessmentReport.PublicShareTitle", { lng }),
        description: t("assessmentReport.PublicShareDescription", { lng }),
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

  const shareSection = () =>{
    return (
      isDefault ?
        <>
          <Divider sx={{ my: 1 }} />
          <Typography
            color={"surface.onVariant"}
            variant={"bodySmall"}
            fontFamily="inherit"
          >
            {t("assessmentReport.isDraftSpaceReport", { lng })}
          </Typography>
        </>
      :
       <>
         {access === VISIBILITY.RESTRICTED && permissions.canShareReport && (
           <>
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
             <FormProvider {...methods}>
               <form onSubmit={handleSubmit(onSubmit)}>
                 <Grid
                   container
                   display="flex"
                   alignItems="flex-start"
                   sx={{ ...styles.formGrid,mt: 0, mb: 1 ,gap  : 1 }}
                 >
                   <Grid item flex={1}>
                     <InputFieldUC
                       name="email"
                       size="small"
                       placeholder={t("assessmentReport.shareReportViaEmail", { lng })}
                       fullWidth
                       required
                       stylesProps= {{ input: { padding: "4px 12px" } }}
                     />
                   </Grid>
                   {/*<Grid item xs={0.5}></Grid>*/}
                   <Grid item >
                     <LoadingButton
                       variant="outlined"
                       type="submit"
                       sx={{ fontFamily: "inherit",minWidth: "inherit", padding: "5px", height: "100%"  }}
                     >
                       <PersonAddIcon fontSize={"small"} />
                     </LoadingButton>
                   </Grid>
                 </Grid>
               </form>
             </FormProvider>
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
                   <Box display="flex" flexDirection="column" my={1} gap={2}>
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
       </>
    )
  }

  const handleCloseSnackbar = () => setSnackbarOpen(false);

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
      contentStyle={{ p: "40px 64px !important" }}
      titleStyle={{ mb: "0px !important" }}
    >
      <Box mt={0}>
        <Typography
          variant="bodyMedium"
          color="rgba(61, 77, 92, 0.5)"
          fontFamily="inherit"
        >
          {t("assessmentReport.shareOptions", { lng })}
        </Typography>
        <Divider sx={{ my: 1 }} />
      </Box>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        {Object.values(VISIBILITY).map((key) => {
          const isSelected = access === key;
          return (
            <Box
              key={uniqueId()}
              sx={{
                display: "flex",
                justifyContent: "flex-start",
                background: isSelected ? "#2466A814" : "inherit",
                width: "100%",
                height: "fit-content",
                borderRadius: "8%",
                cursor: "pointer",
              }}
              onClick={() => handleSelect(key)}
            >
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                width="38px"
                height="38px"
              >
                <Radio
                  checked={isSelected}
                  color="primary"
                  size="small"
                  sx={{
                    padding: "9px",
                    "&.Mui-checked": {
                      color: "#2466A8",
                    },
                  }}
                />
              </Box>
              <Box
                display="flex"
                flexDirection="column"
                justifyContent="center"
                padding="8px 0"
                gap="4px"
                width="398px"
                height="59px"
              >
                <Typography  fontFamily="inherit" variant="bodyMedium" sx={{ color: "#2B333B" }}>
                  {accessOptionsNew[key].title}
                </Typography>
                <Typography
                  variant="bodySmall"
                  color="background.onVariant"
                  fontFamily="inherit"
                >
                  {accessOptionsNew[key].description}{" "}
                </Typography>
              </Box>
            </Box>
          );
        })}
      </Box>
      {shareSection()}
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
