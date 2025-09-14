import { useEffect, useState } from "react";
import { Trans } from "react-i18next";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import { useParams } from "react-router-dom";
import { useQuery } from "@utils/useQuery";
import { useServiceContext } from "@providers/ServiceProvider";
import { AssessmentReportNarrator } from "@/components/dashboard/advice-tab/assessmentReportNarrator";
import AdviceDialog from "./AdviceDialog";
import QueryBatchData from "@common/QueryBatchData";
import AdviceItems from "./advice-items/AdviceItems";
import { styles } from "@styles";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import { ErrorCodes } from "@/types/index";
import useCalculate from "@/hooks/useCalculate";
import { useAssessmentContext } from "@/providers/AssessmentProvider";
import useInsightPopup from "@/hooks/useAssessmentInsightPopup";
import ActionPopup from "@/components/common/buttons/ActionPopup";
import { t } from "i18next";

const AssessmentAdviceContainer = (props: any) => {
  const { permissions } = useAssessmentContext();

  const fetchPreAdviceInfo = useQuery<any>({
    service: (args, config) =>
      service.assessments.advice.getPreInfo({ assessmentId }, config),
    toastError: false,
    runOnMount: false,
  });
  const fetchAdviceNarration = useQuery<any>({
    service: (args, config) =>
      service.assessments.advice.getNarration({ assessmentId }, config),
    toastError: false,
  });

  const { calculate, calculateConfidence } = useCalculate();
  const [loading, setLoading] = useState<boolean>(false);

  const handleErrorResponse = async (errorCode: any) => {
    setLoading(true);
    let shouldRefetch = false;

    switch (errorCode) {
      case ErrorCodes.CalculateNotValid:
        shouldRefetch = await calculate();
        break;
      case ErrorCodes.ConfidenceCalculationNotValid:
        shouldRefetch = await calculateConfidence();
        break;
      case "DEPRECATED":
        await service.assessments.info
          .migrateKitVersion({ assessmentId })
          .then(() => {
            shouldRefetch = true;
          })
          .catch(() => {
            shouldRefetch = false;
          });
        break;
      default:
        break;
    }
    if (shouldRefetch) {
      fetchPreAdviceInfo.query();
    }
    setLoading(false);
  };

  useEffect(() => {
    const errorCode = fetchPreAdviceInfo.errorObject?.response?.data?.code;
    if (errorCode) {
      handleErrorResponse(errorCode);
    }
  }, [fetchPreAdviceInfo.errorObject]);

  const [expanded, setExpanded] = useState<boolean>(false);
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

  const approveAdvice = async (event: React.SyntheticEvent) => {
    try {
      event.stopPropagation();
      await ApproveAIAdvice.query().then(() => {
        fetchAdviceNarration.query();
      });
    } catch (e) {}
  };

  const ApproveAIAdvice = useQuery({
    service: (args, config) =>
      service.assessments.advice.approveAI(args ?? { assessmentId }, config),
    runOnMount: false,
  });

  const {
    status,
    hidePrimaryButton,
    onPrimaryAction,
    loadingPrimary,
    onSecondaryAction,
    loadingSecondary,
    colorScheme,
    texts,
  } = useInsightPopup({
    insight:
      fetchAdviceNarration.data?.aiNarration?.narration ??
      fetchAdviceNarration.data?.assessorNarration?.narration,
    isExpired: fetchAdviceNarration.data?.issues?.expired,
    isApproved: !fetchAdviceNarration.data?.issues?.unapproved,
    initQuery: handleClickOpen,
    initLoading: false,
    approveAction: approveAdvice,
    approveLoading: ApproveAIAdvice.loading,
    AIEnabled: fetchAdviceNarration.data?.aiEnabled,
    label: t("common.advice")
  });

  return (
    <QueryBatchData
      queryBatchData={[fetchAdviceNarration]}
      renderLoading={() => <Skeleton height={160} />}
      render={([narrationComponent]) => {
        return (
          <Box>
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
                <Box display="flex" justifyContent="space-between">
                  <Box sx={{ ...styles.centerVH }} gap={1}>
                    <Typography variant="semiBoldLarge">
                      <Trans i18nKey="advice.approachToAdvice" />
                    </Typography>
                  </Box>
                  {fetchAdviceNarration.data?.editable && (
                    <ActionPopup
                      status={status}
                      hidePrimaryButton={hidePrimaryButton}
                      onPrimaryAction={onPrimaryAction}
                      loadingPrimary={loadingPrimary}
                      onSecondaryAction={onSecondaryAction}
                      loadingSecondary={loadingSecondary}
                      colorScheme={colorScheme}
                      texts={texts}
                      disablePrimaryButton={
                        !permissions?.approveAdviceNarration
                      }
                      disablePrimaryButtonText={
                        t(
                          "assessment.questionsArentCompleteSoAICantBeGenerated",
                        ) ?? ""
                      }
                    />
                  )}
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
