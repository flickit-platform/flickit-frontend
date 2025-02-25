import React, { useMemo } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";
import Skeleton from "@mui/material/Skeleton";
import { convertToRadialChartData } from "@/utils/convertToAssessmentChartData";
import { farsiFontFamily, primaryFontFamily, theme } from "@/config/theme";
import languageDetector from "@/utils/languageDetector";
import { useMediaQuery } from "@mui/material";

interface AssessmentSubjectRadialChartProps {
  loading: boolean;
  data: any[];
}

const AssessmentSubjectRadialChart: React.FC<
  AssessmentSubjectRadialChartProps
> = ({ loading, data }) => {
  return loading ? (
    <Skeleton
      height={"620px"}
      width="620px"
      variant="circular"
      sx={{ margin: "auto" }}
    />
  ) : (
    <SubjectRadial data={data} />
  );
};

interface SubjectRadialProps {
  data: any[];
}

const SubjectRadial: React.FC<SubjectRadialProps> = ({ data }) => {
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const wordLimit = !isSmallScreen ? 18 : 12;
  const formatXAxisTick = (tick: string) => {
    return tick.length > wordLimit
      ? `${tick?.substring(0, wordLimit)}...`
      : tick;
  };
  const chartData = useMemo(() => convertToRadialChartData(data), [data]);
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart cx="50%" cy="50%" barSize={30} data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="title" interval={0} tickFormatter={formatXAxisTick} />
        <YAxis type="number" domain={[0, 5]} tickCount={6} />
        <Bar
          min={15}
          dataKey="ml"
          label={{
            position: "middle",
            fill: "#fff",
            fontSize: "1.75rem",
            fontFamily: languageDetector(chartData[0]?.title)
              ? farsiFontFamily
              : primaryFontFamily,
          }}
          background
          name="name"
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default AssessmentSubjectRadialChart;
