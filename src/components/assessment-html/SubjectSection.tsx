import { useState } from "react";
import Typography from "@mui/material/Typography";
import { farsiFontFamily, primaryFontFamily, theme } from "@config/theme";
import GeneralLayout from "./layout/GeneralLayout";
import languageDetector from "@utils/languageDetector";
import Grid from "@mui/material/Grid";
import DonutChart from "@common/charts/donutChart/donutChart";
import BulletPointStatus from "./BulletPointStatus";
import AssessmentSubjectRadarChart from "@components/assessment-report/AssessmenetSubjectRadarChart";
import BoxReportLayout from "./layout/BoxReportLayout";
import AssessmentSubjectRadialChart from "@components/assessment-report/AssessmenetSubjectRadial";
import { styles } from "@styles";
import { t } from "i18next";

interface IAttribute {
  id: number;
  description: string;
  index: string;
  title: string;
  confidenceValue?: number | any;
  insight: any;
  maturityLevel: {
    id: number;
    title: string;
    index: number;
    value: number;
    description: string;
  };
}

const SubjectReport = ({ data }: any) => {
  const [maturityLevelCount] = useState<number>(
    data?.assessment?.assessmentKit?.maturityLevelCount,
  );
  const { subjects } = data;
  return (
    <GeneralLayout>
      {subjects?.map((item: any, index: number) => {
        const { title, insight, maturityLevel } = item;
        const is_farsi = languageDetector(title);
        return (
          <>
            <Grid
              component="div"
              id={title}
              container
              key={item.index}
              sx={{
                direction: true ? "rtl" : "ltr",
                fontFamily: true ? farsiFontFamily : primaryFontFamily,
                mb: "40px",
              }}
            >
              <Grid item xs={12} sm={9}>
                <Typography
                  sx={{
                    color: theme.palette.primary.main,
                    ...theme.typography.headlineSmall,
                    fontWeight: "bold",
                    direction: true ? "rtl" : "ltr",
                    fontFamily: true ? farsiFontFamily : primaryFontFamily,
                  }}
                >
                  {index + 1}
                  {") "}
                  {title}
                </Typography>
                <Typography
                  component="div"
                  sx={{
                    ...theme.typography.extraLight,
                    fontWeight: 300,
                    direction: true ? "rtl" : "ltr",
                    fontFamily: true ? farsiFontFamily : primaryFontFamily,
                    mt: 2,
                  }}
                  textAlign="justify"
                  dangerouslySetInnerHTML={{
                    __html: insight ?? t("unavailable", { lng: "fa" }),
                  }}
                ></Typography>
              </Grid>
              <Grid item xs={12} sm={3}>
                <DonutChart
                  maturityLevelNumber={maturityLevelCount}
                  levelValue={maturityLevel.value}
                  text={maturityLevel.title}
                />
              </Grid>
            </Grid>
            <Grid container>
              <Grid
                item
                xs={12}
                md={6}
                spacing={2}
                sx={{ ...styles.centerCVH, gap: 2 }}
              >
                {item?.attributes?.map((attribute: IAttribute) => {
                  return (
                    <BulletPointStatus
                      key={attribute.index}
                      title={attribute.title}
                      maturityLevel={attribute.maturityLevel}
                      maturityLevelCount={maturityLevelCount}
                    />
                  );
                })}
              </Grid>
              <Grid
                item
                xs={12}
                sm={6}
                spacing={2}
                m={"auto"}
                sx={{ height: "300px" }}
              >
                {item?.attributes?.length <= 2 ? (
                  <AssessmentSubjectRadialChart
                    data={item.attributes}
                    maturityLevelsCount={maturityLevelCount ?? 5}
                    loading={false}
                  />
                ) : (
                  <AssessmentSubjectRadarChart
                    data={item.attributes}
                    maturityLevelsCount={maturityLevelCount ?? 5}
                    loading={false}
                    chartHeight={300}
                    lng="fa"
                  />
                )}
              </Grid>
            </Grid>
            {item?.attributes?.map((attribute: IAttribute) => {
              return (
                <BoxReportLayout
                  confidenceValue={attribute.confidenceValue}
                  maturityLevelCount={maturityLevelCount}
                  {...attribute}
                />
              );
            })}
          </>
        );
      })}
    </GeneralLayout>
  );
};

export default SubjectReport;
