import { useEffect } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import QueryBatchData from "@common/QueryBatchData";
import { useParams } from "react-router-dom";
import { useQuery } from "@/hooks/useQuery";
import { AssessmentSubjectList } from "./AssessmentSubjectList";
import { useServiceContext } from "@/providers/service-provider";
import LoadingSkeletonOfAssessmentReport from "@common/loadings/LoadingSkeletonOfAssessmentReport";
import { ECustomErrorType, RolesType } from "@/types/index";
import { styles } from "@styles";
import { AssessmentInsight } from "./AssessmentInsight";
import PermissionControl from "../../../common/PermissionControl";
import { t } from "i18next";
import { Gauge } from "../../../common/charts/Gauge";
import { Trans } from "react-i18next";
import { IssuesItem } from "../DashboardTopSection";
import { LoadingSkeleton } from "../../../common/loadings/LoadingSkeleton";
import { Text } from "@/components/common/Text";

const AssessmentReportContainer = (props: any) => {
  const { service } = useServiceContext();
  const { assessmentId = "" } = useParams();

  const fetchAssessmentInsight = useQuery({
    service: (args, config) =>
      service.assessments.insight.getList({ assessmentId }, config),
    toastError: false,
  });
  const calculateMaturityLevelQuery = useQuery({
    service: (args, config) =>
      service.assessments.info.calculateMaturity(
        args ?? { assessmentId },
        config,
      ),
    runOnMount: false,
  });
  const calculateConfidenceLevelQuery = useQuery({
    service: (args, config) =>
      service.assessments.info.calculateConfidence(
        args ?? { assessmentId },
        config,
      ),
    runOnMount: false,
  });
  const assessmentTotalProgress = useQuery({
    service: (args, config) =>
      service.assessments.info.getProgress(
        { assessmentId, ...(args ?? {}) },
        config,
      ),
  });
  const runCalculationWithRefresh = async (calculationQuery: any) => {
    await calculationQuery.query();
    await fetchAssessmentInsight.query();
    await fetchInsightsIssues.query();
  };

  const calculate = () =>
    runCalculationWithRefresh(calculateMaturityLevelQuery);
  const calculateConfidenceLevel = () =>
    runCalculationWithRefresh(calculateConfidenceLevelQuery);

  useEffect(() => {
    if (
      fetchAssessmentInsight.errorObject?.response?.data?.code ==
      ECustomErrorType.CALCULATE_NOT_VALID
    ) {
      calculate();
    }
    if (
      fetchAssessmentInsight.errorObject?.response?.data?.code ==
      ECustomErrorType.CONFIDENCE_CALCULATION_NOT_VALID
    ) {
      calculateConfidenceLevel();
    }
    if (
      fetchAssessmentInsight?.errorObject?.response?.data?.code ===
      ECustomErrorType.DEPRECATED
    ) {
      service.assessments.info.migrateKitVersion({ assessmentId }).then(() => {
        fetchAssessmentInsight.query();
      });
    }
  }, [fetchAssessmentInsight.errorObject]);

  const fetchInsightsIssues = useQuery<RolesType>({
    service: (args, config) =>
      service.assessments.insight.getIssues({ assessmentId }, config),
    toastError: false,
  });

  const reloadQuery = () => {
    fetchInsightsIssues.query();
    fetchAssessmentInsight.query();
  };

  return (
    <PermissionControl
      error={[fetchAssessmentInsight.errorObject?.response?.data]}
    >
      <QueryBatchData
        queryBatchData={[fetchInsightsIssues]}
        renderLoading={() => <LoadingSkeleton />}
        loading={!fetchInsightsIssues.loaded || assessmentTotalProgress.loading}
        render={([issues]) => {
          const { answersCount, questionsCount } =
            assessmentTotalProgress.data ?? {};
          return (
            <Box m="auto">
              <Grid container spacing={1}>
                {Object.entries(issues).map(([key, value]) => {
                  return (
                    <Grid
                      key={key}
                      size={{ xs: 12, md: 6 }}
                      display={value !== 0 ? "block" : "none"}
                    >
                      <IssuesItem
                        name={key}
                        value={value}
                        originalName={key}
                        fetchDashboard={reloadQuery}
                        color="error"
                        textVariant="semiBoldSmall"
                        py={0.5}
                        px={1}
                        issues={issues}
                        disableGenerateButtons={answersCount !== questionsCount}
                      />
                    </Grid>
                  );
                })}
              </Grid>
            </Box>
          );
        }}
      />

      <QueryBatchData
        queryBatchData={[fetchAssessmentInsight]}
        renderLoading={() => <LoadingSkeletonOfAssessmentReport />}
        loading={
          !fetchAssessmentInsight.loaded || assessmentTotalProgress.loading
        }
        render={([data = {}]) => {
          const { assessment, subjects } = data ?? {};
          const { answersCount, questionsCount } =
            assessmentTotalProgress.data ?? {};

          const colorCode = assessment?.color?.code ?? "#101c32";
          const { kit, maturityLevel, confidenceValue } = assessment ?? {};
          const progress = ((answersCount ?? 0) / (questionsCount || 1)) * 100;

          return (
            <Box m="auto">
              <Box
                sx={{
                  ...styles.boxStyle,
                  paddingBottom: 3,
                  mt: 2,
                  display: "flex",
                  flexDirection: "row",
                  gap: 2,
                  flexWrap: "wrap",
                  width: "100%",
                }}
              >
                <Box sx={{ flex: 1, minWidth: "300px" }}>
                  <AssessmentInsight
                    defaultInsight={assessment?.insight}
                    reloadQuery={fetchInsightsIssues.query}
                  />
                </Box>

                <Box
                  mt={1}
                  sx={{ ...styles.centerVH }}
                  width={{ xs: "100%", md: "unset" }}
                  height="230px"
                >
                  <Gauge
                    maturity_level_number={kit?.maturityLevelsCount}
                    maturity_level_status={maturityLevel?.title}
                    level_value={maturityLevel?.index ?? 0}
                    confidence_value={confidenceValue}
                    confidence_text={t("common.confidence") + ":"}
                    confidence_text_variant="semiBoldSmall"
                    maxWidth="240px"
                    height="156px"
                  />
                </Box>
              </Box>

              <Text color="outline.outline" variant="semiBoldMedium">
                <Trans i18nKey="common.subjects" />
              </Text>
              <AssessmentSubjectList
                maturityLevelCount={kit?.maturityLevelsCount ?? 5}
                subjects={subjects}
                colorCode={colorCode}
                reloadQuery={fetchInsightsIssues.query}
                progress={progress}
              />
            </Box>
          );
        }}
      />
    </PermissionControl>
  );
};

export default AssessmentReportContainer;
