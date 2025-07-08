import Divider from "@mui/material/Divider";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { theme as customTheme } from "@/config/theme";
import { Trans } from "react-i18next";
import { styles } from "@styles";

const ScoreDisplay = ({ data }: any) => {
  const {
    missedScore,
    gainedScore,
    missedScorePercentage,
    gainedScorePercentage,
  } = data;
  const minWidthPerUnit = 40;
  const maxWidthPerUnit = 40;

  const missedWidth = Math.min(
    maxWidthPerUnit * Math.abs(missedScore),
    Math.max(minWidthPerUnit * Math.abs(missedScore), 0),
  );

  const gainedWidth = Math.min(
    maxWidthPerUnit * Math.abs(gainedScore),
    Math.max(minWidthPerUnit * Math.abs(gainedScore), 0),
  );

  const width = missedWidth + gainedWidth;
  const height = 12;

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
              direction: "ltr",
            }}
          >
            <Box sx={{ ...styles.centerCVH }}>
              <Typography variant="semiBoldSmall" sx={{ color: "white" }}>
                {missedScore} ({missedScorePercentage}%)
              </Typography>
              <Typography variant="bodySmall" sx={{ color: "white" }}>
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
                {gainedScore} ({gainedScorePercentage}%)
              </Typography>
              <Typography variant="bodySmall" sx={{ color: "white" }}>
                <Trans i18nKey="subject.gainedScore" />
              </Typography>
            </Box>
          </Box>
        </Box>
      }
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: `${width}px`,
          height: `${height}px`,
          borderRadius: "4px",
          overflow: "hidden",
          transition: "all 0.3s ease",
          position: "relative",
          margin: "0 auto",
        }}
      >
        <Box
          sx={{
            width: "2px",
            height: "100%",
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 1,
          }}
        />

        <Box
          sx={{
            width: `${missedWidth}px`,
            height: "100%",
            backgroundColor: customTheme.palette.secondary.main,
            position: "absolute",
            right: "50%",
            top: 0,
            borderTopLeftRadius: "4px",
            borderBottomLeftRadius: "4px",
          }}
        />

        <Box
          sx={{
            width: `${gainedWidth}px`,
            height: "100%",
            backgroundColor: customTheme.palette.primary.main,
            position: "absolute",
            left: "50%",
            top: 0,
            borderTopRightRadius: "4px",
            borderBottomRightRadius: "4px",
          }}
        />
      </Box>
    </Tooltip>
  );
};

export default ScoreDisplay;
