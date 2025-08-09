import Box, { BoxProps } from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { lazy, Suspense, useMemo, useRef } from "react";
import { Trans } from "react-i18next";
import { styles, getMaturityLevelColors } from "@styles";
import SkeletonGauge from "@common/charts/SkeletonGauge";
import ConfidenceLevel from "@/utils/confidenceLevel/confidenceLevel";
import PermissionRequired from "@common/charts/permissionRequired";
import languageDetector from "@/utils/languageDetector";
import { t } from "i18next";
import { farsiFontFamily, primaryFontFamily } from "@/config/theme";

interface IGaugeProps extends BoxProps {
  maturity_level_number: number;
  maturity_level_status: string;
  level_value: number;
  confidence_value?: number | null;
  height?: number | string;
  className?: string;
  hideGuidance?: boolean;
  confidence_text?: string | null;
  isMobileScreen?: boolean;
  maturity_status_guide?: string | null;
  maturity_status_guide_variant?: any;
  status_font_variant?: any;
  textPosition?: "top" | "bottom";
}

const Gauge = ({
  maturity_level_status,
  maturity_level_number = 5,
  level_value,
  confidence_value = 0,
  height = 200,
  className,
  hideGuidance,
  isMobileScreen,
  confidence_text,
  maturity_status_guide,
  maturity_status_guide_variant = "titleMedium",
  status_font_variant,
  textPosition = "top",
  ...rest
}: IGaugeProps) => {
  const colorPallet = getMaturityLevelColors(maturity_level_number);
  const colorCode = colorPallet?.[level_value - 1] ?? "gray";

  const gaugeComponentCache = useRef<any>({});

  const GaugeComponent = useMemo(() => {
    gaugeComponentCache.current[maturity_level_number] ??= lazy(
      () => import(`./GaugeComponent${maturity_level_number}.tsx`),
    );
    return gaugeComponentCache.current[maturity_level_number];
  }, [maturity_level_number]);

  const calculateFontSize = (length: number): string => {
    const maxLength = 14; // Example threshold for maximum length
    const minLength = 4; // Example threshold for minimum length
    let maxFontSizeRem = 1.5; // 24px / 16 = 1.5rem
    let minFontSizeRem = 1; // 18px / 16 = 1.125rem
    if (isMobileScreen) {
      maxFontSizeRem = 2.5;
      minFontSizeRem = 1.125;
    }
    if (hideGuidance && !isMobileScreen) {
      maxFontSizeRem = 3;
      minFontSizeRem = 2.25;
    }

    if (length <= minLength) return `${maxFontSizeRem}rem`;
    if (length >= maxLength) return `${minFontSizeRem}rem`;

    const fontSizeRem =
      maxFontSizeRem -
      ((length - minLength) / (maxLength - minLength)) *
        (maxFontSizeRem - minFontSizeRem);
    return `${fontSizeRem}rem`;
  };

  const fontSize = calculateFontSize(maturity_level_status?.length ?? 0);

  return (
    <Box
      position="relative"
      width="100%"
      height={height}
      overflow="hidden" // اضافه کردن overflow: hidden
      {...rest}
    >
      <Suspense fallback={<SkeletonGauge />}>
        {maturity_level_status ? (
          <GaugeComponent
            confidence_value={confidence_value}
            colorCode={colorCode}
            value={level_value || -1}
            height={height}
            className={className}
          />
        ) : (
          <img
            alt="empty"
            width="100%"
            height={height}
            src="/assets/svg/maturityNull.svg"
          />
        )}
      </Suspense>
      {level_value ? (
        <Box
          sx={{
            ...styles.centerCVH,
            position: "absolute",
            top: isMobileScreen ? "unset" : "50%",
            bottom: isMobileScreen ? "4%" : "unset",
            left: "50%",
            transform: isMobileScreen
              ? "translateX(-50%)"
              : "translate(-50%, -50%)",
            textAlign: "center",
          }}
        >
          {!hideGuidance && !isMobileScreen && (
            <Typography
              variant="subtitle2"
              color="black"
              fontSize={{ xs: "1rem", sm: "1rem", md: "0.875rem" }}
            >
              <Trans i18nKey="common.maturityGuidanceFirst" />
            </Typography>
          )}
          {maturity_status_guide && (
            <Typography
              mt="1rem"
              variant={maturity_status_guide_variant}
              color="#243342"
            >
              {maturity_status_guide}
            </Typography>
          )}
          <Typography
            sx={{
              fontWeight: "bold",
              fontFamily: languageDetector(t(maturity_level_status))
                ? farsiFontFamily
                : primaryFontFamily,
            }}
            variant={status_font_variant ?? "h6"}
            color={colorCode}
            fontSize={status_font_variant ? "2rem" : fontSize}
            mt={maturity_status_guide ? "0.5rem" : "0px"}
          >
            {maturity_level_status}
          </Typography>
          {confidence_text && (
            <Typography
              variant={maturity_status_guide_variant}
              color="#6C8093"
              mt={!isMobileScreen ? "1.5rem" : "unset"}
              display="flex"
              justifyContent="center"
              alignItems="center"
              gap="0.125rem"
              sx={{
                fontFamily: languageDetector(confidence_text)
                  ? farsiFontFamily
                  : primaryFontFamily,
              }}
            >
              {confidence_text}
              <ConfidenceLevel
                displayNumber
                inputNumber={Math.ceil(confidence_value ?? 0)}
                variant="titleSmall"
                fontFamily={
                  languageDetector(confidence_text)
                    ? farsiFontFamily
                    : primaryFontFamily
                }
              />
            </Typography>
          )}
          {!hideGuidance && !isMobileScreen && (
            <Typography
              variant="subtitle2"
              color="black"
              fontSize={{ xs: "1rem", sm: "1rem", md: "0.875rem" }}
            >
              <Trans i18nKey="common.maturityGuidanceSecond" />
            </Typography>
          )}
        </Box>
      ) : (
        <Box
          sx={{ ...styles.centerCVH, bottom: "22%", left: "25%", right: "25%" }}
          position="absolute"
        >
          <PermissionRequired />
          <Typography
            sx={{ fontWeight: "bold", whiteSpace: "nowrap" }}
            variant="h5"
            color="GrayText"
          >
            <Trans i18nKey="notification.permissionRequired" />
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export { Gauge };
