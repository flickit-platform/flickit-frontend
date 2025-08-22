import { useCallback, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import PermissionControl from "../common/PermissionControl";
import { useQuery } from "@/utils/useQuery";
import {
  ErrorCodes,
  IGraphicalReport,
  ISubject,
  PathInfo,
} from "@/types/index";
import { useServiceContext } from "@/providers/ServiceProvider";
import { styles } from "@styles";
import { t } from "i18next";
import useCalculate from "@/hooks/useCalculate";
import QueryData from "../common/QueryData";
import { ASSESSMENT_MODE, VISIBILITY } from "@/utils/enumType";
import GraphicalReportSkeleton from "../common/loadings/GraphicalReportSkeleton";
import { useAuthContext } from "@/providers/AuthProvider";
import { setSurveyBox, useConfigContext } from "@providers/ConfgProvider";
import AssessmentReportTitle from "./AssessmentReportTitle";
import { Button, Typography, Box, Paper, Grid } from "@mui/material";
import {
  ArrowForward,
  CalendarMonthOutlined,
  DesignServicesOutlined,
  EmojiObjectsOutlined,
  Replay,
} from "@mui/icons-material";
import { getBasePath, useIntersectOnce } from "@/utils/helpers";
import LoadingButton from "@mui/lab/LoadingButton";
import Share from "@mui/icons-material/Share";
import useDialog from "@/utils/useDialog";
import { ShareDialog } from "./ShareDialog";
import ChipsRow, { ChipItem } from "../common/fields/ChipsRow";
import { getReadableDate } from "@/utils/readableDate";
import { Gauge } from "../common/charts/Gauge";
import { blue } from "@/config/colors";

const InvalidReportBanner = ({ onRetry }: { onRetry: () => void }) => (
  <Box
    bgcolor="error.main"
    height={48}
    gap={6}
    sx={{ ...styles.centerVH }}
    role="alert"
    aria-live="polite"
  >
    <Typography
      variant="semiBoldLarge"
      color="error.contrastText"
      sx={{ ...styles.centerV }}
    >
      {t("notification.incompleteReportDueToDelay")}
    </Typography>
    <Box bgcolor="background.container" color="error.main" borderRadius="4px">
      <Button
        onClick={onRetry}
        size="small"
        variant="contained"
        color="inherit"
        endIcon={<Replay />}
      >
        {t("common.retry")}
      </Button>
    </Box>
  </Box>
);

const AssessmentReport = () => {
  const { calculate, calculateConfidence } = useCalculate();
  const { isAuthenticatedUser } = useAuthContext();
  const { service } = useServiceContext();
  const { dispatch } = useConfigContext();
  const dialogProps = useDialog();

  const location = useLocation();

  const { assessmentId = "", spaceId = "", linkHash = "" } = useParams();

  const fetchPathInfo = useQuery<PathInfo>({
    service: (args, config) =>
      service.common.getPathInfo({ assessmentId, ...(args ?? {}) }, config),
    runOnMount: isAuthenticatedUser ?? false,
  });

  const fetchGraphicalReport = useQuery({
    service: (args, config) =>
      isAuthenticatedUser
        ? service.assessments.report.getGraphical(
            { assessmentId, ...(args ?? {}) },
            config,
          )
        : service.assessments.report.getPublicGraphicalReport(
            { linkHash, ...(args ?? {}) },
            { skipAuth: true, ...config },
          ),
    runOnMount: true,
  });

  // --- intersection for survey box (trigger once when recommendations appears)
  useIntersectOnce("recommendations", () => dispatch(setSurveyBox(true)));

  // --- handle error codes (type-safe & optional handlers)
  const errorActions: Partial<
    Record<ErrorCodes | "DEPRECATED", () => Promise<boolean>>
  > = {
    [ErrorCodes.CalculateNotValid]: () => calculate(),
    [ErrorCodes.ConfidenceCalculationNotValid]: () => calculateConfidence(),
    DEPRECATED: () =>
      service.assessments.info
        .migrateKitVersion({ assessmentId })
        .then(() => true)
        .catch(() => false),
  };

  const handleErrorResponse = useCallback(
    async (code: unknown) => {
      if (typeof code !== "string" && typeof code !== "number") return;

      const action =
        errorActions[code as ErrorCodes | "DEPRECATED"] ??
        errorActions[String(code) as ErrorCodes | "DEPRECATED"];

      if (!action) return;

      const ok = await action();
      if (ok) fetchGraphicalReport.query();
    },
    [
      assessmentId,
      calculate,
      calculateConfidence,
      fetchGraphicalReport,
      service.assessments.info,
      errorActions,
    ],
  );

  useEffect(() => {
    const code = fetchGraphicalReport.errorObject?.response?.data?.code;
    if (code != null) void handleErrorResponse(code);
  }, [
    fetchGraphicalReport.errorObject?.response?.data?.code,
    handleErrorResponse,
  ]);

  // --- reload
  const handleReloadReport = () => fetchGraphicalReport.query();

  // --- helper
  const isInvalid = (
    subjects: ISubject[] = [],
    advice: { narration?: string; adviceItems?: unknown[] } | null | undefined,
    isAdvisable: boolean,
    quickMode: boolean,
  ) => {
    if (!quickMode || !isAuthenticatedUser) return false;
    const hasMissingInsight = subjects.some((s) => !s?.insight);
    const hasMissingAdvice =
      isAdvisable &&
      (!advice?.narration?.trim?.() || (advice.adviceItems?.length ?? 0) === 0);
    return hasMissingInsight || hasMissingAdvice;
  };

  useEffect(() => {
    const data = fetchGraphicalReport.data as IGraphicalReport | undefined;

    const visibility = data?.visibility;
    const linkHashFromData = data?.linkHash;

    if (visibility === VISIBILITY.PUBLIC && linkHashFromData) {
      const basePath = getBasePath(location.pathname);
      const newPath = `${basePath}${linkHashFromData}/`;
      if (location.pathname !== newPath) {
        window.history.replaceState({}, "", newPath);
      }
    }
  }, [fetchGraphicalReport.data, location.pathname]);

  const navState = (location.state || {}) as {
    language?: { code?: string };
  };

  const langCode = navState.language?.code;

  return (
    <PermissionControl error={[fetchGraphicalReport.errorObject]}>
      <QueryData
        {...fetchGraphicalReport}
        renderLoading={() => (
          <GraphicalReportSkeleton
            lang={langCode}
            isAuthenticatedUser={isAuthenticatedUser}
          />
        )}
        render={(graphicalReport) => {
          const {
            assessment,
            advice,
            subjects,
            lang,
            isAdvisable,
            permissions,
          } = graphicalReport as IGraphicalReport;
          const lng = lang?.code?.toLowerCase();

          const ChipItems: ChipItem[] = [
            {
              key: "kit",
              label: (
                <Box display="inline-flex" alignItems="center" gap={0.5}>
                  <DesignServicesOutlined fontSize="small" color="primary" />
                  {t("assessmentReport.kitWithTitle", {
                    lng,
                    title: graphicalReport?.assessment.assessmentKit.title,
                  })}
                </Box>
              ),
            },
            {
              key: "qna",
              label: (
                <Box display="inline-flex" alignItems="center" gap={0.5}>
                  <EmojiObjectsOutlined fontSize="small" color="primary" />{" "}
                  {t("assessmentReport.questionsAndAnswer", {
                    lng,
                    count:
                      graphicalReport?.assessment.assessmentKit.questionsCount,
                  })}
                </Box>
              ),
            },
            {
              key: "date",
              label: (
                <Box display="inline-flex" alignItems="center" gap={0.5}>
                  <CalendarMonthOutlined fontSize="small" color="primary" />{" "}
                  {getReadableDate(graphicalReport?.assessment?.creationTime)}
                </Box>
              ),
            },
          ];

          const GotoItems: ChipItem[] = [
            {
              key: "kit",
              label: (
                <Box display="inline-flex" alignItems="center" gap={0.5}>
                  {t("assessmentReport.kitWithTitle", {
                    lng,
                    title: graphicalReport?.assessment.assessmentKit.title,
                  })}
                  <ArrowForward fontSize="small" color="primary" />
                </Box>
              ),
              color: blue[95],
            },
            {
              key: "qna",
              label: (
                <Box display="inline-flex" alignItems="center" gap={0.5}>
                  {t("assessmentReport.questionsAndAnswer", {
                    lng,
                    count:
                      graphicalReport?.assessment.assessmentKit.questionsCount,
                  })}
                  <ArrowForward fontSize="small" color="primary" />
                </Box>
              ),
              color: blue[95],
            },
          ];
          const isQuickMode = assessment?.mode?.code === ASSESSMENT_MODE.QUICK;
          const rtlLanguage = lng === "fa";

          return (
            <>
              {isInvalid(subjects, advice, isAdvisable, isQuickMode) && (
                <InvalidReportBanner onRetry={handleReloadReport} />
              )}

              <Box
                m="auto"
                pb={3}
                textAlign={rtlLanguage ? "right" : "left"}
                p={
                  isInvalid(subjects, advice, isAdvisable, isQuickMode)
                    ? 1
                    : { xs: 1, sm: 1, md: 4 }
                }
                px={{ xxl: 30, xl: 20, lg: 12, md: 8, xs: 1, sm: 3 }}
                sx={{ ...styles.rtlStyle(rtlLanguage) }}
                display="flex"
                flexDirection="column"
                gap={2}
              >
                {isAuthenticatedUser && (
                  <QueryData
                    {...fetchPathInfo}
                    render={(pathInfo) => (
                      <AssessmentReportTitle
                        pathInfo={pathInfo}
                        rtlLanguage={rtlLanguage}
                      >
                        {!isQuickMode && (
                          <LoadingButton
                            variant="contained"
                            startIcon={
                              <Share
                                fontSize="small"
                                sx={{ ...styles.iconDirectionStyle(lng) }}
                              />
                            }
                            size="small"
                            onClick={() => dialogProps.openDialog({})}
                            disabled={
                              !permissions.canShareReport &&
                              !permissions.canManageVisibility
                            }
                            sx={{
                              ...styles.rtlStyle(rtlLanguage),
                              height: "100%",
                              width: "290px",
                            }}
                          >
                            {t("assessmentReport.shareReport", { lng })}
                          </LoadingButton>
                        )}
                      </AssessmentReportTitle>
                    )}
                  />
                )}
                <Box display="flex" flexDirection="column" gap={4}>
                  <Paper
                    elevation={3}
                    sx={{
                      ...styles.centerCV,
                      borderRadius: "16px",
                      boxShadow: "none",
                      paddingBlock: 2,
                      paddingInline: 2.5,
                    }}
                  >
                    <Box
                      justifyContent="space-between"
                      width="100%"
                      sx={{ ...styles.centerV }}
                    >
                      <Typography
                        variant="headlineMedium"
                        color="primary"
                        sx={{ ...styles.rtlStyle(rtlLanguage) }}
                      >
                        {t("assessmentReport.assessmentResult", { lng })}
                      </Typography>
                      <ChipsRow items={ChipItems} lng={lng} />
                    </Box>
                    <Grid container mt={2} columnSpacing={5}>
                      <Grid item xs={12} sm={6} md={12} lg={8.7}>
                        {!isQuickMode && (
                          <>
                            <Typography
                              component="div"
                              variant="titleSmall"
                              color="background.onVariant"
                              sx={{
                                ...styles.rtlStyle(rtlLanguage),
                              }}
                            >
                              {t("assessmentReport.introduction", { lng })}
                            </Typography>
                            <Typography
                              component="div"
                              textAlign="justify"
                              variant="bodyMedium"
                              sx={{
                                mt: 1,
                                ...styles.rtlStyle(rtlLanguage),
                              }}
                              dangerouslySetInnerHTML={{
                                __html:
                                  assessment.intro ??
                                  t("common.unavailable", { lng }),
                              }}
                              className="tiptap"
                            />
                            <Typography
                              component="div"
                              variant="titleSmall"
                              color="background.onVariant"
                              sx={{
                                mt: 2,
                                ...styles.rtlStyle(rtlLanguage),
                              }}
                            >
                              {t("common.summary", { lng })}
                            </Typography>
                          </>
                        )}
                        <Typography
                          component="div"
                          textAlign="justify"
                          variant="bodyMedium"
                          sx={{
                            mt: 1,
                            ...styles.rtlStyle(rtlLanguage),
                          }}
                          dangerouslySetInnerHTML={{
                            __html:
                              assessment.overallInsight ??
                              t("common.unavailable", { lng }),
                          }}
                          className="tiptap"
                        />
                        <Box sx={{ ...styles.centerV }} gap={2}>
                          <Typography
                            component="div"
                            variant="titleSmall"
                            color="background.onVariant"
                            sx={{
                              ...styles.rtlStyle(rtlLanguage),
                            }}
                          >
                            {t("common.goto", { lng })}
                          </Typography>
                          <ChipsRow items={GotoItems} lng={lng} />
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={6} md={12} lg={3.3} height="200px">
                        <Gauge
                          level_value={assessment.maturityLevel?.value ?? 0}
                          maturity_level_status={
                            assessment.maturityLevel?.title
                          }
                          maturity_level_number={
                            assessment.assessmentKit?.maturityLevelCount
                          }
                          confidence_value={assessment.confidenceValue}
                          confidence_text={
                            !isQuickMode
                              ? t("common.withPercentConfidence", { lng })
                              : ""
                          }
                          isMobileScreen={false}
                          hideGuidance={true}
                          status_font_variant="headlineLarge"
                          height={270}
                          confidence_text_variant="semiBoldSmall"
                        />
                      </Grid>{" "}
                    </Grid>
                  </Paper>
                </Box>

                <ShareDialog
                  {...dialogProps}
                  {...graphicalReport}
                  lang={lang}
                />
              </Box>
            </>
          );
        }}
      />
    </PermissionControl>
  );
};

export default AssessmentReport;
