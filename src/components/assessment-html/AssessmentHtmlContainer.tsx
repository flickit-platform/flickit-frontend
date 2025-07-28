import { useLocation, useNavigate, useParams } from "react-router-dom";
import PermissionControl from "../common/PermissionControl";
import { useQuery } from "@/utils/useQuery";
import {
  ErrorCodes,
  IGraphicalReport,
  ISubject,
  PathInfo,
} from "@/types/index";
import { useServiceContext } from "@/providers/ServiceProvider";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import AssessmentHtmlTitle from "./AssessmentHtmlTitle";
import { AssessmentTOC } from "./TopOfContents";
import SubjectReport from "./SubjectSection";
import { farsiFontFamily, primaryFontFamily, theme } from "@/config/theme";
import { Gauge } from "../common/charts/Gauge";
import TreeMapChart from "../common/charts/TreeMapChart";
import AdviceItemsAccordion from "../dashboard/advice-tab/advice-items/AdviceItemsAccordions";
import ReportCard from "./ReportSummary";
import DesignServicesIcon from "@mui/icons-material/DesignServices";
import EmojiObjectsIcon from "@mui/icons-material/EmojiObjects";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { getMaturityLevelColors, styles } from "@styles";
import { t } from "i18next";
import PieChart from "../common/charts/PieChart";
import useDialog from "@/utils/useDialog";
import { ShareDialog } from "./ShareDialog";
import LoadingButton from "@mui/lab/LoadingButton";
import ArrowForward from "@mui/icons-material/ArrowForward";
import Share from "@mui/icons-material/Share";
import uniqueId from "@/utils/uniqueId";
import useCalculate from "@/hooks/useCalculate";
import { useEffect } from "react";
import { getReadableDate } from "@utils/readableDate";
import QueryData from "../common/QueryData";
import { ASSESSMENT_MODE, VISIBILITY } from "@/utils/enumType";
import GraphicalReportSkeleton from "../common/loadings/GraphicalReportSkeleton";
import ReplayIcon from "@mui/icons-material/Replay";
import { Button } from "@mui/material";
import languageDetector from "@/utils/languageDetector";
import { useAuthContext } from "@/providers/AuthProvider";
import { setSurveyBox, useConfigContext } from "@providers/ConfgProvider";
import FaWandMagicSparkles from "../common/icons/FaWandMagicSparkles";

const getBasePath = (path: string): string => {
  const baseRegex = /^(.*\/graphical-report)(?:\/.*)?$/;
  const baseMatch = baseRegex.exec(path);
  return baseMatch?.[1]
    ? baseMatch[1] + "/"
    : path.endsWith("/")
      ? path
      : path + "/";
};

const AssessmentHtmlContainer = () => {
  const { calculate, calculateConfidence } = useCalculate();
  const { isAuthenticatedUser } = useAuthContext();

  const { assessmentId = "", spaceId = "", linkHash = "" } = useParams();
  const { service } = useServiceContext();
  const { dispatch } = useConfigContext();
  const dialogProps = useDialog();

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

  const fetchGraphicalReportUsers = useQuery<PathInfo>({
    service: (args, config) =>
      service.assessments.member.getReportAccessUsers(
        { assessmentId, ...(args ?? {}) },
        config,
      ),
    runOnMount: false,
  });

  useEffect(() => {
    let hasIntersected = false;
    let observer: IntersectionObserver | null = null;

    const setupIntersectionObserver = (targetElement: HTMLElement) => {
      observer = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && !hasIntersected) {
              hasIntersected = true;
              dispatch(setSurveyBox(true));
              obs.unobserve(entry.target);
            }
          });
        },
        {
          root: null,
          threshold: 0.5,
          rootMargin: "100px 0px -50px 0px",
        },
      );
      observer.observe(targetElement);
    };

    const targetElement = document.getElementById("recommendations");

    if (targetElement) {
      setupIntersectionObserver(targetElement);
    } else {
      const domObserver = new MutationObserver(() => {
        const el = document.getElementById("recommendations");
        if (el) {
          setupIntersectionObserver(el);
          domObserver.disconnect();
        }
      });

      domObserver.observe(document.body, {
        childList: true,
        subtree: true,
      });
    }

    return () => {
      observer?.disconnect();
    };
  }, []);

  const handleErrorResponse = async (errorCode: any) => {
    let shouldRefetch = false;

    switch (errorCode) {
      case ErrorCodes.CalculateNotValid:
        shouldRefetch = await calculate();
        break;
      case ErrorCodes.ConfidenceCalculationNotValid:
        shouldRefetch = await calculateConfidence();
        break;
      case "DEPRECATED":
        await service.assessments.info
          .migrateKitVersion({ assessmentId })
          .catch(() => {
            shouldRefetch = false;
          });
        break;
      default:
        break;
    }
    if (
      (errorCode === ErrorCodes.CalculateNotValid ||
        errorCode === ErrorCodes.ConfidenceCalculationNotValid ||
        errorCode === "DEPRECATED") &&
      shouldRefetch
    ) {
      fetchGraphicalReport.query();
    }
  };

  useEffect(() => {
    const errorCode = fetchGraphicalReport.errorObject?.response?.data?.code;

    if (errorCode) {
      handleErrorResponse(errorCode);
    }
  }, [fetchGraphicalReport.errorObject]);

  const renderChip = (icon: any, label: any, language: string) => (
    <Chip
      label={
        <Box
          sx={{
            ...styles.box,
            ...styles.rtlStyle(language === "fa"),
            fontWeight: 200,
          }}
        >
          {icon}
          {label}
        </Box>
      }
      size="small"
      sx={{ ...styles.chip }}
    />
  );

  const renderChips = (graphicalReport: IGraphicalReport, language: string) => (
    <>
      {renderChip(
        <DesignServicesIcon fontSize="small" color="primary" />,
        t("assessmentReport.kitWithTitle", {
          lng: language,
          title: graphicalReport?.assessment.assessmentKit.title,
        }),
        language,
      )}
      {renderChip(
        <EmojiObjectsIcon fontSize="small" color="primary" />,
        t("assessmentReport.questionsAndAnswer", {
          lng: language,
          count: graphicalReport?.assessment.assessmentKit.questionsCount,
        }),
        language,
      )}
      {renderChip(
        <CalendarMonthIcon fontSize="small" color="primary" />,
        getReadableDate(graphicalReport?.assessment?.creationTime),
        language,
      )}
    </>
  );

  const isInvalid = (subjects: ISubject[], advice: any, quickMode: boolean) => {
    const isAnyInsightMissing = subjects.some((s) => !s?.insight);
    const isAdviceMissing =
      !advice || advice.narration == null || !advice.adviceItems?.length;
    return (
      (isAnyInsightMissing || isAdviceMissing) &&
      quickMode &&
      isAuthenticatedUser
    );
  };

  const handleReloadReport = () => {
    fetchGraphicalReport.query();
  };
  const { state } = useLocation();
  const navigate = useNavigate();
  const from = state?.location?.from;
  const lang = state?.language?.code;

  const handleBack = () => {
    if (from) {
      navigate(from, { replace: true });
    } else {
      navigate(`/${spaceId}/assessments/1/`, { replace: true });
    }
  };

  return (
    <PermissionControl error={[fetchGraphicalReport.errorObject]}>
      <QueryData
        {...fetchGraphicalReport}
        renderLoading={() => (
          <GraphicalReportSkeleton
            lang={lang}
            isAuthenticatedUser={isAuthenticatedUser}
          />
        )}
        render={(graphicalReport) => {
          const {
            assessment,
            advice,
            permissions,
            subjects,
            lang,
            visibility,
            linkHash,
          } = graphicalReport as IGraphicalReport;
          const lng = lang?.code?.toLowerCase();
          const rtlLanguage = lng === "fa";
          const isQuickMode = assessment?.mode?.code === ASSESSMENT_MODE.QUICK;
          const currentPath = window.location.pathname;
          const basePath = getBasePath(currentPath);

          if (visibility === VISIBILITY.PUBLIC && linkHash) {
            const newPath = `${basePath}${linkHash}/`;
            window.history.replaceState({}, "", newPath);
          }

          return (
            <>
              {isInvalid(subjects, advice, isQuickMode) && (
                <Box
                  sx={{
                    backgroundColor: theme.palette.error.main,
                    height: 48,
                    ...styles.centerVH,
                  }}
                  gap={6}
                >
                  <Typography
                    variant="semiBoldLarge"
                    color="error.contrastText"
                    sx={{
                      ...styles.centerV,
                    }}
                  >
                    {t("notification.incompleteReportDueToDelay")}
                  </Typography>
                  <Box
                    sx={{
                      background: "#F3F5F6",
                      color: theme.palette.error.main,
                      borderRadius: "4px",
                    }}
                  >
                    <Button
                      onClick={handleReloadReport}
                      size="small"
                      variant="contained"
                      color="inherit"
                      endIcon={<ReplayIcon />}
                    >
                      {t("common.retry")}
                    </Button>
                  </Box>
                </Box>
              )}

              <Box
                m="auto"
                pb={3}
                sx={{
                  textAlign: rtlLanguage ? "right" : "left",
                  ...styles.rtlStyle(rtlLanguage),
                  p: isInvalid(subjects, advice, isQuickMode)
                    ? 1
                    : { xs: 1, sm: 1, md: 4 },
                  px: { xxl: 30, xl: 20, lg: 12, md: 8, xs: 1, sm: 3 },
                }}
              >
                {isAuthenticatedUser && (
                  <QueryData
                    {...fetchPathInfo}
                    renderLoading={() => <></>}
                    render={(pathInfo) => {
                      return (
                        <AssessmentHtmlTitle
                          pathInfo={pathInfo}
                          language={lang.code.toLowerCase()}
                        />
                      );
                    }}
                  />
                )}

                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  my={2}
                >
                  <Typography
                    color="primary"
                    textAlign="left"
                    variant="headlineLarge"
                    sx={{
                      ...styles.rtlStyle(rtlLanguage),
                    }}
                  >
                    {isAuthenticatedUser && (
                      <IconButton color="primary" onClick={handleBack}>
                        <ArrowForward
                          sx={{
                            ...theme.typography.headlineMedium,
                            transform: `scaleX(${lang.code.toLowerCase() === "fa" ? 1 : -1})`,
                          }}
                        />
                      </IconButton>
                    )}
                    {t("assessmentReport.assessmentReport", {
                      lng,
                    })}
                  </Typography>
                  <>
                    <LoadingButton
                      variant="contained"
                      startIcon={
                        <Share
                          fontSize="small"
                          sx={{
                            ...styles.iconDirectionStyle(lng),
                          }}
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
                      }}
                    >
                      {t("assessmentReport.shareReport", {
                        lng,
                      })}
                    </LoadingButton>
                    <ShareDialog
                      {...dialogProps}
                      onClose={() => dialogProps.onClose()}
                      fetchGraphicalReportUsers={fetchGraphicalReportUsers}
                      {...graphicalReport}
                      lang={lang}
                    />
                  </>{" "}
                </Box>
                <Grid container spacing={2}>
                  <Grid item lg={2.5} md={2.5} sm={12} xs={12}>
                    <AssessmentTOC graphicalReport={graphicalReport} />
                  </Grid>
                  <Grid item lg={9.5} md={9.5} sm={12} xs={12}>
                    <Paper
                      elevation={3}
                      sx={{
                        position: "relative",
                        backgroundColor: "#ffffff",
                        display: "flex",
                        justifyContent: "center",
                        borderStartEndRadius: 16,
                        borderStartStartRadius: 16,
                        boxShadow: "none",
                        width: "100%",
                        padding: { md: 6, xs: 1 },
                      }}
                    >
                      <Box
                        sx={{
                          position: "absolute",
                          right: { md: "40px", xs: "12px" },
                          top: { md: "60px", xs: "6px" },
                          bottom: { md: "40px", xs: "4px" },
                          width: { md: "8px", xs: "2px" },
                          backgroundColor: "#D5E5F6",
                        }}
                      />
                      <Box
                        sx={{
                          position: "absolute",
                          left: { md: "40px", xs: "12px" },
                          top: { md: "60px", xs: "6px" },
                          bottom: { md: "40px", xs: "4px" },
                          width: { md: "8px", xs: "2px" },
                          backgroundColor: "#D5E5F6",
                        }}
                      />
                      <Box padding={3} width="100%">
                        <Grid container spacing={4} sx={{ mb: "40px" }}>
                          <Grid item xs={12} sm={12}>
                            {renderChips(graphicalReport, lng)}
                          </Grid>
                          <Grid item xs={12} sm={6} md={6} lg={8}>
                            <Box display="flex" gap={1.5}>
                              <Typography
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  color: theme.palette.primary.main,
                                  ...theme.typography.headlineSmall,
                                  fontWeight: "bold",
                                  ...styles.rtlStyle(
                                    languageDetector(assessment.title),
                                  ),
                                }}
                              >
                                {assessment.title}
                              </Typography>

                              {isQuickMode && (
                                <Chip
                                  icon={
                                    <FaWandMagicSparkles
                                      styles={{
                                        color: "#6B7A90",
                                      }}
                                    />
                                  }
                                  label={t("common.AIAssissted", {
                                    lng,
                                  })}
                                  sx={{
                                    border: "1px solid #C6CDD7",
                                    backgroundColor: "#ffffff",
                                    color: "#6B7A90",
                                    px: 1.5,
                                    height: 32,
                                    ".MuiChip-label": {
                                      padding: 0,
                                      marginInlineStart: 1,
                                      ...styles.rtlStyle(rtlLanguage),
                                    },
                                    ...theme.typography.semiBoldMedium,
                                  }}
                                />
                              )}
                            </Box>

                            {!isQuickMode && (
                              <>
                                <Typography
                                  component="div"
                                  id="introduction"
                                  sx={{
                                    ...theme.typography.titleSmall,
                                    color: "#6C8093",
                                    mt: 2,
                                    ...styles.rtlStyle(rtlLanguage),
                                  }}
                                >
                                  {t("assessmentReport.introduction", {
                                    lng,
                                  })}
                                </Typography>
                                <Typography
                                  component="div"
                                  textAlign="justify"
                                  sx={{
                                    ...theme.typography.bodyMedium,
                                    mt: 1,
                                    ...styles.rtlStyle(rtlLanguage),
                                  }}
                                  dangerouslySetInnerHTML={{
                                    __html:
                                      assessment.intro ??
                                      t("common.unavailable", {
                                        lng,
                                      }),
                                  }}
                                  className="tiptap"
                                />
                              </>
                            )}
                            <Typography
                              component="div"
                              id="summary"
                              sx={{
                                ...theme.typography.titleSmall,
                                color: "#6C8093",
                                mt: 2,
                                ...styles.rtlStyle(rtlLanguage),
                              }}
                            >
                              {t("common.summary", {
                                lng,
                              })}
                            </Typography>
                            <Typography
                              component="div"
                              textAlign="justify"
                              sx={{
                                ...theme.typography.bodyMedium,
                                mt: 1,
                                ...styles.rtlStyle(rtlLanguage),
                              }}
                              dangerouslySetInnerHTML={{
                                __html:
                                  assessment.overallInsight ??
                                  t("common.unavailable", {
                                    lng,
                                  }),
                              }}
                            ></Typography>
                          </Grid>
                          <Grid item xs={12} sm={6} md={6} lg={4} mt={10}>
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
                                  ? t("common.withPercentConfidence", {
                                      lng,
                                    })
                                  : ""
                              }
                              isMobileScreen={false}
                              hideGuidance={true}
                              status_font_variant="titleMedium"
                              height={250}
                            />
                          </Grid>
                        </Grid>
                        <PieChart
                          data={subjects?.map((subject: any) => ({
                            name: subject.title,
                            value: 1,
                            color: getMaturityLevelColors(
                              assessment.assessmentKit.maturityLevelCount,
                            )[subject.maturityLevel.value - 1],
                            label:
                              subject.maturityLevel.title +
                              ": " +
                              subject.maturityLevel.value +
                              "/" +
                              assessment.assessmentKit.maturityLevelCount,
                            bgColor: getMaturityLevelColors(
                              assessment.assessmentKit.maturityLevelCount,
                              true,
                            )[subject.maturityLevel.value - 1],
                          }))}
                          language={lang.code.toLowerCase()}
                        />
                        <Typography
                          component="div"
                          id="strengthsAndWeaknesses"
                          sx={{
                            ...theme.typography.titleMedium,
                            color: "#6C8093",
                            my: 1,
                            ...styles.rtlStyle(rtlLanguage),
                          }}
                        >
                          {t("assessmentReport.prosAndCons", {
                            lng,
                          })}
                        </Typography>

                        <TreeMapChart
                          data={subjects.flatMap((subject: any) =>
                            subject.attributes.map((attribute: any) => ({
                              name: attribute.title,
                              description: attribute.description,
                              id: attribute.id,
                              count: attribute.weight,
                              label: attribute.maturityLevel.value.toString(),
                            })),
                          )}
                          levels={assessment.assessmentKit.maturityLevelCount}
                          lang={lang}
                        />

                        <Grid
                          xs={12}
                          md={12}
                          bgcolor="#F3F5F6"
                          borderRadius="8px"
                          paddingX={2}
                          paddingBottom={2}
                          my={2}
                          container
                          spacing={2}
                          marginLeft={0}
                        >
                          {!isQuickMode && (
                            <Grid item xs={12} md={10}>
                              <Typography
                                sx={{
                                  ...theme.typography.titleSmall,
                                  color: "#2B333B",
                                  my: 1,
                                  ...styles.centerV,
                                  direction: rtlLanguage ? "rtl" : "ltr",
                                  fontFamily: rtlLanguage
                                    ? farsiFontFamily
                                    : primaryFontFamily,
                                  gap: "4px",
                                }}
                              >
                                <InfoOutlinedIcon fontSize="small" />
                                {t("common.treeMapChart", {
                                  lng,
                                })}
                              </Typography>
                              <Typography
                                component="div"
                                textAlign="justify"
                                sx={{
                                  ...theme.typography.bodyMedium,
                                  fontWeight: "light",
                                  mt: 1,
                                  ...styles.rtlStyle(rtlLanguage),
                                }}
                                dangerouslySetInnerHTML={{
                                  __html:
                                    assessment.prosAndCons ??
                                    t("common.unavailable", {
                                      lng,
                                    }),
                                }}
                              ></Typography>
                            </Grid>
                          )}

                          <Grid item xs={12} md={!isQuickMode ? 2 : 12}>
                            <Typography
                              sx={{
                                ...theme.typography.titleSmall,
                                color: "#2B333B",
                                my: 1,
                                ...styles.centerV,
                                direction: rtlLanguage ? "rtl" : "ltr",
                                fontFamily: rtlLanguage
                                  ? farsiFontFamily
                                  : primaryFontFamily,
                              }}
                            >
                              {t("common.maturityLevels", {
                                lng,
                              })}
                            </Typography>
                            <Grid
                              container
                              xs={12}
                              sx={{
                                flexDirection: !isQuickMode ? "column" : "row",
                              }}
                              mt={2}
                            >
                              {assessment.assessmentKit.maturityLevels.map(
                                (level: any, index: number) => (
                                  <Box
                                    key={uniqueId()}
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                      rowGap: 2,
                                    }}
                                  >
                                    <Box
                                      sx={{
                                        backgroundColor: getMaturityLevelColors(
                                          assessment.assessmentKit
                                            .maturityLevelCount,
                                        )[level.value - 1],
                                        height: "10px",
                                        width: "27px",
                                        borderRadius: "16px",
                                        color: "#fff",
                                        fontWeight: "bold",
                                      }}
                                    ></Box>

                                    <Typography
                                      component="span"
                                      sx={{
                                        ...theme.typography.body2,
                                        color: "#2B333B",
                                        direction: rtlLanguage ? "rtl" : "ltr",
                                        fontFamily: rtlLanguage
                                          ? farsiFontFamily
                                          : primaryFontFamily,
                                        paddingInlineEnd: 1,
                                        paddingInlineStart: 0.25,
                                      }}
                                    >
                                      {level.title}
                                    </Typography>
                                  </Box>
                                ),
                              )}
                            </Grid>
                          </Grid>
                        </Grid>
                        <SubjectReport graphicalReport={graphicalReport} />
                      </Box>
                    </Paper>
                    <Paper
                      elevation={3}
                      sx={{
                        position: "relative",
                        backgroundColor: "#ffffff",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        borderEndStartRadius: 16,
                        borderEndEndRadius: 16,
                        boxShadow: "none",
                        width: "100%",
                        padding: { md: 6, xs: 1 },
                      }}
                    >
                      <Typography
                        component="div"
                        id="recommendations"
                        sx={{
                          color: theme.palette.primary.main,
                          ...theme.typography.headlineSmall,
                          fontWeight: "bold",
                          ...styles.rtlStyle(rtlLanguage),
                        }}
                      >
                        {t("assessmentReport.recommendations", {
                          lng,
                        })}
                      </Typography>
                      {advice?.narration || advice?.adviceItems?.length ? (
                        <>
                          {" "}
                          <Typography
                            textAlign="justify"
                            sx={{
                              ...theme.typography.bodyMedium,
                              my: 1,
                              ...styles.rtlStyle(rtlLanguage),
                            }}
                            dangerouslySetInnerHTML={{
                              __html: advice?.narration,
                            }}
                          ></Typography>
                          <AdviceItemsAccordion
                            items={graphicalReport?.advice?.adviceItems}
                            onDelete={() => {}}
                            setDisplayedItems={() => {}}
                            query={undefined}
                            readOnly
                            language={lang.code.toLowerCase()}
                          />
                        </>
                      ) : (
                        <Typography
                          textAlign="justify"
                          sx={{
                            ...theme.typography.titleSmall,
                            fontWeight: "light",
                            my: 1,
                            ...styles.rtlStyle(rtlLanguage),
                          }}
                        >
                          {t("common.unavailable", {
                            lng,
                          })}
                        </Typography>
                      )}

                      <div id="evaluationProcess">
                        <ReportCard graphicalReport={graphicalReport} />
                      </div>
                    </Paper>
                  </Grid>
                </Grid>
              </Box>
            </>
          );
        }}
      />
    </PermissionControl>
  );
};

export default AssessmentHtmlContainer;
