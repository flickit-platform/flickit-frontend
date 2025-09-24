import { useMemo } from "react";
import { DialogProps } from "@mui/material/Dialog";
import { useForm } from "react-hook-form";
import { Trans } from "react-i18next";
import { styles } from "@styles";
import { CEDialog, CEDialogActions } from "@common/dialogs/CEDialog";
import FormProviderWithForm from "@common/FormProviderWithForm";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import DriveFileMoveOutlinedIcon from "@mui/icons-material/DriveFileMoveOutlined";
import { Grid } from "@mui/material";
import { SpaceField } from "../common/fields/SpaceField";
import { useServiceContext } from "@/providers/service-provider";
import { useQuery } from "@/hooks/useQuery";
import SpaceFieldForm from "@common/spaceFieldForm";

interface IAssessmentCEFromDialogProps extends DialogProps {
  onClose: () => void;
  onSubmitForm?: () => void;
  openDialog?: any;
  context?: any;
  assessmentId?: any;
}

const MoveAssessmentDialog = (props: IAssessmentCEFromDialogProps) => {
  const {
    onClose: closeDialog,
    onSubmitForm,
    context = {},
    openDialog,
    assessmentId,
    ...rest
  } = props;

  const { service } = useServiceContext();
  const { type, staticData = {} } = context;

  const formMethods = useForm({
    shouldUnregister: true,
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  });
  const abortController = useMemo(() => new AbortController(), [rest.open]);

  const close = () => {
    abortController.abort();
    closeDialog();
    if (window.location.hash) {
      history.replaceState(
        null,
        "",
        window.location.pathname + window.location.search,
      );
    }
  };

  const AssessmentMoveTarget = useQuery({
    service: (args, config) =>
      service.assessments.info.AssessmentMoveTarget(
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
    await AssessmentMoveTarget.query();
    onSubmitForm?.();
    close();
  };
  return (
    <CEDialog
      {...rest}
      closeDialog={close}
      title={
        <Box sx={{ ...styles.centerVH, gap: "6px" }}>
          <DriveFileMoveOutlinedIcon />
          <Trans i18nKey={"assessment.move"} />
        </Box>
      }
      titleStyle={{ marginBottom: 0 }}
      style={{
        padding: "16px 32px",
        background: "#F3F5F6",
        overflowX: "hidden",
      }}
      sx={{
        "& .MuiPaper-root": {
          width: {
            xs: "100%",
            sm: "100%",
            md: "50%",
            lg: "50%",
          },
        },
      }}
    >
      <SpaceFieldForm formMethods={formMethods} staticData={staticData} />
      <CEDialogActions
        closeDialog={close}
        submitButtonLabel="common.move"
        type={type}
        onSubmit={formMethods.handleSubmit(onSubmit)}
      />
    </CEDialog>
  );
};

export default MoveAssessmentDialog;
