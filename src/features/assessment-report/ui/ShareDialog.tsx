import { useTranslation } from "react-i18next";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Skeleton from "@mui/material/Skeleton";
import Snackbar from "@mui/material/Snackbar";
import Divider from "@mui/material/Divider";
import Chip from "@mui/material/Chip";
import Share from "@mui/icons-material/Share";
import { useEffect, useMemo, useState } from "react";

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
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import { Button, IconButton } from "@mui/material";
import FormProviderWithForm from "@/components/common/FormProviderWithForm";
import SpaceFieldForm from "@/components/common/SpaceFiledForm";
import { useServiceContext } from "@providers/service-provider";
import { useConnectAutocompleteField } from "@common/fields/AutocompleteAsyncField";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@/hooks/useQuery";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import Tooltip from "@mui/material/Tooltip";
import { Text } from "@/components/common/Text";

type ShareDialogProps = {
  open: boolean;
  onClose: () => void;
  assessment: any;
  lng: string;
  fetchGraphicalReport: any;
  setStep: React.Dispatch<React.SetStateAction<number>>;
  step: any;
} & Pick<IGraphicalReport, "visibility" | "permissions" | "linkHash" | "lang">;

export default function ShareDialog({
  open,
  onClose,
  visibility,
  permissions,
  linkHash,
  lng,
  assessment,
  fetchGraphicalReport,
  setStep,
  step,
}: ShareDialogProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const formMethods = useForm({
    shouldUnregister: true,
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  });

  const isRTL = lng === "fa";
  const { space, title } = assessment ?? {};
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

  const { service } = useServiceContext();
  const { assessmentId = "" } = useParams();
  const queryDataSpaces = useConnectAutocompleteField({
    service: (args, config) =>
      service.assessments.info.getTargetSpaces(args, config),
    accessor: "items",
  });

  const MoveAssessment = useQuery({
    service: (args, config) =>
      service.assessments.info.moveAssessment(
        args ?? {
          id: assessmentId,
          targetSpaceId: formMethods?.getValues("space")?.id,
        },
        config,
      ),
    runOnMount: false,
    toastError: true,
  });

  const onSubmit = async () => {
    const targetSpaceId = formMethods.getValues("space")?.id;
    if (!targetSpaceId) return;

    await MoveAssessment.query({ id: assessmentId, targetSpaceId });
    closeShareDialog();
    navigate(`/${targetSpaceId}/assessments/${assessmentId}/graphical-report/`);
    fetchGraphicalReport.query();
  };

  const [spaceList, setSpaceList] = useState<any[]>([]);
  const fetchSpaces = async () => {
    const data = await queryDataSpaces.query({ assessmentId });
    setSpaceList(data);
  };

  useEffect(() => {
    if (isDefault) {
      fetchSpaces();
    }
  }, [assessmentId]);

  const staticData = {
    queryDataSpaces,
    spaceList,
  };

  const closeShareDialog = () => {
    onClose();
    setStep(0);
  };

  type AccessOptions = Record<
    VISIBILITY,
    {
      title: string;
      description: string;
      titleDefault?: string | null;
      descriptionDefault?: string | null;
    }
  >;

  const accessOptionsNew: AccessOptions = useMemo(
    () => ({
      [VISIBILITY.RESTRICTED]: {
        title: t("assessmentReport.restrictedShareTitle", { lng }),
        description: t("assessmentReport.restrictedShareDescription", { lng }),
        titleDefault: t("assessmentReport.restrictedShareTitleDefault", {
          lng,
        }),
        descriptionDefault: t(
          "assessmentReport.restrictedShareDescriptionDefault",
          { lng },
        ),
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

  const getBackgroundColor = ({
    status,
    isSelected,
    isDefault,
  }: {
    status: string;
    isSelected: boolean;
    isDefault: boolean;
  }) => {
    if (isSelected && isDefault && status === VISIBILITY.RESTRICTED)
      return "#8A0F2414";
    if (isSelected) return "#2466A814";
    return "inherit";
  };

  const changeStatus = (pageNumber: number) => {
    setStep(pageNumber);
  };

  const publicSection = () => {
    return (
      <>
        <Box mt={2}>
          <Text
            variant="bodyMedium"
            color="rgba(61, 77, 92, 0.5)"
            fontFamily="inherit"
          >
            {t("assessmentReport.WhoHasAccessReport", { lng })}
          </Text>{" "}
          <Divider sx={{ my: 1 }} />{" "}
        </Box>
        <Text
          variant={"bodyMedium"}
          color={"background.secondaryDark"}
          sx={{ fontFamily: "inherit" }}
        >
          {t("assessmentReport.anyoneCanAccessReport", { lng })}
        </Text>
        <Box
          bgcolor={"primary.states.hover"}
          sx={{
            ...styles.centerV,
            direction: "ltr",
            gap: "24px",
            width: "100%",
            borderRadius: 1,
            p: 2,
            mt: 2,
          }}
        >
          <Text
            variant="bodyMedium"
            color="primary.main"
            lines={1}
            sx={{ width: "100%" }}
          >
            {globalThis.location.href}
          </Text>
          <Tooltip title={t("assessmentReport.copyReportLink", { lng })}>
            <Button
              onClick={handleCopyClick}
              sx={{
                background: "primary.states.selected",
                minWidth: "unset",
                width: "36px",
                height: "36px",
              }}
            >
              <ContentCopyIcon
                fontSize={"small"}
                sx={{ color: "primary.main" }}
              />
            </Button>
          </Tooltip>
        </Box>
      </>
    );
  };

  const shareSection = () => {
    return (
      <>
        {" "}
        {access === VISIBILITY.RESTRICTED && permissions.canShareReport && (
          <>
            {" "}
            <Box mt={permissions.canManageVisibility ? 3 : 0}>
              {" "}
              <Text
                variant="bodyMedium"
                color="rgba(61, 77, 92, 0.5)"
                sx={{ ...styles.rtlStyle(lng === "fa") }}
              >
                {" "}
                {isDefault
                  ? t("assessmentReport.WhoHasAccessReport", { lng })
                  : t("assessmentReport.peopleWithAccess", { lng })}
              </Text>{" "}
              <Divider sx={{ my: 1 }} />{" "}
            </Box>{" "}
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
                <Grid flex={1}>
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
                <Grid>
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
      closeDialog={closeShareDialog}
      title={
        <Box sx={{ ...styles.centerV }} gap={1}>
          <Share />
          <Text
            variant={"semiBoldXLarge"}
            sx={{
              ...styles.rtlStyle(lng === "fa"),
            }}
          >
            {t("assessmentReport.shareReport", { lng })}
          </Text>
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
      {step == 0 && (
        <>
          <Box
            sx={{
              display: permissions.canManageVisibility ? "flex-column" : "none",
              mt: 0,
            }}
          >
            <Text
              variant="bodyMedium"
              color="rgba(61, 77, 92, 0.5)"
              fontFamily="inherit"
            >
              {t("assessmentReport.shareOptions", { lng })}
            </Text>
            <Divider sx={{ my: 1 }} />
          </Box>
          <Box
            sx={{
              display: permissions.canManageVisibility ? "flex-column" : "none",
              gap: 1,
            }}
          >
            {Object.values(VISIBILITY).map((key) => {
              const status = key as VISIBILITY;
              const isSelected = access === status;
              return (
                <Box
                  key={status}
                  sx={{
                    display: "flex",
                    justifyContent: "flex-start",
                    background: getBackgroundColor({
                      status,
                      isSelected,
                      isDefault,
                    }),
                    width: "100%",
                    height: "fit-content",
                    borderRadius: "8px",
                    cursor: "pointer",
                  }}
                  onClick={() => handleSelect(status)}
                >
                  <Box sx={{ ...styles.centerVH }} width="38px" height="38px">
                    <Radio
                      checked={isSelected}
                      color="primary"
                      size="small"
                      sx={{
                        padding: "9px",
                        "&.Mui-checked": {
                          color:
                            isDefault && status == VISIBILITY.RESTRICTED
                              ? "#8A0F24"
                              : "#2466A8",
                        },
                      }}
                    />
                  </Box>
                  <Box
                    sx={{ ...styles.centerCV }}
                    padding="8px 0"
                    gap="4px"
                    flex={"1"}
                    height="fit-content"
                  >
                    <Text
                      fontFamily="inherit"
                      variant="bodyMedium"
                      sx={{ color: "#2B333B" }}
                    >
                      {isDefault && status == VISIBILITY.RESTRICTED
                        ? accessOptionsNew[status].titleDefault
                        : accessOptionsNew[status].title}
                    </Text>
                    <Text
                      variant="bodySmall"
                      color="background.secondaryDark"
                      fontFamily="inherit"
                    >
                      {isDefault && status == VISIBILITY.RESTRICTED
                        ? accessOptionsNew[status].descriptionDefault
                        : accessOptionsNew[status].description}
                    </Text>
                  </Box>
                  <Box sx={{ ...styles.centerV, paddingInlineEnd: "16px" }}>
                    {isDefault && status == VISIBILITY.RESTRICTED && (
                      <Button
                        variant={"outlined"}
                        color={"error"}
                        sx={{
                          height: "fit-content",
                          width: "fit-content",
                          p: "4px 10px",
                        }}
                        onClick={() => changeStatus(1)}
                      >
                        <Text
                          variant={"labelLarge"}
                          sx={{ ...styles.rtlStyle(lng === "fa") }}
                        >
                          {t("assessmentReport.moveAssessment", { lng })}
                        </Text>
                      </Button>
                    )}
                  </Box>
                </Box>
              );
            })}
          </Box>
          {access === VISIBILITY.PUBLIC && publicSection()}
          {!isDefault && access === VISIBILITY.RESTRICTED && shareSection()}
        </>
      )}
      {step == 1 && (
        <>
          <Box
            sx={{
              display: permissions.canManageVisibility ? "flex-column" : "none",
              mt: 0,
            }}
          >
            <Text
              variant="bodyMedium"
              color="rgba(61, 77, 92, 0.5)"
              fontFamily="inherit"
            >
              {t("assessmentReport.moveTheAssessment", { lng })}
            </Text>
            <Divider sx={{ my: 1 }} />
          </Box>
          {isDefault && access === VISIBILITY.RESTRICTED && (
            <SpaceFieldForm
              formMethods={formMethods}
              staticData={staticData}
              lng={lng}
              shareDialog={true}
              closeShareDialog={onClose}
              setStep={setStep}
              ReportTitle={title}
              onSubmit={onSubmit}
            />
          )}
        </>
      )}
      <CEDialogActions
        type="delete"
        loading={false}
        onClose={onClose}
        hideSubmitButton
        hideCancelButton
      >
        {step === 0 && (
          <LoadingButton
            variant="contained"
            onClick={onClose}
            sx={{ marginInlineStart: 1, fontFamily: "inherit" }}
          >
            {t("assessmentReport.done", { lng })}
          </LoadingButton>
        )}
        {step === 1 && (
          <>
            <Button
              variant="outlined"
              sx={{ marginInlineStart: 1, fontFamily: "inherit" }}
              onClick={() => changeStatus(0)}
            >
              {t("common.back", { lng })}
            </Button>
            <Button
              variant="contained"
              sx={{ marginInlineStart: 1, fontFamily: "inherit" }}
              onClick={onSubmit}
              disabled={spaceList.length <= 0}
            >
              {t("common.continue", { lng })}
            </Button>
          </>
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
      sx={{ maxHeight: "250px" }}
    >
      {[
        ...users.map((u: any) => ({ ...u, isInvitee: false })),
        ...invitees.map((i: any) => ({ ...i, isInvitee: true })),
      ].map((member) => {
        const { displayName, id, pictureLink, email, deletable, isInvitee } =
          member;
        const isInvited = !!invitees?.some((inv: any) => inv.id === member.id);

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
              {isInvited && (
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
                <DeleteOutlinedIcon color="primary"/>
              </IconButton>
            )}
          </Box>
        );
      })}
    </Box>
  );
};
