import { useState } from "react";
import Typography from "@mui/material/Typography";
import GeneralLayout from "./layout/GeneralLayout";
import Grid from "@mui/material/Grid";
import DonutChart from "@common/charts/donutChart/donutChart";
import BulletPointStatus from "./BulletPointStatus";
import BoxReportLayout from "./layout/BoxReportLayout";
import { styles } from "@styles";
import { t } from "i18next";
import { IGraphicalReport } from "@/types/index";
import uniqueId from "@/utils/uniqueId";
import { Box } from "@mui/material";

const SubjectReport = ({
  graphicalReport,
}: {
  graphicalReport: IGraphicalReport;
}) => {

  const [maturityLevelCount] = useState<number>(
    graphicalReport?.assessment?.assessmentKit?.maturityLevelCount,
  );
  const { subjects, lang } = graphicalReport;
  const isRTL = lang.code.toLowerCase() === "fa"
  return (
    <GeneralLayout>
      {subjects?.map((item: any, index: number) => {
        const { title, insight, maturityLevel } = item;
        return (
          <Box key={uniqueId()}>
            <Grid
              component="div"
              id={title}
              container
              key={item.index}
              mb="40px"
              sx={{ ...styles.rtlStyle(isRTL) }}
            >
              <Grid item xs={12} sm={9}>
                <Typography
                  variant="headlineSmall"
                  color="primary.main"
                  fontWeight="bold"
                  sx={{ ...styles.rtlStyle(isRTL) }}
                >
                  {index + 1}
                  {") "}
                  {title}
                </Typography>
                <Typography
                  component="div"
                  variant="bodyMedium"
                  mt={2}
                  sx={{ ...styles.rtlStyle(isRTL) }}
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
              <Grid item xs={12} md={12} sx={{ ...styles.centerCVH, gap: 2 }}>
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
          </Box>
        );
      })}
    </GeneralLayout>
  );
};

export default SubjectReport;
