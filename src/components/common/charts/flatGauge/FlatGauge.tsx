import { Suspense } from "react";
import Box, { BoxProps } from "@mui/material/Box";
import { farsiFontFamily, primaryFontFamily } from "@config/theme";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import { confidenceColor, getMaturityLevelColors, styles } from "@styles";
import { capitalizeFirstLetter } from "@/utils/filterLetter";
import languageDetector from "@/utils/languageDetector";
import FlatGaugeComponent from "@common/flatGaugeComponent";
import ConfidenceLevel from "@utils/confidenceLevel/confidenceLevel";
import Tooltip from "@mui/material/Tooltip";

type TPosition = "top" | "left";

interface IGaugeProps extends BoxProps {
  maturityLevelNumber: number;
  levelValue: number;
  text: string;
  textPosition: TPosition;
  confidenceLevelNum?: number;
  confidenceText?: string | null;
  lng?: string;
  segment?: {width: number, height: number}
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
    confidenceText,
    lng,
    ...rest
  } = props;
  const isSmallScreen = useMediaQuery((theme: any) =>
    theme.breakpoints.down("sm"),
  );

  if (maturityLevelNumber < levelValue) return null;
  const darkColors = getMaturityLevelColors(maturityLevelNumber);

  const checkColor = (num: number): string => {
    if (num == 100) {
      return confidenceColor[4];
    } else {
      let newNum = Math.floor(num / 20);
      return confidenceColor[newNum];
    }
  };

  const isFarsi = languageDetector(text ?? "");

  return (
    <Suspense fallback={<Box>fallback</Box>}>
      <Box sx={{ height: "100%", textAlign: "center" }} {...rest}>
        <Box
          flexDirection={
            textPosition === "top" || isSmallScreen ? "column" : "row"
          }
          gap="1rem"
          mx="auto"
          sx={{ ...styles.centerVH }}
        >
          {textPosition === "top" && (
            <Tooltip title={text}
            sx={{
              fontFamily: isFarsi ? farsiFontFamily : primaryFontFamily,
            }}
            >
              <Typography
                color={"surface.on"}
                sx={{
                  fontSize: "1.25rem",
                  fontWeight: "bold",
                  fontFamily: isFarsi ? farsiFontFamily : primaryFontFamily,
                  whiteSpace: "nowrap",
                  textAlign: "center",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  width: { sm: "100px", md: "200px", lg: "300px" },
                }}
              >
                {capitalizeFirstLetter(text)}
              </Typography>
            </Tooltip>
          )}

          <Box
            gap="3px"
            width="fit-content"
            flexDirection={isSmallScreen ? "column" : "row"}
            sx={{ ...styles.centerV }}
          >
            <FlatGaugeComponent
              {...rest}
            levels={maturityLevelNumber}
            levelValue={levelValue}
            lng={lng}
            darkColors={darkColors}
            position="horizontal"
            guideText={false}
            pointer={true}
            />
            {textPosition === "left" && (
              <Typography
                color={"surface.on"}
                sx={{
                  fontFamily: isFarsi ? farsiFontFamily : primaryFontFamily,
                  ml: 0.5,
                  textAlign: "right",
                }}
              >
                {text}
              </Typography>
            )}
          </Box>

          {textPosition === "top" && confidenceText && (
            <Typography
              variant="bodyMedium"
              color={"surface.onVariant"}
              sx={{
                ...styles.centerVH,
                gap: "5px",
                fontWeight: 300,
                fontFamily: languageDetector(confidenceText ?? "")
                  ? farsiFontFamily
                  : primaryFontFamily,
              }}
            >
              {confidenceText}
              <ConfidenceLevel displayNumber={true} inputNumber={confidenceLevelNum} />
            </Typography>
          )}
        </Box>
      </Box>
    </Suspense>
  );
};

export default FlatGauge;
