import { useState } from "react";
import { Box, Divider, Tooltip, Typography } from "@mui/material";
import { theme } from "@/config/theme";
import { Trans } from "react-i18next";
import { styles } from "@styles";

const ScoreDisplay = ({ gainedScore, missedScore }: any) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const absGainedScore = Math.abs(gainedScore);
  const absMissedScore = Math.abs(missedScore);
  const totalScore = absGainedScore + absMissedScore;

  const minWidth = 20;
  const maxWidth = 200;
  const width = Math.min(maxWidth, Math.max(minWidth, totalScore * 10));

  const height = 12;

  const missedWidth = totalScore > 0 ? (absMissedScore / totalScore) * 50 : 0;
  const gainedWidth = totalScore > 0 ? (absGainedScore / totalScore) * 50 : 0;

  return (
    <Tooltip
      title={
        <Box
          sx={{
            textAlign: "center",
            backgroundColor: "#5F6E7C",
            color: "white",
            borderRadius: "4px",
            p: 0.5,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Box sx={{ ...styles.centerCVH }}>
              <Typography variant="semiBoldSmall" sx={{ color: "white" }}>
                {missedScore}
              </Typography>
              <Typography variant="labelSmall" sx={{ color: "white" }}>
                <Trans i18nKey="missedScore" />
              </Typography>
            </Box>
            <Divider
              orientation="vertical"
              flexItem
              sx={{ mx: "8px", bgcolor: "white" }}
            />
            <Box sx={{ ...styles.centerCVH }}>
              <Typography variant="semiBoldSmall" sx={{ color: "white" }}>
                {gainedScore}
              </Typography>
              <Typography variant="labelSmall" sx={{ color: "white" }}>
                <Trans i18nKey="gainedScore" />
              </Typography>
            </Box>
          </Box>
        </Box>
      }
    >
      <Box
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: isHovered ? `${width + 10}px` : `${width}px`,
          height: `${height}px`,
          borderRadius: "16px",
          overflow: "hidden",
          transition: "all 0.3s ease",
          position: "relative",
        }}
      >
        <Box
          sx={{
            width: `${missedWidth}%`,
            height: "100%",
            backgroundColor: theme.palette.secondary.main,
            position: "absolute",
            left: `calc(50% - ${missedWidth}%)`,
            top: 0,
            borderTopLeftRadius: "16px",
            borderBottomLeftRadius: "16px",
          }}
        />
        <Box
          sx={{
            width: `${gainedWidth}%`,
            height: "100%",
            backgroundColor: theme.palette.primary.main,
            position: "absolute",
            right: `calc(50% - ${gainedWidth}%)`,
            top: 0,
            borderTopRightRadius: "16px",
            borderBottomRightRadius: "16px",
          }}
        />
      </Box>
    </Tooltip>
  );
};

export default ScoreDisplay;
