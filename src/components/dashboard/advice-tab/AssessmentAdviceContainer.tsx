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
  const fetchAssessment = useQuery<IAssessmentReportModel>({
    service: (args, config) =>
      service.fetchAssessment({ assessmentId }, config),
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
      await fetchAssessment.query();
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
      await fetchAssessment.query();
    } catch (e) {}
  };

  useEffect(() => {
    if (
      fetchAssessment.errorObject?.response?.data?.code == "CALCULATE_NOT_VALID"
    ) {
      calculate();
    }
    if (
      fetchAssessment.errorObject?.response?.data?.code ==
      "CONFIDENCE_CALCULATION_NOT_VALID"
    ) {
      calculateConfidenceLevel();
    }
    if (fetchAssessment?.errorObject?.response?.data?.code === "DEPRECATED") {
      service.migrateKitVersion({ assessmentId }).then(() => {
        fetchAssessment.query();
      });
    }
  }, [fetchAssessment.errorObject]);
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

  const computeFilteredMaturityLevels = (assessment: any) => {
    if (!assessment?.assessmentKit?.maturityLevels) return [];
    return assessment.assessmentKit.maturityLevels.sort(
      (elem1: any, elem2: any) => elem1.index - elem2.index,
    );
  };

  return (
    <QueryBatchData
      queryBatchData={[fetchAdviceNarration, fetchAssessment, fetchAdviceItems]}
      renderLoading={() => <Skeleton height={160} />}
      render={([narrationComponent, assessmentData, adviceItems]) => {
        const { assessment, subjects, permissions } = assessmentData || {};
        const filteredMaturityLevels =
          computeFilteredMaturityLevels(assessment);

        return (
          <Box mt={4}>
            <AdviceDialog
              open={expanded}
              handleClose={handleClose}
              subjects={subjects}
              filteredMaturityLevels={filteredMaturityLevels}
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
