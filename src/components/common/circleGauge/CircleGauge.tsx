import { lazy, Suspense, useMemo } from "react";
import Box, { BoxProps } from "@mui/material/Box";
import { theme } from "@config/theme";
import { Trans } from "react-i18next";
import { Typography } from "@mui/material";
import { getMaturityLevelColors } from "@styles";

interface IGaugeProps extends BoxProps {
  maturityLevelNumber: number;
  levelValue: number;
  text: string;
}

const CircleGauge = (props: IGaugeProps) => {
  const { maturityLevelNumber, levelValue, text, ...rest } = props;

  if (maturityLevelNumber < levelValue) return null;

  const CircleGaugeComponent = useMemo(
    () => lazy(() => import(`./circleGauge${maturityLevelNumber}.tsx`)),
    [maturityLevelNumber],
  );

  const colorPallet = getMaturityLevelColors(maturityLevelNumber);
  const colorCode = colorPallet[levelValue - 1];

  return (
    <Suspense fallback={<Box>fallback</Box>}>
      <Box sx={{ width: "100%", height: "100%" }} {...rest}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            textAlign: "center",
            width: "fit-content",
            gap: "1rem",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Box
            style={{
              direction: theme.direction,
              display: "flex",
              alignItems: "center",
              gap: "3px",
              width: "fit-content",
            }}
          >
            <CircleGaugeComponent colorCode={colorCode} value={levelValue} />
          </Box>
          <Typography
            sx={{
              display: "flex",
              gap: "5px",
              ...theme.typography.titleMedium,
              fontWeight:"bold",
              fontSize:"1.37rem",
              color: colorCode,
            }}
          >
           <Trans i18nKey={text} />
          </Typography>
        </Box>
      </Box>
    </Suspense>
  );
};

export default CircleGauge;