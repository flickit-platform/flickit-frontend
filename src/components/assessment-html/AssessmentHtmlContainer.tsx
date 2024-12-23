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
import { Trans } from "react-i18next";
import { Chip, Grid, Paper, Typography } from "@mui/material";
import { AssessmentTOC } from "./TopOfContents";
import SubjectReport from "./SubjectSection";
import data from "./greport.json";
import { theme } from "@/config/theme";
import { Gauge } from "../common/charts/Gauge";
import TreeMapChart from "../common/charts/TreeMapChart";
import AdviceItemsAccordion from "../assessment-report/advice-items/AdviceItemsAccordions";
import ReportCard from "./ReportSummary";
import DesignServicesIcon from "@mui/icons-material/DesignServices";
import EmojiObjectsIcon from "@mui/icons-material/EmojiObjects";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import formatDate from "@utils/formatDate";
import { getMaturityLevelColors, styles } from "@styles";
import { t } from "i18next";

const AssessmentExportContainer = () => {
  const { assessmentId = "" } = useParams();
  const [content, setContent] = useState("");
  const [errorObject, setErrorObject] = useState<any>(undefined);
  const { service } = useServiceContext();
  const { subjects, assessment, recommendationsSummary } = data;
  const {
    maturityLevel,
    assessmentKit,
    confidenceValue,
    intro,
    title,
    executiveSummary,
  } = assessment;

  const iframeUrl = `${import.meta.env.VITE_STATIC_HTML}${assessmentId}/index.html`;

  const fetchContent = async () => {
    try {
      const response = await fetch(iframeUrl);
      const html = await response.text();
      setContent(html);
    } catch (error) {
      console.error("Error fetching site content:", error);
    }
  };

  const checkIframeUrl = async () => {
    try {
      const response = await fetch(iframeUrl, { method: "HEAD" });
      if (response.status === 404) {
        setErrorObject(response);
      }
    } catch (error) {
      setErrorObject(error);
      console.error("Error checking iframe URL:", error);
    }
  };

  useEffect(() => {
    fetchContent();
    checkIframeUrl();
  }, [iframeUrl]);

  const fetchPathInfo = useQuery<PathInfo>({
    service: (args, config) =>
      service.fetchPathInfo({ assessmentId, ...(args || {}) }, config),
    runOnMount: true,
  });

  const combinedAttributes = subjects.flatMap((subject) =>
    subject.attributes.map((attribute) => ({
      name: attribute.title,
      count: attribute.maturityLevel.value,
    })),
  );

  const renderChips = () => (
    <>
      <Chip
        label={
          <Box sx={{ ...styles.centerVH, gap: 0.5 }}>
            <DesignServicesIcon fontSize="small" color="primary" />
            <Trans
              i18nKey="assessmentKit"
              values={{ title: assessment.assessmentKit.title }}
            />
          </Box>
        }
        size="small"
        sx={{
          fontWeight: 200,
          padding: 1,
          background: "rgba(36, 102, 168, 0.04)",
        }}
      />
      <Chip
        label={
          <Box sx={{ ...styles.centerVH, gap: 0.5 }}>
            <EmojiObjectsIcon fontSize="small" color="primary" />
            <Trans
              i18nKey="questionsAndAnswer"
              values={{ count: assessment.assessmentKit.questionsCount }}
            />
          </Box>
        }
        size="small"
        sx={{
          fontWeight: 200,
          padding: 1,
          background: "rgba(36, 102, 168, 0.04)",
        }}
      />
      <Chip
        label={
          <Box sx={{ ...styles.centerVH, gap: 0.5 }}>
            <CalendarMonthIcon fontSize="small" color="primary" />
            {theme.direction === "rtl"
              ? formatDate(assessment.creationTime, "Shamsi")
              : formatDate(assessment.creationTime, "Miladi")}
          </Box>
        }
        size="small"
        sx={{
          fontWeight: 200,
          padding: 1,
          background: "rgba(36, 102, 168, 0.04)",
        }}
      />
    </>
  );

  return (
    <PermissionControl error={[errorObject]}>
      <QueryBatchData
        queryBatchData={[fetchPathInfo]}
        renderLoading={() => <LoadingSkeletonOfAssessmentRoles />}
        render={([pathInfo]) => (
          <Box m="auto" pb={3} sx={{ px: { xl: 20, lg: 6, xs: 2, sm: 3 } }}>
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
              <Grid item lg={2.5} md={2.5} sm={12} xs={12}>
                <AssessmentTOC />
              </Grid>
              <Grid item lg={9.5} md={9.5} sm={12} xs={12}>
                <Paper
                  elevation={3}
                  sx={{
                    position: "relative",
                    backgroundColor: "#ffffff",
                    display: "flex",
                    justifyContent: "center",
                    borderStartEndRadius: 16,
                    borderStartStartRadius: 16,
                    boxShadow: "none",
                    width: "100%",
                    padding: 6,
                  }}
                >
                  <Box
                    sx={{
                      position: "absolute",
                      right: "40px",
                      top: "60px",
                      bottom: "40px",
                      width: "8px",
                      backgroundColor: "#D5E5F6",
                    }}
                  />
                  <Box
                    sx={{
                      position: "absolute",
                      left: "40px",
                      top: "60px",
                      bottom: "40px",
                      width: "8px",
                      backgroundColor: "#D5E5F6",
                    }}
                  />
                  <Box padding={3} width="100%">
                    <Grid container spacing={4} sx={{ mb: "40px" }}>
                      <Grid item xs={12} sm={12}>
                        {renderChips()}
                      </Grid>
                      <Grid item xs={12} sm={6} md={6} lg={8}>
                        <Typography
                          sx={{
                            color: theme.palette.primary.main,
                            ...theme.typography.headlineSmall,
                            fontWeight: "bold",
                          }}
                        >
                          {title}
                        </Typography>
                        <Typography
                          sx={{
                            ...theme.typography.titleSmall,
                            color: "#6C8093",
                            mt: 2,
                          }}
                        >
                          <Trans i18nKey="introduction" />
                        </Typography>
                        <Typography
                          textAlign="justify"
                          sx={{
                            ...theme.typography.titleSmall,
                            fontWeight: "light",
                            mt: 1,
                          }}
                        >
                          {intro}
                        </Typography>
                        <Typography
                          sx={{
                            ...theme.typography.titleSmall,
                            color: "#6C8093",
                            mt: 2,
                          }}
                        >
                          <Trans i18nKey="summary" />
                        </Typography>
                        <Typography
                          textAlign="justify"
                          sx={{
                            ...theme.typography.titleSmall,
                            fontWeight: "light",
                            mt: 1,
                          }}
                        >
                          {executiveSummary}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6} md={6} lg={4} mt={10}>
                        <Gauge
                          level_value={maturityLevel?.value ?? 0}
                          maturity_level_status={maturityLevel?.title}
                          maturity_level_number={
                            assessmentKit?.maturityLevelCount
                          }
                          confidence_value={confidenceValue}
                          confidence_text={t("withPercentConfidence")}
                          isMobileScreen={false}
                          hideGuidance={true}
                          status_font_variant="titleMedium"
                          height={250}
                        />
                      </Grid>
                    </Grid>
                    <Typography
                      sx={{
                        ...theme.typography.titleMedium,
                        color: "#6C8093",
                        my: 1,
                      }}
                    >
                      <Trans i18nKey="prosAndCons" />
                    </Typography>

                    <TreeMapChart
                      data={combinedAttributes}
                      levels={assessment.assessmentKit.maturityLevelCount}
                    />
                    <Grid
                      xs={12}
                      md={12}
                      bgcolor="#F3F5F6"
                      borderRadius="8px"
                      paddingX={2}
                      my={2}
                      container
                      spacing={2}
                    >
                      {/* Pros and Cons Section */}
                      <Grid item xs={10} md={10}>
                        <Typography
                          sx={{
                            ...theme.typography.titleSmall,
                            color: "#2B333B",
                            my: 1,
                            ...styles.centerV,
                          }}
                        >
                          <InfoOutlinedIcon fontSize="small" />
                          <Trans i18nKey="treeMapChart" />
                        </Typography>
                        <Typography
                          textAlign="justify"
                          sx={{
                            ...theme.typography.titleSmall,
                            fontWeight: "light",
                            mt: 1,
                          }}
                        >
                          {assessment.assessmentKit.prosAndCons}
                        </Typography>
                      </Grid>

                      {/* Maturity Levels Section */}
                      <Grid item xs={2} md={2}>
                        <Typography
                          sx={{
                            ...theme.typography.titleSmall,
                            color: "#2B333B",
                            my: 1,
                            ...styles.centerV,
                          }}
                        >
                          <Trans i18nKey="maturityLevels" />
                        </Typography>
                        <Grid container spacing={1}>
                          {assessment.assessmentKit.maturityLevels.map(
                            (level, index) => (
                              <Grid
                                container
                                sx={{ ...styles.centerVH }}
                                spacing={1}
                                mb={1}
                              >
                                <Grid item key={index} xs={3} sm={3}>
                                  <Box
                                    sx={{
                                      backgroundColor: getMaturityLevelColors(
                                        assessment.assessmentKit
                                          .maturityLevelCount,
                                      )[level.value - 1],
                                      height: "10px",
                                      borderRadius: "16px",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      color: "#fff",
                                      fontWeight: "bold",
                                    }}
                                  ></Box>
                                </Grid>
                                <Grid item key={index} xs={8} sm={8}>
                                  <Typography
                                    sx={{
                                      ...theme.typography.body2,
                                      color: "#2B333B",
                                    }}
                                  >
                                    {level.title}
                                  </Typography>
                                </Grid>
                              </Grid>
                            ),
                          )}
                        </Grid>
                      </Grid>
                    </Grid>
                    <SubjectReport />
                  </Box>
                </Paper>
                <Paper
                  elevation={3}
                  sx={{
                    position: "relative",
                    backgroundColor: "#ffffff",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    borderEndStartRadius: 16,
                    borderEndEndRadius: 16,
                    boxShadow: "none",
                    width: "100%",
                    padding: 6,
                  }}
                >
                  <Typography
                    sx={{
                      color: theme.palette.primary.main,
                      ...theme.typography.headlineSmall,
                      fontWeight: "bold",
                    }}
                  >
                    <Trans i18nKey="recommendations" />
                  </Typography>
                  <Typography
                    textAlign="justify"
                    sx={{
                      ...theme.typography.titleSmall,
                      fontWeight: "light",
                      my: 1,
                    }}
                  >
                    {recommendationsSummary}
                  </Typography>
                  <AdviceItemsAccordion
                    items={data.adviceItems}
                    onDelete={() => {}}
                    setDisplayedItems={() => {}}
                    query={undefined}
                    readOnly
                  />
                  <ReportCard />
                </Paper>
              </Grid>
            </Grid>
          </Box>
        )}
      />
    </PermissionControl>
  );
};

export default AssessmentExportContainer;
