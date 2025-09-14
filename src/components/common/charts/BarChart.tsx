import { useMemo } from "react";
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
import { farsiFontFamily, primaryFontFamily, } from "@/config/theme";
import languageDetector from "@/utils/languageDetector";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material";

interface CustomBarChartProps {
  loading: boolean;
  data: any[];
  maturityLevelsCount: number;
}

const CustomBarChart: React.FC<CustomBarChartProps> = ({
  loading,
  data,
  maturityLevelsCount,
}) => {
  return loading ? (
    <Skeleton
      height={"620px"}
      width="620px"
      variant="circular"
      sx={{ margin: "auto" }}
    />
  ) : (
    <SubjectRadial data={data} maturityLevelsCount={maturityLevelsCount} />
  );
};

interface SubjectRadialProps {
  data: any[];
  maturityLevelsCount: number;
}

const SubjectRadial: React.FC<SubjectRadialProps> = ({
  data,
  maturityLevelsCount,
}) => {
  const theme = useTheme();

  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const wordLimit = !isSmallScreen ? 18 : 12;
  const formatXAxisTick = (tick: string) => {
    return tick.length > wordLimit
      ? `${tick?.substring(0, wordLimit)}...`
      : tick;
  };

  const chartData = useMemo(
    () => convertToRadialChartData(data, maturityLevelsCount),
    [data],
  );
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart cx="50%" cy="50%" barSize={30} data={chartData.items}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="title" interval={0} tickFormatter={formatXAxisTick} />
        <YAxis
          type="number"
          domain={[0, chartData.maturityLevelsCount]}
          tickCount={chartData.maturityLevelsCount + 1}
        />
        <Bar
          min={15}
          dataKey="ml"
          label={{
            position: "middle",
            fill: theme.palette.background.containerLowest,
            fontSize: "1.75rem",
            fontFamily: languageDetector(chartData.items[0]?.title)
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

export default CustomBarChart;
