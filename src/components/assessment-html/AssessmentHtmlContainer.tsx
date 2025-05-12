import { Link, useParams } from "react-router-dom";
import PermissionControl from "../common/PermissionControl";
import { useQuery } from "@/utils/useQuery";
import { ErrorCodes, IGraphicalReport, PathInfo } from "@/types/index";
import { useServiceContext } from "@/providers/ServiceProvider";
import LoadingSkeletonOfAssessmentRoles from "../common/loadings/LoadingSkeletonOfAssessmentRoles";
import QueryBatchData from "../common/QueryBatchData";
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
import { Trans } from "react-i18next";
import uniqueId from "@/utils/uniqueId";
import useCalculate from "@/hooks/useCalculate";
import { useEffect } from "react";
import { getReadableDate } from "@utils/readableDate";

const AssessmentExportContainer = () => {
  const { calculate, calculateConfidence } = useCalculate();

  const { assessmentId = "", spaceId = "" } = useParams();
  const { service } = useServiceContext();

  const dialogProps = useDialog();

  const fetchPathInfo = useQuery<PathInfo>({
    service: (args, config) =>
      service.common.getPathInfo({ assessmentId, ...(args ?? {}) }, config),
    runOnMount: true,
  });

  const fetchGraphicalReport = useQuery({
    service: (args, config) =>
      service.assessments.report.getGraphical(
        { assessmentId, ...(args ?? {}) },
        config,
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

  const handleErrorResponse = async (errorCode: any) => {
    switch (errorCode) {
      case ErrorCodes.CalculateNotValid:
        await calculate();
        break;
      case ErrorCodes.ConfidenceCalculationNotValid:
        await calculateConfidence();
        break;
      case "DEPRECATED":
        await service.assessments.info.migrateKitVersion({ assessmentId });
        break;
      default:
        break;
    }
    fetchGraphicalReport.query();
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
        t("kitWithTitle", {
          lng: language,
          title: graphicalReport?.assessment.assessmentKit.title,
        }),
        language,
      )}
      {renderChip(
        <EmojiObjectsIcon fontSize="small" color="primary" />,
        t("questionsAndAnswer", {
          lng: language,
          count: graphicalReport?.assessment.assessmentKit.questionsCount,
        }),
        language,
      )}
      {renderChip(
        <CalendarMonthIcon fontSize="small" color="primary" />,
         getReadableDate(graphicalReport?.assessment?.creationTime) ,
        language,
      )}
    </>
  );

  return (
    <PermissionControl error={[fetchGraphicalReport.errorObject]}>
      <QueryBatchData
        queryBatchData={[fetchPathInfo, fetchGraphicalReport]}
        renderLoading={() => <LoadingSkeletonOfAssessmentRoles />}
        render={([pathInfo, graphicalReport]) => {
          const { assessment, advice, permissions, subjects, lang } =
            graphicalReport as IGraphicalReport;
          const rtlLanguage = lang.code.toLowerCase() === "fa";
          return (
            <Box
              m="auto"
              pb={3}
              sx={{
                textAlign: rtlLanguage ? "right" : "left",
                ...styles.rtlStyle(rtlLanguage),
              }}
            >
              <AssessmentHtmlTitle
                pathInfo={pathInfo}
                language={lang.code.toLowerCase()}
              />
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
                  <IconButton
                    color={"primary"}
                    component={Link}
                    to={
                      permissions.canViewDashboard
                        ? `/${spaceId}/assessments/1/${assessmentId}/dashboard/`
                        : `/${spaceId}/assessments/1/`
                    }
                  >
                    <ArrowForward
                      sx={{
                        ...theme.typography.headlineMedium,
                        transform: `scaleX(${lang.code.toLowerCase() === "fa" ? 1 : -1})`,
                      }}
                    />
                  </IconButton>
                  {t("assessmentReport", {
                    lng: lang.code.toLowerCase(),
                  })}
                </Typography>
                <>
                  <LoadingButton
                    variant="contained"
                    startIcon={<Share fontSize="small" />}
                    size="small"
                    onClick={() => dialogProps.openDialog({})}
                  >
                    <Trans i18nKey="shareReport" />
                  </LoadingButton>
                  <ShareDialog
                    {...dialogProps}
                    onClose={() => dialogProps.onClose()}
                    fetchGraphicalReportUsers={fetchGraphicalReportUsers}
                    title={assessment.title}
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
                          {renderChips(
                            graphicalReport,
                            lang.code.toLowerCase(),
                          )}
                        </Grid>
                        <Grid item xs={12} sm={6} md={6} lg={8}>
                          <Typography
                            sx={{
                              color: theme.palette.primary.main,
                              ...theme.typography.headlineSmall,
                              fontWeight: "bold",
                              ...styles.rtlStyle(rtlLanguage),
                            }}
                          >
                            {assessment.title}
                          </Typography>
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
                            {t("introduction", {
                              lng: lang.code.toLowerCase(),
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
                                t("unavailable", {
                                  lng: lang.code.toLowerCase(),
                                }),
                            }}
                            className="tiptap"
                          />

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
                            {t("summary", {
                              lng: lang.code.toLowerCase(),
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
                                t("unavailable", {
                                  lng: lang.code.toLowerCase(),
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
                            confidence_text={t("withPercentConfidence", {
                              lng: lang.code.toLowerCase(),
                            })}
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
                        {t("prosAndCons", {
                          lng: lang.code.toLowerCase(),
                        })}
                      </Typography>

                      <TreeMapChart
                        data={subjects.flatMap((subject: any) =>
                          subject.attributes.map((attribute: any) => ({
                            name: attribute.title,
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
                      >
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
                            {t("treeMapChart", {
                              lng: lang.code.toLowerCase(),
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
                                t("unavailable", {
                                  lng: lang.code.toLowerCase(),
                                }),
                            }}
                          ></Typography>
                        </Grid>
                        <Grid item xs={12} md={2}>
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
                            {t("maturityLevels", {
                              lng: lang.code.toLowerCase(),
                            })}
                          </Typography>
                          <Grid
                            container
                            xs={12}
                            sx={{
                              flexDirection: "column",
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
                                    gap: 2,
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
                      {t("recommendations", {
                        lng: lang.code.toLowerCase(),
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
                        {t("unavailable", { lng: lang.code.toLowerCase() })}
                      </Typography>
                    )}

                    <div id="evaluationProcess">
                      <ReportCard graphicalReport={graphicalReport} />
                    </div>
                  </Paper>
                </Grid>
              </Grid>
            </Box>
          );
        }}
      />
    </PermissionControl>
  );
};

export default AssessmentExportContainer;
