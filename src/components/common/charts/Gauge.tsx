import Box, { BoxProps } from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { lazy, Suspense, useMemo, useRef } from "react";
import { Trans } from "react-i18next";
import { styles, getMaturityLevelColors } from "@styles";
import SkeletonGauge from "@common/charts/SkeletonGauge";
import CompletionRing from "@/components/common/charts/completion-ring/CompletionRing";
import HiddenMaturityLevel from "@/assets/svg/hidden-maturity-level.svg";
import permissionRequired from "@/assets/svg/permission-required.svg";
import languageDetector from "@/utils/language-detector";
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
  maturity_status_guide?: string | null;
  confidence_text_variant?: any;
  status_font_variant?: any;
}

const Gauge = ({
  maturity_level_status,
  maturity_level_number = 5,
  level_value,
  confidence_value = 0,
  height,
  className,
  confidence_text,
  maturity_status_guide,
  confidence_text_variant = "titleMedium",
  status_font_variant,
  ...rest
}: IGaugeProps) => {
  const colorPallet = getMaturityLevelColors(maturity_level_number);
  const colorCode = colorPallet?.[level_value - 1] ?? "disabled.main";

  const gaugeComponentCache = useRef<any>({});
  const GaugeComponent = useMemo(() => {
    gaugeComponentCache.current[maturity_level_number] ??= lazy(
      () => import(`./GaugeComponent${maturity_level_number}.tsx`),
    );
    return gaugeComponentCache.current[maturity_level_number];
  }, [maturity_level_number]);

  return (
    <Box width="100%" overflow="visible" position="relative" {...rest}>
      <Box position="relative" width="100%" height={height} overflow="hidden">
        <Suspense fallback={<SkeletonGauge />}>
          {maturity_level_status ? (
            <GaugeComponent
              confidence_value={confidence_value}
              colorPallet={colorPallet}
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
              src={HiddenMaturityLevel}
            />
          )}
        </Suspense>
      </Box>

      {level_value ? (
        <Box
          sx={{
            width: "100%",
            textAlign: "center",
            px: 1,
            pointerEvents: "none",
          }}
        >
          <Typography
            component="div"
            sx={{
              fontFamily: languageDetector(t(maturity_level_status))
                ? farsiFontFamily
                : primaryFontFamily,
              whiteSpace: "normal",
            }}
            variant={status_font_variant ?? "headlineMedium"}
            color="background.onVariant"
          >
            {maturity_level_status}
          </Typography>

          {confidence_text && (
            <Typography
              variant={confidence_text_variant}
              color="background.onVariant"
              gap="0.125rem"
              mt="4px"
              sx={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: languageDetector(confidence_text)
                  ? farsiFontFamily
                  : primaryFontFamily,
                whiteSpace: "normal",
                wordBreak: "break-word",
                overflowWrap: "anywhere",
              }}
            >
              {confidence_text}
              <CompletionRing
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

          {maturity_status_guide && (
            <Typography
              variant={confidence_text_variant}
              color="#6C8093"
              sx={{
                whiteSpace: "normal",
                wordBreak: "break-word",
                overflowWrap: "anywhere",
              }}
            >
              {maturity_status_guide}
            </Typography>
          )}
        </Box>
      ) : (
        <Box
          sx={{
            ...styles.centerCVH,
            position: "absolute",
            inset: 0,
            gap: "8px",
            pointerEvents: "none",
            px: 2,
          }}
        >
          <img
            alt="empty"
            width="80px"
            height="80px"
            src={permissionRequired}
          />{" "}
          <Typography
            variant="headlineSmall"
            color="background.onVariant"
            textAlign="center"
          >
            <Trans i18nKey="notification.reportInaccebile" />
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export { Gauge };
