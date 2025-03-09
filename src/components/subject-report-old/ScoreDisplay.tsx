import { Box, Divider, Tooltip, Typography, useTheme } from "@mui/material";
import { theme as customTheme } from "@/config/theme";
import { Trans } from "react-i18next";
import { styles } from "@styles";

const ScoreDisplay = ({ gainedScore, missedScore }: any) => {
  const theme = useTheme();
  const minWidthPerUnit = 20;
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
              direction: 'ltr',
            }}
          >
            <Box sx={{ ...styles.centerCVH }}>
              <Typography variant="semiBoldSmall" sx={{ color: "white" }}>
                {missedScore}
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
                {gainedScore}
              </Typography>
              <Typography variant="bodySmall" sx={{ color: "white" }}>
                <Trans i18nKey="gainedScore" />
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
          width: gainedWidth && missedWidth ? `${width}px` : `${width + 10}px`,
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
            width: `${missedWidth}px`,
            height: "100%",
            backgroundColor: customTheme.palette.secondary.main,
            position: "absolute",
            left: 0,
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
            right: 0,
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