import { farsiFontFamily, primaryFontFamily, theme } from "@/config/theme";
import languageDetector from "@/utils/languageDetector";
import { Box, Divider, Typography } from "@mui/material";
import { t } from "i18next";
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
  Tooltip,
} from "recharts";
import { styles } from "@styles";
import { Trans } from "react-i18next";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const missedScore = payload[0].payload.missedScore;
    const gainedScore = payload[0].payload.gainedScore;

    return (
      <Box
        sx={{
          textAlign: "center",
          backgroundColor: "#5F6E7C",
          color: "white",
          borderRadius: "4px",
          p: 1,
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            direction: "ltr",
            gap: 2,
          }}
        >
          <Box sx={{ ...styles.centerCVH }}>
            <Typography
              variant="body1"
              sx={{ color: "white", fontWeight: "bold" }}
            >
              {missedScore}
            </Typography>
            <Typography variant="body2" sx={{ color: "white" }}>
              <Trans i18nKey="missedScore" />
            </Typography>
          </Box>

          <Box sx={{ ...styles.centerCVH }}>
            <Typography
              variant="body1"
              sx={{ color: "white", fontWeight: "bold" }}
            >
              {gainedScore}
            </Typography>
            <Typography variant="body2" sx={{ color: "white" }}>
              <Trans i18nKey="gainedScore" />
            </Typography>
          </Box>
        </Box>
      </Box>
    );
  }

  return null;
};

export default function ScoreImpactBarChart({ measures }: any) {
  const chartData = measures?.map((measure: any) => ({
    name: measure.title,
    pv: -Math.abs(measure.missedScorePercentage),
    uv: measure.gainedScorePercentage,
    missedScore: measure.missedScore,
    gainedScore: measure.gainedScore,
  }));

  const barSize = Math.min(24, Math.max(14, 240 / (chartData?.length || 1)));

  return (
    <div style={{ width: "100%", height: "500px", direction: "rtl" }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          layout="vertical"
          data={chartData}
          stackOffset="sign"
          margin={{
            top: 0,
            right: theme.direction === "ltr" ? 80 : 10,
            left: theme.direction === "ltr" ? 10 : 80,
            bottom: 0,
          }}
          barSize={barSize}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal />
          <Tooltip content={<CustomTooltip />} />

          <Legend
            verticalAlign="top"
            formatter={(value) => (
              <span
                style={{ marginInlineStart: theme.direction === "ltr" ? 8 : 0 }}
              >
                {value === "uv" ? t("gainedScore") : t("missedScore")}
              </span>
            )}
          />

          <ReferenceLine x={0} strokeDasharray="3 3" />

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
            width={160}
            tick={({ x, y, payload }) => {
              const isFarsi = languageDetector(payload.value);
              return (
                <text
                  x={x}
                  y={y + 5}
                  textAnchor={theme.direction === "rtl" ? "end" : "start"}
                  fontSize={14}
                  fontFamily={isFarsi ? farsiFontFamily : primaryFontFamily}
                  fill="#333"
                >
                  {payload.value}
                </text>
              );
            }}
            orientation={theme.direction === "rtl" ? "right" : "left"}
          />
          <Bar
            dataKey="uv"
            fill="#2466A8"
            stackId="stack"
            radius={[0, 10, 10, 0]}
            isAnimationActive={false}
          >
            <LabelList
              dataKey="uv"
              position="right"
              fill="#2466A8"
              formatter={(v: any) => (v !== 0 ? `${v}%` : "")}
              style={{
                textAnchor: "end",
                fontSize: 14,
              }}
            />
          </Bar>
          <Bar
            dataKey="pv"
            fill="#B8144B"
            stackId="stack"
            radius={[0, 10, 10, 0]}
            isAnimationActive={false}
          >
            <LabelList
              dataKey="pv"
              position="right"
              fill="#B8144B"
              formatter={(v: any) => (v !== 0 ? `${Math.abs(v)}%` : "")}
              style={{
                textAnchor: "start",
                fontSize: 14,
              }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
