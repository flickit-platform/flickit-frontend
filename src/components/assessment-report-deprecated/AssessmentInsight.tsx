import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import { useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { ICustomError } from "@/utils/CustomError";
import { useServiceContext } from "@/providers/ServiceProvider";
import { format } from "date-fns";
import { convertToRelativeTime } from "@/utils/convertToRelativeTime";
import { styles } from "@styles";
import { t } from "i18next";
import formatDate from "@utils/formatDate";
import languageDetector from "@/utils/languageDetector";
import { useQuery } from "@/utils/useQuery";
import toastError from "@/utils/toastError";
import { EditableRichEditor } from "../common/fields/EditableRichEditor";
import ActionPopup from "../common/buttons/ActionPopup";
import useInsightPopup from "@/hooks/useAssessmentInsightPopup";

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
    <Box
      display="flex"
      flexDirection="column"
      alignItems="left"
      justifyContent="left"
      textAlign="left"
      height="100%"
      gap={0.5}
      py={2}
      sx={{
        background: "#fff",
        boxShadow: "0px 0px 8px 0px rgba(0, 0, 0, 0.25)",
        borderRadius: "12px",
        px: { xs: 2, sm: 3.75 },
      }}
    >
      {fetchAssessmentInsight.loading ? (
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
          <Box
            sx={{
              ...styles.centerV,
              width: "100%",
              justifyContent: "end",
            }}
          >
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
              t("writeHere", {
                title: t("insight").toLowerCase(),
              }) ?? ""
            }
          />
          {insight?.creationTime && (
            <Typography variant="bodyMedium" mx={1}>
              {languageDetector(insight)
                ? formatDate(
                    format(
                      new Date(
                        new Date(insight?.creationTime).getTime() -
                          new Date(insight?.creationTime).getTimezoneOffset() *
                            60000,
                      ),
                      "yyyy/MM/dd HH:mm",
                    ),
                    "Shamsi",
                  ) +
                  " (" +
                  t(convertToRelativeTime(insight?.creationTime)) +
                  ")"
                : format(
                    new Date(
                      new Date(insight?.creationTime).getTime() -
                        new Date(insight?.creationTime).getTimezoneOffset() *
                          60000,
                    ),
                    "yyyy/MM/dd HH:mm",
                  ) +
                  " (" +
                  t(convertToRelativeTime(insight?.creationTime)) +
                  ")"}
            </Typography>
          )}
        </>
      )}
    </Box>
  );
};
