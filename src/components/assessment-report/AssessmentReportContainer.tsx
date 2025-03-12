import { useEffect } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import QueryBatchData from "@common/QueryBatchData";
import { useParams } from "react-router-dom";
import { useQuery } from "@utils/useQuery";
import { AssessmentSubjectList } from "./AssessmentSubjectList";
import { useServiceContext } from "@providers/ServiceProvider";
import LoadingSkeletonOfAssessmentReport from "@common/loadings/LoadingSkeletonOfAssessmentReport";
import { RolesType } from "@types";
import { styles } from "@styles";
import { AssessmentInsight } from "./AssessmentInsight";
import PermissionControl from "../common/PermissionControl";
import { t } from "i18next";
import { Gauge } from "../common/charts/Gauge";
import { Trans } from "react-i18next";
import { IssuesItem } from "../dashboard/dashboard-tab/todoBox";
import uniqueId from "@/utils/uniqueId";

const AssessmentReportContainer = (props: any) => {
  const { service } = useServiceContext();
  const { assessmentId = "" } = useParams();

  const fetchAssessmentInsight = useQuery({
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
      await fetchAssessmentInsight.query();
    } catch (e) {}
  };
  const calculateConfidenceLevel = async () => {
    try {
      await calculateConfidenceLevelQuery.query();
      await fetchAssessmentInsight.query();
    } catch (e) {}
  };

  useEffect(() => {
    if (
      fetchAssessmentInsight.errorObject?.response?.data?.code ==
      "CALCULATE_NOT_VALID"
    ) {
      calculate();
    }
    if (
      fetchAssessmentInsight.errorObject?.response?.data?.code ==
      "CONFIDENCE_CALCULATION_NOT_VALID"
    ) {
      calculateConfidenceLevel();
    }
    if (
      fetchAssessmentInsight?.errorObject?.response?.data?.code === "DEPRECATED"
    ) {
      service.migrateKitVersion({ assessmentId }).then(() => {
        fetchAssessmentInsight.query();
      });
    }
  }, [fetchAssessmentInsight.errorObject]);
  const fetchAssessmentsRoles = useQuery<RolesType>({
    service: (args, config) => service.fetchAssessmentsRoles(args, config),
    toastError: false,
    toastErrorOptions: { filterByStatus: [404] },
  });

  return (
    <PermissionControl
      error={[fetchAssessmentInsight.errorObject?.response?.data]}
    >
      <QueryBatchData
        queryBatchData={[
          fetchAssessmentInsight,
          assessmentTotalProgress,
          fetchAssessmentsRoles,
        ]}
        renderLoading={() => <LoadingSkeletonOfAssessmentReport />}
        render={([data = {}, progress]) => {
          const { assessment, subjects, issues } = data || {};
          const { answersCount, questionsCount } = progress || {};

          const colorCode = assessment?.color?.code || "#101c32";
          const { assessmentKit, maturityLevel, confidenceValue } =
            assessment || {};

          return (
            <Box m="auto">
              <Grid container spacing={1} mt="32px">
                {Object.entries(issues).map(([key, value]) => {
                  return (
                    <Grid
                      key={uniqueId()}
                      item
                      xs={12}
                      md={6}
                      display={value !== 0 ? "block" : "none"}
                    >
                      <IssuesItem
                        name={key}
                        value={value}
                        originalName={key}
                        fetchDashboard={fetchAssessmentInsight}
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
              <Box
                gap={2}
                sx={{ ...styles.boxStyle, paddingBottom: 3 }}
                display="flex"
                mt={2}
              >
                <AssessmentInsight
                  defaultInsight={
                    fetchAssessmentInsight.data.assessment.insight
                  }
                />
                <Gauge
                  maturity_level_number={assessmentKit?.maturityLevelCount}
                  isMobileScreen={true}
                  maturity_level_status={maturityLevel?.title}
                  level_value={maturityLevel?.index ?? 0}
                  confidence_value={confidenceValue}
                  confidence_text={t("confidence") + ":"}
                  hideGuidance={true}
                  maxWidth="180px"
                  maturity_status_guide_variant="bodyMedium"
                  m="auto"
                  maturity_status_guide={t("overallStatus")}
                />
              </Box>
              <Typography color="#73808C" variant="semiBoldMedium">
                <Trans i18nKey="subjects" />
              </Typography>
              <AssessmentSubjectList
                maturityLevelCount={assessmentKit?.maturityLevelCount ?? 5}
                subjects={subjects}
                colorCode={colorCode}
              />
            </Box>
          );
        }}
      />
    </PermissionControl>
  );
};

export default AssessmentReportContainer;
