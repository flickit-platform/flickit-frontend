import { useEffect, useState } from "react";
import { Trans } from "react-i18next";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Skeleton from "@mui/material/Skeleton";
import Tooltip from "@mui/material/Tooltip";
import { useParams } from "react-router-dom";
import { useQuery } from "@utils/useQuery";
import { IAssessmentReportModel } from "@types";
import { useServiceContext } from "@providers/ServiceProvider";
import { FaWandMagicSparkles } from "react-icons/fa6";
import { AssessmentReportNarrator } from "@components/dashboard/advice-tab/assessmentReportNarrator";
import AdviceDialog from "./AdviceDialog";
import QueryBatchData from "@common/QueryBatchData";
import AdviceItems from "./advice-items/AdviceItems";
import { styles } from "@styles";
import { Divider, Typography } from "@mui/material";
import AIGenerated from "@common/tags/AIGenerated";

const AssessmentAdviceContainer = (props: any) => {
  const fetchPreAdviceInfo = useQuery<any>({
    service: (args, config) =>
      service.fetchPreAdviceInfo({ assessmentId }, config),
    toastError: false,
    runOnMount: false,
  });
  const fetchAdviceNarration = useQuery<any>({
    service: (args, config) =>
      service.fetchAdviceNarration({ assessmentId }, config),
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
      await fetchAdviceNarration.query();
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
      await fetchAdviceNarration.query();
    } catch (e) {}
  };

  useEffect(() => {
    if (
      fetchAdviceNarration.errorObject?.response?.data?.code ==
      "CALCULATE_NOT_VALID"
    ) {
      calculate();
    }
    if (
      fetchAdviceNarration.errorObject?.response?.data?.code ==
      "CONFIDENCE_CALCULATION_NOT_VALID"
    ) {
      calculateConfidenceLevel();
    }
    if (
      fetchAdviceNarration?.errorObject?.response?.data?.code === "DEPRECATED"
    ) {
      service.migrateKitVersion({ assessmentId }).then(() => {
        fetchAdviceNarration.query();
      });
    }
  }, [fetchAdviceNarration.errorObject]);
  const [expanded, setExpanded] = useState<boolean>(false);
  const [isAIGenerated, setIsAIGenerated] = useState<boolean>(false);
  const [hasExpandedOnce, setHasExpandedOnce] = useState<boolean>(false);

  const { assessmentId = "" } = useParams();

  const { service } = useServiceContext();

  const handleClickOpen = () => {
    setExpanded(true);
    if (!hasExpandedOnce) {
      fetchPreAdviceInfo.query();
      setHasExpandedOnce(true);
    }
  };

  const handleClose = () => {
    setExpanded(false);
  };

  useEffect(() => {
    setIsAIGenerated(!!fetchAdviceNarration.data?.aiNarration);
  }, [fetchAdviceNarration.data]);

  const fetchAssessmentPermissions = useQuery({
    service: (args, config) =>
      service.fetchAssessmentPermissions(
        { assessmentId, ...(args || {}) },
        config,
      ),
    runOnMount: true,
  });

  return (
    <QueryBatchData
      queryBatchData={[fetchAdviceNarration, fetchAssessmentPermissions]}
      renderLoading={() => <Skeleton height={160} />}
      render={([narrationComponent, permissionsData]) => {
        const { permissions } = permissionsData;

        return (
          <Box mt={4}>
            <AdviceDialog
              open={expanded}
              handleClose={handleClose}
              fetchPreAdviceInfo={fetchPreAdviceInfo}
              permissions={permissions}
              fetchAdviceNarration={fetchAdviceNarration}
            />
            <Box sx={{ ...styles.boxStyle }}>
              <>
                <Box display="flex" justifyContent="space-between" mt={2}>
                  <Box sx={{ ...styles.centerVH }} gap={1}>
                    <Typography variant="semiBoldLarge">
                      <Trans i18nKey="approachToAdvice" />
                    </Typography>
                    {isAIGenerated && <AIGenerated />}
                  </Box>
                  <Tooltip
                    title={
                      !narrationComponent.aiEnabled && (
                        <Trans i18nKey="AIDisabled" />
                      )
                    }
                  >
                    <div>
                      <Button
                        variant="contained"
                        sx={{
                          display: "flex",
                          gap: 1,
                        }}
                        size="small"
                        onClick={handleClickOpen}
                        disabled={!narrationComponent.aiEnabled}
                      >
                        <Trans
                          i18nKey={
                            isAIGenerated
                              ? "regenerateAdvicesViaAI"
                              : "generateAdvicesViaAI"
                          }
                        />
                        <FaWandMagicSparkles />
                      </Button>
                    </div>
                  </Tooltip>
                </Box>

                <AssessmentReportNarrator
                  fetchAdviceNarration={fetchAdviceNarration}
                />
              </>
              <Divider />
              <AdviceItems />
            </Box>
          </Box>
        );
      }}
    />
  );
};

export default AssessmentAdviceContainer;
