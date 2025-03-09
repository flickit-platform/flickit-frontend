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

const SubjectOverallInsight = (props: any) => {
  const { subjectId } = props;

  const abortController = useRef(new AbortController());

  const [isApproved, setIsApproved] = useState(true);
  const [insight, setInsight] = useState<any>(null);
  const [editable, setEditable] = useState(false);
  const [isExpired, setIsExpired] = useState(false);

  const { service } = useServiceContext();

  const { assessmentId = "" } = useParams();

  const ApproveAISubject = useQuery({
    service: (
      args = {
        assessmentId,
        subjectId,
      },
      config,
    ) => service.ApproveAISubject(args, config),
    runOnMount: false,
  });

  const InitInsight = useQuery({
    service: (
      args = {
        assessmentId,
        subjectId,
      },
      config,
    ) => service.InitInsight(args, config),
    runOnMount: false,
  });

  const fetchSubjectInsight = useQuery<any>({
    service: (args, config) =>
      service.fetchSubjectInsight({ assessmentId, subjectId }, {}),
    toastError: false,
  });

  const ApproveSubject = async (event: React.SyntheticEvent) => {
    try {
      event.stopPropagation();
      await ApproveAISubject.query();
      fetchSubjectInsight.query();
    } catch (e) {
      const err = e as ICustomError;
      toastError(err);
    }
  };

  useEffect(() => {
    const data = fetchSubjectInsight.data;
    const selectedInsight = data?.assessorInsight || data?.defaultInsight;
    setIsExpired(
      (data?.assessorInsight && !data?.assessorInsight?.isValid) ?? false,
    );

    if (selectedInsight) {
      setInsight(selectedInsight);
      setIsApproved(data?.approved);
    }
    setEditable(data?.editable ?? false);
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
    <Box display="flex" flexDirection="column" px={4}>
      <Box
        sx={{
          ...styles.centerV,
          justifyContent: "space-between",
        }}
      >
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
          <>
            <EditableRichEditor
              defaultValue={insight?.insight}
              editable={editable}
              fieldName="insight"
              onSubmit={async (payload: any, event: any) => {
                await service.updateSubjectInsight(
                  {
                    assessmentId,
                    data: { insight: payload?.insight },
                    subjectId,
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
          </>
        )}
      </Box>{" "}
    </Box>
  );
};
export default SubjectOverallInsight;
