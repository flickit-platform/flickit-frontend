import { useMemo } from "react";
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  RadarChart,
  ResponsiveContainer,
  Text,
  Radar,
  Legend,
} from "recharts";
import Skeleton from "@mui/material/Skeleton";
import convertToSubjectChartData from "@utils/convertToSubjectChartData";
import { t } from "i18next";
import { theme } from "@/config/theme";

const SubjectRadarChart = (props: any) => {
  const { loading, ...rest } = props;
  return loading ? (
    <Skeleton
      height={"620px"}
      width="620px"
      variant="circular"
      sx={{ margin: "auto" }}
    />
  ) : (
    <SubjectRadar {...rest} />
  );
};

const SubjectRadar = (props: any) => {
  const { data: res = {}, loaded } = props;
  const { maturityLevelsCount } = res;
  const data = useMemo(() => {
    return convertToSubjectChartData(res);
  }, [loaded]);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
        <PolarGrid />
        <PolarAngleAxis
          dataKey="title"
          tick={({ payload, x, y, cx, cy, ...rest }: any) => {
            return (
              <Text
                {...rest}
                y={y + (y - cy) / (theme.direction === "rtl" ? 7 : 15)}
                x={x + (x - cx) / (theme.direction === "rtl" ? 7 : 15)}
                fontSize="1.25rem"
              >
                {payload.value}
              </Text>
            );
          }}
          orientation={theme.direction === "ltr" ? "inner" : "outer"}
        />
        <PolarRadiusAxis
          angle={90}
          domain={[0, maturityLevelsCount]}
          type="number"
          tickCount={maturityLevelsCount + 1}
          tick={false}
        />
        {/* <Radar name="confidence level" dataKey="cl" stroke="#137681" fill="#3596A1" fillOpacity={0.5} /> */}
        <Radar
          name={t("maturityLevel") as string}
          dataKey="ml"
          stroke="#004F83"
          fill="#004F83"
          fillOpacity={0.5}
        />
        <Legend wrapperStyle={{ paddingTop: 20 }} />{" "}
      </RadarChart>
    </ResponsiveContainer>
  );
};

export default SubjectRadarChart;
