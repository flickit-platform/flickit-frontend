import React from "react";
import { Grid, IconButton } from "@mui/material";
import { t } from "i18next";
import { SpaceField } from "@common/fields/SpaceField";
import FormProviderWithForm from "@common/FormProviderWithForm";
import Box from "@mui/material/Box";
import { Close } from "@mui/icons-material";
import Button from "@mui/material/Button";
import CreateNewFolderOutlinedIcon from "@mui/icons-material/CreateNewFolderOutlined";
import { styles } from "@styles";
import { useNavigate } from "react-router-dom";
import {
  assessmentActions,
  useAssessmentContext,
} from "@providers/assessment-provider";
import { useParams } from "react-router";
import { Text } from "./Text";
import { GenericPopover } from "@common/PopOver";
import usePopover from "@/hooks/usePopover";

const CreateSpacePopUp = ({
  onClose,
  handleCloseDialog,
  ReportTitle,
  lng,
}: {
  onClose: () => void;
  handleCloseDialog: () => void;
  ReportTitle: string;
  lng: string;
}) => {
  const { spaceId, assessmentId } = useParams();
  const navigate = useNavigate();
  const { dispatch } = useAssessmentContext();
  const handelCreateSpace = () => {
    onClose();
    handleCloseDialog();
    dispatch(
      assessmentActions.setPendingShareReport({
        spaceId,
        assessmentId,
        title: ReportTitle,
        report: true,
      }),
    );
    navigate("/spaces/#createSpace");
  };

  return (
    <Box
      sx={{
        width: 270,
        bgcolor: "background.paper",
        color: "white",
        borderRadius: 1,
        textAlign: "inherit",
        zIndex: 10,
        direction: lng == "fa" ? "rtl" : "ltr",
        "&::before": {
          content: '""',
          position: "absolute",
          top: "-8px",
          left: "50%",
          transform: "translateX(-50%)",
          width: 0,
          height: 0,
          borderLeft: "12px solid transparent",
          borderRight: "12px solid transparent",
          borderBottom: "12px solid #f9fafb",
        },
      }}
    >
      <Box sx={{ display: "flex", flexDirection: "column", mb: "12px" }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "start",
            mb: 1,
          }}
        >
          <Text
            sx={{ ...styles.rtlStyle(lng == "fa") }}
            variant={"bodyMedium"}
            color={"background.secondaryDark"}
          >
            {t("assessmentReport.leaveAndCreateSpaceTitle", { lng })}
          </Text>
          <IconButton
            aria-label="close"
            onClick={onClose}
            edge="end"
            size="small"
            sx={{ marginInlineStart: 2, color: "primary.main" }}
            data-testid="close-box"
          >
            <Close />
          </IconButton>
        </Box>
        <Text
          variant={"bodySmall"}
          color={"background.secondaryDark"}
          sx={{ ...styles.rtlStyle(lng == "fa") }}
        >
          {t("assessmentReport.leaveAndCreateSpaceDescription", { lng })}
        </Text>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
        <Button
          onClick={onClose}
          variant={"outlined"}
          sx={{ ...styles.rtlStyle(lng == "fa"), color: "primary.main" }}
        >
          <Text variant={"labelMedium"}>{t("common.refuse", { lng })}</Text>
        </Button>
        <Button
          onClick={handelCreateSpace}
          variant={"contained"}
          sx={{ ...styles.centerV, gap: 1 }}
        >
          <Text
            variant={"labelMedium"}
            sx={{ ...styles.rtlStyle(lng == "fa") }}
          >
            {t("assessmentReport.newSpace", { lng })}
          </Text>
          <CreateNewFolderOutlinedIcon />
        </Button>
      </Box>
    </Box>
  );
};

const SpaceFieldForm = (props: any) => {
  const {
    formMethods,
    staticData,
    lng,
    shareDialog,
    closeShareDialog,
    setStep,
    ReportTitle,
  } = props;
  const { spaceList, queryDataSpaces } = staticData;

  const { anchorEl, open, handlePopoverOpen, handlePopoverClose, data } =
    usePopover();

  const handleCloseDialog = () => {
    closeShareDialog();
    setStep(0);
  };

  return (
    <FormProviderWithForm formMethods={formMethods}>
      <Grid container>
        <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12 }}>
          <Text variant="bodyMedium" sx={{ fontFamily: "inherit" }}>
            {t("assessment.chooseTargetSpace", { lng })}
          </Text>
        </Grid>
        <Grid spacing={2} sx={{ width: "70%" }} alignItems={"center"} container>
          <Grid size={{ xs: 12, sm: 12, md: 6, lg: 6 }}>
            <SpaceField
              queryDataSpaces={queryDataSpaces}
              spaces={spaceList}
              sx={{ mt: "24px" }}
              label={t("spaces.targetSpace", { lng })}
              noOptionsText={t("spaces.noSpaceHere", { lng })}
              filterSelectedOptions={false}
              data-testid="target-space-field"
              style={{
                "& .MuiInputLabel-root": {
                  transform: "unset",
                  transformOrigin: "unset",
                },
                "& .MuiOutlinedInput-notchedOutline": { textAlign: "unset" },
                "& .MuiOutlinedInput-root .MuiAutocomplete-endAdornment": {
                  all: "unset",
                },
                "& .MuiAutocomplete-inputRoot": {
                  paddingRight: "8px !important",
                  paddingLeft: "8px !important",
                },
              }}
            />{" "}
          </Grid>
          {shareDialog && (
          <Grid size={{ xs: 12, sm: 12, md: 6, lg: 6 }} mt={"24px"}>
            <Text
              sx={{
                position: "relative",
                cursor: "pointer",
                fontFamily: "inherit",
              }}
              variant={"labelMedium"}
              color={"primary.main"}
              onClick={(e) => handlePopoverOpen(e)}
            >
              {t("assessmentReport.newSpace", { lng })}
            </Text>
            {anchorEl && (
              <GenericPopover
                open={open}
                onClose={handlePopoverClose}
                anchorEl={anchorEl}
              >
                <CreateSpacePopUp
                  ReportTitle={ReportTitle}
                  onClose={handlePopoverClose}
                  handleCloseDialog={handleCloseDialog}
                  lng={lng}
                />
              </GenericPopover>
            )}
          </Grid>
          )}
        </Grid>
      </Grid>
    </FormProviderWithForm>
  );
};

export default SpaceFieldForm;
