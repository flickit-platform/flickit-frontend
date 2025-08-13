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

interface IAssessmentCEFromDialogProps extends DialogProps {
  onClose: () => void;
  onSubmitForm?: () => void;
  openDialog?: any;
  context?: any;
}

const MoveAssessmentDialog = (props: IAssessmentCEFromDialogProps) => {
  const {
    onClose: closeDialog,
    onSubmitForm,
    context = {},
    openDialog,
    ...rest
  } = props;
  const { type, staticData = {} } = context;
  const { spaceList, queryDataSpaces } = staticData;
  const formMethods = useForm({ shouldUnregister: true });
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

  const onSubmit = async () => {};

  return (
    <CEDialog
      {...rest}
      closeDialog={close}
      title={
        <Box sx={{ ...styles.centerVH, gap: "6px" }}>
          <DriveFileMoveOutlinedIcon />
          <Trans i18nKey={"assessment.moveAssessment"} />
        </Box>
      }
      titleStyle={{ marginBottom: 0 }}
      style={{ padding: "16px 32px", background: "#F3F5F6" }}
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
      <FormProviderWithForm formMethods={formMethods}>
        <Grid container>
          <Grid item lg={12} md={12} sm={12} xs={12}>
            <Typography variant="bodyMedium">
              <Trans i18nKey="assessment.chooseTargetSpace" />
            </Typography>
          </Grid>
          <Grid item lg={6} md={6} sm={12} xs={12}>
            <SpaceField
              queryDataSpaces={queryDataSpaces}
              spaces={spaceList}
              sx={{ mt: "24px" }}
              label={<Trans i18nKey="spaces.targetSpace"/>}
            />{" "}
          </Grid>
        </Grid>
      </FormProviderWithForm>

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

