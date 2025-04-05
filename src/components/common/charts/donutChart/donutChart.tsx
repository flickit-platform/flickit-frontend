import { lazy, Suspense, useMemo } from "react";
import Box, { BoxProps } from "@mui/material/Box";
import { farsiFontFamily, primaryFontFamily, theme } from "@config/theme";
import { Trans } from "react-i18next";
import Typography from "@mui/material/Typography";
import { getMaturityLevelColors, styles } from "@styles";
import languageDetector from "@/utils/languageDetector";

interface IGaugeProps extends BoxProps {
  maturityLevelNumber: number;
  levelValue: number;
  text: string;
  displayTitle?: boolean;
}

const DonutChart = (props: IGaugeProps) => {
  const {
    maturityLevelNumber,
    levelValue,
    text,
    displayTitle = true,
    height = "110",
    ...rest
  } = props;

  const CircleGaugeComponent = useMemo(
    () => lazy(() => import(`./donutChart${maturityLevelNumber}.tsx`)),
    [maturityLevelNumber],
  );

  if (maturityLevelNumber < levelValue) return null;

  const colorPallet = getMaturityLevelColors(maturityLevelNumber);
  const colorCode = colorPallet ? colorPallet[levelValue - 1] : "gray";

  return (
    <Suspense fallback={<Trans i18nKey={"loading"} />}>
      <Box sx={{ height: "100%" }} {...rest}>
        <Box
          sx={{
            ...styles.centerCVH,
            textAlign: "center",
            gap: "1rem",
          }}
        >
          <Box
            style={{
              display: "flex",
              alignItems: "center",
              gap: "3px",
            }}
          >
            <CircleGaugeComponent
              colorCode={colorCode}
              value={levelValue}
              height={height}
            />
          </Box>
          {displayTitle && (
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
          )}
        </Box>
      </Box>
    </Suspense>
  );
};

export default DonutChart;
