import { useParams } from "react-router-dom";
import PermissionControl from "../common/PermissionControl";
import { useQuery } from "@/utils/useQuery";
import {
  AdviceItem,
  AssessmentKitInfoType,
  IMaturityLevel,
  ISubject,
  PathInfo,
} from "@/types";
import { useServiceContext } from "@/providers/ServiceProvider";
import LoadingSkeletonOfAssessmentRoles from "../common/loadings/LoadingSkeletonOfAssessmentRoles";
import QueryBatchData from "../common/QueryBatchData";
import Box from "@mui/material/Box";
import AssessmentHtmlTitle from "./AssessmentHtmlTitle";
import { Chip, Grid, Paper, Typography } from "@mui/material";
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
import formatDate from "@utils/formatDate";
import { getMaturityLevelColors, styles } from "@styles";
import { t } from "i18next";
import PieChart from "../common/charts/PieChart";
import useDialog from "@/utils/useDialog";
import { ShareDialog } from "./ShareDialog";
import { LoadingButton } from "@mui/lab";
import { Share } from "@mui/icons-material";
import { Trans } from "react-i18next";

type reportData = {
  assessment: {
    title: string;
    intro: string;
    executiveSummary: string;
    creationTime: string;
    assessmentKit: any;
    maturityLevel: IMaturityLevel;
    confidenceValue: number;
  };
  subjects: ISubject[];
  recommendationsSummary: string;
  adviceItems: AdviceItem[];
};

const AssessmentExportContainer = () => {
  const { assessmentId = "" } = useParams();
  const { service } = useServiceContext();

  const dialogProps = useDialog();

  const fetchPathInfo = useQuery<PathInfo>({
    service: (args, config) =>
      service.fetchPathInfo({ assessmentId, ...(args || {}) }, config),
    runOnMount: true,
  });

  const fetchGraphicalReport = useQuery({
    service: (args, config) =>
      service.fetchGraphicalReport({ assessmentId, ...(args || {}) }, config),
    runOnMount: true,
  });

  const fetchGraphicalReportUsers = useQuery<PathInfo>({
    service: (args, config) =>
      service.fetchGraphicalReportUsers(
        { assessmentId, ...(args || {}) },
        config,
      ),
    runOnMount: false,
  });

  const renderChip = (icon: any, label: any) => (
    <Chip
      label={
        <Box sx={{ ...styles.box, ...styles.typography(true) }}>
          {icon}
          {label}
        </Box>
      }
      size="small"
      sx={{ ...styles.chip }}
    />
  );

  const renderChips = (reportData: reportData) => (
    <>
      {renderChip(
        <DesignServicesIcon fontSize="small" color="primary" />,
        t("assessmentKitWithTitle", {
          lng: "fa",
          title: reportData?.assessment.assessmentKit.title,
        }),
      )}
      {renderChip(
        <EmojiObjectsIcon fontSize="small" color="primary" />,
        t("questionsAndAnswer", {
          lng: "fa",
          count: reportData?.assessment.assessmentKit.questionsCount,
        }),
      )}
      {renderChip(
        <CalendarMonthIcon fontSize="small" color="primary" />,
        true
          ? formatDate(reportData?.assessment.creationTime, "Shamsi")
          : formatDate(reportData?.assessment.creationTime, "Miladi"),
      )}
    </>
  );

  return (
    <PermissionControl error={[fetchGraphicalReport.errorObject]}>
      <QueryBatchData
        queryBatchData={[fetchPathInfo, fetchGraphicalReport]}
        renderLoading={() => <LoadingSkeletonOfAssessmentRoles />}
        render={([pathInfo, reportData]) => (
          <Box
            m="auto"
            pb={3}
            sx={{
              px: { xl: 20, lg: 6, xs: 2, sm: 3 },
              direction: true ? "rtl" : "ltr",
              fontFamily: true ? farsiFontFamily : primaryFontFamily,
              textAlign: true ? "right" : "left",
            }}
          >
            <AssessmentHtmlTitle pathInfo={pathInfo} />
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
                  direction: true ? "rtl" : "ltr",
                  fontFamily: true ? farsiFontFamily : primaryFontFamily,
                }}
              >
                {t("assessmentDocument", {
                  lng: "fa",
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
                  title={reportData?.assessment.title}
                />
              </>{" "}
            </Box>
            <Grid container spacing={2}>
              <Grid item lg={2.5} md={2.5} sm={12} xs={12}>
                <AssessmentTOC data={reportData} />
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
                        {renderChips(reportData)}
                      </Grid>
                      <Grid item xs={12} sm={6} md={6} lg={8}>
                        <Typography
                          sx={{
                            color: theme.palette.primary.main,
                            ...theme.typography.headlineSmall,
                            fontWeight: "bold",
                            direction: true ? "rtl" : "ltr",
                            fontFamily: true
                              ? farsiFontFamily
                              : primaryFontFamily,
                          }}
                        >
                          {reportData?.assessment.title}
                        </Typography>
                        <Typography
                          component="div"
                          id="introduction"
                          sx={{
                            ...theme.typography.titleSmall,
                            color: "#6C8093",
                            mt: 2,
                            direction: true ? "rtl" : "ltr",
                            fontFamily: true
                              ? farsiFontFamily
                              : primaryFontFamily,
                          }}
                        >
                          {t("introduction", {
                            lng: "fa",
                          })}
                        </Typography>
                        <Typography
                          component="div"
                          textAlign="justify"
                          sx={{
                            ...theme.typography.extraLight,
                            mt: 1,
                            direction: true ? "rtl" : "ltr",
                            fontFamily: true
                              ? farsiFontFamily
                              : primaryFontFamily,
                          }}
                          dangerouslySetInnerHTML={{
                            __html:
                              reportData?.assessment.intro ??
                              t("unavailable", { lng: "fa" }),
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
                            direction: true ? "rtl" : "ltr",
                            fontFamily: true
                              ? farsiFontFamily
                              : primaryFontFamily,
                          }}
                        >
                          {t("summary", {
                            lng: "fa",
                          })}
                        </Typography>
                        <Typography
                          component="div"
                          textAlign="justify"
                          sx={{
                            ...theme.typography.extraLight,
                            mt: 1,
                            direction: true ? "rtl" : "ltr",
                            fontFamily: true
                              ? farsiFontFamily
                              : primaryFontFamily,
                          }}
                          dangerouslySetInnerHTML={{
                            __html:
                              reportData?.assessment.overallInsight ??
                              t("unavailable", { lng: "fa" }),
                          }}
                        ></Typography>
                      </Grid>
                      <Grid item xs={12} sm={6} md={6} lg={4} mt={10}>
                        <Gauge
                          level_value={
                            reportData?.assessment.maturityLevel?.value ?? 0
                          }
                          maturity_level_status={
                            reportData?.assessment.maturityLevel?.title
                          }
                          maturity_level_number={
                            reportData?.assessment.assessmentKit
                              ?.maturityLevelCount
                          }
                          confidence_value={
                            reportData?.assessment.confidenceValue
                          }
                          confidence_text={t("withPercentConfidence", {
                            lng: "fa",
                          })}
                          isMobileScreen={false}
                          hideGuidance={true}
                          status_font_variant="titleMedium"
                          height={250}
                        />
                      </Grid>
                    </Grid>
                    <PieChart
                      data={reportData?.subjects.map((subject: any) => ({
                        name: subject.title,
                        value: 1,
                        color: getMaturityLevelColors(
                          reportData?.assessment.assessmentKit
                            .maturityLevelCount,
                        )[subject.maturityLevel.value - 1],
                        label:
                          subject.maturityLevel.title +
                          ": " +
                          subject.maturityLevel.value +
                          "/" +
                          reportData?.assessment.assessmentKit
                            .maturityLevelCount,
                        bgColor: getMaturityLevelColors(
                          reportData?.assessment.assessmentKit
                            .maturityLevelCount,
                          true,
                        )[subject.maturityLevel.value - 1],
                      }))}
                    />
                    <Typography
                      component="div"
                      id="strengthsAndWeaknesses"
                      sx={{
                        ...theme.typography.titleMedium,
                        color: "#6C8093",
                        my: 1,
                        direction: true ? "rtl" : "ltr",
                        fontFamily: true ? farsiFontFamily : primaryFontFamily,
                      }}
                    >
                      {t("prosAndCons", {
                        lng: "fa",
                      })}
                    </Typography>

                    <TreeMapChart
                      data={reportData?.subjects.flatMap((subject: any) =>
                        subject.attributes.map((attribute: any) => ({
                          name: attribute.title,
                          count: attribute.value,
                          label: attribute.maturityLevel.value.toString(),
                        })),
                      )}
                      levels={
                        reportData?.assessment.assessmentKit.maturityLevelCount
                      }
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
                            direction: true ? "rtl" : "ltr",
                            fontFamily: true
                              ? farsiFontFamily
                              : primaryFontFamily,
                            gap: "4px",
                          }}
                        >
                          <InfoOutlinedIcon fontSize="small" />
                          {t("treeMapChart", {
                            lng: "fa",
                          })}
                        </Typography>
                        <Typography
                          component="div"
                          textAlign="justify"
                          sx={{
                            ...theme.typography.extraLight,
                            fontWeight: "light",
                            mt: 1,
                            direction: true ? "rtl" : "ltr",
                            fontFamily: true
                              ? farsiFontFamily
                              : primaryFontFamily,
                          }}
                          dangerouslySetInnerHTML={{
                            __html:
                              reportData?.assessment.prosAndCons ??
                              t("unavailable", { lng: "fa" }),
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
                            direction: true ? "rtl" : "ltr",
                            fontFamily: true
                              ? farsiFontFamily
                              : primaryFontFamily,
                          }}
                        >
                          {t("maturityLevels", {
                            lng: "fa",
                          })}
                        </Typography>
                        <Grid container spacing={1}>
                          {reportData?.assessment.assessmentKit.maturityLevels.map(
                            (level: any, index: number) => (
                              <Box
                                key={index}
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 2,
                                }}
                              >
                                <Box
                                  sx={{
                                    backgroundColor: getMaturityLevelColors(
                                      reportData?.assessment.assessmentKit
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
                                    direction: true ? "rtl" : "ltr",
                                    fontFamily: true
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
                    <SubjectReport data={reportData} />
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
                      direction: true ? "rtl" : "ltr",
                      fontFamily: true ? farsiFontFamily : primaryFontFamily,
                    }}
                  >
                    {t("recommendations", {
                      lng: "fa",
                    })}
                  </Typography>
                  {reportData?.advice?.narration ||
                  reportData?.advice?.adviceItems?.length ? (
                    <>
                      {" "}
                      <Typography
                        textAlign="justify"
                        sx={{
                          ...theme.typography.titleSmall,
                          fontWeight: "light",
                          my: 1,
                          direction: true ? "rtl" : "ltr",
                          fontFamily: true
                            ? farsiFontFamily
                            : primaryFontFamily,
                        }}
                        dangerouslySetInnerHTML={{
                          __html: reportData?.advice?.narration,
                        }}
                      ></Typography>
                      <AdviceItemsAccordion
                        items={reportData?.advice?.adviceItems}
                        onDelete={() => {}}
                        setDisplayedItems={() => {}}
                        query={undefined}
                        readOnly
                      />
                    </>
                  ) : (
                    <Typography
                      textAlign="justify"
                      sx={{
                        ...theme.typography.titleSmall,
                        fontWeight: "light",
                        my: 1,
                        direction: true ? "rtl" : "ltr",
                        fontFamily: true ? farsiFontFamily : primaryFontFamily,
                      }}
                    >
                      {t("unavailable", { lng: "fa" })}
                    </Typography>
                  )}

                  <div id="evaluationProcess">
                    <ReportCard data={reportData} />
                  </div>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        )}
      />
    </PermissionControl>
  );
};

export default AssessmentExportContainer;
