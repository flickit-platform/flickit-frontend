import { farsiFontFamily, primaryFontFamily, theme } from "@/config/theme";
import languageDetector from "@/utils/languageDetector";
import { t } from "i18next";
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
  LabelList,
} from "recharts";

export default function ScoreImpactBarChart({ measures }: any) {
  const chartData = measures?.map((measure: any) => ({
    name: measure.title,
    pv: -Math.abs(measure.missedScorePercentage),
    uv: measure.gainedScorePercentage,
  }));

  return (
    <div style={{ width: "100%", height: "500px", direction: "rtl" }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          layout="vertical"
          data={chartData}
          stackOffset="sign"
          margin={{ top: 40, right: 20, left: 20, bottom: 40 }}
          barSize={24}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal />
          <Legend
            verticalAlign="top"
            formatter={(value) =>
              value === "uv" ? t("gainedScore") : t("missedScore")
            }
          />
          <ReferenceLine x={0} stroke="#000" />

          <XAxis
            type="number"
            domain={[-100, 100]}
            ticks={[-100, -80, -60, -40, -20, 0, 20, 40, 60, 80, 100]}
            axisLine={false}
            tickLine={false}
            tick={{ textAnchor: "middle", fontSize: 12 }}
          />

          <YAxis
            type="category"
            dataKey="name"
            axisLine={false}
            tickLine={false}
            width={100}
            tick={{
              fontSize: 12,
              fill: "#333",
            }}
            orientation={theme.direction === "rtl" ? "right" : "left"}
            style={{
              textAnchor: theme.direction === "rtl" ? "end" : "start",
            }}
          />
  <Bar
            dataKey="uv"
            fill="#2466A8"
            stackId="stack"
            radius={[0, 10, 10, 0]}
          >
            <LabelList
              dataKey="uv"
              position="right"
              fill="#2466A8"
              formatter={(v: any) => `${v}%`}
              style={{
                textAnchor: "end",
              }}
            />
          </Bar>
          <Bar
            dataKey="pv"
            fill="#B8144B"
            stackId="stack"
            radius={[0, 10, 10, 0]}
          >
            <LabelList
              dataKey="pv"
              position="right"
              fill="#B8144B"
              formatter={(v: any) => `${Math.abs(v)}%`}
              style={{
                textAnchor: "start",
              }}
            />
          </Bar>

        
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
