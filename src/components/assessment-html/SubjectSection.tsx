import { useState } from "react";
import Typography from "@mui/material/Typography";
import { theme } from "@config/theme";
import GeneralLayout from "./layout/GeneralLayout";
import Grid from "@mui/material/Grid";
import DonutChart from "@common/charts/donutChart/donutChart";
import BulletPointStatus from "./BulletPointStatus";
import AssessmentSubjectRadarChart from "@/components/common/charts/RadarChart";
import BoxReportLayout from "./layout/BoxReportLayout";
import AssessmentSubjectRadialChart from "@/components/common/charts/BarChart";
import { styles } from "@styles";
import { t } from "i18next";
import { IGraphicalReport } from "@/types/index";
import uniqueId from "@/utils/uniqueId";

const SubjectReport = ({
  graphicalReport,
}: {
  graphicalReport: IGraphicalReport;
}) => {
  const [maturityLevelCount] = useState<number>(
    graphicalReport?.assessment?.assessmentKit?.maturityLevelCount,
  );
  const { subjects, lang } = graphicalReport;
  return (
    <GeneralLayout>
      {subjects?.map((item: any, index: number) => {
        const { title, insight, maturityLevel } = item;
        return (
          <>
            <Grid
              component="div"
              id={title}
              container
              key={item.index}
              sx={{
                ...styles.rtlStyle(lang.code.toLowerCase() === "fa"),
                mb: "40px",
              }}
            >
              <Grid item xs={12} sm={9}>
                <Typography
                  sx={{
                    color: theme.palette.primary.main,
                    ...theme.typography.headlineSmall,
                    fontWeight: "bold",
                    ...styles.rtlStyle(lang.code.toLowerCase() === "fa"),
                  }}
                >
                  {index + 1}
                  {") "}
                  {title}
                </Typography>
                <Typography
                  component="div"
                  sx={{
                    ...theme.typography.bodyMedium,
                    ...styles.rtlStyle(lang.code.toLowerCase() === "fa"),
                    mt: 2,
                  }}
                  textAlign="justify"
                  dangerouslySetInnerHTML={{
                    __html:
                      insight ??
                      t("common.unavailable", { lng: lang.code.toLowerCase() }),
                  }}
                ></Typography>
              </Grid>
              <Grid item xs={12} sm={3}>
                <DonutChart
                  maturityLevelNumber={maturityLevelCount}
                  levelValue={maturityLevel.value}
                  text={maturityLevel.title}
                  sx={{ ...styles.centerCVH }}
                  width="100%"
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
                {item?.attributes?.map((attribute: any) => {
                  return (
                    <BulletPointStatus
                      key={attribute.index}
                      title={attribute.title}
                      maturityLevel={attribute.maturityLevel}
                      maturityLevelCount={maturityLevelCount}
                      language={lang.code.toLowerCase()}
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
                    lng={lang.code.toLowerCase()}
                  />
                )}
              </Grid>
            </Grid>
            {item?.attributes?.map((attribute: any) => {
              return (
                <BoxReportLayout
                  key={uniqueId()}
                  language={lang.code.toLowerCase()}
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
