import React, { useState } from "react";
import { Grid, IconButton } from "@mui/material";
import Typography from "@mui/material/Typography";
import { t } from "i18next";
import { SpaceField } from "@common/fields/SpaceField";
import FormProviderWithForm from "@common/FormProviderWithForm";
import Box from "@mui/material/Box";
import { Close } from "@mui/icons-material";
import Popper from "@mui/material/Popper";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Button from "@mui/material/Button";
import CreateNewFolderOutlinedIcon from "@mui/icons-material/CreateNewFolderOutlined";
import { styles } from "@styles";
import { useNavigate } from "react-router-dom";
import {
  assessmentActions,
  useAssessmentContext,
} from "@providers/assessment-provider";
import { useParams } from "react-router";

const CreateSpacePopUp = ({
  onClose,
  handleCloseDialog,
  ReportTitle,
}: {
  onClose: () => void;
  handleCloseDialog: () => void;
  ReportTitle: string;
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
        report: true
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
        p: 1,
        borderRadius: 1,
        textAlign: "inherit",
        zIndex: 10,
        boxShadow: "0 0 8px 0 #00000040",
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
          <Typography variant={"bodyMedium"} color={"background.secondaryDark"}>
            {t("assessmentReport.leaveAndCreateSpaceTitle")}
          </Typography>
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
        <Typography
          variant={"bodySmall"}
          color={"background.secondaryDark"}
          sx={{ textAlign: "right" }}
        >
          {t("assessmentReport.leaveAndCreateSpaceDescription")}
        </Typography>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
        <Button
          onClick={onClose}
          variant={"outlined"}
          sx={{ color: "primary.main" }}
        >
          <Typography variant={"labelMedium"}>{t("common.refuse")}</Typography>
        </Button>
        <Button
          onClick={handelCreateSpace}
          variant={"contained"}
          sx={{ ...styles.centerV, gap: 1 }}
        >
          <Typography variant={"labelMedium"}>
            {t("assessmentReport.newSpace")}
          </Typography>
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
  const popperRef = React.useRef<HTMLDivElement | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const togglePopOver = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };
  const handleClose = () => setAnchorEl(null);
  const handleCloseDialog = () => {
    closeShareDialog();
    setStep(0);
  };

  return (
    <FormProviderWithForm formMethods={formMethods}>
      <Grid container>
        <Grid item lg={12} md={12} sm={12} xs={12}>
          <Typography variant="bodyMedium">
            {t("assessment.chooseTargetSpace", { lng })}
          </Typography>
        </Grid>
        <Grid spacing={2} alignItems={"center"} container>
          <Grid item lg={6} md={6} sm={12} xs={12}>
            <SpaceField
              queryDataSpaces={queryDataSpaces}
              spaces={spaceList}
              sx={{ mt: "24px" }}
              label={t("spaces.targetSpace", { lng })}
              noOptionsText={t("spaces.noSpaceHere", { lng })}
              filterSelectedOptions={false}
              data-testid="target-space-field"
              style={{
                  "& .MuiInputLabel-root": { transform: "unset", transformOrigin: "unset" },
                  "& .MuiOutlinedInput-notchedOutline": { textAlign: "unset" },
                  "& .MuiOutlinedInput-root .MuiAutocomplete-endAdornment": { all: "unset" },
                  "& .MuiAutocomplete-inputRoot": {paddingRight: "8px !important", paddingLeft:"8px !important" },
              }}
            />{" "}
          </Grid>
          {shareDialog && (
            <Grid item lg={6} md={6} sm={12} xs={12} mt={"24px"}>
              <Typography
                sx={{ position: "relative", cursor: "pointer" }}
                variant={"labelMedium"}
                color={"primary.main"}
                onClick={(e) => togglePopOver(e)}
              >
                {t("assessmentReport.newSpace", { lng })}
              </Typography>
              {anchorEl && (
                <Popper
                  sx={{ zIndex: 1400 }}
                  open={Boolean(anchorEl)}
                  anchorEl={anchorEl}
                  placement="bottom"
                >
                  <ClickAwayListener
                    onClickAway={(event) => {
                        if (anchorEl?.contains(event.target as Node)) return;
                        if (popperRef.current?.contains(event.target as Node)) return;
                        handleClose();
                    }}
                  >
                    <Box ref={popperRef}>
                      <CreateSpacePopUp
                        ReportTitle={ReportTitle}
                        onClose={handleClose}
                        handleCloseDialog={handleCloseDialog}
                      />
                    </Box>
                  </ClickAwayListener>
                </Popper>
              )}
            </Grid>
          )}
        </Grid>
      </Grid>
    </FormProviderWithForm>
  );
};

export default SpaceFieldForm;
