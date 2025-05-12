import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { farsiFontFamily, primaryFontFamily } from "@config/theme";
import languageDetector from "@/utils/languageDetector";
import ChartTooltip from "./ChartTooltip";
import uniqueId from "@/utils/uniqueId";

interface SemiCircleChartProps {
  items: {
    title: string;
    description?: string;
    attributes: { title: string; description?: string }[];
    [key: string]: any;
  }[];
  childrenField: string;
}

const subjectColors = [
  { main: "#2466A8", attribute: "rgba(36, 102, 168, 0.12)" },
  { main: "#3D8F3D", attribute: "rgba(61, 143, 61, 0.12)" },
  { main: "#CC7400", attribute: "rgba(204, 116, 0, 0.12)" },
  { main: "#B8144B", attribute: "rgba(138, 15, 56, 0.12)" },
];

const useResponsiveRadius = () => {
  const [radius, setRadius] = useState({ inner: 285, outer: 489 });

  useEffect(() => {
    const updateRadius = () => {
      const width = window.innerWidth;
      if (width < 960) {
        setRadius({ inner: 180, outer: 300 });
      } else if (width < 1280) {
        setRadius({ inner: 220, outer: 350 });
      } else if (width < 1620) {
        setRadius({ inner: 270, outer: 450 });
      } else {
        setRadius({ inner: 290, outer: 500 });
      }
    };

    updateRadius();
    window.addEventListener("resize", updateRadius);
    return () => window.removeEventListener("resize", updateRadius);
  }, []);

  return radius;
};

const renderCustomLabel = (props: any, totalAttributes: number) => {
  const RADIAN = Math.PI / 180;
  const { cx, cy, outerRadius, midAngle, name, payload } = props;

  const radius = outerRadius * 0.8;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  const rotateAngle =
    totalAttributes < 5
      ? 70 - (midAngle / 180) * 140
      : (() => {
          const flip = midAngle > 90 && midAngle < 270;
          return flip ? 180 - midAngle : -midAngle;
        })();

  const MAX_LENGTH = 25;
  const isFarsi = languageDetector(name);

  if (name.length > MAX_LENGTH && name.includes(" ")) {
    const words = name.split(" ");
    const firstLine = words.slice(0, Math.ceil(words.length / 2)).join(" ");
    const secondLine = words.slice(Math.ceil(words.length / 2)).join(" ");

    return (
      <g transform={`rotate(${rotateAngle}, ${x}, ${y})`}>
        <text
          x={x}
          y={y - 8}
          fill={payload.textColor}
          fontSize={14}
          fontWeight={500}
          textAnchor="middle"
          dominantBaseline="central"
          style={{ fontFamily: isFarsi ? farsiFontFamily : primaryFontFamily }}
        >
          {firstLine}
        </text>
        <text
          x={x}
          y={y + 14}
          fill={payload.textColor}
          fontSize={14}
          fontWeight={500}
          textAnchor="middle"
          dominantBaseline="central"
          style={{ fontFamily: isFarsi ? farsiFontFamily : primaryFontFamily }}
        >
          {secondLine}
        </text>
      </g>
    );
  }

  return (
    <text
      x={x}
      y={y}
      fill={payload.textColor}
      fontSize={14}
      fontWeight={500}
      textAnchor="middle"
      dominantBaseline="central"
      transform={`rotate(${rotateAngle}, ${x}, ${y})`}
      style={{
        fontFamily: isFarsi ? farsiFontFamily : primaryFontFamily,
      }}
    >
      {name}
    </text>
  );
};

const renderMainLabel = (props: any) => {
  const RADIAN = Math.PI / 180;
  const { cx, cy, outerRadius, midAngle, name } = props;
  const radius = outerRadius - 90;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  const rotateAngle = 70 - (midAngle / 180) * 140;

  return (
    <text
      x={x}
      y={y}
      fill="#fff"
      textAnchor="middle"
      dominantBaseline="central"
      transform={`rotate(${rotateAngle}, ${x}, ${y})`}
      fontSize={22}
      fontWeight={500}
      style={{
        fontFamily: languageDetector(name)
          ? farsiFontFamily
          : primaryFontFamily,
      }}
    >
      {name}
    </text>
  );
};

const SemiCircleChart = ({ items, childrenField }: SemiCircleChartProps) => {
  const radius = useResponsiveRadius();

  const mainData = items.map((item, index) => {
    const colorPair = subjectColors[index % subjectColors.length];
    return {
      name: item.title,
      value: 25,
      color: colorPair.main,
      attributeColor: colorPair.attribute,
      description: item.description ?? "",
    };
  });

  const attributeData = items.flatMap((item, index) => {
    const subject = mainData[index];
    return (
      item[childrenField] as { title: string; description?: string }[]
    ).map((child) => ({
      name: child.title,
      value: 100 / ((item[childrenField] as []).length || 1),
      fillColor: subject.attributeColor,
      textColor: subject.color,
      description: child.description ?? "",
    }));
  });
  const totalAttributes = attributeData.length;

  return (
    <ResponsiveContainer width="100%" height={"100%"}>
      <PieChart>
        <Tooltip content={<ChartTooltip />} />
        <Pie
          data={mainData}
          dataKey="value"
          startAngle={180}
          endAngle={0}
          innerRadius={0}
          outerRadius={radius.inner}
          label={renderMainLabel}
          labelLine={false}
          cx="50%"
          cy="100%"
        >
          {mainData.map((entry) => (
            <Cell key={uniqueId()} fill={entry.color} />
          ))}
        </Pie>

        <Pie
          data={attributeData}
          dataKey="value"
          startAngle={180}
          endAngle={0}
          innerRadius={radius.inner}
          outerRadius={radius.outer}
          label={(props) => renderCustomLabel(props, totalAttributes)}
          labelLine={false}
          isAnimationActive={false}
          cx="50%"
          cy="100%"
        >
          {attributeData.map((entry) => (
            <Cell key={uniqueId()} fill={entry.fillColor} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
};

export default SemiCircleChart;
