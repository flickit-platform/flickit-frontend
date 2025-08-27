import Divider from "@mui/material/Divider";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
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
          textAlign="center"
          bgcolor="#5F6E7C"
          color="background.containerLowest"
          borderRadius="4px"
          p={0.5}
        >
          <Box
            sx={{
              ...styles.centerVH,
              direction: "ltr",
            }}
          >
            <Box sx={{ ...styles.centerCVH }}>
              <Typography
                variant="semiBoldSmall"
                color="background.containerLowest"
              >
                {missedScore} ({missedScorePercentage}%)
              </Typography>
              <Typography
                variant="bodySmall"
                color="background.containerLowest"
              >
                <Trans i18nKey="subject.missedScore" />
              </Typography>
            </Box>
            <Divider
              orientation="vertical"
              flexItem
              sx={{ mx: "8px", bgcolor: "background.containerLowest" }}
            />
            <Box sx={{ ...styles.centerCVH }}>
              <Typography
                variant="semiBoldSmall"
                color="background.containerLowest"
              >
                {gainedScore} ({gainedScorePercentage}%)
              </Typography>
              <Typography
                variant="bodySmall"
                color="background.containerLowest"
              >
                <Trans i18nKey="subject.gainedScore" />
              </Typography>
            </Box>
          </Box>
        </Box>
      }
    >
      <Box
        width={`${width}px`}
        height={`${height}px`}
        borderRadius="4px"
        overflow="hidden"
        position="relative"
        margin="0 auto"
        sx={{
          ...styles.centerVH,
          transition: "all 0.3s ease",
        }}
      >
        <Box
          width="2px"
          height="100%"
          position="absolute"
          left="50%"
          zIndex={1}
          sx={{ transform: "translateX(-50%)" }}
        />

        <Box
          width={`${missedWidth}px`}
          height="100%"
          bgcolor="secondary.main"
          position="absolute"
          right="50%"
          top={0}
          sx={{
            borderTopLeftRadius: "4px",
            borderBottomLeftRadius: "4px",
          }}
        />

        <Box
          width={`${gainedWidth}px`}
          height="100%"
          bgcolor="primary.main"
          position="absolute"
          left="50%"
          top={0}
          sx={{
            borderTopRightRadius: "4px",
            borderBottomRightRadius: "4px",
          }}
        />
      </Box>
    </Tooltip>
  );
};

export default ScoreDisplay;
