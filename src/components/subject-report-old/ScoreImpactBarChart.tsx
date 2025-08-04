import { farsiFontFamily, primaryFontFamily } from "@/config/theme";
import languageDetector from "@/utils/languageDetector";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { t } from "i18next";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
  LabelList,
  Tooltip,
} from "recharts";
import { styles } from "@styles";

const CustomTooltip = ({
  active,
  payload,
  language,
}: {
  active?: boolean;
  payload?: any[];
  language?: string;
}) => {
  if (!active || !payload?.length) return null;

  const { missedScore, gainedScore } = payload[0].payload;

  return (
    <Box
      sx={{
        textAlign: "center",
        backgroundColor: "#5F6E7C",
        color: "white",
        borderRadius: "4px",
        p: 1,
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
        {[
          { score: missedScore, label: "subject.missedScore" },
          { score: gainedScore, label: "subject.gainedScore" },
        ].map(({ score, label }) => (
          <Box key={label} sx={{ ...styles.centerCVH }}>
            <Typography
              variant="semiBoldSmall"
              sx={{
                color: "white",
                fontFamily:
                  language === "fa" ? farsiFontFamily : primaryFontFamily,
              }}
            >
              {Math.abs(score)}
            </Typography>
            <Typography
              variant="bodySmall"
              sx={{
                color: "white",
                fontFamily:
                  language === "fa" ? farsiFontFamily : primaryFontFamily,
              }}
            >
              {t(label, { lng: language })}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

const legendFormatter = (value: string, language: string) => {

  return (
    <Typography
      component="span"
      variant="labelSmall"
      sx={{
        fontFamily: language === "fa" ? farsiFontFamily : primaryFontFamily,
        marginInline: 2,
      }}
    >
      {value === "uv"
        ? t("subject.gainedScore", { lng: language })
        : t("subject.missedScore", { lng: language })}
    </Typography>
  );
};

interface Measure {
  title: string;
  missedScorePercentage: number;
  gainedScorePercentage: number;
  missedScore: number;
  gainedScore: number;
}

export default function ScoreImpactBarChart({
  measures,
  language,
  compact = false,
}: Readonly<{ measures: Measure[]; language: string; compact?: boolean }>) {
  const chartData = measures?.map((measure) => ({
    name: measure.title,
    pv: -Math.abs(measure.missedScorePercentage),
    uv: measure.gainedScorePercentage,
    missedScore: measure.missedScore,
    gainedScore: measure.gainedScore,
  }));

  const baseBarSize = compact ? 16 : 24;
  const barSize = Math.min(
    baseBarSize,
    Math.max(compact ? 12 : 14, 220 / (chartData?.length ?? 1) + 1),
  );

  const heightPerItem = compact ? 40 : 60;
  const chartHeight = Math.max(240, measures.length * heightPerItem);

  return (
    <div
      style={{
        width: "100%",
        height: `${chartHeight}px`,
        direction: "rtl",
        transformOrigin: "top",
      }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          layout="vertical"
          data={chartData}
          stackOffset="sign"
          margin={{
            top: 0,
            bottom: 0,
          }}
          barSize={barSize}
        >
          <Tooltip content={<CustomTooltip language={language} />} />
          <Legend
            verticalAlign="top"
            formatter={(val) => legendFormatter(val, language)}
            wrapperStyle={{
              transform:
                language === "fa" ? "translateX(-90px)" : "translateX(113px)",
            }}
          />
          <ReferenceLine x={0} strokeDasharray="3 3" />
          <XAxis
            type="number"
            domain={[-100, 100]}
            display={compact ? "none" : "block"}
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
            width={200}
            tick={({ x, y, payload }) => {
              const isFarsi = language === "fa";
              const isFarsiText = languageDetector(payload.value);
              const adjustedX = isFarsi ? x + 190 : x - 190;

              return (
                <text
                  x={adjustedX}
                  y={y + 5}
                  textAnchor={isFarsi ? "start" : "end"}
                  fontSize={14}
                  fontFamily={isFarsiText ? farsiFontFamily : primaryFontFamily}
                  fill="#333"
                >
                  {payload.value}
                </text>
              );
            }}
            orientation={language === "fa" ? "right" : "left"}
          />
          <Bar
            dataKey="uv"
            fill="#2466A8"
            stackId="stack"
            radius={[0, 4, 4, 0]}
            isAnimationActive={false}
          >
            <LabelList
              dataKey="uv"
              position="right"
              fill="#2466A8"
              formatter={(v: any) => (v !== 0 ? `${v}%` : "")}
              style={{ textAnchor: "end", fontSize: compact ? 12 : 14 }}
            />
          </Bar>
          <Bar
            dataKey="pv"
            fill="#B8144B"
            stackId="stack"
            radius={[0, 4, 4, 0]}
            isAnimationActive={false}
          >
            <LabelList
              dataKey="pv"
              position="right"
              fill="#B8144B"
              formatter={(v: any) => (v !== 0 ? `${Math.abs(v)}%` : "")}
              style={{ textAnchor: "start", fontSize: compact ? 12 : 14 }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
