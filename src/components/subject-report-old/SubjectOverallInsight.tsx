import Box from "@mui/material/Box";
import { Trans } from "react-i18next";
import Skeleton from "@mui/material/Skeleton";
import Typography from "@mui/material/Typography";
import SubjectOverallStatusLevelChart from "./SubjectOverallStatusLevelChart";
import { LoadingButton } from "@mui/lab";
import { useEffect, useRef, useState } from "react";
import { ICustomError } from "@utils/CustomError";
import toastError from "@utils/toastError";
import { useQuery } from "@utils/useQuery";
import { useServiceContext } from "@providers/ServiceProvider";
import { useParams } from "react-router-dom";
import { styles } from "@styles";
import CircularProgress from "@mui/material/CircularProgress";
import InfoOutlined from "@mui/icons-material/InfoOutlined";
import { format } from "date-fns";
import { convertToRelativeTime } from "@/utils/convertToRelativeTime";
import { theme } from "@/config/theme";
import { t } from "i18next";
import { EditableRichEditor } from "../common/fields/EditableRichEditor";
import ActionPopup from "../common/buttons/ActionPopup";
import { FaWandMagicSparkles } from "react-icons/fa6";
import { useConfigContext } from "@/providers/ConfgProvider";

const SubjectOverallInsight = (props: any) => {
  return (
    <Box>
      <Box display="flex" sx={{ flexDirection: { xs: "column", sm: "row" } }}>
        <OverallInsightText {...props} />
        <Box sx={{ pl: { xs: 0, sm: 3, md: 6 }, mt: { xs: 4, sm: 0 } }}>
          <SubjectOverallStatusLevelChart {...props} />
        </Box>
      </Box>
    </Box>
  );
};

const OverallInsightText = (props: any) => {
  const { data = {}, loading } = props;
  const { config } = useConfigContext();

  const abortController = useRef(new AbortController());

  const [isApproved, setIsApproved] = useState(true);
  const [insight, setInsight] = useState<any>(null);
  const [editable, setEditable] = useState(false);
  const [isSystemic, setIsSystemic] = useState(true);
  const [isExpired, setIsExpired] = useState(false);

  const { service } = useServiceContext();

  const { subject, attributes, maturityLevelsCount } = data;
  const { title, maturityLevel, confidenceValue } = subject;
  const { assessmentId = "", subjectId = "" } = useParams();

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
      setIsSystemic(data?.defaultInsight ?? false);
      setInsight(selectedInsight);
      setIsApproved(data?.approved);
    }
    setEditable(data?.editable ?? false);
  }, [fetchSubjectInsight.data]);
  return (
    <Box display="flex" flexDirection={"column"} flex={1}>
      <Typography variant="titleLarge" sx={{ opacity: 0.96 }}>
        {loading ? (
          <Skeleton height="60px" />
        ) : (
          <>
            <Trans i18nKey="withConfidenceSubject" />{" "}
            <Typography
              component="span"
              variant="titleLarge"
              sx={{ color: "#3596A1" }}
            >
              <Trans
                i18nKey={"clOf"}
                values={{
                  cl: Math.ceil(confidenceValue),
                  clDivider: 100,
                }}
              />
            </Typography>{" "}
            <Trans i18nKey="wasEstimate" values={{ title }} />{" "}
            <Typography
              component="span"
              variant="titleLarge"
              sx={{ color: "#6035A1" }}
            >
              <Trans
                i18nKey={"divider"}
                values={{
                  cl: Math.ceil(maturityLevel.index),
                  clDivider: Math.ceil(maturityLevelsCount),
                }}
              />
            </Typography>{" "}
            <Trans i18nKey="meaning" values={{ title }} />{" "}
            <Typography component="span" variant="titleLarge">
              <Trans i18nKey={`${maturityLevel.title}`} />
            </Typography>
            <Trans i18nKey="is" />{" "}
            <Box>
              <Typography variant="body2">
                <Trans
                  i18nKey="attributesAreConsidered"
                  values={{ length: attributes?.length }}
                />
              </Typography>
            </Box>
          </>
        )}
      </Typography>
      <Box
        sx={{
          ...styles.centerV,
          mt: 4,
          mb: 2,
          marginInline: 3,
          justifyContent: "space-between",
        }}
      >
        <Typography variant="headlineSmall">
          <Trans i18nKey="subjectBriefConclusion" />
        </Typography>
        {editable && (
          <ActionPopup
            status={
              insight
                ? isExpired
                  ? "expired"
                  : isApproved
                    ? "approved"
                    : "pending"
                : "default"
            }
            hidePrimaryButton={insight && !isExpired && !isApproved}
            onPrimaryAction={(event) => {
              InitInsight.query().then(() => fetchSubjectInsight.query());
            }}
            loadingPrimary={InitInsight.loading}
            onSecondaryAction={(event: any) => ApproveSubject(event)}
            loadingSecondary={ApproveAISubject.loading}
            colorScheme={
              !insight
                ? {
                    muiColor: "primary",
                    main: theme.palette.primary.main,
                    light: theme.palette.primary.light,
                  }
                : isApproved && !isExpired
                  ? {
                      muiColor: "success",
                      main: theme.palette.success.main,
                      light: theme.palette.success.light,
                    }
                  : {
                      muiColor: "error",
                      main: theme.palette.error.main,
                      light: theme.palette.error.light,
                    }
            }
            texts={{
              buttonLabel: (
                <Typography
                  variant="labelMedium"
                  sx={{ ...styles.centerVH, gap: 1 }}
                >
                  <FaWandMagicSparkles />{" "}
                  {t(
                    insight
                      ? isExpired
                        ? "insightPage.insightIsExpired"
                        : isApproved
                          ? "insightPage.insightIsApproved"
                          : "insightPage.generatedByAppNeedsApproval"
                      : "insightPage.generateInsight",
                    {
                      title: config.appTitle,
                    },
                  )}
                </Typography>
              ),
              description: isExpired
                ? t("insightPage.insightIsExpiredDescrption")
                : insight
                  ? t("insightPage.generatedByAppNeedsApprovalDescrption", {
                      title: config.appTitle,
                    })
                  : t("insightPage.generateInsightDescription", {
                      title: config.appTitle,
                    }),
              primaryAction: insight
                ? t("insightPage.regenerate")
                : t("insightPage.generateInsight"),
              secondaryAction: t("insightPage.approveInsight"),
              confirmMessage: t("insightPage.regenerateDescription"),
              cancelMessage: t("insightPage.no"),
            }}
          />
        )}
      </Box>
      <Box
        display="flex"
        flexDirection="column"
        maxHeight="100%"
        gap={0.5}
        ml={3}
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
            {insight?.creationTime && (
              <Typography variant="bodyMedium" mx={1}>
                {format(
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
      </Box>{" "}
    </Box>
  );
};
export default SubjectOverallInsight;
