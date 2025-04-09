import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import Skeleton from "@mui/material/Skeleton";
import { useServiceContext } from "@/providers/ServiceProvider";
import { styles } from "@styles";
import { t } from "i18next";
import { Trans } from "react-i18next";
import { useQuery } from "@/utils/useQuery";
import toastError from "@/utils/toastError";
import { ICustomError } from "@/utils/CustomError";
import { EditableRichEditor } from "../common/fields/EditableRichEditor";
import ActionPopup from "../common/buttons/ActionPopup";
import useInsightPopup from "@/hooks/useAssessmentInsightPopup";

export const AssessmentInsight = ({ defaultInsight, reloadQuery }: any) => {
  const { service } = useServiceContext();
  const { assessmentId = "" } = useParams();
  const abortController = useRef(new AbortController());

  const [insight, setInsight] = useState<any>(
    defaultInsight?.assessorInsight ?? defaultInsight?.defaultInsight,
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

  const fetchAssessmentInsight = useQuery<any>({
    service: (args, config) =>
      service.fetchAssessmentInsight({ assessmentId }, config),
    toastError: false,
    runOnMount: false,
  });

  const ApproveAssessmentInsight = useQuery({
    service: (args, config) =>
      service.approveAssessmentInsight(args ?? { assessmentId }, config),
    runOnMount: false,
  });

  const InitAssessmentInsight = useQuery({
    service: (args, config) =>
      service.initAssessmentInsight(args ?? { assessmentId }, config),
    runOnMount: false,
  });

  const ApproveInsight = async (event: React.SyntheticEvent) => {
    try {
      event.stopPropagation();
      await ApproveAssessmentInsight.query();
      await fetchAssessmentInsight.query();
      await reloadQuery();
    } catch (e) {
      toastError(e as ICustomError);
    }
  };

  useEffect(() => {
    if (fetchAssessmentInsight.data) {
      const data = fetchAssessmentInsight.data;
      const selected = data?.assessorInsight ?? data?.defaultInsight;
      setInsight(selected);
      setEditable(data?.editable ?? false);
      setIsApproved(data?.approved ?? true);
      setIsExpired(
        (data?.assessorInsight && !data?.assessorInsight?.isValid) ?? false,
      );
      reloadQuery();
    }
  }, [fetchAssessmentInsight.data]);

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
    initQuery: InitAssessmentInsight.query,
    fetchQuery: fetchAssessmentInsight.query,
    approveAction: ApproveInsight,
    initLoading: InitAssessmentInsight.loading,
    approveLoading: ApproveAssessmentInsight.loading,
  });

  return (
    <Box
      display="flex"
      flexDirection="column"
      gap={2}
      width="100%"
    >
      <Box
        sx={{
          ...styles.centerV,
          width: "100%",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="semiBoldLarge">
          <Trans i18nKey="insightsTab.assessmentOverallInsights" />
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
          />
        )}
      </Box>

      {fetchAssessmentInsight.loading ? (
        <Skeleton height={240} width="100%" />
      ) : (
        <EditableRichEditor
          defaultValue={insight?.insight}
          editable={editable}
          fieldName="insight"
          onSubmit={async (payload: any, event: any) => {
            await service.updateAssessmentInsight(
              { assessmentId, data: { insight: payload?.insight } },
              { signal: abortController.current.signal },
            );
          }}
          infoQuery={fetchAssessmentInsight.query}
          placeholder={t("writeYourInsightsOfTheAssessmentResultsHere") ?? ""}
        />
      )}
    </Box>
  );
};
