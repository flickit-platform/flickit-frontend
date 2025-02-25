import { useMediaQuery } from "@mui/material";
import { t } from "i18next";
import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

interface PieChartNode {
  name: string;
  value: number;
  label?: string;
  color?: string;
  bgColor?: string;
}

interface CustomPieChartProps {
  data: PieChartNode[];
  language: string;
}

const CustomPieChart: React.FC<CustomPieChartProps> = ({ data, language }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const sliceCount = data.length;
  const equalValue = total / sliceCount;
  const isMobileScreen = useMediaQuery((theme: any) =>
    theme.breakpoints.down("md"),
  );

  const renderLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    name,
    label,
    color,
  }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) / 2;
    const maxLength = 22;
    const truncatedName =
      name?.length > maxLength ? name?.substring(0, maxLength) + "..." : name;
    const truncatedLabel =
      label && label.length > maxLength
        ? label.substring(0, maxLength) + "..."
        : label;
    const xprime = cx + radius * Math.cos(-midAngle * RADIAN);
    const yprime = cy + radius * Math.sin(-midAngle * RADIAN);
    const isUpsideDown = midAngle < -0 && -160 < midAngle;
    const textRotation = isUpsideDown ? midAngle + 90 : midAngle - 90;

    return (
      <g transform={`translate(${xprime}, ${yprime}) rotate(${-textRotation})`}>
        <text
          fill={color}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={16}
        >
          {truncatedName}
        </text>
        <text
          y={20}
          fill={color}
          fontWeight={700}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={14}
        >
          {truncatedLabel}
        </text>
      </g>
    );
  };

  const centeredText = `${sliceCount}`;

  return (
    <ResponsiveContainer width="100%" height={!isMobileScreen ? 370 : 250}>
      <PieChart>
        {!isMobileScreen && (
          <>
            <circle
              cx="50%"
              cy="50%"
              r="66"
              fill="#F3F5F6"
              stroke="#C7CCD1"
              strokeWidth={1}
            />
            <text
              x="50%"
              y="48%"
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize={24}
              fontWeight="bold"
              fill="#333"
              direction="rtl"
            >
              {centeredText}
            </text>
            <text
              x="50%"
              y="54%"
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize={16}
              fontWeight="bold"
              fill="#333"
              direction="rtl"
            >
              {t("consideredSubjects", { lng: language })}
            </text>
          </>
        )}
        <Pie
          data={data.map((item) => ({ ...item, value: equalValue }))}
          cx="50%"
          cy="50%"
          startAngle={90}
          endAngle={-270}
          innerRadius={!isMobileScreen ? 80 : ""}
          outerRadius={!isMobileScreen ? 180 : 120}
          dataKey="value"
          paddingAngle={5}
          label={renderLabel}
        >
          {data.map((item, index) => (
            <Cell
              key={`cell-${index}`}
              fill={item.bgColor ?? "#fff"}
              stroke={item.color}
              strokeWidth={2}
            />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
};

export default CustomPieChart;
