import { useMemo } from "react";
import { Box } from "@mui/material";
import { styles } from "@styles";
import i18next, { t } from "i18next";
import uniqueId from "@/utils/unique-id";
import { v3Tokens } from "@/config/tokens";
import { Text } from "./Text";

interface Props {
  levels: number;
  levelValue: number | null;
  lng?: string | null;
  darkColors: string[];
  position?: "horizontal" | "vertical" | "vertical-trapezoid";
  guideText?: boolean;
  pointer?: boolean;
  segment?: { width: number; height: number };
}

interface ArrowProps {
  position: "horizontal" | "vertical" | "vertical-trapezoid";
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
    width: 20,
    height: 12,
  },
}) => {
  const lngCode = lng ?? i18next.language;
  const isRtl = (lngCode === "fa" && !lng) || lng === "fa";

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

  const topWidth = 24;
  const cellHeight = 20;
  const slope = 0.1;

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
        <Text
          variant="caption"
          color="success.dark"
          mt={0.5}
          fontWeight={600}
          sx={{ ...styles.rtlStyle(isRtl) }}
        >
          {t("common.best", { lngCode })}
        </Text>
      )}

      <Box sx={{ position: "relative" }}>
        {position === "vertical-trapezoid" ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column-reverse",
              alignItems: "center",
            }}
          >
            {Array.from({ length: levels }).map((_, i) => {
              const widthTop = topWidth * Math.pow(1 - slope, levels - 1 - i);
              const widthBottom = topWidth * Math.pow(1 - slope, levels - i);
              const offsetTop = (topWidth - widthTop) / 2;
              const offsetBottom = (topWidth - widthBottom) / 2;
              const clipPath = `polygon(${offsetTop}px 0, ${
                offsetTop + widthTop
              }px 0, ${offsetBottom + widthBottom}px ${cellHeight}px, ${offsetBottom}px ${cellHeight}px)`;

              let borderRadius: string | number = 0;

              if (i === levels - 1) {
                borderRadius = "2px 2px 0 0";
              } else if (i === 0) {
                borderRadius = "0 0 2px 2px";
              }

              return (
                <Box
                  key={i}
                  sx={{
                    width: `${topWidth}px`,
                    height: `${cellHeight}px`,
                    bgcolor: darkColors[i],
                    clipPath,
                    WebkitClipPath: clipPath,
                    mb: 0,
                    borderRadius,
                    overflow: "hidden",
                  }}
                />
              );
            })}
          </Box>
        ) : (
          <Box
            sx={{
              display: "flex",
              flexDirection:
                position === "horizontal" ? "row" : "column-reverse",
              overflow: "hidden",
            }}
          >
            {Array.from({ length: levels }).map((_, i) => (
              <Box
                key={uniqueId()}
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
        )}

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
            <Arrow position={position} markerColor={v3Tokens.primary.main} />
          </Box>
        )}
      </Box>

      {guideText && (
        <Text
          variant="caption"
          color="error.main"
          mt={0.5}
          fontWeight={600}
          sx={{ ...styles.rtlStyle(isRtl) }}
        >
          {t("common.worst", { lngCode })}
        </Text>
      )}
    </Box>
  );
};

export default FlatGaugeComponent;
