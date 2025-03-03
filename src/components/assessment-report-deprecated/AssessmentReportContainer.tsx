import { useEffect } from "react";
import { Box, Divider, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import QueryBatchData from "@common/QueryBatchData";
import { useParams } from "react-router-dom";
import { useQuery } from "@utils/useQuery";
import { AssessmentSubjectList } from "./AssessmentSubjectList";
import { useServiceContext } from "@providers/ServiceProvider";
import { AssessmentOverallStatus } from "./AssessmentOverallStatus";
import LoadingSkeletonOfAssessmentReport from "@common/loadings/LoadingSkeletonOfAssessmentReport";
import { ErrorCodes, IAssessmentReportModel, RolesType } from "@types";
import { AssessmentReportKit } from "./AssessmentReportKit";
import { Trans } from "react-i18next";
import { styles } from "@styles";
import { AssessmentInsight } from "./AssessmentInsight";
import PermissionControl from "../common/PermissionControl";
import useCalculate from "@/hooks/useCalculate";

const AssessmentReportContainer = (props: any) => {
  const { service } = useServiceContext();
  const { assessmentId = "" } = useParams();
  const { calculate, calculateConfidence } = useCalculate();

  const queryData = useQuery<IAssessmentReportModel>({
    service: (args, config) =>
      service.fetchAssessment({ assessmentId }, config),
    toastError: false,
  });

  const assessmentTotalProgress = useQuery({
    service: (args, config) =>
      service.fetchAssessmentTotalProgress(
        { assessmentId, ...(args || {}) },
        config,
      ),
  });
  const getQueryData = async () => {
    try {
      await queryData.query();
    } catch (e) {}
  };

  useEffect(() => {
    if (
      queryData.errorObject?.response?.data?.code ==
      ErrorCodes.CalculateNotValid
    ) {
      calculate(getQueryData);
    }
    if (
      queryData.errorObject?.response?.data?.code ==
      ErrorCodes.ConfidenceCalculationNotValid
    ) {
      calculateConfidence(getQueryData);
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
        render={([data = {}, progress, roles]) => {
          const {
            assessment,
            subjects,
            assessmentPermissions: { exportable },
          } = data || {};

          const colorCode = assessment?.color?.code || "#101c32";
          const { assessmentKit, maturityLevel, confidenceValue } =
            assessment || {};

          const totalAttributesLength = subjects.reduce(
            (sum: any, subject: any) => {
              return sum + (subject.attributes?.length || 0);
            },
            0,
          );

          return (
            <Box m="auto" pb={3}>
              <Grid container spacing={1} columns={12} mt={0}>
                <Grid item sm={12} xs={12}>
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
                          <Trans i18nKey="assessmentKit" />
                        </Typography>
                        <AssessmentReportKit assessmentKit={assessmentKit} />
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
                          maturity_level={maturityLevel}
                          maturity_level_count={
                            assessmentKit?.maturityLevelCount
                          }
                          confidence_value={confidenceValue}
                        />
                      </Box>
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item lg={12} md={12} sm={12} xs={12}>
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
                      <Trans i18nKey="insight" />
                    </Typography>
                    <AssessmentInsight />
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
              </Grid>
            </Box>
          );
        }}
      />
    </PermissionControl>
  );
};

export default AssessmentReportContainer;
