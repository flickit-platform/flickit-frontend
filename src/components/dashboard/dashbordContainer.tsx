import { useState } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { useServiceContext } from "@/providers/ServiceProvider";
import DashboardTitle from "@components/dashboard/dashboardContainerTitle";
import QueryBatchData from "@common/QueryBatchData";
import LoadingSkeletonOfAssessmentRoles from "@common/loadings/LoadingSkeletonOfAssessmentRoles";
import { useQuery } from "@utils/useQuery";
import { PathInfo } from "@types";
import {useLocation, useOutlet, useParams} from "react-router-dom";
import MainTabs from "@/components/dashboard/MainTabs";

const DashbordContainer = () => {
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(segment => segment);
  const lastPart = pathSegments[pathSegments.length - 1];

  const [selectedTab, setSelectedTab] = useState(lastPart || "assessment-dashboard");
  const { service } = useServiceContext();
  const { assessmentId = "" } = useParams();
  const outlet = useOutlet()

  const handleTabChange = (event: any, newValue: any) => {
    setSelectedTab(newValue);
  };

  const fetchPathInfo = useQuery<PathInfo>({
    service: (args, config) =>
      service.fetchPathInfo({ assessmentId, ...(args || {}) }, config),
    runOnMount: true,
  });

  return (
    // <PermissionControl error={[errorObject]}>
    <QueryBatchData
      queryBatchData={[fetchPathInfo]}
      renderLoading={() => <LoadingSkeletonOfAssessmentRoles />}
      render={([pathInfo]) => {
        return (
          <Box m="auto" pb={3} sx={{ px: { xl: 30, lg: 12, xs: 2, sm: 3 } }}>
            <DashboardTitle pathInfo={pathInfo} />
            <Grid container spacing={1} columns={12}>
              <Grid item sm={12} xs={12} mt={1}>
                <Typography
                  color="primary"
                  textAlign="left"
                  variant="headlineLarge"
                >
                    {pathInfo?.assessment?.title}
                </Typography>
              </Grid>
              <Grid container sm={12} xs={12}>
                <Grid
                  item
                  xs={12}
                  sx={{ display: "flex" }}
                >
                  <MainTabs
                    onTabChange={handleTabChange}
                    selectedTab={selectedTab}
                  />
                </Grid>

                <Grid
                  item
                  xs={12}
                >
                  {outlet}
                </Grid>
              </Grid>
            </Grid>
          </Box>
        );
      }}
    />
    // </PermissionControl>
  );
};
export default DashbordContainer;
