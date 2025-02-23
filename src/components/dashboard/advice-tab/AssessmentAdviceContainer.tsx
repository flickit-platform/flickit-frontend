import { useEffect, useState } from "react";
import { Trans } from "react-i18next";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Skeleton from "@mui/material/Skeleton";
import Tooltip from "@mui/material/Tooltip";
import { useParams } from "react-router-dom";
import { useQuery } from "@utils/useQuery";
import { useServiceContext } from "@providers/ServiceProvider";
import { FaWandMagicSparkles } from "react-icons/fa6";
import { AssessmentReportNarrator } from "@/components/dashboard/advice-tab/assessmentReportNarrator";
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

  const calculateConfidenceLevelQuery = useQuery({
    service: (args = { assessmentId }, config) =>
      service.calculateConfidenceLevel(args, config),
    runOnMount: false,
  });
  const [loading, setLoading] = useState<boolean>(false);

  const calculateMaturityLevel = async () => {
    try {
      await calculateMaturityLevelQuery.query();
    } catch (e) {}
  };

  const calculateConfidenceLevel = async () => {
    try {
      await calculateConfidenceLevelQuery.query();
    } catch (e) {}
  };

  const handleErrorResponse = async (errorCode: any) => {
    setLoading(true);

    switch (errorCode) {
      case "CALCULATE_NOT_VALID":
        await calculateMaturityLevel();
        break;
      case "CONFIDENCE_CALCULATION_NOT_VALID":
        await calculateConfidenceLevel();
        break;
      case "DEPRECATED":
        await service.migrateKitVersion({ assessmentId });
        break;
      default:
        break;
    }
    fetchPreAdviceInfo.query();
    setLoading(false);
  };

  useEffect(() => {
    const errorCode = fetchPreAdviceInfo.errorObject?.response?.data?.code;
    if (errorCode) {
      handleErrorResponse(errorCode);
    }
  }, [fetchPreAdviceInfo.errorObject]);

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
              loading={loading}
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
