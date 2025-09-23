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
import DriveFileMoveOutlinedIcon from "@mui/icons-material/DriveFileMoveOutlined";
import { useMemo } from "react";
import LoadingButton from "@mui/lab/LoadingButton";
import stringAvatar from "@/utils/string-avatar";
import { VISIBILITY } from "@/utils/enum-type";
import { IGraphicalReport } from "@/types";
import { useForm } from "react-hook-form";
import { styles } from "@styles";
import Radio from "@mui/material/Radio";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { useShareDialog } from "../model/hooks/useShareDialog";
import {
  CEDialog,
  CEDialogActions,
} from "@/components/common/dialogs/CEDialog";
import { InputFieldUC } from "@/components/common/fields/InputField";
import QueryBatchData from "@/components/common/QueryBatchData";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import { Button, IconButton } from "@mui/material";
import FormProviderWithForm from "@/components/common/FormProviderWithForm";

type ShareDialogProps = {
  open: boolean;
  onClose: () => void;
  assessment: any;
  lng: string;
} & Pick<IGraphicalReport, "visibility" | "permissions" | "linkHash" | "lang">;

export default function ShareDialog({
  open,
  onClose,
  visibility,
  permissions,
  linkHash,
  lng,
  assessment,
}: ShareDialogProps) {
  const { t } = useTranslation();
  const formMethods = useForm({
    shouldUnregister: true,
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  });

  const isRTL = lng === "fa";
  const { space } = assessment ?? {};
  const isDefault = space?.isDefault ?? false;

  const {
    access,
    snackbarOpen,
    closeSnackbar,
    fetchGraphicalReportUsers,
    handleSelect,
    onInviteSubmit,
    handleCopyClick,
    deleteUserRoleHandler,
    deleteInviteeHandler,
  } = useShareDialog({ open, visibility, linkHash });

  type AccessOptions = Record<
    VISIBILITY,
    { title: string; description: string }
  >;

  const accessOptionsNew: AccessOptions = useMemo(
    () => ({
      [VISIBILITY.RESTRICTED]: {
        title: t("assessmentReport.restrictedShareTitle", { lng }),
        description: t("assessmentReport.restrictedShareDescription", { lng }),
      },
      [VISIBILITY.PUBLIC]: {
        title: t("assessmentReport.publicShareTitle", { lng }),
        description: t("assessmentReport.publicShareDescription", { lng }),
      },
    }),
    [lng, t],
  );

  const handleInviteSubmit = formMethods.handleSubmit(async (data, e) => {
    await onInviteSubmit(data);
    formMethods.reset({ email: "" });
  });

  const shareSection = () => {
    return isDefault ? (
      <Box sx={{ background: "#8A0F240A", borderRadius: "4px", p: "8px 16px" }}>
        <Typography
          color="error.main"
          variant={"bodyMedium"}
          fontFamily="inherit"
        >
          {" "}
          {t("assessmentReport.isDraftSpaceReport", { lng })}{" "}
        </Typography>{" "}
      </Box>
    ) : (
      <>
        {" "}
        {access === VISIBILITY.RESTRICTED && permissions.canShareReport && (
          <>
            <FormProviderWithForm
              formMethods={formMethods}
              onSubmit={handleInviteSubmit}
            >
              {" "}
              <Grid
                container
                display="flex"
                alignItems="flex-start"
                sx={{ ...styles.formGrid, mt: 0, mb: 1, gap: 1 }}
              >
                {" "}
                <Grid item flex={1}>
                  {" "}
                  <InputFieldUC
                    lng={lng}
                    name="email"
                    size="small"
                    placeholder={t("assessmentReport.shareReportViaEmail", {
                      lng,
                    })}
                    fullWidth
                    required
                    stylesProps={{
                      input: {
                        padding: "4px 12px",
                        "::placeholder": { ...styles.rtlStyle(lng === "fa") },
                      },
                    }}
                  />{" "}
                </Grid>{" "}
                <Grid item>
                  {" "}
                  <LoadingButton
                    variant="outlined"
                    type="submit"
                    sx={{
                      fontFamily: "inherit",
                      minWidth: "inherit",
                      padding: "5px",
                      height: "100%",
                    }}
                  >
                    {" "}
                    <PersonAddIcon fontSize="small" />{" "}
                  </LoadingButton>{" "}
                </Grid>{" "}
              </Grid>{" "}
            </FormProviderWithForm>{" "}
            <QueryBatchData
              queryBatchData={[fetchGraphicalReportUsers]}
              renderLoading={() => (
                <>
                  {" "}
                  {[1, 2].map((n) => (
                    <Skeleton
                      key={n}
                      variant="rectangular"
                      sx={{ borderRadius: 2, height: "30px", mb: 1 }}
                    />
                  ))}{" "}
                </>
              )}
              render={([graphicalReportUsers]) => (
                <UserSection
                  {...graphicalReportUsers}
                  lng={lng}
                  deleteUserRoleHandler={deleteUserRoleHandler}
                  deleteInviteeHandler={deleteInviteeHandler}
                />
              )}
            />{" "}
          </>
        )}{" "}
      </>
    );
  };

  return (
    <CEDialog
      open={open}
      closeDialog={onClose}
      title={
        <Box sx={{ ...styles.centerV }} gap={1}>
          <Share />
          <Typography
            variant={"semiBoldXLarge"}
            sx={{
              ...styles.rtlStyle(lng === "fa"),
            }}
          >
            {t("assessmentReport.shareReport", { lng })}
          </Typography>
        </Box>
      }
      maxWidth="sm"
      sx={{ ...styles.rtlStyle(isRTL) }}
      contentStyle={{
        p: "16px 32px !important",
        overflow: "hidden !important",
      }}
      titleStyle={{ mb: "0px !important" }}
    >
      <Box
        sx={{
          display: permissions.canManageVisibility ? "flex" : "none",
          mt: 0,
        }}
      >
        <Typography
          variant="bodyMedium"
          color="rgba(61, 77, 92, 0.5)"
          fontFamily="inherit"
        >
          {t("assessmentReport.shareOptions", { lng })}
        </Typography>
        <Divider sx={{ my: 1 }} />
      </Box>
      <Box
        sx={{
          display: permissions.canManageVisibility ? "flex" : "none",
          flexDirection: "column",
          gap: 1,
        }}
      >
        {Object.values(VISIBILITY).map((key) => {
          const k = key as VISIBILITY;
          const isSelected = access === k;
          return (
            <Box
              key={k}
              sx={{
                display: "flex",
                justifyContent: "flex-start",
                background: isSelected ? "#2466A814" : "inherit",
                width: "100%",
                height: "fit-content",
                borderRadius: "8px",
                cursor: "pointer",
              }}
              onClick={() => handleSelect(k)}
            >
              <Box sx={{ ...styles.centerVH }} width="38px" height="38px">
                <Radio
                  checked={isSelected}
                  color="primary"
                  size="small"
                  sx={{
                    padding: "9px",
                    "&.Mui-checked": { color: "#2466A8" },
                  }}
                />
              </Box>
              <Box
                sx={{ ...styles.centerCV }}
                padding="8px 0"
                gap="4px"
                width="398px"
                height="59px"
              >
                <Typography
                  fontFamily="inherit"
                  variant="bodyMedium"
                  sx={{ color: "#2B333B" }}
                >
                  {accessOptionsNew[k].title}
                </Typography>
                <Typography
                  variant="bodySmall"
                  color="background.onVariant"
                  fontFamily="inherit"
                >
                  {accessOptionsNew[k].description}
                </Typography>
              </Box>
            </Box>
          );
        })}
      </Box>{" "}
      <Box mt={permissions.canManageVisibility ? 3 : 0}>
        {" "}
        <Typography
          variant="bodyMedium"
          color="rgba(61, 77, 92, 0.5)"
          fontFamily="inherit"
        >
          {" "}
          {isDefault
            ? t("assessmentReport.WhoHasAccessReport", { lng })
            : t("assessmentReport.peopleWithAccess", { lng })}
        </Typography>{" "}
        <Divider sx={{ my: 1 }} />{" "}
      </Box>{" "}
      {shareSection()}
      <CEDialogActions
        type="delete"
        loading={false}
        onClose={onClose}
        hideSubmitButton
        hideCancelButton
      >
        {isDefault ? (
          <Box display={"flex"} gap={2}>
            <Button
              variant={"outlined"}
              startIcon={
                <DriveFileMoveOutlinedIcon
                  fontSize="small"
                  sx={{ ...styles.iconDirectionStyle(lng) }}
                />
              }
              sx={{ fontFamily: "inherit" }}
            >
              <Typography>{t("assessmentReport.moveTheAssessment")}</Typography>
            </Button>
            <Button variant={"contained"} sx={{ fontFamily: "inherit" }}>
              <Typography>{t("assessmentReport.makeItPublic")}</Typography>
            </Button>
          </Box>
        ) : (
          <LoadingButton
            variant="contained"
            onClick={onClose}
            sx={{ marginInlineStart: 1, fontFamily: "inherit" }}
          >
            {t("common.done", { lng })}
          </LoadingButton>
        )}
      </CEDialogActions>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={closeSnackbar}
        message={t("common.linkCopied", { lng })}
        sx={{ fontFamily: "inherit" }}
      />
    </CEDialog>
  );
}

const UserSection = (props: any) => {
  const { invitees, users, deleteUserRoleHandler, deleteInviteeHandler, lng } =
    props;
  const { t } = useTranslation();
  return (
    <Box
      display="flex"
      flexDirection="column"
      my={1}
      gap={2}
      sx={{ overflowY: "auto", maxHeight: "250px" }}
    >
      {[
        ...(users ?? []).map((u: any) => ({ ...u, isInvitee: false })),
        ...(invitees ?? []).map((i: any) => ({ ...i, isInvitee: true })),
      ].map((member) => {
        const { displayName, id, pictureLink, email, deletable, isInvitee } =
          member;
        return (
          <Box
            key={id}
            sx={{ ...styles.centerV, justifyContent: "space-between" }}
          >
            <Box key={String(id ?? email)} sx={{ ...styles.centerV }} gap={1}>
              <Avatar
                {...stringAvatar((displayName ?? "").toUpperCase())}
                src={pictureLink ?? undefined}
                sx={{ width: 24, height: 24, fontSize: 12 }}
              />
              {email}
              {(invitees ?? []).includes(member) && (
                <Chip
                  label={t("common.invited", { lng })}
                  size="small"
                  sx={{
                    ".MuiChip-label": {
                      ...styles.rtlStyle(lng === "fa"),
                    },
                  }}
                />
              )}
            </Box>
            {deletable && (
              <IconButton
                onClick={() =>
                  isInvitee
                    ? deleteInviteeHandler(id)
                    : deleteUserRoleHandler(id)
                }
              >
                <DeleteForeverOutlinedIcon
                  fontSize={"medium"}
                  sx={{ color: "background.onVariant" }}
                />
              </IconButton>
            )}
          </Box>
        );
      })}
    </Box>
  );
};
