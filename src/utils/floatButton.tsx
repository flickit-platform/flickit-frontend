import React, { useState } from "react";
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
import { questionActions } from "@providers/QuestionProvider";

const FloatButton = (props: any) => {
  const { dialogProps } = props;
  const [showFeedback, setShowFeadback] = useState(false);

  const closeFeadbackBox = (e: any) => {};

  return (
    <Box
      sx={{
        position: "fixed",
        right: { xs: "2.5%", lg: "1.6%", xl: "2%" },
        bottom: { xs: 0, md: "55px" },
      }}
    >
      <Box
        sx={{
          position: "relative",
          background: theme.palette.primary.main,
          bottom: "9px",
          borderRadius: "8px",
          px: "32px",
          pt: "28px",
          pb: "8px",
          maxWidth: "320px",
        }}
      >
        <Typography sx={{ ...theme.typography.semiBoldXLarge, color: "#fff" }}>
          <Trans i18nKey={"common.gotMinute"} />
        </Typography>
        <Typography
          sx={{ ...theme.typography.bodyMedium, color: "#fff", mb: 2 }}
        >
          <Trans i18nKey={"common.helpUsToImprove"} />
        </Typography>
        <Button
          variant={"contained"}
          sx={{
            background: "#F3F5F6",
            color: theme.palette.primary.main,
            width: "100%",
            "&:hover": {
              background: "#F3F5F6",
            },
          }}
        >
          <Typography>
            <Trans i18nKey={"common.giveFeedback"} />
          </Typography>
        </Button>
        <FormControlLabel
          sx={{
            mr: 0,
            color: "#fff",
            display: props?.disabled ? "none" : "block",
          }}
          data-cy="automatic-submit-check"
          control={
            <Checkbox
              checked={showFeedback}
              sx={{
                color: "#fff",
                "&.Mui-checked": {
                  color: "#fff",
                },
              }}
              onChange={(e) => setShowFeadback(e.target.checked)}
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
  );
};

export default FloatButton;
