import React from "react";
import {
  ResponsiveContainer,
  Treemap,
  TreemapProps,
  RectangleProps,
} from "recharts";
import { getMaturityLevelColors } from "@styles";

interface TreeMapNode {
  name: string;
  count: number;
  label: string;
}

interface TreeMapProps {
  data: TreeMapNode[];
  levels: number;
}

const TreeMapChart: React.FC<TreeMapProps> = ({ data, levels }) => {
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
        content={<CustomNode levels={levels} />}
      />
    </ResponsiveContainer>
  );
};

const CustomNode: any = (props: any) => {
  const { x, y, width, height, name, color, label, levels } = props as any;
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
            fontSize="14"
            fontWeight={200}
          >
            {name}
          </text>
          <text
            x={x + width / 2}
            y={y + height / 2 + 10}
            textAnchor="middle"
            fill="#fff"
            fontSize="12"
          >
            {` ${label}/${levels}`}
          </text>
        </>
      )}
    </g>
  );
};

export default TreeMapChart;
