import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import PermissionControl from "../common/PermissionControl";
import { useQuery } from "@/utils/useQuery";
import { AdviceItem, PathInfo } from "@/types";
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

type MaturityLevel = {
  value: number;
  title: string;
};

type AssessmentKit = {
  title: string;
  questionsCount: number;
  maturityLevelCount: number;
  maturityLevels: MaturityLevel[];
  prosAndCons: string;
};

type Subject = {
  title: string;
  maturityLevel: MaturityLevel;
  attributes: Attribute[];
};

type Attribute = {
  title: string;
  maturityLevel: MaturityLevel;
  value: number;
};

type JsonData = {
  assessment: {
    title: string;
    intro: string;
    executiveSummary: string;
    creationTime: string;
    assessmentKit: AssessmentKit;
    maturityLevel: MaturityLevel;
    confidenceValue: number;
  };
  subjects: Subject[];
  recommendationsSummary: string;
  adviceItems: AdviceItem[];
};

const AssessmentExportContainer = () => {
  const { assessmentId = "" } = useParams();
  const [content, setContent] = useState("");
  const [errorObject, setErrorObject] = useState<any>(undefined);
  const { service } = useServiceContext();
  const [jsonData, setJsonData] = useState<JsonData>({
    assessment: {
      title: "",
      intro: "",
      executiveSummary: "",
      creationTime: "",
      assessmentKit: {
        title: "",
        questionsCount: 0,
        maturityLevelCount: 0,
        maturityLevels: [],
        prosAndCons: "",
      },
      maturityLevel: {
        value: 0,
        title: "",
      },
      confidenceValue: 0,
    },
    subjects: [],
    recommendationsSummary: "",
    adviceItems: [],
  });
  const sharedStyles = {
    chip: {
      fontWeight: 200,
      padding: 1,
      background: "rgba(36, 102, 168, 0.04)",
    },
    box: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 0.5,
      fontWeight: "bold",
    },
    typography: (isFarsi = true) => ({
      direction: isFarsi ? "rtl" : "ltr",
      fontFamily: isFarsi ? farsiFontFamily : primaryFontFamily,
      fontWeight: 200,
    }),
  };

  const getDirectionStyles = (isFarsi = true) => ({
    direction: isFarsi ? "rtl" : "ltr",
    fontFamily: isFarsi ? farsiFontFamily : primaryFontFamily,
    textAlign: isFarsi ? "right" : "left",
  });

  const dialogProps = useDialog();

  const iframeUrl = `${import.meta.env.VITE_STATIC_HTML}${assessmentId}/index.html`;
  const jsonUrl = `${import.meta.env.VITE_STATIC_HTML}${assessmentId}/greport.json`;

  useEffect(() => {
    const fetchJsonData = async () => {
      try {
        const response = await fetch(jsonUrl);
        const data = await response.json();
        setContent("");
        setJsonData(data);
      } catch (error) {
        console.error("Error fetching JSON data:", error);
      }
    };

    fetchJsonData();
  }, [jsonUrl]);

  const fetchContent = async () => {
    try {
      const response = await fetch(iframeUrl);
      const html = await response.text();
      setContent(html);
      if (response.status === 404) {
        setContent("");
      }
    } catch (error) {
      setContent("");
      console.error("Error fetching site content:", error);
    }
  };

  const checkIframeUrl = async () => {
    try {
      const response = await fetch(iframeUrl, { method: "HEAD" });
      const jsonResponse = await fetch(jsonUrl, { method: "HEAD" });
      if (response.status === 404 && jsonResponse.status === 404) {
        setErrorObject(response);
      }
    } catch (error) {
      setErrorObject(error);
      console.error("Error fetching iframe URL:", error);
    }
  };

  useEffect(() => {
    fetchContent();
    checkIframeUrl();
  }, [iframeUrl]);

  const fetchPathInfo = useQuery<PathInfo>({
    service: (args, config) =>
      service.fetchPathInfo({ assessmentId, ...(args || {}) }, config),
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

  const combinedAttributes = jsonData?.subjects.flatMap((subject) =>
    subject.attributes.map((attribute) => ({
      name: attribute.title,
      count: attribute.value,
      label: attribute.maturityLevel.value.toString(),
    })),
  );

  const renderChip = (icon: any, label: any) => (
    <Chip
      label={
        <Box sx={{ ...sharedStyles.box, ...sharedStyles.typography(true) }}>
          {icon}
          {label}
        </Box>
      }
      size="small"
      sx={sharedStyles.chip}
    />
  );

  const renderChips = () => (
    <>
      {renderChip(
        <DesignServicesIcon fontSize="small" color="primary" />,
        t("assessmentKitWithTitle", {
          lng: "fa",
          title: jsonData?.assessment.assessmentKit.title,
        }),
      )}
      {renderChip(
        <EmojiObjectsIcon fontSize="small" color="primary" />,
        t("questionsAndAnswer", {
          lng: "fa",
          count: jsonData?.assessment.assessmentKit.questionsCount,
        }),
      )}
      {renderChip(
        <CalendarMonthIcon fontSize="small" color="primary" />,
        true
          ? formatDate(jsonData?.assessment.creationTime, "Shamsi")
          : formatDate(jsonData?.assessment.creationTime, "Miladi"),
      )}
    </>
  );

  const renderSharingSection = () => (
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
        title={jsonData?.assessment.title}
      />
    </>
  );

  return (
    <PermissionControl error={[errorObject]}>
      <QueryBatchData
        queryBatchData={[fetchPathInfo]}
        renderLoading={() => <LoadingSkeletonOfAssessmentRoles />}
        render={([pathInfo]) => (
          <>
            {content ? (
              <>
                {" "}
                <Box
                  m="auto"
                  pb={3}
                  mt="40px"
                  sx={{ px: { xl: 30, lg: 12, xs: 2, sm: 3 } }}
                >
                  <AssessmentHtmlTitle pathInfo={pathInfo} />
                  <Box
                    display="flex"
                    justifyContent="flex-end"
                    alignItems="center"
                    mt={-4}
                  >
                    {renderSharingSection()}
                  </Box>
                </Box>
                <div
                  dangerouslySetInnerHTML={{ __html: content }}
                  style={{
                    width: "100%",
                    height: "100%",
                    overflowX: "hidden",
                    direction: "ltr",
                  }}
                />
              </>
            ) : (
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
                  {renderSharingSection()}
                </Box>
                <Grid container spacing={2}>
                  <Grid item lg={2.5} md={2.5} sm={12} xs={12}>
                    <AssessmentTOC data={jsonData} />
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
                            {renderChips()}
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
                              {jsonData?.assessment.title}
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
                              textAlign="justify"
                              sx={{
                                ...theme.typography.extraLight,
                                mt: 1,
                                direction: true ? "rtl" : "ltr",
                                fontFamily: true
                                  ? farsiFontFamily
                                  : primaryFontFamily,
                              }}
                            >
                              {jsonData?.assessment.intro}
                            </Typography>
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
                              textAlign="justify"
                              sx={{
                                ...theme.typography.extraLight,
                                mt: 1,
                                direction: true ? "rtl" : "ltr",
                                fontFamily: true
                                  ? farsiFontFamily
                                  : primaryFontFamily,
                              }}
                            >
                              {jsonData?.assessment.executiveSummary}
                            </Typography>
                          </Grid>
                          <Grid item xs={12} sm={6} md={6} lg={4} mt={10}>
                            <Gauge
                              level_value={
                                jsonData?.assessment.maturityLevel?.value ?? 0
                              }
                              maturity_level_status={
                                jsonData?.assessment.maturityLevel?.title
                              }
                              maturity_level_number={
                                jsonData?.assessment.assessmentKit
                                  ?.maturityLevelCount
                              }
                              confidence_value={
                                jsonData?.assessment.confidenceValue
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
                          data={jsonData?.subjects.map((subject) => ({
                            name: subject.title,
                            value: 1,
                            color: getMaturityLevelColors(
                              jsonData?.assessment.assessmentKit
                                .maturityLevelCount,
                            )[subject.maturityLevel.value - 1],
                            label:
                              subject.maturityLevel.title +
                              " (" +
                              subject.maturityLevel.value +
                              "/" +
                              jsonData?.assessment.assessmentKit
                                .maturityLevelCount +
                              ")",
                            bgColor: getMaturityLevelColors(
                              jsonData?.assessment.assessmentKit
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
                            fontFamily: true
                              ? farsiFontFamily
                              : primaryFontFamily,
                          }}
                        >
                          {t("prosAndCons", {
                            lng: "fa",
                          })}
                        </Typography>

                        <TreeMapChart
                          data={combinedAttributes}
                          levels={
                            jsonData?.assessment.assessmentKit
                              .maturityLevelCount
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
                            >
                              {jsonData?.assessment.assessmentKit.prosAndCons}
                            </Typography>
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
                              {jsonData?.assessment.assessmentKit.maturityLevels.map(
                                (level, index) => (
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
                                          jsonData?.assessment.assessmentKit
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
                        <SubjectReport data={jsonData} />
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
                          fontFamily: true
                            ? farsiFontFamily
                            : primaryFontFamily,
                        }}
                      >
                        {t("recommendations", {
                          lng: "fa",
                        })}
                      </Typography>
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
                      >
                        {jsonData?.recommendationsSummary}
                      </Typography>
                      <AdviceItemsAccordion
                        items={jsonData.adviceItems}
                        onDelete={() => {}}
                        setDisplayedItems={() => {}}
                        query={undefined}
                        readOnly
                      />
                      <div id="evaluationProcess">
                        <ReportCard data={jsonData} />
                      </div>
                    </Paper>
                  </Grid>
                </Grid>
              </Box>
            )}
          </>
        )}
      />
    </PermissionControl>
  );
};

export default AssessmentExportContainer;
