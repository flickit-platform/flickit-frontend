import { useEffect, useState } from "react";
import { Box, Divider, IconButton, Tooltip, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import QueryBatchData from "@common/QueryBatchData";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@utils/useQuery";
import { AssessmentSubjectList } from "./AssessmentSubjectList";
import { useServiceContext } from "@providers/ServiceProvider";
import { AssessmentOverallStatus } from "./AssessmentOverallStatus";
import LoadingSkeletonOfAssessmentReport from "@common/loadings/LoadingSkeletonOfAssessmentReport";
import AssessmentReportTitle from "./AssessmentReportTitle";
import { IAssessmentReportModel, RolesType } from "@types";
import AssessmentAdviceContainer from "./AssessmentAdviceContainer";
import { AssessmentSummary } from "./AssessmentSummary";
import { AssessmentReportKit } from "./AssessmentReportKit";
import { Trans } from "react-i18next";
import { styles } from "@styles";
import SettingsIcon from "@mui/icons-material/Settings";
import { ArticleRounded, Assessment } from "@mui/icons-material";
import { AssessmentInsight } from "./AssessmentInsight";
import BetaSvg from "@assets/svg/beta.svg";
import PermissionControl from "../common/PermissionControl";
import { theme } from "@config/theme";

const AssessmentReportContainer = (props: any) => {
  const { service } = useServiceContext();
  const { assessmentId = "" } = useParams();
  const [disableHtmlDocument, setDisableHtmlDodument] = useState(false);
  const queryData = useQuery<IAssessmentReportModel>({
    service: (args, config) =>
      service.fetchAssessment({ assessmentId }, config),
    toastError: false,
  });
  const calculateMaturityLevelQuery = useQuery({
    service: (args = { assessmentId }, config) =>
      service.calculateMaturityLevel(args, config),
    runOnMount: false,
  });
  const calculateConfidenceLevelQuery = useQuery({
    service: (args = { assessmentId }, config) =>
      service.calculateConfidenceLevel(args, config),
    runOnMount: false,
  });
  const assessmentTotalProgress = useQuery({
    service: (args, config) =>
      service.fetchAssessmentTotalProgress(
        { assessmentId, ...(args || {}) },
        config,
      ),
  });
  const calculate = async () => {
    try {
      await calculateMaturityLevelQuery.query();
      await queryData.query();
    } catch (e) {}
  };
  const calculateConfidenceLevel = async () => {
    try {
      await calculateConfidenceLevelQuery.query();
      await queryData.query();
    } catch (e) {}
  };
  const iframeUrl =
    "https://flickit-cdn.hectora.app/static-stage/report/" +
    assessmentId +
    "/index.html";
  useEffect(() => {
    const checkIframeUrl = async () => {
      try {
        const response = await fetch(iframeUrl, { method: "HEAD" });
        if (response.status === 404) {
          setDisableHtmlDodument(true);
        }
      } catch (error) {
        setDisableHtmlDodument(true);
        console.error("Error fetching iframe URL:", error);
      }
    };

    checkIframeUrl();
  }, [iframeUrl]);
  useEffect(() => {
    if (queryData.errorObject?.response?.data?.code == "CALCULATE_NOT_VALID") {
      calculate();
    }
    if (
      queryData.errorObject?.response?.data?.code ==
      "CONFIDENCE_CALCULATION_NOT_VALID"
    ) {
      calculateConfidenceLevel();
    }
    if (queryData?.errorObject?.response?.data?.code === "DEPRECATED") {
      service.migrateKitVersion({ assessmentId }).then(() => {
        queryData.query();
      });
    }
  }, [queryData.errorObject]);
  const { spaceId } = useParams();
  const fetchAssessmentsRoles = useQuery<RolesType>({
    service: (args, config) => service.fetchAssessmentsRoles(args, config),
    toastError: false,
    toastErrorOptions: { filterByStatus: [404] },
  });
  return (
    <PermissionControl error={[queryData.errorObject?.response]}>
      <QueryBatchData
        queryBatchData={[
          queryData,
          assessmentTotalProgress,
          fetchAssessmentsRoles,
        ]}
        renderLoading={() => <LoadingSkeletonOfAssessmentReport />}
        render={([data = {}, progress, roles]) => {
          const {
            status,
            assessment,
            subjects,
            assessmentPermissions: { manageable, exportable },
            permissions,
          } = data || {};

          const colorCode = assessment?.color?.code || "#101c32";
          const { assessmentKit, maturityLevel, confidenceValue } =
            assessment || {};
          const { questionsCount, answersCount } = progress;

          const totalProgress =
            ((answersCount || 0) / (questionsCount || 1)) * 100;
          const totalAttributesLength = subjects.reduce(
            (sum: any, subject: any) => {
              return sum + (subject.attributes?.length || 0);
            },
            0,
          );

          return (
            <Box m="auto" pb={3} sx={{ px: { xl: 30, lg: 12, xs: 2, sm: 3 } }}>
              <AssessmentReportTitle data={data} colorCode={colorCode} />
              <Grid container spacing={1} columns={12} mt={0}>
                <Grid item sm={12} xs={12}>
                  <Box display="flex" justifyContent="space-between">
                    <Typography
                      color="primary"
                      textAlign="left"
                      variant="headlineLarge"
                    >
                      <Trans i18nKey="assessmentInsights" />
                    </Typography>
                    <Box sx={{ py: "0.6rem", display: "flex" }}>
                      <Tooltip title={<Trans i18nKey={"graphicChart"} />}>
                        <Box>
                          <IconButton
                            data-cy="more-action-btn"
                            disabled={disableHtmlDocument}
                            component={exportable ? Link : "div"}
                            to={`/${spaceId}/assessments/1/${assessmentId}/html-document/`}
                          >
                            <Assessment
                              sx={{ fontSize: "1.5rem", margin: "0.2rem" }}
                            />
                          </IconButton>
                        </Box>
                      </Tooltip>
                      <Tooltip title={<Trans i18nKey={"assessmentDocument"} />}>
                        <Box>
                          <IconButton
                            data-cy="more-action-btn"
                            disabled={!exportable}
                            component={exportable ? Link : "div"}
                            to={`/${spaceId}/assessments/1/${assessmentId}/assessment-document/`}
                          >
                            <ArticleRounded
                              sx={{ fontSize: "1.5rem", margin: "0.2rem" }}
                            />
                          </IconButton>
                        </Box>
                      </Tooltip>
                      <Tooltip title={<Trans i18nKey={"assessmentSettings"} />}>
                        <Box>
                          <IconButton
                            data-cy="more-action-btn"
                            disabled={!manageable}
                            component={manageable ? Link : "div"}
                            to={`/${spaceId}/assessments/1/${assessmentId}/assessment-settings/`}
                          >
                            <SettingsIcon
                              sx={{ fontSize: "1.5rem", margin: "0.2rem" }}
                            />
                          </IconButton>
                        </Box>
                      </Tooltip>
                    </Box>
                  </Box>
                  <Grid container alignItems="stretch" spacing={2} mt={1}>
                    <Grid item lg={6} md={6} sm={12} xs={12}>
                      <Box
                        display="flex"
                        flexDirection="column"
                        gap={1}
                        height="100%"
                      >
                        <Typography
                          color="#73808C"
                          marginX={4}
                          variant="titleMedium"
                        >
                          <Trans i18nKey="general" />
                        </Typography>
                        <AssessmentSummary
                          assessmentKit={assessment}
                          data={data}
                          progress={totalProgress}
                          questionCount={questionsCount}
                          answerCount={answersCount}
                        />
                      </Box>
                    </Grid>
                    <Grid item lg={6} md={6} sm={12} xs={12}>
                      <Box
                        display="flex"
                        flexDirection="column"
                        gap={1}
                        height="100%"
                      >
                        <Typography
                          color="#73808C"
                          marginX={4}
                          variant="titleMedium"
                        >
                          <Trans i18nKey="overallStatus" />
                        </Typography>
                        <AssessmentOverallStatus
                          status={status}
                          maturity_level={maturityLevel}
                          maturity_level_count={
                            assessmentKit?.maturityLevelCount
                          }
                          confidence_value={confidenceValue}
                        />
                      </Box>
                    </Grid>
                    {/* <Grid item lg={4} md={12} sm={12} xs={12}>
                    <Box display="flex" flexDirection="column" gap={1}>
                      <Typography color="#73808C" marginX={4}>
                        <Trans i18nKey="subjectStatus" />
                      </Typography>
                      <AssessmentSubjectStatus subjects={subjects} />
                    </Box>
                  </Grid> */}
                  </Grid>
                </Grid>

                <Grid item lg={12} md={12} sm={12} xs={12}>
                  <Box display="flex" flexDirection="column" gap={1}>
                    <Typography
                      color="#73808C"
                      marginX={4}
                      variant="titleMedium"
                    >
                      <Trans i18nKey="insight" />
                    </Typography>
                    <AssessmentInsight />
                  </Box>
                </Grid>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                  <Box display="flex" flexDirection="column" gap={1}>
                    <Typography
                      color="#73808C"
                      marginX={4}
                      variant="titleMedium"
                    >
                      <Trans i18nKey="assessmentKit" />
                    </Typography>
                    <AssessmentReportKit assessmentKit={assessmentKit} />
                  </Box>
                </Grid>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                  <Box
                    sx={{ ...styles.centerCV }}
                    alignItems="flex-start"
                    marginTop={6}
                  >
                    <Typography color="#73808C" variant="h5">
                      <Trans i18nKey="subjectReport" />
                    </Typography>
                    <Typography variant="titleMedium" fontWeight={400}>
                      <Trans
                        i18nKey="overallStatusDetails"
                        values={{
                          attributes: totalAttributesLength,
                          subjects: subjects?.length,
                        }}
                      />
                    </Typography>
                    <Divider sx={{ width: "100%", marginTop: 2 }} />
                  </Box>
                </Grid>
                <Grid item lg={12} md={12} sm={12} xs={12} id="subjects">
                  <AssessmentSubjectList
                    maturityLevelCount={assessmentKit?.maturityLevelCount ?? 5}
                    subjects={subjects}
                    colorCode={colorCode}
                  />
                </Grid>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                  <Box sx={{ ...styles.centerCV }} marginTop={6} gap={2}>
                    <Typography
                      color="#73808C"
                      variant="h5"
                      display="flex"
                      alignItems="center"
                    >
                      <Trans i18nKey="advice" />
                      <Box
                        sx={{
                          ml: theme.direction == "ltr" ? 1 : "unset",
                          mr: theme.direction == "rtl" ? 1 : "unset",
                          mt: 1,
                        }}
                      >
                        <img src={BetaSvg} alt="beta" width={34} />
                      </Box>
                    </Typography>

                    <Divider sx={{ width: "100%" }} />
                  </Box>
                </Grid>
                <Grid item lg={12} md={12} sm={12} xs={12} id="advices" mt={2}>
                  <AssessmentAdviceContainer
                    subjects={subjects}
                    assessment={assessment}
                    permissions={permissions}
                  />
                </Grid>
              </Grid>
            </Box>
          );
        }}
      />
    </PermissionControl>
  );
};

export default AssessmentReportContainer;
