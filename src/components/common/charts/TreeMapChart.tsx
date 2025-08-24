import React, { useCallback, memo, Dispatch, SetStateAction } from "react";
import { ResponsiveContainer, Treemap, Tooltip } from "recharts";
import { getMaturityLevelColors } from "@styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import languageDetector from "@/utils/languageDetector";
import ChartTooltip from "./ChartTooltip";
import { useTheme } from "@mui/material";
import { v3Tokens } from "@/config/tokens";

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
  lang: { code: string };
  selectedId: number | null;
  setSelectedId: Dispatch<SetStateAction<number | null>>;
}

const TreeMapChart: React.FC<TreeMapProps> = ({
  data,
  levels,
  lang,
  selectedId,
  setSelectedId,
}) => {
  const lightColors = getMaturityLevelColors(levels, true);
  const darkColors = getMaturityLevelColors(levels);

  const treeMapData = data.map((node) => {
    const idx = Math.max(0, Number(node.label) - 1);
    return {
      ...node,
      color: darkColors[idx],
      bg: lightColors[idx],
    };
  });

  const handleSelect = useCallback((id?: number | null) => {
    if (typeof id !== "number") return;
    setSelectedId((prev) => (prev === id ? null : id));
  }, []);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <Treemap
        data={treeMapData}
        dataKey="count"
        stroke={v3Tokens.surface.containerLowest}
        fill={v3Tokens.surface.containerLowest}
        content={
          <CustomNode
            levels={levels}
            lang={lang}
            selectedId={selectedId}
            onSelect={handleSelect}
          />
        }
      >
        <Tooltip
          wrapperStyle={{ outline: "none" }}
          content={
            <ChartTooltip
              getPrimary={(d) => d.description}
              getSecondary={() => ""}
            />
          }
        />
      </Treemap>
    </ResponsiveContainer>
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
    label,
    levels,
    lang,
    bg,
    id,
    selectedId,
    onSelect,
  } = props;

  const isSelected = selectedId === id;
  const dimOthers = selectedId !== null && !isSelected;
  const groupOpacity = dimOthers ? 0.6 : 1;
  const strokeWidth = dimOthers ? 0.7 : 2;

  if (width <= 30 || height <= 30) {
    return (
      <g
        opacity={groupOpacity}
        onClick={(e) => {
          e.stopPropagation();
          onSelect?.(id);
        }}
        style={{ cursor: "pointer" }}
      >
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
        />
      </g>
    );
  }

  const fontSize = width / 12;
  const adjustedFontSize = fontSize > 13 ? (isSmallScreen ? 10 : 13) : fontSize;
  const truncatedName =
    name?.length > 10 && fontSize < 10 ? `${name.slice(0, 11)}…` : name;

  const isFarsi = (lang?.code || "").toUpperCase() === "FA";
  const subText = isFarsi
    ? `\u200F${label} از ${levels}`
    : `${label} out of ${levels}`;

  return (
    <g
      opacity={groupOpacity}
      onClick={(e) => {
        e.stopPropagation();
        onSelect?.(id);
      }}
      style={{ cursor: "pointer" }}
    >
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill={bg}
        stroke={color}
        strokeWidth={strokeWidth}
        strokeOpacity={groupOpacity}
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
