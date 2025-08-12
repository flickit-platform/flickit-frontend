import Box from "@mui/material/Box";
import { Trans } from "react-i18next";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import { ICustomError } from "@utils/CustomError";
import { useQuery } from "@utils/useQuery";
import { useServiceContext } from "@providers/ServiceProvider";
import { useParams } from "react-router-dom";
import { styles } from "@styles";
import CircularProgress from "@mui/material/CircularProgress";
import { t } from "i18next";
import useInsightPopup from "@/hooks/useAssessmentInsightPopup";
import ActionPopup from "@/components/common/buttons/ActionPopup";
import { EditableRichEditor } from "@/components/common/fields/EditableRichEditor";
import showToast from "@utils/toastError";

const AttributeInsight = ({
  attributeId,
  defaultInsight,
  progress,
  reloadQuery,
}: any) => {
  const { service } = useServiceContext();
  const { assessmentId = "" } = useParams();

  const [insight, setInsight] = useState<any>(
    defaultInsight?.assessorInsight ??
      defaultInsight?.aiInsight ??
      defaultInsight?.defaultInsight,
  );
  const [editable, setEditable] = useState(defaultInsight?.editable ?? false);
  const [isApproved, setIsApproved] = useState(
    defaultInsight?.approved ?? true,
  );
  const [isExpired, setIsExpired] = useState(
    ((defaultInsight?.assessorInsight &&
      !defaultInsight?.assessorInsight?.isValid) ||
      (defaultInsight?.defaultInsight &&
        !defaultInsight?.defaultInsight?.isValid)) ??
      false,
  );

  const fetchSubjectInsight = useQuery<any>({
    service: (args, config) =>
      service.assessments.attribute.getAttributeInsight(
        args ?? { assessmentId, attributeId },
        config,
      ),
    toastError: false,
    runOnMount: false,
  });

  const ApproveAISubject = useQuery({
    service: (args, config) =>
      service.assessments.attribute.approveAIInsight(
        args ?? { assessmentId, attributeId },
        config,
      ),
    runOnMount: false,
  });

  const InitInsight = useQuery({
    service: (args, config) =>
      service.assessments.attribute.generateAIInsight(
        args ?? { assessmentId, attributeId },
        config,
      ),
    runOnMount: false,
  });

  const ApproveSubject = async (event: React.SyntheticEvent) => {
    try {
      event.stopPropagation();
      await ApproveAISubject.query();
      await fetchSubjectInsight.query();
      await reloadQuery();
    } catch (e) {
      showToast(e as ICustomError);
    }
  };

  useEffect(() => {
    if (fetchSubjectInsight.data) {
      const data = fetchSubjectInsight.data;
      const selected = data?.assessorInsight ?? data?.aiInsight;
      setInsight(selected);
      setEditable(data?.editable ?? false);
      setIsApproved(data?.approved ?? true);
      setIsExpired(
        (data?.assessorInsight && !data?.assessorInsight?.isValid) ?? false,
      );
      reloadQuery();
    }
  }, [fetchSubjectInsight.data]);

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
    insight,
    isExpired,
    isApproved,
    initQuery: InitInsight.query,
    fetchQuery: fetchSubjectInsight.query,
    approveAction: ApproveSubject,
    initLoading: InitInsight.loading,
    approveLoading: ApproveAISubject.loading,
    AIEnabled: true,
  });

  return (
    <Box display="flex" flexDirection="column" px={{ xs: 1, sm: 4 }}>
      <Box sx={{ ...styles.centerV, justifyContent: "space-between" }}>
        <Typography variant="semiBoldLarge">
          <Trans i18nKey="common.insight" />
        </Typography>
        {editable && (
          <ActionPopup
            status={status}
            hidePrimaryButton={hidePrimaryButton}
            onPrimaryAction={onPrimaryAction}
            loadingPrimary={loadingPrimary}
            onSecondaryAction={onSecondaryAction}
            loadingSecondary={loadingSecondary}
            colorScheme={colorScheme}
            texts={texts}
            disablePrimaryButton={progress !== 100}
            disablePrimaryButtonText={
              t("assessment.questionsArentCompleteSoAICantBeGenerated") ?? ""
            }
          />
        )}
      </Box>

      <Box
        display="flex"
        flexDirection="column"
        maxHeight="100%"
        gap={0.5}
        mt={1}
      >
        {fetchSubjectInsight.loading ? (
          <Box height="100%" sx={{ ...styles.centerV }}>
            <CircularProgress />
          </Box>
        ) : (
          <EditableRichEditor
            defaultValue={insight?.insight}
            editable={editable}
            fieldName="insight"
            onSubmit={async (payload: any) => {
              await service.assessments.attribute.createAttributeInsight({
                assessmentId,
                attributeId,
                data: { assessorInsight: payload.insight },
              });
            }}
            infoQuery={fetchSubjectInsight.query}
            placeholder={
              t("common.writeHere", {
                title: t("common.insight").toLowerCase(),
              }) ?? ""
            }
          />
        )}
      </Box>
    </Box>
  );
};

export default AttributeInsight;
