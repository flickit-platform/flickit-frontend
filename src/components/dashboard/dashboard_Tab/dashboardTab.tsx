import Box from "@mui/material/Box";
import { Typography } from "@mui/material";
import { Trans } from "react-i18next";
import { theme } from "@config/theme";
import InfoIcon from "@mui/icons-material/Info";
import StepperSection from "@components/dashboard/dashboard_Tab/StepperSection";
const DashboardTab = () => {
  return (
    <Box sx={{ p: "80px 45px", height: "100%", width: "100%" }}>
      <Typography
        sx={{
          ...theme.typography.headlineSmall,
          display: "flex",
          alignItems: "center",
          textAlign: "center",
          color: "#3D4D5C80",
          gap: 2,
          mb: 4,
        }}
      >
        <Trans i18nKey={"assessmentSteps"} />
        <InfoIcon sx={{ cursor: "pointer" }} fontSize={"small"} />
      </Typography>
      <StepperSection />

    </Box>
  );
};

export default DashboardTab;
