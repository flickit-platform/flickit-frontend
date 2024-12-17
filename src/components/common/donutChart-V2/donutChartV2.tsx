import { lazy, Suspense, useMemo } from "react";
import Box, { BoxProps } from "@mui/material/Box";
import { Trans } from "react-i18next";
import { getMaturityLevelColors, styles } from "@styles";

interface IGaugeProps extends BoxProps {
  title: string;
  subjectCount: number;
  maturityLevel: {title: string, value: number};
  maturityLevelNumber: number;
}

const DonutChartV2 = (props: IGaugeProps) => {
  const {title: mainTitle, subjectCount, maturityLevel, maturityLevelNumber } = props;
  const {title:maturityLevelTitle,value:maturityLevelValue} = maturityLevel
  if (maturityLevelNumber < maturityLevelValue || subjectCount > 5) return null;

  const DonutChartV2Component = useMemo(
    () => lazy(() => import(`./donutChartV2${subjectCount}.tsx`)),
    [subjectCount],
  );

  const colorPallet = getMaturityLevelColors(maturityLevelNumber);
  const colorCode = colorPallet[maturityLevelValue - 1];

  return (
    <Suspense fallback={<Trans i18nKey={"loading"} />}>
      <Box
        sx={{
          ...styles.centerCVH,
          textAlign: "center",
          width: "fit-content",
          gap: "1rem",
        }}
      >
          <Box sx={{position:"relative"}}>
              <DonutChartV2Component colorCode={colorCode} value={maturityLevelValue}/>

          </Box>

      </Box>
    </Suspense>
  );
};

export default DonutChartV2;
