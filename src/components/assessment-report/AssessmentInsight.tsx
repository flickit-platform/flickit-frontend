import Box from "@mui/material/Box";
import { Trans } from "react-i18next";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import { useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import InfoOutlined from "@mui/icons-material/InfoOutlined";
import { ICustomError } from "@/utils/CustomError";
import { useServiceContext } from "@/providers/ServiceProvider";
import { format } from "date-fns";
import { convertToRelativeTime } from "@/utils/convertToRelativeTime";
import { styles } from "@styles";
import { theme } from "@/config/theme";
import { t } from "i18next";
import formatDate from "@utils/formatDate";
import languageDetector from "@/utils/languageDetector";
import { LoadingButton } from "@mui/lab";
import { useQuery } from "@/utils/useQuery";
import toastError from "@/utils/toastError";
import { EditableRichEditor } from "../common/fields/EditableRichEditor";

export const AssessmentInsight = () => {
  const { service } = useServiceContext();
  const { assessmentId = "" } = useParams();
  const [insight, setInsight] = useState<any>(null);
  const [editable, setEditable] = useState(false);
  const [isApproved, setIsApproved] = useState(true);
  const [isSystemic, setIsSystemic] = useState(true);
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

    if (selectedInsight) {
      setIsSystemic(data?.defaultInsight ?? false);
      setInsight(selectedInsight);
      setIsApproved(data?.approved);
    }
    setEditable(data?.editable ?? false);
  }, [fetchAssessmentInsight.data]);

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
              gap: 1,
              justifyContent: "end",
            }}
          >
            {(!isApproved || (!insight?.isValid && insight)) && editable && (
              <LoadingButton
                variant={"contained"}
                onClick={(event) => ApproveInsight(event)}
                loading={ApproveAssessmentInsight.loading}
                size="small"
              >
                <Trans i18nKey={"approve"} />
              </LoadingButton>
            )}
            {editable && (
              <LoadingButton
                onClick={(event) => {
                  event.stopPropagation();
                  InitAssessmentInsight.query().then(() =>
                    fetchAssessmentInsight.query(),
                  );
                }}
                variant={"contained"}
                loading={InitAssessmentInsight.loading}
                size="small"
              >
                <Trans i18nKey={!insight ? "generate" : "regenerate"} />
              </LoadingButton>
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
          {(!isApproved || (!insight?.isValid && insight)) && (
            <Box sx={{ ...styles.centerV }} gap={2} my={1}>
              <Box
                sx={{
                  zIndex: 1,
                  display: "flex",
                  justifyContent: "flex-start",
                  ml: { xs: 0.75, sm: 0.75, md: 1 },
                }}
              >
                <Typography
                  variant="labelSmall"
                  sx={{
                    backgroundColor: "#d85e1e",
                    color: "white",
                    padding: "0.35rem 0.35rem",
                    borderRadius: "4px",
                    fontWeight: "bold",
                  }}
                >
                  <Trans i18nKey={!isSystemic ? "outdated" : "note"} />
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  backgroundColor: "rgba(255, 249, 196, 0.31)",
                  padding: 1,
                  borderRadius: 2,
                  maxWidth: "100%",
                }}
              >
                <InfoOutlined
                  color="primary"
                  sx={{
                    marginRight: theme.direction === "ltr" ? 1 : "unset",
                    marginLeft: theme.direction === "rtl" ? 1 : "unset",
                  }}
                />
                <Typography
                  variant="titleMedium"
                  fontWeight={400}
                  textAlign="left"
                >
                  <Trans
                    i18nKey={
                      !isSystemic ? "invalidInsight" : "defaultInsightTemplate"
                    }
                  />
                </Typography>
              </Box>
            </Box>
          )}
        </>
      )}
    </Box>
  );
};
