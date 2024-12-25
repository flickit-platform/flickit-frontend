import { t } from "i18next";
import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

interface PieChartNode {
  name: string;
  value: number;
  label?: string;
}

interface CustomPieChartProps {
  data: PieChartNode[];
}

const CustomPieChart: React.FC<CustomPieChartProps> = ({ data }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const sliceCount = data.length;
  const equalValue = total / sliceCount;

  const renderLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    name,
    label,
  }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) / 2;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    const maxLength = 17;
    const truncatedName =
      name.length > maxLength ? name.substring(0, maxLength) + "..." : name;
    const truncatedLabel =
      label && label.length > maxLength
        ? label.substring(0, maxLength) + "..."
        : label;

    return (
      <g>
        <text
          x={x}
          y={y - 10}
          fill="#333"
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={14}
        >
          {truncatedName}
        </text>
        <text
          x={x}
          y={y + 10}
          fill="#888"
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={12}
        >
          {truncatedLabel}
        </text>
      </g>
    );
  };

  const centeredText = `${sliceCount}`;

  return (
    <ResponsiveContainer width="100%" height={370}>
      <PieChart>
        <circle
          cx="50%"
          cy="50%"
          r="66"
          fill="white"
          stroke="#C2850A"
          strokeWidth={3}
        />
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={18}
          fontWeight="bold"
          fill="#333"
          direction="rtl"
        >
          {centeredText}
        </text>
        <text
          x="50%"
          y="55%"
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={18}
          fontWeight="bold"
          fill="#333"
          direction="rtl"
        >
          {t("subjects")}
        </text>
        <Pie
          data={data.map((item) => ({ ...item, value: equalValue }))}
          cx="50%"
          cy="50%"
          startAngle={90}
          endAngle={-270}
          innerRadius={80}
          outerRadius={180}
          dataKey="value"
          paddingAngle={5}
          label={renderLabel}
        >
          {data.map((item, index) => (
            <Cell
              key={`cell-${index}`}
              fill="#ffffff"
              stroke="#C2850A"
              strokeWidth={2}
            />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
};

export default CustomPieChart;
