import Box from "@mui/material/Box";
import { Trans } from "react-i18next";
import Typography from "@mui/material/Typography";
import { useEffect, useRef, useState } from "react";
import { ICustomError } from "@utils/CustomError";
import toastError from "@utils/toastError";
import { useQuery } from "@utils/useQuery";
import { useServiceContext } from "@providers/ServiceProvider";
import { useParams } from "react-router-dom";
import { styles } from "@styles";
import CircularProgress from "@mui/material/CircularProgress";
import { t } from "i18next";
import { EditableRichEditor } from "../common/fields/EditableRichEditor";
import ActionPopup from "../common/buttons/ActionPopup";
import useInsightPopup from "@/hooks/useAssessmentInsightPopup";

const SubjectOverallInsight = ({
  subjectId,
  defaultInsight,
  reloadQuery,
}: any) => {
  const { service } = useServiceContext();
  const { assessmentId = "" } = useParams();
  const abortController = useRef(new AbortController());

  const [insight, setInsight] = useState<any>(
    defaultInsight?.assessorInsight || defaultInsight?.defaultInsight,
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
      service.fetchSubjectInsight({ assessmentId, subjectId }, config),
    toastError: false,
    runOnMount: false,
  });

  const ApproveAISubject = useQuery({
    service: (args, config) =>
      service.ApproveAISubject(args ?? { assessmentId, subjectId }, config),
    runOnMount: false,
  });

  const InitInsight = useQuery({
    service: (args, config) =>
      service.InitInsight(args ?? { assessmentId, subjectId }, config),
    runOnMount: false,
  });

  const ApproveSubject = async (event: React.SyntheticEvent) => {
    try {
      event.stopPropagation();
      await ApproveAISubject.query();
      await fetchSubjectInsight.query();
      await reloadQuery();
    } catch (e) {
      toastError(e as ICustomError);
    }
  };

  useEffect(() => {
    if (fetchSubjectInsight.data) {
      const data = fetchSubjectInsight.data;
      const selected = data?.assessorInsight || data?.defaultInsight;
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
  });

  return (
    <Box display="flex" flexDirection="column" px={{ xs: 1, sm: 4 }}>
      <Box sx={{ ...styles.centerV, justifyContent: "space-between" }}>
        <Typography variant="semiBoldLarge">
          <Trans i18nKey="insight" />
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

      <Box
        display="flex"
        flexDirection="column"
        maxHeight="100%"
        gap={0.5}
        mt={1}
      >
        {fetchSubjectInsight.loading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="100%"
          >
            <CircularProgress />
          </Box>
        ) : (
          <EditableRichEditor
            defaultValue={insight?.insight}
            editable={editable}
            fieldName="insight"
            onSubmit={async (payload: any, event: any) => {
              await service.updateSubjectInsight(
                {
                  assessmentId,
                  subjectId,
                  data: { insight: payload?.insight },
                },
                { signal: abortController.current.signal },
              );
            }}
            infoQuery={fetchSubjectInsight.query}
            placeholder={
              t("writeHere", {
                title: t("insight").toLowerCase(),
              }) ?? ""
            }
          />
        )}
      </Box>
    </Box>
  );
};

export default SubjectOverallInsight;
