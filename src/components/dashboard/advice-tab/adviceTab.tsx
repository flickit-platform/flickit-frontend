import { useEffect } from "react";
import Grid from "@mui/material/Grid";
import AssessmentAdviceContainer from "./AssessmentAdviceContainer";
import AdviceItems from "@components/dashboard/advice-tab/advice-items/AdviceItems";
import { useQuery } from "@utils/useQuery";
import { IAssessmentReportModel } from "@types";
import { useServiceContext } from "@providers/ServiceProvider";
import PermissionControl from "@common/PermissionControl";
import LoadingSkeletonOfAssessmentReport from "@common/loadings/LoadingSkeletonOfAssessmentReport";
import QueryData from "@common/QueryData";
import { useParams } from "react-router-dom";

const AdviceTab = () => {
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
    const calculate = async () => {
        try {
            await calculateMaturityLevelQuery.query();
            await queryData.query();
        } catch (e) {}
    };

    const calculateConfidenceLevelQuery = useQuery({
        service: (args = { assessmentId }, config) =>
            service.calculateConfidenceLevel(args, config),
        runOnMount: false,
    });

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
  return (
    <PermissionControl error={[queryData.errorObject?.response?.data]}>
      <QueryData
        {...queryData}
        renderLoading={() => <LoadingSkeletonOfAssessmentReport />}
        render={(data = {}) => {
          const {
            assessment,
            subjects,
            assessmentPermissions: { manageable, exportable },
            permissions,
          } = data || {};
          return (
            <>
              <Grid item lg={12} md={12} sm={12} xs={12} id="advices" mt={2}>
                <AssessmentAdviceContainer
                  subjects={subjects}
                  assessment={assessment}
                  permissions={permissions}
                />
              </Grid>
              <Grid
                item
                lg={12}
                md={12}
                sm={12}
                xs={12}
                id="advices-empty"
                mt={2}
              >
                <Grid item lg={12} md={12} sm={12} xs={12}>
                  <AdviceItems />
                </Grid>
              </Grid>
            </>
          );
        }}
      />
    </PermissionControl>
  );
};

export default AdviceTab;
