import { Suspense } from "react";
import Box, { BoxProps } from "@mui/material/Box";
import { farsiFontFamily, primaryFontFamily } from "@config/theme";
import useMediaQuery from "@mui/material/useMediaQuery";
import { getMaturityLevelColors, styles } from "@styles";
import { capitalizeFirstLetter } from "@/utils/filter-letter";
import languageDetector from "@/utils/language-detector";
import FlatGaugeComponent from "@/components/common/FlatGaugeComponent";
import CompletionRing from "@/components/common/charts/completion-ring/CompletionRing";
import Tooltip from "@mui/material/Tooltip";
import { Text } from "../../Text";

interface IGaugeProps extends BoxProps {
  maturityLevelNumber: number;
  levelValue: number;
  text: string;
  confidenceLevelNum?: number;
  confidenceText?: string | null;
  lng?: string;
  segment?: { width: number; height: number };
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

  const isFarsi = languageDetector(text ?? "");

  return (
    <Suspense fallback={<Box>fallback</Box>}>
      <Box sx={{ height: "100%", textAlign: "center" }} {...rest}>
        <Box gap="1rem" mx="auto" sx={{ ...styles.centerCVH }}>
          <Tooltip
            title={text}
            sx={{
              fontFamily: isFarsi ? farsiFontFamily : primaryFontFamily,
            }}
          >
            <Text
              color="text.primary"
              sx={{
                fontSize: "1.25rem",
                fontWeight: "bold",
                whiteSpace: "nowrap",
                textAlign: "center",
                overflow: "hidden",
                textOverflow: "ellipsis",
                width: { sm: "100px", md: "200px", lg: "300px" },
              }}
            >
              {capitalizeFirstLetter(text)}
            </Text>
          </Tooltip>

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
          </Box>
          <Text
            variant="bodyMedium"
            color="background.onVariant"
            sx={{
              ...styles.centerVH,
              gap: "5px",
              fontWeight: 300,
            }}
          >
            {confidenceText}
            <CompletionRing
              displayNumber={true}
              inputNumber={confidenceLevelNum}
              variant="semiBoldMedium"
            />
          </Text>
        </Box>
      </Box>
    </Suspense>
  );
};

export default FlatGauge;
