import React, { useEffect, useMemo, useState } from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import { theme } from "@config/theme";
import ContactSupport from "@assets/svg/ContactSupport.svg";
import polygon from "@assets/svg/dialogPolygon.svg";
import Typography from "@mui/material/Typography";
import { Trans } from "react-i18next";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import { Close } from "@mui/icons-material";
import { useLocation, useParams } from "react-router-dom";
import { setSurveyBox, useConfigContext } from "@providers/ConfgProvider";
import { useAuthContext } from "@providers/AuthProvider";
import { useQuery } from "@utils/useQuery";
import { useServiceContext } from "@providers/ServiceProvider";

const SurveyBoxSection = (props: any) => {
  const [showFeedback, setShowFeadback] = useState(true);
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const { service } = useServiceContext();
  const { assessmentId } = useParams()
  const { pathname } = useLocation();
  const {
    config: { SurveyBox, appTitle },
    dispatch,
  } = useConfigContext();
  const {
    userInfo: { email, showSurvey },
  } = useAuthContext();
  const { isAuthenticatedUser } = useAuthContext();

  const dontShowSurvey = useQuery({
    service: (args= { assessmentId }, config) =>
      service.common.dontShowSurvey( args, config),
    runOnMount: false,
  });

  const closeFeadbackBox = () => {
    setShowFeadback(false);
    if(dontShowAgain){
      dontShowSurvey.query()
    }
  };
  useEffect(() => {
    if (pathname.includes("graphical-report")) {
      setShowFeadback(true);
    } else {
      setShowFeadback(false);
      dispatch(setSurveyBox(false));
    }
  }, [pathname]);

  const goToSurvey = () => {
    window.open(`https://formafzar.com/form/zzn90?email=${email}`, "_blank");
  };
  const  showSurveyBox  = useMemo(() => {
    return showSurvey && showFeedback && SurveyBox && isAuthenticatedUser
  }, [showSurvey, showFeedback, SurveyBox, isAuthenticatedUser]);

  return (
    <Box
      sx={{
        position: "fixed",
        right: { xs: "2.5%", lg: "1.6%", xl: "2%" },
        bottom: { xs: 0, md: "55px" },
        display: showSurveyBox ? "flex" : "none",
      }}
    >
      <Box
        sx={{
          position: "relative",
          background: theme.palette.primary.main,
          bottom: "65px",
          right: 0,
          borderRadius: "8px",
          px: "32px",
          pt: "28px",
          pb: "8px",
          maxWidth: "320px",
        }}
      >
        <IconButton
          aria-label="close"
          onClick={closeFeadbackBox}
          edge="end"
          size="small"
          sx={{ color: "#fff", position: "absolute", left: 2.5, top: 2.5 }}
          data-testid="close-btn"
        >
          <Close />
        </IconButton>
        <Typography sx={{ ...theme.typography.semiBoldXLarge, color: "#fff" }}>
          <Trans i18nKey={"common.gotMinute"} />
        </Typography>
        <Typography
          sx={{ ...theme.typography.bodyMedium, color: "#fff", mb: 2 }}
        >
          <Trans
            i18nKey={"common.helpUsToImprove"}
            values={{ appName: appTitle }}
          />
        </Typography>
        <Button
          onClick={goToSurvey}
          variant={"contained"}
          size="small"
          sx={{
            background: "#F3F5F6",
            color: theme.palette.primary.main,
            width: "100%",
            "&:hover": {
              background: "#F3F5F6",
            },
          }}
        >
          <Trans i18nKey={"common.giveFeedback"} />
        </Button>
        <FormControlLabel
          sx={{
            marginInlineEnd: 0,
            color: "#fff",
            display: props?.disabled ? "none" : "block",
          }}
          data-cy="automatic-submit-check"
          control={
            <Checkbox
              checked={dontShowAgain}
              sx={{
                color: "#fff",
                "&.Mui-checked": {
                  color: "#fff",
                },
              }}
              onChange={(e) => setDontShowAgain(e.target.checked)}
            />
          }
          label={
            <Typography
              sx={{ ...theme.typography.bodySmall, display: "inline-block" }}
            >
              <Trans i18nKey={"common.dontShowAgain"} />
            </Typography>
          }
        />
        <Box
          component={"img"}
          src={polygon}
          sx={{ position: "absolute", bottom: "-10px", right: "20px" }}
        />
      </Box>
    </Box>
  );
};

const FloatButton = (props: any) => {
  const { dialogProps } = props;

  return (
    <>
      <SurveyBoxSection {...props} />
      <Box
        sx={{
          position: "fixed",
          right: { xs: "2.5%", lg: "1.6%", xl: "2%" },
          bottom: { xs: 0, md: "55px" },
        }}
      >
        <IconButton
          edge="start"
          sx={{
            background: theme.palette.primary.main,
            "&:hover": {
              background: theme.palette.primary.dark,
            },
            borderRadius: "50%",
            width: "56px",
            height: "56px",
          }}
          onClick={() => dialogProps.openDialog({})}
        >
          <img src={ContactSupport} alt={"ContactSupport"} />
        </IconButton>
      </Box>
    </>
  );
};

export default FloatButton;
