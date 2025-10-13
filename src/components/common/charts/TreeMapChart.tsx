import {
  useCallback,
  memo,
  Dispatch,
  SetStateAction,
  useState,
  useMemo,
} from "react";
import { ResponsiveContainer, Treemap } from "recharts";
import { styles } from "@styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme, Box } from "@mui/material";
import { v3Tokens } from "@/config/tokens";
import FlatGaugeComponent from "@/components/common/FlatGaugeComponent";
import { getSemanticColors } from "@/config/colors";

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

  const lightColors = getSemanticColors(levels, "bg");
  const textColors = getSemanticColors(levels, "text");
  const darkColors = getSemanticColors(levels);

  const treeMapData = useMemo(
    () =>
      data.map((node) => {
        const idx = Math.max(0, Number(node.label) - 1);
        return { ...node, color: textColors[idx], bg: lightColors[idx] };
      }),
    [data, lightColors, textColors],
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
      <FlatGaugeComponent
        levels={levels}
        levelValue={null}
        lng={lng}
        darkColors={darkColors}
        position={"vertical"}
        guideText={true}
        pointer={false}
        segment={{ width: 24, height: 16 }}
      />
    </Box>
  );
};

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
    bg,
    id,
    selectedId,
    hoveredId,
    onSelect,
    onHover,
    lng,
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

  const fontSize = isSmallScreen ? 12 : 15;

  const pad = 6;

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

      {width > 50 && height > 24 && (
        <foreignObject
          x={x + pad}
          y={y + pad}
          width={Math.max(0, width - pad * 2)}
          height={Math.max(0, height - pad * 2)}
          style={{ pointerEvents: "none" }}
        >
          <div
            dir={lng === "fa" ? "rtl" : "ltr"}
            style={
              {
                ...styles.centerVH,
                width: "100%",
                height: "100%",
                textAlign: "center",
                lineHeight: 1.5,
                fontSize: fontSize,
                fontWeight: 500,
                color: color,
                opacity: groupOpacity,
                padding: 0,
                overflow: "hidden",
                WebkitLineClamp: 2 as any,
                WebkitBoxOrient: "vertical" as any,
                wordBreak: "break-word",
                whiteSpace: "normal",
              } as React.CSSProperties
            }
          >
            {name}
          </div>
        </foreignObject>
      )}
    </g>
  );
});

export default TreeMapChart;
