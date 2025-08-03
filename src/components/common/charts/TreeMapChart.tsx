import React from "react";
import { ResponsiveContainer, Treemap, Tooltip } from "recharts";
import { getMaturityLevelColors } from "@styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import languageDetector from "@/utils/languageDetector";
import ChartTooltip from "./ChartTooltip";
import { useTheme } from "@mui/material";

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
}

const TreeMapChart: React.FC<TreeMapProps> = ({ data, levels, lang }) => {
  const colorPallet = getMaturityLevelColors(levels);
  const treeMapData = data.map((node) => ({
    ...node,
    color: colorPallet[Number(node.label) - 1],
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <Treemap
        data={treeMapData}
        dataKey="count"
        stroke="#fff"
        fill="white"
        content={<CustomNode levels={levels} lang={lang} />}
        onClick={(props) => {
          const { id }: any = props;
          const element = document.getElementById(id);
          if (element) {
            element.scrollIntoView({ behavior: "smooth" });
          }
        }}
      >
        <Tooltip
          wrapperStyle={{ outline: "none" }}
          content={
            <ChartTooltip
              getPrimary={(d) => d.description}
              getSecondary={(d) => ""}
            />
          }
        />
      </Treemap>
    </ResponsiveContainer>
  );
};

const CustomNode: any = (props: any) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const { x, y, width, height, name, color, label, levels, lang } = props;
  if (width <= 30 || height <= 30)
    return (
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill={color}
        style={{ cursor: "pointer" }}
      />
    );

  const fontSize = width / 12;
  const adjustedFontSize = fontSize > 13 ? (isSmallScreen ? 10 : 13) : fontSize;

  const truncatedName =
    name?.length > 10 && fontSize < 10 ? `${name?.substring(0, 11)}...` : name;
  const isFarsi = lang.code === "FA";

  const text = isFarsi
    ? `\u200F${label} از ${levels}` // \u200F = RLM (Right-to-Left Mark)
    : `${label} out of ${levels}`;
  return (
    <g>
      <rect
        x={x}
        y={y}
        rx={8}
        ry={8}
        width={width}
        height={height}
        fill={color}
        style={{ cursor: "pointer" }}
      />
      {width > 50 && height > 20 && (
        <>
          <text
            x={x + width / 2}
            y={y + height / 2 - 10}
            textAnchor="middle"
            fill="#fff"
            fontSize={adjustedFontSize}
            fontWeight={5}
            letterSpacing={languageDetector(truncatedName) ? 0 : 0.5}
          >
            {truncatedName}
          </text>
          <text
            x={x + width / 2}
            y={y + height / 2 + 10}
            textAnchor="middle"
            fill="#fff"
            fontSize={11}
            fontWeight={5}
            alignmentBaseline="middle"
          >
            {text}
          </text>
        </>
      )}
    </g>
  );
};

export default TreeMapChart;
