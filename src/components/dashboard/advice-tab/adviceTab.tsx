import React from "react";
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
import Box from "@mui/material/Box";
import { styles } from "@styles";
import Typography from "@mui/material/Typography";
import { Trans } from "react-i18next";
import { theme } from "@config/theme";
import BetaSvg from "@assets/svg/beta.svg";
import { Divider } from "@mui/material";

const AdviceTab = () => {
  const { service } = useServiceContext();
  const { assessmentId = "" } = useParams();

  const queryData = useQuery<IAssessmentReportModel>({
    service: (args, config) =>
      service.fetchAssessment({ assessmentId }, config),
    toastError: false,
  });

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
