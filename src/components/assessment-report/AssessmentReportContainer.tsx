import { useEffect } from "react";
import { Box, Grid, Typography } from "@mui/material";
import QueryBatchData from "@common/QueryBatchData";
import { useParams } from "react-router-dom";
import { useQuery } from "@utils/useQuery";
import { AssessmentSubjectList } from "./AssessmentSubjectList";
import { useServiceContext } from "@providers/ServiceProvider";
import LoadingSkeletonOfAssessmentReport from "@common/loadings/LoadingSkeletonOfAssessmentReport";
import { IAssessmentReportModel, RolesType } from "@types";
import { styles } from "@styles";
import { AssessmentInsight } from "./AssessmentInsight";
import PermissionControl from "../common/PermissionControl";
import { t } from "i18next";
import { Gauge } from "../common/charts/Gauge";
import { Trans } from "react-i18next";
import { IssuesItem } from "../dashboard/dashboard-tab/todoBox";
import { uniqueId } from "lodash";

const AssessmentReportContainer = (props: any) => {
  const { service } = useServiceContext();
  const { assessmentId = "" } = useParams();

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
  const fetchAssessmentsRoles = useQuery<RolesType>({
    service: (args, config) => service.fetchAssessmentsRoles(args, config),
    toastError: false,
    toastErrorOptions: { filterByStatus: [404] },
  });

  return (
    <PermissionControl error={[queryData.errorObject?.response?.data]}>
      <QueryBatchData
        queryBatchData={[
          queryData,
          assessmentTotalProgress,
          fetchAssessmentsRoles,
        ]}
        renderLoading={() => <LoadingSkeletonOfAssessmentReport />}
        render={([data = {}]) => {
          const { assessment, subjects } = data || {};

          const colorCode = assessment?.color?.code || "#101c32";
          const { assessmentKit, maturityLevel, confidenceValue } =
            assessment || {};

          return (
            <Box m="auto">
              <Grid container spacing={1} mt="32px">
                {Object.entries({
                  notGenerated: 2,
                  unapproved: 1,
                  expired: 0,
                }).map(([key, value]) => {
                  return (
                    <Grid key={uniqueId()} item xs={12} md={4}>
                      <IssuesItem
                        name={key}
                        value={value}
                        originalName={key}
                        fetchDashboard={queryData}
                        color="error"
                        textVariant="semiBoldSmall"
                        py={0.5}
                        px={1}
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
                <AssessmentInsight />
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
