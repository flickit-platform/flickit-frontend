import { useState } from "react";
import { Trans } from "react-i18next";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import { useParams } from "react-router-dom";
import { useQuery } from "@/hooks/useQuery";
import { useServiceContext } from "@/providers/service-provider";
import { AssessmentReportNarrator } from "@/components/dashboard/advice-tab/AdviceNarrator";
import AdviceDialog from "./AdviceDialog";
import QueryBatchData from "@common/QueryBatchData";
import AdviceItems from "./advice-items/AdviceItems";
import { styles } from "@styles";
import Divider from "@mui/material/Divider";
import { useAssessmentContext } from "@/providers/assessment-provider";
import useInsightPopup from "@/hooks/useAssessmentInsightPopup";
import ActionPopup from "@/components/common/buttons/ActionPopup";
import { t } from "i18next";
import showToast from "@/utils/toast-error";
import { ICustomError } from "@/utils/custom-error";
import { Text } from "@/components/common/Text";

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

  const fetchData = () => {
    fetchPreAdviceInfo.query();
  };

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
    } catch (e) {
      showToast(e as ICustomError);
    }
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
    label: t("common.advice"),
  });

  return (
    <QueryBatchData
      queryBatchData={[fetchAdviceNarration]}
      renderLoading={() => <Skeleton height={160} />}
      render={() => {
        return (
          <Box>
            <AdviceDialog
              loading={fetchPreAdviceInfo.loading}
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
                    <Text variant="semiBoldLarge">
                      <Trans i18nKey="advice.approachToAdvice" />
                    </Text>
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
