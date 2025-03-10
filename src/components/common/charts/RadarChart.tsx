import React, { useMemo } from "react";
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  RadarChart,
  ResponsiveContainer,
  Radar,
  Legend,
} from "recharts";
import Skeleton from "@mui/material/Skeleton";
import { t } from "i18next";
import convertToAssessmentChartData from "@/utils/convertToAssessmentChartData";
import { useTheme } from "@mui/material/styles";
import languageDetector from "@/utils/languageDetector";
import { farsiFontFamily, primaryFontFamily } from "@/config/theme";

interface RadarChartProps {
  loading: boolean;
  data: any[];
  maturityLevelsCount: number;
  chartHeight?: number;
  lng?: string;
}

const CustomRadarChart: React.FC<
  RadarChartProps
> = ({ loading, data, maturityLevelsCount, chartHeight, lng }) => {
  return loading ? (
    <Skeleton
      height={"620px"}
      width="620px"
      variant="circular"
      sx={{ margin: "auto" }}
    />
  ) : (
    <SubjectRadar
      data={data}
      maturityLevelsCount={maturityLevelsCount}
      chartHeight={chartHeight}
      lng={lng}
    />
  );
};

interface SubjectRadarProps {
  data: any[];
  maturityLevelsCount: number;
  chartHeight?: number;
  lng?: string;
}

const breakTextIntoLines = (text: string, maxLineLength: number) => {
  const words = text.split(" ");
  const lines = [];
  let currentLine = words[0];

  for (let i = 1; i < words.length; i++) {
    if ((currentLine + " " + words[i]).length <= maxLineLength) {
      currentLine += " " + words[i];
    } else {
      lines.push(currentLine);
      currentLine = words[i];
    }
  }
  lines.push(currentLine);
  return lines;
};

const SubjectRadar: React.FC<SubjectRadarProps> = ({
  data,
  maturityLevelsCount,
  chartHeight,
  lng,
}) => {
  const theme = useTheme();
  const chartData = useMemo(() => convertToAssessmentChartData(data), [data]);
  const maxLineLength = 24;

  return (
    <ResponsiveContainer width="100%" height={chartHeight ? chartHeight : 400}>
      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
        <PolarGrid />
        <PolarAngleAxis
          dataKey="title"
          tick={({ payload, x, y, cx, cy, ...rest }: any) => {
            const lines = breakTextIntoLines(payload.value, maxLineLength);
            return (
              <g>
                {lines.map((line, index) => (
                  <text
                    key={line}
                    {...rest}
                    y={
                      y +
                      (y - cy) /
                        ((theme.direction === "rtl" && !lng) || lng === "fa" ? 7 : 15) +
                      index * 12
                    }
                    x={
                      x +
                      (x - cx) /
                        ((theme.direction === "rtl" && !lng) || lng === "fa" ? 7 : 15)
                    }
                    style={{
                      fontFamily: languageDetector(line ?? "")
                        ? farsiFontFamily
                        : primaryFontFamily,
                    }}
                    fontSize={10}
                    color="color(srgb 0.4245 0.5003 0.5759)"
                  >
                    {line}
                  </text>
                ))}
              </g>
            );
          }}
          orientation={
            (theme.direction === "rtl" && !lng) || lng === "fa"
              ? "inner"
              : "outer"
          }
        />
        <PolarRadiusAxis
          angle={90}
          domain={[0, maturityLevelsCount]}
          type="number"
          tickCount={maturityLevelsCount + 1}
          tick={false}
        />
        <Radar
          name={t("maturityLevel") as string}
          dataKey="ml"
          stroke="#9CCAFF"
          fill="#9CCAFF"
          fillOpacity={0.5}
          isAnimationActive={true}
        />
        {!chartHeight && <Legend wrapperStyle={{ paddingTop: 20 }} />}
      </RadarChart>
    </ResponsiveContainer>
  );
};

export default CustomRadarChart;
