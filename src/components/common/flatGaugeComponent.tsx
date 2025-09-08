import React, { useMemo } from "react";
import { Box, Typography } from "@mui/material";
import { styles } from "@styles";
import { t } from "i18next";
import { useAssessmentContext } from "@providers/AssessmentProvider";

interface Props {
  levels: number;
  levelValue: number | null;
  lng?: string;
  darkColors: string[];
  position?: "horizontal" | "vertical";
  guideText?: boolean;
  pointer?: boolean;
  segment?: {width: number, height: number};
}

interface ArrowProps {
  position: "horizontal" | "vertical";
  markerColor: string;
}

const Arrow: React.FC<ArrowProps> = ({ position, markerColor }) => (
  <Box
    sx={
      position === "horizontal"
        ? {
            width: 0,
            height: 0,
            borderLeft: "6px solid transparent",
            borderRight: "6px solid transparent",
            borderTop: `8px solid ${markerColor}`,
          }
        : {
            width: 0,
            height: 0,
            borderTop: "6px solid transparent",
            borderBottom: "6px solid transparent",
            borderLeft: `8px solid ${markerColor}`,
          }
    }
  />
);

const FlatGaugeComponent: React.FC<Props> = ({
  levels,
  levelValue,
  lng,
  darkColors,
  position = "horizontal",
  pointer,
  guideText = false,
  segment = {
   width: 20, height: 12
  },
}) => {
  const { assessmentInfo } = useAssessmentContext();
  const language = assessmentInfo?.language;
  const lngCode = language?.code.toLowerCase();
  const isRtl = lng === "fa" || lngCode === "fa";

  const idx = levelValue
    ? Math.max(0, Math.min(levels - 1, levelValue - 1))
    : 0;
  const idxInverse = levels - 1 - idx;

  const activeIdx = useMemo(() => {
    if (position === "horizontal") {
      return isRtl ? idxInverse : idx;
    }
    return idxInverse;
  }, [position, isRtl, idx, idxInverse]);

  const segPct = 100 / levels;
  const centerPct = (activeIdx + 0.5) * segPct;
  const markerColor = darkColors[idx] ?? "#000";

  const getBorderRadius = (i: number): string => {
    const isFirst = i === 0;
    const isLast = i === levels - 1;

    if (!isFirst && !isLast) return "0";

    if (position === "vertical") {
      return isFirst ? "0 0 2px 2px" : "2px 2px 0 0";
    }

    if (isRtl) {
      return isFirst ? "0 2px 2px 0" : "2px 0 0 2px";
    }

    return isFirst ? "2px 0 0 2px" : "0 2px 2px 0";
  };

  return (
    <Box
      sx={{
        ...styles[position === "vertical" ? "centerCH" : "centerH"],
        userSelect: "none",
        pointerEvents: "none",
        direction: isRtl ? "rtl" : "ltr",
      }}
    >
      {guideText && (
        <Typography
          variant="caption"
          color="success.dark"
          mt={0.5}
          fontWeight={600}
          sx={{ ...styles.rtlStyle(isRtl) }}
        >
          {t("common.best", { lng })}
        </Typography>
      )}

      <Box sx={{ position: "relative" }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: position === "horizontal" ? "row" : "column-reverse",
            overflow: "hidden",
          }}
        >
          {Array.from({ length: levels }).map((_, i) => (
            <Box
              key={i}
              sx={{
                width: segment.width,
                height: segment.height,
                bgcolor: darkColors[i],
                border: "0.5px solid #3D4D5C80",
                borderRadius: getBorderRadius(i),
              }}
            />
          ))}
        </Box>

        {pointer && levelValue && (
          <Box
            sx={{
              position: "absolute",
              ...(position === "horizontal"
                ? {
                    left: `${centerPct}%`,
                    top: -10,
                    transform: "translateX(-50%)",
                  }
                : {
                    top: `${centerPct}%`,
                    left: -10,
                    transform: "translateY(-50%)",
                  }),
            }}
          >
            <Arrow position={position} markerColor={markerColor} />
          </Box>
        )}
      </Box>

      {guideText && (
        <Typography
          variant="caption"
          color="error.main"
          mt={0.5}
          fontWeight={600}
          sx={{ ...styles.rtlStyle(isRtl) }}
        >
          {t("common.worst", { lng })}
        </Typography>
      )}
    </Box>
  );
};

export default FlatGaugeComponent;
