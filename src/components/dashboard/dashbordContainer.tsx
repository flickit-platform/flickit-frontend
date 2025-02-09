import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { useServiceContext } from "@/providers/ServiceProvider";
import DashboardTitle from "@components/dashboard/dashboardContainerTitle";
import QueryBatchData from "@common/QueryBatchData";
import LoadingSkeletonOfAssessmentRoles from "@common/loadings/LoadingSkeletonOfAssessmentRoles";
import { useQuery } from "@utils/useQuery";
import { PathInfo } from "@types";
import { useLocation, useOutlet, useParams } from "react-router-dom";
import MainTabs from "@/components/dashboard/MainTabs";
import languageDetector from "@/utils/languageDetector";
import { farsiFontFamily, primaryFontFamily } from "@/config/theme";

const DashbordContainer = () => {
  const location = useLocation();
  const [selectedTab, setSelectedTab] = useState("dashboard");
  const { service } = useServiceContext();
  const { assessmentId = "" } = useParams();
  const outlet = useOutlet();

  useEffect(() => {
    const pathSegments = location.pathname
      .split("/")
      .filter((segment) => segment);
    const lastPart = pathSegments[4];
    setSelectedTab(lastPart);
  }, [location]);
  const handleTabChange = (event: any, newValue: any) => {
    setSelectedTab(newValue);
  };

  const fetchPathInfo = useQuery<PathInfo>({
    service: (args, config) =>
      service.fetchPathInfo({ assessmentId, ...(args || {}) }, config),
    runOnMount: true,
  });

  return (
    <QueryBatchData
      queryBatchData={[fetchPathInfo]}
      renderLoading={() => <LoadingSkeletonOfAssessmentRoles />}
      render={([pathInfo]) => {
        return (
          <Box m="auto" pb={3} sx={{ px: { xl: 30, lg: 12, xs: 2, sm: 3 } }}>
            <DashboardTitle pathInfo={pathInfo} />
            <Grid
              container
              spacing={1}
              columns={12}
              display="flex"
              alignItems="center"
              mt={0.5}
            >
              <Grid
                item
                sm={Number(pathInfo?.assessment?.title?.length) < 20 ? 4 : 12}
                xs={12}
              >
                <Typography
                  color="primary"
                  textAlign="left"
                  variant="headlineLarge"
                  sx={{
                    fontFamily: languageDetector(pathInfo?.assessment?.title)
                      ? farsiFontFamily
                      : primaryFontFamily,
                  }}
                >
                  {pathInfo?.assessment?.title}
                </Typography>
              </Grid>
              <Grid
                item
                xs={Number(pathInfo?.assessment?.title?.length) < 20 ? 8 : 12}
                sx={{ display: "flex" }}
              >
                <MainTabs
                  onTabChange={handleTabChange}
                  selectedTab={selectedTab}
                />
              </Grid>
              <Grid container>
                <Grid item xs={12}>
                  {outlet}
                </Grid>
              </Grid>
            </Grid>
          </Box>
        );
      }}
    />
  );
};
export default DashbordContainer;
