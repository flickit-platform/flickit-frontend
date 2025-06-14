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
      if (width < 890) {
        setRadius({ inner: 200, outer: 350 });
      } else if (width < 1280) {
        setRadius({ inner: 240, outer: 400 });
      } else if (width < 1400) {
        setRadius({ inner: 250, outer: 420 });
      } else if (width < 1620) {
        setRadius({ inner: 270, outer: 450 });
      } else if (width < 1900) {
        setRadius({ inner: 270, outer: 490 });
      } else {
        setRadius({ inner: 290, outer: 520 });
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
  const { cx, cy, outerRadius, midAngle, name, payload, startAngle, endAngle } =
    props;

  const angleSpan = Math.abs(endAngle - startAngle);
  const isTightAngle = angleSpan < 6;

  const radius = outerRadius * 0.8;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  let rotateAngle: number;
  const flip = midAngle > 90 && midAngle < 270;

  if (totalAttributes < 5) {
    rotateAngle = flip
      ? 75 - (midAngle / 180) * 160
      : 85 - (midAngle / 180) * 160;
  } else {
    rotateAngle = flip ? 180 - midAngle : -midAngle;
  }

  const isFarsi = languageDetector(name);
  const font = isFarsi ? farsiFontFamily : primaryFontFamily;

  let maxCharPerLine: number;
  let maxLines: number;
  let fontSize: number;

  if (isTightAngle) {
    maxCharPerLine = 26;
    maxLines = 1;
    fontSize = 10;
  } else if (totalAttributes < 5) {
    maxCharPerLine = 30;
    maxLines = 2;
    fontSize = 14;
  } else {
    maxCharPerLine = 20;
    maxLines = 2;
    fontSize = 14;
  }

  const buildLines = (
    text: string,
    maxLineLength: number,
    maxLines: number,
  ): string[][] => {
    const words = text.split(" ");
    const lines: string[][] = [];

    for (const word of words) {
      const currentLine = lines[lines.length - 1] ?? [];
      const currentLength = currentLine.join(" ").length + word.length;

      if (!lines.length || currentLength > maxLineLength) {
        if (lines.length < maxLines) {
          lines.push([word]);
        } else {
          if (lines[lines.length - 1].slice(-1)[0] !== "…") {
            lines[lines.length - 1].push("…");
          }
          break;
        }
      } else {
        lines[lines.length - 1].push(word);
      }
    }

    return lines;
  };

  const lines = buildLines(name, maxCharPerLine, maxLines);

  return (
    <g transform={`rotate(${rotateAngle}, ${x}, ${y})`}>
      {lines.map((line, i) => (
        <text
          key={uniqueId()}
          x={x}
          y={y + i * (fontSize + 4) - ((lines.length - 1) * (fontSize + 4)) / 2}
          fill={payload.textColor}
          fontSize={fontSize}
          fontWeight={500}
          textAnchor="middle"
          dominantBaseline="central"
          style={{ fontFamily: font }}
        >
          {line.join(" ")}
        </text>
      ))}
    </g>
  );
};

const renderMainLabel = (props: any, count: number) => {
  const RADIAN = Math.PI / 180;
  const { cx, cy, outerRadius, midAngle, name } = props;

  const labelRadius = outerRadius * (count > 1 ? 0.68 : 0.4);
  const angle = -midAngle;
  const x = cx + labelRadius * Math.cos(angle * RADIAN);
  const y = cy + labelRadius * Math.sin(angle * RADIAN);

  let rotate = -midAngle + 90;

  const isFarsi = languageDetector(name);
  const font = isFarsi ? farsiFontFamily : primaryFontFamily;
  const MAX_LENGTH = 14;

  let lines: string[] = [];
  if (name.length > MAX_LENGTH && name.includes(" ")) {
    const words = name.split(" ");
    let firstLine = "";
    let secondLine = "";
    for (let w of words) {
      if ((firstLine + " " + w).trim().length <= MAX_LENGTH) {
        firstLine = (firstLine + " " + w).trim();
      } else {
        secondLine = (secondLine + " " + w).trim();
      }
    }
    if (!firstLine) {
      firstLine = name.slice(0, MAX_LENGTH);
      secondLine = name.slice(MAX_LENGTH);
    }
    lines = [firstLine, secondLine];
  } else {
    lines = [name];
  }

  const lineCount = lines.length;
  const fontSizeMap: Record<number, number> = {
    1: 22,
    2: 16,
  };
  const fontSize = fontSizeMap[lineCount] ?? 14;

  return (
    <g transform={`translate(${x},${y}) rotate(${rotate})`}>
      {lines.map((line, idx) => (
        <text
          key={idx}
          x={0}
          y={idx * (fontSize + 3) - ((lines.length - 1) * (fontSize + 3)) / 2}
          fill="#fff"
          fontSize={fontSize}
          fontWeight={500}
          textAnchor="middle"
          dominantBaseline="central"
          style={{ fontFamily: font, pointerEvents: "none" }}
        >
          {line}
        </text>
      ))}
    </g>
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
        <Tooltip
          wrapperStyle={{ outline: "none" }}
          content={
            <ChartTooltip
              getPrimary={(d) => d.name}
              getSecondary={(d) => d.description}
            />
          }
        />
        <Pie
          data={mainData}
          dataKey="value"
          startAngle={180}
          endAngle={0}
          innerRadius={0}
          outerRadius={radius.inner}
          label={(props) => renderMainLabel(props, mainData.length)}
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
