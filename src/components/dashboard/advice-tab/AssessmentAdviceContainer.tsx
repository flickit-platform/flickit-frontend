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
import EmptyState from "./EmptyState";
import AdviceItems from "./advice-items/AdviceItems";
import { styles } from "@styles";
import { Divider, Typography } from "@mui/material";
import AIGenerated from "@common/tags/AIGenerated";

const AssessmentAdviceContainer = (props: any) => {
  const fetchPreAdviceInfo = useQuery<IAssessmentReportModel>({
    service: (args, config) =>
      service.fetchPreAdviceInfo({ assessmentId }, config),
    toastError: false,
  });

  const fetchAdviceItems = useQuery<any>({
    service: (args, config) =>
      service.fetchAdviceItems({ assessmentId, page: 0, size: 50 }, config),
    toastError: true,
  });

  const calculateMaturityLevelQuery = useQuery({
    service: (args = { assessmentId }, config) =>
      service.calculateMaturityLevel(args, config),
    runOnMount: false,
  });
  const calculate = async () => {
    try {
      await calculateMaturityLevelQuery.query();
      await fetchPreAdviceInfo.query();
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
      await fetchPreAdviceInfo.query();
    } catch (e) {}
  };

  useEffect(() => {
    if (
      fetchPreAdviceInfo.errorObject?.response?.data?.code ==
      "CALCULATE_NOT_VALID"
    ) {
      calculate();
    }
    if (
      fetchPreAdviceInfo.errorObject?.response?.data?.code ==
      "CONFIDENCE_CALCULATION_NOT_VALID"
    ) {
      calculateConfidenceLevel();
    }
    if (
      fetchPreAdviceInfo?.errorObject?.response?.data?.code === "DEPRECATED"
    ) {
      service.migrateKitVersion({ assessmentId }).then(() => {
        fetchPreAdviceInfo.query();
      });
    }
  }, [fetchPreAdviceInfo.errorObject]);
  const [expanded, setExpanded] = useState<boolean>(false);
  const [isWritingAdvice, setIsWritingAdvice] = useState<boolean>(false);
  const [isAIGenerated, setIsAIGenerated] = useState<boolean>(false);

  const { assessmentId = "" } = useParams();

  const { service } = useServiceContext();

  const handleClickOpen = () => {
    setExpanded(true);
  };

  const handleClose = () => {
    setExpanded(false);
  };

  const fetchAdviceNarration = useQuery<any>({
    service: (args, config) =>
      service.fetchAdviceNarration({ assessmentId }, config),
    toastError: false,
  });

  useEffect(() => {
    setIsAIGenerated(!!fetchAdviceNarration.data?.aiNarration);
  }, [fetchAdviceNarration.data]);

  return (
    <QueryBatchData
      queryBatchData={[
        fetchAdviceNarration,
        fetchPreAdviceInfo,
        fetchAdviceItems,
      ]}
      renderLoading={() => <Skeleton height={160} />}
      render={([narrationComponent, adviceInfo, adviceItems]) => {
        const { attributes, maturityLevels, permissions } = adviceInfo || {};

        return (
          <Box mt={4}>
            <AdviceDialog
              open={expanded}
              handleClose={handleClose}
              attributes={attributes}
              filteredMaturityLevels={maturityLevels}
              permissions={permissions}
              fetchAdviceNarration={fetchAdviceNarration}
            />
            {!(
              narrationComponent?.aiNarration ||
              narrationComponent?.assessorNarration
            ) &&
            !isWritingAdvice &&
            !adviceItems?.items?.length ? (
              <EmptyState
                isWritingAdvice={isWritingAdvice}
                permissions={permissions}
                setIsWritingAdvice={setIsWritingAdvice}
                handleClickOpen={handleClickOpen}
                narrationComponent={narrationComponent}
              />
            ) : (
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
                    isWritingAdvice={isWritingAdvice}
                    setIsWritingAdvice={setIsWritingAdvice}
                    setAIGenerated={setIsAIGenerated}
                    fetchAdviceNarration={fetchAdviceNarration}
                  />
                </>
                <Divider />
                <AdviceItems />
              </Box>
            )}
          </Box>
        );
      }}
    />
  );
};

export default AssessmentAdviceContainer;
