import React from "react";
import { ResponsiveContainer, Treemap, Tooltip } from "recharts";
import { getMaturityLevelColors } from "@styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { theme } from "@/config/theme";
import languageDetector from "@/utils/languageDetector";
import { t } from "i18next";

interface TreeMapNode {
  name: string;
  count: number;
  label: string;
}

interface TreeMapProps {
  data: TreeMapNode[];
  levels: number;
  lang: {code: string}
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
      >
        <Tooltip
          wrapperStyle={{ outline: "none" }}
          content={<CustomTooltip />}
        />
      </Treemap>
    </ResponsiveContainer>
  );
};

const CustomNode: any = (props: any) => {
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const { x, y, width, height, name, color, label, levels, lang } = props;
  if (width <= 10 || height <= 20) return null;

  const fontSize = width / (isSmallScreen ? 10 : 8);
  const adjustedFontSize = fontSize > 13 ? (isSmallScreen ? 10 : 13) : fontSize;

  const truncatedName =
    name?.length > 10 && fontSize < 10 ? `${name?.substring(0, 11)}...` : name;

  return (
    <g>
      <rect x={x} y={y} width={width} height={height} fill={color} />
      {width > 50 && height > 20 && (
        <>
          <text
            x={x + width / 2}
            y={y + height / 2 - 10}
            textAnchor="middle"
            fill="#fff"
            fontSize={adjustedFontSize}
            fontWeight={9}
            letterSpacing={languageDetector(truncatedName) ? 0 : 0.5}
          >
            {truncatedName}
          </text>
          <text
            x={x + width / 2}
            y={y + height / 2 + 10}
            fill="#fff"
            fontWeight={9}
            fontSize={11}
          >
            {`${label} ${lang.code === "EN" ? "out of" :  " از "} ${levels}`}
          </text>
        </>
      )}
    </g>
  );
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload?.length) {
    const { name } = payload[0].payload;
    return (
      <div
        style={{
          backgroundColor: "rgba(97, 97, 97, 0.92)",
          borderRadius: "4px",
          color: "white",
          maxWidth: "300px",
          overflowWrap: "break-word",
          fontWeight: 500,
          border: "none !important",
          boxShadow: "none",
          fontSize: 12,
          padding: 3,
        }}
      >
        <p>{name}</p>
      </div>
    );
  }
  return null;
};

export default TreeMapChart;
