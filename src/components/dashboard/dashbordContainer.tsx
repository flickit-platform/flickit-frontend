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
import {useQuery} from "@utils/useQuery";
import {PathInfo} from "@types";
import {useParams} from "react-router-dom";
import DashboardTab from "@components/dashboard/dashboard_Tab/dashboardTab";

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
                                  <Typography color="primary" textAlign="left" variant="headlineLarge">
                                      <Trans i18nKey="dashboard" />
                                  </Typography>
                              </Grid>
                              <Grid container sm={12} xs={12} mt={6}>
                                  <Grid
                                      item
                                      // sm={3}
                                      xs={12}
                                      sx={{ display: "flex"}}
                                  >
                                      <Tabs
                                          textColor="primary"
                                          indicatorColor="primary"
                                          orientation="horizontal"
                                          variant="scrollable"
                                          value={selectedTab}
                                          onChange={handleTabChange}
                                          aria-label="horizontal tabs"
                                          centered={true}
                                          sx={{
                                              width:"100%",
                                              borderRight: 1,
                                              borderColor: "divider",
                                              flexGrow: 1,
                                              backgroundColor: "rgba(36, 102, 168, 0.04)",
                                              padding: 0,
                                              color: "rgba(0, 0, 0, 0.6)", // Default text color

                                              // Adding hover state for background color and text color
                                              "&:hover": {
                                                  // backgroundColor: "#f0f0f0",
                                                  // color: "#2466A8",
                                              },
                                              "& .Mui-selected": {
                                                  color: "#2466A8 !important",
                                                  fontWeight: "bold",
                                                  // background: "rgba(36, 102, 168, 0.08)"
                                              },

                                              "& .MuiTabs-indicator": {
                                                  backgroundColor: "primary.main",
                                              },
                                              "& .MuiTabs-flexContainer":{
                                                  justifyContent:"space-between",
                                              }
                                          }}
                                      >
                                          <Tab
                                              sx={{
                                                  alignItems: "center",
                                                  textTransform: "none",
                                                  flexGrow:1,
                                                  border: "2px solid #C7CCD1",
                                                  borderBottom: "none",
                                                  borderRadius: ".5rem .5rem 0 0",
                                                  background:"#2466A805"
                                              }}
                                              label={
                                                  <Typography variant="semiBoldLarge">
                                                      <Trans i18nKey="Dashboard" />
                                                  </Typography>
                                              }
                                          />
                                          <Tab
                                              sx={{
                                                  alignItems: "center",
                                                  textTransform: "none",
                                                  flexGrow:1,
                                                  border: "2px solid #C7CCD1",
                                                  borderBottom: "none",
                                                  borderRadius: ".5rem .5rem 0 0"
                                              }}
                                              label={
                                                  <Typography variant="semiBoldLarge">
                                                      <Trans i18nKey="questions" />
                                                  </Typography>
                                              }
                                          />
                                          <Tab
                                              sx={{
                                                  alignItems: "center",
                                                  textTransform: "none",
                                                  flexGrow:1,
                                                  border: "2px solid #C7CCD1",
                                                  borderBottom: "none",
                                                  borderRadius: ".5rem .5rem 0 0"
                                              }}
                                              label={
                                                  <Typography variant="semiBoldLarge">
                                                      <Trans i18nKey="insights" />
                                                  </Typography>
                                              }
                                          />
                                          <Tab
                                              sx={{
                                                  alignItems: "center",
                                                  textTransform: "none",
                                                  flexGrow:1,
                                                  border: "2px solid #C7CCD1",
                                                  borderBottom: "none",
                                                  borderRadius: ".5rem .5rem 0 0"
                                              }}
                                              label={
                                                  <Typography variant="semiBoldLarge">
                                                      <Trans i18nKey="advices" />
                                                  </Typography>
                                              }
                                          />
                                          <Tab
                                              sx={{
                                                  alignItems: "center",
                                                  textTransform: "none",
                                                  flexGrow:1,
                                                  border: "2px solid #C7CCD1",
                                                  borderBottom: "none",
                                                  borderRadius: ".5rem .5rem 0 0"
                                              }}
                                              label={
                                                  <Typography variant="semiBoldLarge">
                                                      <Trans i18nKey="reports" />
                                                  </Typography>
                                              }
                                          />{" "}
                                          <Tab
                                              sx={{
                                                  alignItems: "center",
                                                  textTransform: "none",
                                                  flexGrow:1,
                                                  border: "2px solid #C7CCD1",
                                                  borderBottom: "none",
                                                  borderRadius: ".5rem .5rem 0 0"
                                              }}
                                              label={
                                                  <Typography variant="semiBoldLarge">
                                                      <Trans i18nKey="settings" />
                                                  </Typography>
                                              }
                                          />
                                      </Tabs>
                                  </Grid>

                                  <Grid
                                      item
                                      // sm={9}
                                      xs={12}
                                      sx={{ height: "100%", background: "#F9FAFB",borderRadius: "0 0 1rem 1rem" }}
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
