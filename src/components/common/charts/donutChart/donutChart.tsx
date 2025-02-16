import { lazy, Suspense, useMemo } from "react";
import Box, { BoxProps } from "@mui/material/Box";
import { farsiFontFamily, primaryFontFamily, theme } from "@config/theme";
import { Trans } from "react-i18next";
import { Typography } from "@mui/material";
import { getMaturityLevelColors, styles } from "@styles";
import languageDetector from "@/utils/languageDetector";

interface IGaugeProps extends BoxProps {
  maturityLevelNumber: number;
  levelValue: number;
  text: string;
}

const DonutChart = (props: IGaugeProps) => {
  const { maturityLevelNumber, levelValue, text, ...rest } = props;

  if (maturityLevelNumber < levelValue) return null;

  const CircleGaugeComponent = useMemo(
    () => lazy(() => import(`./donutChart${maturityLevelNumber}.tsx`)),
    [maturityLevelNumber],
  );

  const colorPallet = getMaturityLevelColors(maturityLevelNumber);
  const colorCode = colorPallet ? colorPallet[levelValue - 1] : "gray";

  return (
    <Suspense fallback={<Trans i18nKey={"loading"} />}>
      <Box sx={{ width: "100%", height: "100%", ...styles.centerVH }} {...rest}>
        <Box
          sx={{
            ...styles.centerCVH,
            textAlign: "center",
            width: "fit-content",
            gap: "1rem",
          }}
        >
          <Box
            style={{
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
              fontWeight: "bold",
              fontSize: "1.37rem",
              color: colorCode,
              fontFamily: languageDetector(text ?? "")
                ? farsiFontFamily
                : primaryFontFamily,
            }}
          >
            {text}
          </Typography>
        </Box>
      </Box>
    </Suspense>
  );
};

export default DonutChart;
