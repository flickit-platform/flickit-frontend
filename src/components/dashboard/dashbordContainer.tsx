import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { Trans } from "react-i18next";
import { useServiceContext } from "@/providers/ServiceProvider";
import DashboardTitle from "@components/dashboard/dashboardContainerTitle";
import PermissionControl from "@common/PermissionControl";
import QueryBatchData from "@common/QueryBatchData";
import LoadingSkeletonOfAssessmentRoles from "@common/loadings/LoadingSkeletonOfAssessmentRoles";
import AssessmentHtmlTitle from "@components/assessment-html/AssessmentHtmlTitle";
import { useQuery } from "@utils/useQuery";
import { PathInfo } from "@types";
import { useParams } from "react-router-dom";
import DashboardTab from "@components/dashboard/dashboard_Tab/dashboardTab";
import MainTabs from "@common/mainTabs/mainTabs";

const DashbordContainer = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const { service } = useServiceContext();
  const { assessmentId = "" } = useParams();

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
                  <Trans i18nKey="dashboard" />
                </Typography>
              </Grid>
              <Grid container sm={12} xs={12}>
                <Grid
                  item
                  // sm={3}
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
                  // sm={9}
                  xs={12}
                  sx={{
                    height: "100%",
                    background: "#F9FAFB",
                    border: "2px solid #C7CCD1",
                    borderRadius: "1rem",
                  }}
                >
                  {selectedTab === 0 && <DashboardTab />}
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
