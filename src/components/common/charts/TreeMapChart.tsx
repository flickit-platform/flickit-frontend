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
}

interface TreeMapProps {
  data: TreeMapNode[];
}

const TreeMapChart: React.FC<TreeMapProps> = ({ data }) => {
  const treeMapData = data.map((node) => ({
    ...node,
    color: getMaturityLevelColors(node.count),
  }));

  return (
    <ResponsiveContainer width="100%" height={400}>
      <Treemap
        data={treeMapData}
        dataKey="count"
        stroke="#fff"
        content={<CustomNode />}
      />
    </ResponsiveContainer>
  );
};

const CustomNode: React.FC<RectangleProps> = (props) => {
  const { x, y, width, height, name, count, color } = props as any;

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
            fontWeight="bold"
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
            {`Count: ${count}`}
          </text>
        </>
      )}
    </g>
  );
};

export default TreeMapChart;
