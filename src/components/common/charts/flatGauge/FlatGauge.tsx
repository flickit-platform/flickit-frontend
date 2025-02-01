import { lazy, Suspense, useMemo } from "react";
import Box, { BoxProps } from "@mui/material/Box";
import { farsiFontFamily, primaryFontFamily, theme } from "@config/theme";
import { Trans } from "react-i18next";
import { Typography } from "@mui/material";
import { confidenceColor, getMaturityLevelColors } from "@styles";
import { capitalizeFirstLetter } from "@/utils/filterLetter";
import { t } from "i18next";
import languageDetector from "@/utils/languageDetector";

type TPosition = "top" | "left";

interface IGaugeProps extends BoxProps {
  maturityLevelNumber: number;
  levelValue: number;
  text: string;
  textPosition: TPosition;
  confidenceLevelNum?: number;
  confidenceText?: string | null;
  lng?: string;
}

export const confidencePallet: any = {
  10: "#A50026",
  20: "#D73027",
  30: "#F46D43",
  40: "#FDAE61",
  50: "#FEE08B",
  60: "#D9EF8B",
  70: "#A6D96A",
  80: "#66BD63",
  90: "#1A9850",
  100: "#006837",
};

const FlatGauge = (props: IGaugeProps) => {
  const {
    maturityLevelNumber,
    levelValue,
    text,
    textPosition,
    confidenceLevelNum = 0,
    confidenceText = t("confidenceLevel"),
    lng,
    ...rest
  } = props;

  if (maturityLevelNumber < levelValue) return null;

  const FlatGaugeComponent = useMemo(
    () => lazy(() => import(`./flatGauge${maturityLevelNumber}.tsx`)),
    [maturityLevelNumber],
  );

  const checkColor = (num: number): string => {
    if (num == 100) {
      return confidenceColor[4];
    } else {
      let newNum = Math.floor(num / 20);
      return confidenceColor[newNum];
    }
  };

  const colorPallet = getMaturityLevelColors(maturityLevelNumber);
  const colorCode = colorPallet ? colorPallet[levelValue - 1] : "gray";

  return (
    <Suspense fallback={<Box>fallback</Box>}>
      <Box sx={{ height: "100%" }} {...rest}>
        <Box
          sx={{
            display: "flex",
            flexDirection: `${textPosition == "top" ? "column" : "row"}`,
            textAlign: "center",
            width: "fit-content",
            gap: "1rem",
            justifyContent: "center",
            alignItems: "center",
            mx: "auto",
          }}
        >
          {textPosition == "top" && (
            <Typography
              sx={{
                ...theme.typography.semiBoldLarge,
                color: colorCode,
                fontSize: "1.25rem",
                fontWeight: "bold",
                fontFamily: languageDetector(text ?? "")
                  ? farsiFontFamily
                  : primaryFontFamily,
              }}
            >
              {capitalizeFirstLetter(text)}
            </Typography>
          )}
          <Box
            style={{
              display: "flex",
              alignItems: "center",
              gap: "3px",
              width: "fit-content",
            }}
          >
            <FlatGaugeComponent colorCode={colorCode} value={levelValue} />
            {textPosition == "left" && (
              <Typography
                sx={{
                  color: colorCode,
                  fontFamily: languageDetector(text ?? "")
                    ? farsiFontFamily
                    : primaryFontFamily,
                  marginInlineStart: 0.5,
                  textAlign: "right",
                }}
              >
                <Trans i18nKey={`${text}`} />
              </Typography>
            )}
          </Box>
          {textPosition == "top" && (
            <Typography
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "5px",
                ...theme.typography.extraLight,
                fontWeight: 300,
                fontFamily: languageDetector(confidenceText ?? "")
                  ? farsiFontFamily
                  : primaryFontFamily,
              }}
            >
              {confidenceText}
              <Typography
                sx={{
                  color: checkColor(confidenceLevelNum),
                  ...theme.typography.titleMedium,
                  fontFamily: languageDetector(confidenceText ?? "")
                    ? farsiFontFamily
                    : primaryFontFamily,
                }}
              >
                {" "}
                {confidenceLevelNum}%{" "}
              </Typography>
            </Typography>
          )}
        </Box>
      </Box>
    </Suspense>
  );
};

export default FlatGauge;
