import React, {
  useCallback,
  memo,
  Dispatch,
  SetStateAction,
  useState,
  useMemo,
} from "react";
import { ResponsiveContainer, Treemap } from "recharts";
import { getMaturityLevelColors, styles } from "@styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import languageDetector from "@/utils/languageDetector";
import { useTheme, Box, Typography } from "@mui/material";
import { v3Tokens } from "@/config/tokens";
import { t } from "i18next";

interface TreeMapNode {
  name: string;
  id: number;
  description: string;
  count: number;
  label: string;
}

interface TreeMapProps {
  data: TreeMapNode[];
  levels: number;
  lng: string;
  selectedId: number | null;
  setSelectedId: Dispatch<SetStateAction<number | null>>;
}

const CHART_HEIGHT = 300;
const LEGEND_WIDTH = 50;

const TreeMapChart: React.FC<TreeMapProps> = ({
  data,
  levels,
  lng,
  selectedId,
  setSelectedId,
}) => {
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  const lightColors = getMaturityLevelColors(levels, true);
  const darkColors = getMaturityLevelColors(levels);

  const treeMapData = useMemo(
    () =>
      data.map((node) => {
        const idx = Math.max(0, Number(node.label) - 1);
        return { ...node, color: darkColors[idx], bg: lightColors[idx] };
      }),
    [data, lightColors, darkColors],
  );

  const handleSelect = useCallback(
    (id?: number | null) => {
      if (typeof id !== "number") return;
      setSelectedId((prev) => (prev === id ? null : id));
    },
    [setSelectedId],
  );

  const handleHover = useCallback((id?: number | null) => {
    setHoveredId(typeof id === "number" ? id : null);
  }, []);

  return (
    <Box display="flex" alignItems="flex-end" gap={1}>
      {/* Chart */}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
          <Treemap
            data={treeMapData}
            dataKey="count"
            stroke={v3Tokens.surface.containerLowest}
            fill={v3Tokens.surface.containerLowest}
            content={
              <CustomNode
                levels={levels}
                lng={lng}
                selectedId={selectedId}
                hoveredId={hoveredId}
                onSelect={handleSelect}
                onHover={handleHover}
              />
            }
          ></Treemap>
        </ResponsiveContainer>
      </Box>
      {/* Legend  */}
      <VerticalLegend
        levels={levels}
        lng={lng}
        lightColors={lightColors}
        darkColors={darkColors}
        height={100}
      />
    </Box>
  );
};

function VerticalLegend({
  levels,
  lng,
  lightColors,
  darkColors,
  height = 50,
}: Readonly<{
  levels: number;
  lng: string;
  lightColors: string[];
  darkColors: string[];
  height?: number;
}>) {
  const order = [...Array(levels).keys()].reverse();

  return (
    <Box
      width={LEGEND_WIDTH}
      sx={{ ...styles.centerCH, userSelect: "none", pointerEvents: "none" }}
    >
      <Typography
        variant="caption"
        color="success.dark"
        mt={0.5}
        fontWeight={600}
      >
        {t("common.best", { lng })}
      </Typography>

      <Box width={LEGEND_WIDTH - 20} borderRadius={0.5} overflow="hidden">
        {order.map((i) => (
          <Box
            key={i}
            height={height / lightColors.length}
            bgcolor={lightColors[i]}
            boxShadow={`inset 0 0 0 1px ${darkColors[i]}20`}
          />
        ))}
      </Box>

      <Typography
        variant="caption"
        color="error.main"
        mt={0.5}
        fontWeight={600}
      >
        {t("common.worst", { lng })}
      </Typography>
    </Box>
  );
}

const CustomNode: React.FC<any> = memo((props) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const {
    x,
    y,
    width,
    height,
    name,
    color,
    label,
    levels,
    lng,
    bg,
    id,
    selectedId,
    hoveredId,
    onSelect,
    onHover,
  } = props;

  const activeId = hoveredId ?? selectedId;
  const isActive = activeId === id;
  const dimOthers = activeId !== null && !isActive;
  const groupOpacity = dimOthers ? 0.6 : 1;
  const strokeWidth = dimOthers ? 0.7 : 2;

  const events = {
    onClick: (e: React.MouseEvent<SVGGElement>) => {
      e.stopPropagation();
      onSelect?.(id);
    },
    onMouseEnter: (e: React.MouseEvent<SVGGElement>) => {
      e.stopPropagation();
      onHover?.(id);
    },
    onMouseLeave: (e: React.MouseEvent<SVGGElement>) => {
      e.stopPropagation();
      onHover?.(null);
    },
  };

  if (width <= 30 || height <= 30) {
    return (
      <g opacity={groupOpacity} {...events} style={{ cursor: "pointer" }}>
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          fill={bg}
          stroke={color}
          strokeOpacity={groupOpacity}
          rx={8}
          ry={8}
          style={{ transition: "opacity 120ms ease, stroke-width 120ms ease" }}
        />
      </g>
    );
  }

  const fontSize = width / 12;
  const adjustedFontSize = fontSize > 13 ? (isSmallScreen ? 10 : 13) : fontSize;
  const truncatedName =
    name?.length > 10 && fontSize < 10 ? `${name.slice(0, 11)}…` : name;
  const isFarsi = lng === "fa";
  const subText = isFarsi
    ? `\u200F${label} از ${levels}`
    : `${label} out of ${levels}`;

  return (
    <g opacity={groupOpacity} {...events} style={{ cursor: "pointer" }}>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill={bg}
        stroke={color}
        strokeWidth={strokeWidth}
        strokeOpacity={groupOpacity}
        style={{ transition: "opacity 120ms ease, stroke-width 120ms ease" }}
      />
      {width > 50 && height > 20 && (
        <>
          <text
            x={x + width / 2}
            y={y + height / 2 - 10}
            textAnchor="middle"
            fontSize={adjustedFontSize}
            fontWeight={200}
            strokeWidth={1}
            letterSpacing={languageDetector(truncatedName) ? 0 : 0.5}
            stroke={color}
            strokeOpacity={groupOpacity}
          >
            {truncatedName}
          </text>
          <text
            x={x + width / 2}
            y={y + height / 2 + 10}
            textAnchor="middle"
            fontSize={11}
            fontWeight={200}
            alignmentBaseline="middle"
            stroke={color}
            strokeOpacity={groupOpacity}
          >
            {subText}
          </text>
        </>
      )}
    </g>
  );
});

export default TreeMapChart;
