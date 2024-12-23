import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import PermissionControl from "../common/PermissionControl";
import { useQuery } from "@/utils/useQuery";
import { PathInfo } from "@/types";
import { useServiceContext } from "@/providers/ServiceProvider";
import LoadingSkeletonOfAssessmentRoles from "../common/loadings/LoadingSkeletonOfAssessmentRoles";
import QueryBatchData from "../common/QueryBatchData";
import Box from "@mui/material/Box";
import AssessmentHtmlTitle from "./AssessmentHtmlTitle";
import { CDN_DIRECTORY } from "@/config/constants";
import { Trans } from "react-i18next";
import { Grid, Paper, Typography } from "@mui/material";
import { AssessmentTOC } from "./TopOfContents";
import SubjectReport from "./SubjectSection";

const AssessmentExportContainer = () => {
  const { assessmentId = "" } = useParams();
  const [content, setContent] = useState("");
  const [errorObject, setErrorObject] = useState<any>(undefined);
  const { service } = useServiceContext();

  const iframeUrl =
    import.meta.env.VITE_STATIC_HTML + assessmentId + "/index.html";

  useEffect(() => {
    const fetchSiteContent = async () => {
      try {
        const response = await fetch(iframeUrl);
        const html = await response.text();
        setContent(html);
      } catch (error) {
        console.error("Error fetching site content:", error);
      }
    };

    fetchSiteContent();
  }, []);

  useEffect(() => {
    const checkIframeUrl = async () => {
      try {
        const response = await fetch(iframeUrl, { method: "HEAD" });
        if (response.status === 404) {
          setErrorObject(response);
        }
      } catch (error) {
        setErrorObject(error);
        console.error("Error fetching iframe URL:", error);
      }
    };

    checkIframeUrl();
  }, [iframeUrl]);

  const fetchPathInfo = useQuery<PathInfo>({
    service: (args, config) =>
      service.fetchPathInfo({ assessmentId, ...(args || {}) }, config),
    runOnMount: true,
  });

  return (
    <PermissionControl error={[errorObject]}>
      <QueryBatchData
        queryBatchData={[fetchPathInfo]}
        renderLoading={() => <LoadingSkeletonOfAssessmentRoles />}
        render={([pathInfo]) => {
          return (
            <>
              <Box
                m="auto"
                pb={3}
                sx={{ px: { xl: 30, lg: 12, xs: 2, sm: 3 } }}
              >
                <AssessmentHtmlTitle pathInfo={pathInfo} />
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  my={2}
                >
                  <Typography
                    color="primary"
                    textAlign="left"
                    variant="headlineLarge"
                  >
                    <Trans i18nKey="assessmentDocument" />
                  </Typography>
                </Box>
                <Grid container spacing={2}>
                  <Grid item lg={3} md={4} sm={12} xs={12}>
                    <AssessmentTOC />
                  </Grid>

                  <Grid item lg={9} md={8} sm={12} xs={12}>
                    <Paper
                      elevation={3}
                      sx={{
                        position: "relative",
                        p: 3,
                        backgroundColor: "#ffffff",
                        display: "flex",
                        justifyContent: "center",
                        borderRadius: 4,
                        boxShadow: "none",
                        width: "100%",
                      }}
                    >
                      <Box
                        sx={{
                          position: "absolute",
                          left: "40px",
                          top: "60px",
                          bottom: 0,
                          width: "8px",
                          backgroundColor: "#D5E5F6",
                        }}
                      />

                      <Box
                        sx={{
                          position: "absolute",
                          right: "40px",
                          top: "60px",
                          bottom: 0,
                          width: "8px",
                          backgroundColor: "#D5E5F6",
                        }}
                      />
                      <SubjectReport />
                    </Paper>
                  </Grid>
                </Grid>
              </Box>
            </>
          );
        }}
      />
    </PermissionControl>
  );
};

export default AssessmentExportContainer;
