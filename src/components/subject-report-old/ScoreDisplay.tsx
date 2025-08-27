import Divider from "@mui/material/Divider";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { Trans } from "react-i18next";
import { styles } from "@styles";

type ScoreDisplayProps = {
  data: {
    missedScore?: number;
    gainedScore?: number;
    missedScorePercentage?: number;
    gainedScorePercentage?: number;
  };
  minUnitPx?: number;
  maxUnitPx?: number;
  heightPx?: number;
};

const isNum = (v: any) => typeof v === "number" && Number.isFinite(v);

const ScoreDisplay = ({
  data,
  minUnitPx = 24,
  maxUnitPx = 24,
  heightPx = 12,
}: ScoreDisplayProps) => {
  const {
    missedScore,
    gainedScore,
    missedScorePercentage,
    gainedScorePercentage,
  } = data;

  const ms = isNum(missedScore) ? Math.abs(missedScore as number) : 0;
  const gs = isNum(gainedScore) ? Math.abs(gainedScore as number) : 0;

  const missedWidth = Math.min(maxUnitPx * ms, Math.max(minUnitPx * ms, 0));
  const gainedWidth = Math.min(maxUnitPx * gs, Math.max(minUnitPx * gs, 0));
  const width = missedWidth + gainedWidth;

  const bar = (
    <Box
      width={`${width}px`}
      height={`${heightPx}px`}
      borderRadius="4px"
      overflow="hidden"
      position="relative"
      margin="0 auto"
      sx={{ ...styles.centerVH, transition: "all 0.3s ease" }}
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
        sx={{ borderTopLeftRadius: "4px", borderBottomLeftRadius: "4px" }}
      />
      <Box
        width={`${gainedWidth}px`}
        height="100%"
        bgcolor="primary.main"
        position="absolute"
        left="50%"
        top={0}
        sx={{ borderTopRightRadius: "4px", borderBottomRightRadius: "4px" }}
      />
    </Box>
  );

  const showTooltip = isNum(missedScore) && isNum(gainedScore);

  if (!showTooltip) return bar;

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
          <Box sx={{ ...styles.centerVH, direction: "ltr" }}>
            <Box sx={{ ...styles.centerCVH }}>
              <Typography variant="semiBoldSmall" color="background.containerLowest">
                {missedScore} ({missedScorePercentage}%)
              </Typography>
              <Typography variant="bodySmall" color="background.containerLowest">
                <Trans i18nKey="subject.missedScore" />
              </Typography>
            </Box>
            <Divider
              orientation="vertical"
              flexItem
              sx={{ mx: "8px", bgcolor: "background.containerLowest" }}
            />
            <Box sx={{ ...styles.centerCVH }}>
              <Typography variant="semiBoldSmall" color="background.containerLowest">
                {gainedScore} ({gainedScorePercentage}%)
              </Typography>
              <Typography variant="bodySmall" color="background.containerLowest">
                <Trans i18nKey="subject.gainedScore" />
              </Typography>
            </Box>
          </Box>
        </Box>
      }
    >
      {bar}
    </Tooltip>
  );
};

export default ScoreDisplay;
