import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { ICustomError } from "@/utils/CustomError";
import { useServiceContext } from "@/providers/ServiceProvider";
import { styles } from "@styles";
import { t } from "i18next";
import { useQuery } from "@/utils/useQuery";
import toastError from "@/utils/toastError";
import { EditableRichEditor } from "../common/fields/EditableRichEditor";
import ActionPopup from "../common/buttons/ActionPopup";
import useInsightPopup from "@/hooks/useAssessmentInsightPopup";
import QueryData from "../common/QueryData";
import Skeleton from "@mui/material/Skeleton";
import { Trans } from "react-i18next";

export const AssessmentInsight = () => {
  const { service } = useServiceContext();
  const { assessmentId = "" } = useParams();
  const [insight, setInsight] = useState<any>(null);
  const [editable, setEditable] = useState(false);
  const [isApproved, setIsApproved] = useState(true);
  const [isExpired, setIsExpired] = useState(false);
  const abortController = useRef(new AbortController());

  const fetchAssessmentInsight = useQuery<any>({
    service: (args, config) =>
      service.fetchAssessmentInsight({ assessmentId }, config),
    toastError: false,
  });

  const ApproveAssessmentInsight = useQuery({
    service: (
      args = {
        assessmentId,
      },
      config,
    ) => service.approveAssessmentInsight(args, config),
    runOnMount: false,
  });
  const InitAssessmentInsight = useQuery({
    service: (
      args = {
        assessmentId,
      },
      config,
    ) => service.initAssessmentInsight(args, config),
    runOnMount: false,
  });
  const ApproveInsight = async (event: React.SyntheticEvent) => {
    try {
      event.stopPropagation();
      await ApproveAssessmentInsight.query();
      await fetchAssessmentInsight.query();
    } catch (e) {
      const err = e as ICustomError;
      toastError(err);
    }
  };

  useEffect(() => {
    const data = fetchAssessmentInsight.data;
    const selectedInsight = data?.assessorInsight || data?.defaultInsight;
    setIsExpired(
      (data?.assessorInsight && !data?.assessorInsight?.isValid) ?? false,
    );

    if (selectedInsight) {
      setInsight(selectedInsight);
      setIsApproved(data?.approved);
    }
    setEditable(data?.editable ?? false);
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
    <QueryData
      {...fetchAssessmentInsight}
      renderLoading={() => <Skeleton height={240} width="100%" />}
      render={() => {
        return (
          <Box
            display="flex"
            flexDirection="column"
            gap={2}
            height="100%"
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
            <EditableRichEditor
              defaultValue={insight?.insight}
              editable={editable}
              fieldName="insight"
              onSubmit={async (payload: any, event: any) => {
                await service.updateAssessmentInsight(
                  {
                    assessmentId,
                    data: { insight: payload?.insight },
                  },
                  { signal: abortController.current.signal },
                );
              }}
              infoQuery={fetchAssessmentInsight.query}
              placeholder={
                t("writeYourInsightsOfTheAssessmentResultsHere") ?? ""
              }
            />
          </Box>
        );
      }}
    />
  );
};
