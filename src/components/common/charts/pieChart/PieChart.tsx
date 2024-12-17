import { lazy, Suspense, useMemo } from "react";
import Box, { BoxProps } from "@mui/material/Box";
import { Trans } from "react-i18next";
import { chipColorPalette } from "@styles";

interface IGaugeProps extends BoxProps {
  LevelCount: number;
  text: string;
}

const PieChart = (props: IGaugeProps) => {
  const { LevelCount, text, ...rest } = props;

  const PieChartComponent = useMemo(
    () => lazy(() => import(`./PieChart${LevelCount}.tsx`)),
    [LevelCount],
  );

  const colorCode = chipColorPalette[text];

  return (
    <Suspense fallback={<Trans i18nKey="loading" />}>
      <Box sx={{ width: "100%", height: "100%" }} {...rest}>
        <PieChartComponent colorCode={colorCode} />
      </Box>
    </Suspense>
  );
};

export default PieChart;
