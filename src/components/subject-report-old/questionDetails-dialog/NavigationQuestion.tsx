import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { styles } from "@styles";
import { theme } from "@config/theme";
import { Trans } from "react-i18next";

const NavigationQuestion = () => {
  return (
    <Box sx={{ display: "flex", justifyContent: "space-between", mb: "24px" }}>
      <Box
        sx={{
          ...styles.centerVH,
          gap: 1,
          cursor: "pointer",
        }}
      >
        <ArrowBackIosIcon sx={{ color: "#2196F3", fontSize: ".7rem" }} />
        <Typography
          variant={"semiBoldLarge"}
          sx={{
            color: theme.palette.primary.main,
            fontSize: "12px",
          }}
        >
          <Trans i18nKey={"previousQuestion"} />
        </Typography>
      </Box>
      <Box
        sx={{
          ...styles.centerVH,
          gap: 1,
          cursor: "pointer",
        }}
      >
        <Typography
          variant={"semiBoldLarge"}
          sx={{
            color: theme.palette.primary.main,
            fontSize: "12px",
          }}
        >
          <Trans i18nKey={"nextQuestion"} />
        </Typography>
        <ArrowForwardIosIcon sx={{ color: "#2196F3", fontSize: ".7rem" }} />
      </Box>
    </Box>
  );
};

export default NavigationQuestion;
