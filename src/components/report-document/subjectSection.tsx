import React from "react";
import Typography from "@mui/material/Typography";
import data from "./greport.json";
import { primaryFontFamily, theme } from "@config/theme";
import GeneralLayout from "@components/report-document/layout/generalLayout";
import languageDetector from "@utils/languageDetector";
import Grid from "@mui/material/Grid";
import DonutChart from "@common/charts/donutChart/donutChart";
import BulletPointStatus from "@components/report-document/bulletPointStatus";
import AssessmentSubjectRadarChart from "@components/assessment-report/AssessmenetSubjectRadarChart";
import BoxReportLayout from "@components/report-document/layout/BoxReportLayout";
import AssessmentSubjectRadialChart from "@components/assessment-report/AssessmenetSubjectRadial";

const SubjectReport = () => {
  const { maturityLevelCount } = data?.assessment?.assessmentKit;
  const { subjects } = data
  return (
    <GeneralLayout>
      {subjects?.map((item: any, index: number) => {
        const { title, description, maturityLevel } = item;
        const is_farsi = languageDetector(title);
        return (
          <>
            <Grid
              container
              spacing={2}
              key={index}
              sx={{
                direction: theme.direction,
                fontFamily: is_farsi ? "Vazirmatn" : primaryFontFamily,
                mb: "40px",
              }}
            >
              <Grid item xs={12} sm={9}>
                <Typography
                  sx={{
                    color: theme.palette.primary.main,
                    fontSize: "2rem",
                    fontWeight: "bold",
                  }}
                >
                  {index + 1}) {title}
                </Typography>
                <Typography sx={{ fontSize: "0.87rem", fontWeight: "light" }}>
                  {description}
                </Typography>
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
              <Grid item xs={12} md={6} spacing={2} sx={{display:"flex", flexDirection:"column",justifyContent:"center", alignItems: "center",gap:2}}>
                  {item.attributes.map((attribute: any) => {
                    return (
                      <BulletPointStatus
                        titleFa={attribute.titleFa}
                        maturityLevel={attribute.maturityLevel}
                        maturityLevelCount={maturityLevelCount}
                      />
                    );
                  })}
              </Grid>
              <Grid item xs={12} sm={6} spacing={2} m={"auto"} sx={{height:"250px"}}>
                {subjects.length <= 2
                    ?
                    <AssessmentSubjectRadialChart
                        data={item.attributes}
                        maturityLevelsCount={maturityLevelCount ?? 5}
                        loading={false}
                    />
                :
                      <AssessmentSubjectRadarChart
                          data={item.attributes}
                          maturityLevelsCount={maturityLevelCount ?? 5}
                          loading={false}
                      />
                }
              </Grid>
            </Grid>
            {item.attributes.map((attribute: any) => {
              return (
                  <BoxReportLayout
                      confidenceValue={attribute.confidenceValue}
                      analyzation={attribute.analyzation}
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