import QueryBatchData from "@common/QueryBatchData";
import { useQuery } from "@utils/useQuery";
import { useServiceContext } from "@providers/ServiceProvider";
import LoadingSkeletonOfAssessmentRoles from "@common/loadings/LoadingSkeletonOfAssessmentRoles";
import { Trans } from "react-i18next";
import { t } from "i18next";
import { getMaturityLevelColors, styles } from "@styles";
import {
  IAssessmentResponse,
  IAttribute,
  ISubject,
  PathInfo,
  TId,
} from "@types";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import AssessmentExportTitle from "./AssessmentExportTitle";
import FiberManualRecordOutlined from "@mui/icons-material/FiberManualRecordOutlined";
import FiberManualRecordRounded from "@mui/icons-material/FiberManualRecordRounded";
import InfoOutlined from "@mui/icons-material/InfoOutlined";
import TableChartRounded from "@mui/icons-material/TableChartRounded";
import AssessmentSubjectRadarChart from "./AssessmenetSubjectRadarChart";
import AssessmentSubjectRadialChart from "./AssessmenetSubjectRadial";
import { Gauge } from "../common/charts/Gauge";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { AttributeStatusBarContainer } from "../subject-report-old/SubjectAttributeCard";
import setDocumentTitle from "@/utils/setDocumentTitle";
import { useConfigContext } from "@/providers/ConfgProvider";
import { useQuestionnaire } from "../questionnaires/QuestionnaireContainer";
import { Link as RouterLink, useParams } from "react-router-dom";
import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";
import Tooltip from "@mui/material/Tooltip";
import { theme } from "@/config/theme";
import AIGenerated from "../common/tags/AIGenerated";
import { handleCopyAsImage } from "@/utils/handleCopy";
import PermissionControl from "../common/PermissionControl";
import { toast } from "react-toastify";

const AssessmentExportContainer = () => {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [adviceNarration, setAdviceNarration] = useState<string>("");
  const [aiGenerated, setAiGenerated] = useState<boolean>(false);
  const [errorObject, setErrorObject] = useState<any>(undefined);
  const [attributesData, setAttributesData] = useState<any>({});
  const [editable, setEditable] = useState<any>(true);
  const [loadingAttributes, setLoadingAttributes] = useState<{
    [id: string]: boolean;
  }>({});
  const [attributesDataPolicy, setAttributesDataPolicy] = useState<any>({});

  const { service } = useServiceContext();
  const { assessmentId = "" } = useParams();
  const { config } = useConfigContext();
  const { questionnaireQueryData } = useQuestionnaire();

  const fetchPathInfo = useQuery<PathInfo>({
    service: (args, config) =>
      service.fetchPathInfo({ assessmentId, ...(args || {}) }, config),
    runOnMount: true,
  });

  const progressInfo = useQuery<IAssessmentResponse>({
    service: (args = { assessmentId }, config) =>
      service.fetchAssessmentTotalProgress(args, config),
    toastError: false,
    toastErrorOptions: { filterByStatus: [404] },
  });

  const AssessmentReport = useQuery({
    service: (args = { assessmentId }, config) =>
      service.fetchAssessment(args, config),
    toastError: false,
    toastErrorOptions: { filterByStatus: [404] },
  });

  const calculateMaturityLevelQuery = useQuery({
    service: (args = { assessmentId }, config) =>
      service.calculateMaturityLevel(args, config),
    runOnMount: false,
  });

  const calculateConfidenceLevelQuery = useQuery({
    service: (args = { assessmentId }, config) =>
      service.calculateConfidenceLevel(args, config),
    runOnMount: false,
  });

  const fetchAdviceNarration = useQuery<any>({
    service: (args = { assessmentId }, config) =>
      service.fetchAdviceNarration(args, config),
    toastError: false,
  });

  const FetchAttributeData = async (assessmentId: string, attributeId: TId) => {
    try {
      const result = await service.fetchAIReport(
        { assessmentId, attributeId },
        undefined,
      );
      return result?.data?.content || "";
    } catch (error: any) {
      handleFetchError(error);
      return null;
    }
  };

  const LoadAttributeData = async (assessmentId: string, attributeId: TId) => {
    try {
      const result = await service.loadAIReport(
        { assessmentId, attributeId },
        undefined,
      );
      return result?.data || "";
    } catch (error: any) {
      handleFetchError(error);
      return null;
    }
  };

  const handleFetchError = async (error: any) => {
    setErrorObject(error?.response?.data);
    if (error?.response?.data?.code === "CALCULATE_NOT_VALID") {
      await calculateMaturityLevelQuery.query();
      fetchAllAttributesData();
    }
    if (error?.response?.data?.code === "CONFIDENCE_CALCULATION_NOT_VALID") {
      await calculateConfidenceLevelQuery.query();
      fetchAllAttributesData();
    }
    console.error("Error fetching data:", error);
  };

  useEffect(() => {
    const hash = window?.location?.hash?.substring(1);
    if (hash) {
      const scrollToElement = () => {
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      };
      setTimeout(scrollToElement, 500);
    }
  }, []);

  useEffect(() => {
    if (
      AssessmentReport?.errorObject?.response?.data?.code ===
      "CALCULATE_NOT_VALID"
    ) {
      calculateMaturityLevelQuery.query().then(() => AssessmentReport.query());
    }
    if (
      AssessmentReport?.errorObject?.response?.data?.code ===
      "CONFIDENCE_CALCULATION_NOT_VALID"
    ) {
      calculateConfidenceLevelQuery
        .query()
        .then(() => AssessmentReport.query());
    }
    if (AssessmentReport?.errorObject?.response?.data?.code === "DEPRECATED") {
      service.migrateKitVersion({ assessmentId }).then(() => {
        AssessmentReport.query();
      });
    }
  }, [AssessmentReport?.errorObject]);

  const createAttributesDataPromises = (ignoreIds: any[]) =>
    AssessmentReport?.data?.subjects.flatMap((subject: any) =>
      subject?.attributes
        ?.filter((attribute: any) => !ignoreIds.includes(attribute?.id))
        .map((attribute: any) => fetchSingleAttributeData(attribute)),
    );

  const fetchSingleAttributeData = async (attribute: any) => {
    setLoadingAttributes((prevLoading) => ({
      ...prevLoading,
      [attribute?.id]: true,
    }));
    try {
      const result = await FetchAttributeData(assessmentId, attribute?.id);
      return { id: attribute?.id, data: result };
    } catch (error) {
      console.error(
        `Failed to fetch data for attribute ${attribute?.id}:`,
        error,
      );
      return null;
    } finally {
      setLoadingAttributes((prevLoading) => ({
        ...prevLoading,
        [attribute?.id]: false,
      }));
    }
  };

  const createAttributesPolicyPromises = (newIgnoreIds: any[]) =>
    AssessmentReport?.data?.subjects.flatMap((subject: any) =>
      subject?.attributes.map((attribute: any) =>
        loadSingleAttributeData(attribute, newIgnoreIds),
      ),
    );

  const loadSingleAttributeData = async (
    attribute: any,
    newIgnoreIds: any[],
  ) => {
    setLoadingAttributes((prevLoading) => ({
      ...prevLoading,
      [attribute?.id]: true,
    }));
    try {
      const result = await LoadAttributeData(assessmentId, attribute?.id);
      processAttributeResult(result, attribute?.id, newIgnoreIds);
      return { id: attribute?.id, data: result };
    } catch (error) {
      console.error(
        `Failed to load data for attribute ${attribute?.id}:`,
        error,
      );
      return null;
    } finally {
      setLoadingAttributes((prevLoading) => ({
        ...prevLoading,
        [attribute?.id]: false,
      }));
    }
  };

  const processAttributeResult = (
    result: any,
    attributeId: any,
    newIgnoreIds: any[],
  ) => {
    if (!result.editable) setEditable(false);

    const shouldIgnore =
      !result.editable && !result?.assessorInsight && !result?.aiInsight;
    if (
      shouldIgnore ||
      (result?.aiInsight?.insight && result?.aiInsight?.isValid)
    ) {
      setAttributesData((prevData: any) => ({
        ...prevData,
        [attributeId]:
          result?.aiInsight?.insight || result?.assessorInsight?.insight,
      }));
      newIgnoreIds.push(attributeId);
    }
  };

  const updateAttributesData = (allAttributesData: any) => {
    const attributesDataObject = allAttributesData?.reduce(
      (acc: any, { id, data }: any) => {
        acc[id] = data;
        return acc;
      },
      {},
    );
    setAttributesData((prevData: any) => ({
      ...prevData,
      ...attributesDataObject,
    }));
  };

  const updateAttributesDataPolicy = (allAttributesDataPolicy: any) => {
    const attributesDataPolicyObject = allAttributesDataPolicy?.reduce(
      (acc: any, { id, data }: any) => {
        acc[id] = data;
        return acc;
      },
      {},
    );
    setAttributesDataPolicy(attributesDataPolicyObject);
  };

  const fetchAllAttributesData = async (ignoreIds: any[] = []) => {
    try {
      const attributesDataPromises = createAttributesDataPromises(ignoreIds);
      const allAttributesData = attributesDataPromises.length
        ? await Promise.all(attributesDataPromises)
        : [];
      updateAttributesData(allAttributesData);
    } catch (error) {
      console.error("Error fetching all attributes data:", error);
    }
  };

  const loadAllAttributesData = async () => {
    const newIgnoreIds: any[] = [];
    try {
      const attributesDataPolicyPromises =
        createAttributesPolicyPromises(newIgnoreIds);
      const allAttributesDataPolicy = attributesDataPolicyPromises.length
        ? await Promise.all(attributesDataPolicyPromises)
        : [];
      updateAttributesDataPolicy(allAttributesDataPolicy);
    } catch (error) {
      console.error("Error loading all attributes data:", error);
    }
    return newIgnoreIds;
  };

  const refs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const handleSetRef = useCallback(
    (id: string) => (element: HTMLDivElement | null) => {
      refs.current[id] = element;
    },
    [],
  );

  const handleCopyClick = (id: string) => {
    const element = refs.current[id];
    if (element) {
      handleCopyAsImage(
        element,
        (loading) => setLoadingId(loading ? id : null),
        id,
      );
    } else {
      toast.error("Element not found. Please try again.");
    }
  };
  return (
    <PermissionControl error={[errorObject]}>
      <QueryBatchData
        queryBatchData={[
          AssessmentReport,
          fetchPathInfo,
          progressInfo,
          questionnaireQueryData,
          fetchAdviceNarration,
        ]}
        renderLoading={() => <LoadingSkeletonOfAssessmentRoles />}
        render={([
          data = {},
          pathInfo = {},
          progress,
          questionnaireData = {},
          adviceSection,
        ]) => {
          const { items } = questionnaireData;
          const { assessment, subjects } = (data as IAssessmentResponse) || {};
          const { assessmentKit, maturityLevel, confidenceValue } =
            assessment || {};
          const { questionsCount, answersCount } = progress;

          useEffect(() => {
            const selectedNarration =
              adviceSection?.aiNarration || adviceSection?.assessorNarration;
            if (selectedNarration) {
              setAdviceNarration(selectedNarration?.narration);
              adviceSection?.aiNarration && setAiGenerated(true);
            }
          }, [adviceSection]);

          useEffect(() => {
            setDocumentTitle(
              `${t("document", { title: assessment?.title })}`,
              config?.appTitle,
            );
          }, [assessment]);

          useEffect(() => {
            const loadAndFetchData = async () => {
              const ignoreIds = await loadAllAttributesData();
              if (questionsCount === answersCount && editable) {
                await fetchAllAttributesData(ignoreIds);
              }
            };

            if (AssessmentReport?.data && assessmentId) {
              loadAndFetchData();
            }
          }, [AssessmentReport?.data, assessmentId]);

          const colorPallet = getMaturityLevelColors(
            assessment?.assessmentKit?.maturityLevels
              ? assessment?.assessmentKit?.maturityLevels?.length
              : 5,
          );

          return (
            <Box m="auto" pb={3} sx={{ px: { xl: 30, lg: 12, xs: 2, sm: 3 } }}>
              <AssessmentExportTitle pathInfo={pathInfo} />
              <Grid container columns={12} mb={5}>
                <Grid item sm={12} xs={12}>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Typography
                      color="primary"
                      textAlign="left"
                      variant="headlineLarge"
                    >
                      <Trans
                        i18nKey="document"
                        values={{ title: assessment?.title }}
                      />
                    </Typography>
                    {/* <PDFDownloadLink
                    document={
                      <AssessmentReportPDF
                        data={data}
                        progress={progress}
                        assessmentKitInfo={assessmentKitInfo}
                      />
                    }
                    fileName="assessment_report.pdf"
                    style={{ textDecoration: "none" }}
                  >
                    {({ loading }: any) =>
                      loading || showSpinner ? (
                        <IconButton data-cy="more-action-btn">
                          <CircularProgress
                            sx={{ fontSize: "1.5rem", margin: "0.2rem" }}
                          />
                        </IconButton>
                      ) : (
                        <IconButton data-cy="more-action-btn">
                          <DownloadRounded
                            sx={{ fontSize: "1.5rem", margin: "0.2rem" }}
                          />
                        </IconButton>
                      )
                    }
                  </PDFDownloadLink> */}
                  </Box>
                </Grid>
              </Grid>

              <Paper
                sx={{
                  padding: 5,
                  borderRadius: 4,
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <Box
                  sx={{
                    position: "absolute",
                    top: "5.5rem",
                    right: theme.direction === "ltr" ? "-1.75rem" : "unset",
                    left: theme.direction === "rtl" ? "-1.75rem" : "unset",
                    transform:
                      theme.direction === "ltr"
                        ? "rotate(45deg)"
                        : "rotate(-45deg)",
                    transformOrigin:
                      theme.direction === "ltr" ? "top right" : "top left",
                    backgroundColor: theme.palette.error.main,
                    color: "white",
                    padding: "0.5rem 2rem",
                    borderRadius: "4px",
                    fontWeight: "bold",
                    zIndex: 1,
                    display: "inline-block",
                    whiteSpace: "nowrap",
                  }}
                >
                  <Trans i18nKey="betaVersion" />
                </Box>
                <Grid container spacing={2} flexDirection="row-reverse">
                  <Grid
                    item
                    xs={12}
                    md={4}
                    display="flex"
                    justifyContent="flex-start"
                  >
                    <Box
                      sx={{
                        position: "sticky",
                        top: "5.25rem",
                        padding: "0.5rem 2rem",
                        borderRadius: "4px",
                        fontWeight: "bold",
                        zIndex: 1,
                      }}
                    >
                      <Typography
                        component="div"
                        mt={4}
                        variant="titleMedium"
                        gutterBottom
                        display="flex"
                        alignItems="center"
                      >
                        <TableChartRounded
                          fontSize="small"
                          sx={{
                            marginRight:
                              theme.direction === "ltr" ? 1 : "unset",
                            marginLeft: theme.direction === "rtl" ? 1 : "unset",
                          }}
                        />
                        <Trans i18nKey="tableOfContents" />
                      </Typography>
                      <Divider />
                      <Link
                        href="#assessment-methodology"
                        sx={{
                          textDecoration: "none",
                          opacity: 0.9,
                          fontWeight: "bold",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <FiberManualRecordRounded
                          sx={{
                            fontSize: "0.5rem",
                            marginRight:
                              theme.direction === "ltr" ? 1 : "unset",
                            marginLeft: theme.direction === "rtl" ? 1 : "unset",
                          }}
                        />
                        <Typography
                          variant="titleSmall"
                          gutterBottom
                          sx={{
                            textDecoration: "none",
                            opacity: 0.9,
                            fontWeight: "bold",
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <Trans i18nKey="assessmentMethodology" />
                        </Typography>
                      </Link>
                      <Box
                        display="flex"
                        flexDirection="column"
                        paddingLeft={theme.direction === "ltr" ? 2 : "unset"}
                        paddingRight={theme.direction === "rtl" ? 2 : "unset"}
                      >
                        <Link
                          href="#assessment-focus"
                          sx={{
                            textDecoration: "none",
                            opacity: 0.9,
                            fontWeight: "bold",
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <FiberManualRecordOutlined
                            sx={{
                              fontSize: "0.5rem",
                              marginRight:
                                theme.direction === "ltr" ? 1 : "unset",
                              marginLeft:
                                theme.direction === "rtl" ? 1 : "unset",
                            }}
                          />

                          <Typography
                            variant="titleSmall"
                            gutterBottom
                            sx={{
                              textDecoration: "none",
                              opacity: 0.9,
                              fontWeight: "bold",
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            <Trans i18nKey="assessmentFocus" />
                          </Typography>
                        </Link>{" "}
                        <Link
                          href="#maturity-levels"
                          sx={{
                            textDecoration: "none",
                            opacity: 0.9,
                            fontWeight: "bold",
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <FiberManualRecordOutlined
                            sx={{
                              fontSize: "0.5rem",
                              marginRight:
                                theme.direction === "ltr" ? 1 : "unset",
                              marginLeft:
                                theme.direction === "rtl" ? 1 : "unset",
                            }}
                          />

                          <Typography
                            variant="titleSmall"
                            gutterBottom
                            sx={{
                              textDecoration: "none",
                              opacity: 0.9,
                              fontWeight: "bold",
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            <Trans i18nKey="maturityLevels" />
                          </Typography>
                        </Link>
                        <Link
                          href="#questionnaires"
                          sx={{
                            textDecoration: "none",
                            opacity: 0.9,
                            fontWeight: "bold",
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <FiberManualRecordOutlined
                            sx={{
                              fontSize: "0.5rem",
                              marginRight:
                                theme.direction === "ltr" ? 1 : "unset",
                              marginLeft:
                                theme.direction === "rtl" ? 1 : "unset",
                            }}
                          />
                          <Typography
                            variant="titleSmall"
                            gutterBottom
                            sx={{
                              textDecoration: "none",
                              opacity: 0.9,
                              fontWeight: "bold",
                            }}
                          >
                            <Trans i18nKey="questionnaires" />
                          </Typography>
                        </Link>
                      </Box>
                      <Link
                        href="#overall-status-report"
                        sx={{
                          textDecoration: "none",
                          opacity: 0.9,
                          fontWeight: "bold",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <FiberManualRecordRounded
                          sx={{
                            fontSize: "0.5rem",
                            marginRight:
                              theme.direction === "ltr" ? 1 : "unset",
                            marginLeft: theme.direction === "rtl" ? 1 : "unset",
                          }}
                        />
                        <Typography
                          variant="titleSmall"
                          gutterBottom
                          sx={{
                            textDecoration: "none",
                            opacity: 0.9,
                            fontWeight: "bold",
                          }}
                        >
                          <Trans i18nKey="overallStatusReport" />
                        </Typography>
                      </Link>
                      {subjects?.map((subject) => (
                        <Link
                          key={subject?.id}
                          href={`#subject-${subject?.id}`}
                          sx={{
                            textDecoration: "none",
                            opacity: 0.9,
                            fontWeight: "bold",
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <FiberManualRecordRounded
                            sx={{
                              fontSize: "0.5rem",
                              marginRight:
                                theme.direction === "ltr" ? 1 : "unset",
                              marginLeft:
                                theme.direction === "rtl" ? 1 : "unset",
                            }}
                          />
                          <Typography
                            variant="titleSmall"
                            gutterBottom
                            sx={{
                              textDecoration: "none",
                              opacity: 0.9,
                              fontWeight: "bold",
                            }}
                          >
                            <Trans
                              i18nKey="subjectStatusReport"
                              values={{ title: subject?.title }}
                            />
                          </Typography>
                        </Link>
                      ))}
                      <Link
                        href="#recommendations"
                        sx={{
                          textDecoration: "none",
                          opacity: 0.9,
                          fontWeight: "bold",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <FiberManualRecordRounded
                          sx={{
                            fontSize: "0.5rem",
                            marginRight:
                              theme.direction === "ltr" ? 1 : "unset",
                            marginLeft: theme.direction === "rtl" ? 1 : "unset",
                          }}
                        />
                        <Typography
                          variant="titleSmall"
                          gutterBottom
                          sx={{
                            textDecoration: "none",
                            opacity: 0.9,
                            fontWeight: "bold",
                          }}
                        >
                          <Trans i18nKey="recommendations" />
                        </Typography>
                      </Link>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={8}>
                    <Typography
                      component="div"
                      id="assessment-methodology"
                      variant="headlineMedium"
                      fontWeight={600}
                      gutterBottom
                    >
                      <Trans i18nKey="assessmentMethodology" />
                    </Typography>
                    <Typography
                      variant="displaySmall"
                      paragraph
                      dangerouslySetInnerHTML={{
                        __html: assessment?.assessmentKit?.about ?? "",
                      }}
                    ></Typography>
                  </Grid>

                  <Box
                    paddingLeft={theme.direction === "ltr" ? 3 : "unset"}
                    paddingRight={theme.direction === "rtl" ? 3 : "unset"}
                    maxWidth="100%"
                  >
                    <Typography
                      component="div"
                      mt={4}
                      variant="titleLarge"
                      id="assessment-focus"
                      gutterBottom
                    >
                      <Trans i18nKey="assessmentFocus" />
                    </Typography>
                    <Typography variant="displaySmall" paragraph>
                      <Trans
                        i18nKey="assessmentFocusDescription"
                        values={{
                          subjectsCount: subjects?.length,
                          subjects: subjects
                            ?.map((elem: ISubject, index: number) =>
                              index === subjects?.length - 1
                                ? t("and") + elem?.title
                                : index === 0
                                  ? elem?.title
                                  : ", " + elem?.title,
                            )
                            ?.join(""),
                          attributesCount: subjects?.reduce(
                            (previousValue: number, currentValue: ISubject) => {
                              return (
                                previousValue + currentValue?.attributes?.length
                              );
                            },
                            0,
                          ),
                        }}
                      />
                    </Typography>{" "}
                    {subjects?.map((subject: ISubject) => {
                      if (subject?.description)
                        return (
                          <Typography
                            variant="displaySmall"
                            paragraph
                            key={subject?.id}
                          >
                            <Trans
                              i18nKey="assessmentFocusDescriptionSubject"
                              values={{
                                title: subject?.title,
                                description: subject?.description,
                              }}
                            />
                          </Typography>
                        );
                    })}
                    <Typography variant="displaySmall" paragraph>
                      <Trans i18nKey="assessmentFocusDescriptionLastSection" />
                    </Typography>
                    <TableContainer
                      component={Paper}
                      sx={{ marginBlock: 2, borderRadius: 4 }}
                    >
                      <Table>
                        <TableBody>
                          {subjects?.map((subject: ISubject, index: number) => (
                            <React.Fragment key={subject?.id}>
                              <TableRow>
                                <TableCell
                                  sx={{
                                    backgroundColor: "#f9f9f9",
                                    border: "1px solid rgba(224, 224, 224, 1)",
                                  }}
                                >
                                  <Typography variant="titleMedium">
                                    {subject?.title}
                                  </Typography>
                                  <br />
                                  <Typography variant="displaySmall">
                                    {subject?.description}
                                  </Typography>
                                </TableCell>
                              </TableRow>

                              <TableRow>
                                <TableCell
                                  sx={{
                                    padding: 0,
                                    border: "none",
                                  }}
                                >
                                  <Table
                                    sx={{
                                      borderCollapse: "collapse",
                                      width: "100%",
                                    }}
                                  >
                                    <TableHead>
                                      <TableRow>
                                        <TableCell
                                          sx={{
                                            backgroundColor: "#f5f5f5",
                                            border:
                                              "1px solid rgba(224, 224, 224, 1)",
                                          }}
                                        >
                                          <Typography
                                            sx={{ unicodeBidi: "plaintext" }}
                                            variant="titleMedium"
                                          >
                                            {subject?.title}{" "}
                                            <Trans i18nKey="attribute" />
                                          </Typography>
                                        </TableCell>
                                        <TableCell
                                          sx={{
                                            backgroundColor: "#f5f5f5",
                                            border:
                                              "1px solid rgba(224, 224, 224, 1)",
                                          }}
                                        >
                                          <Typography variant="titleMedium">
                                            <Trans i18nKey="description" />
                                          </Typography>
                                        </TableCell>
                                      </TableRow>
                                    </TableHead>
                                    <TableBody>
                                      {subject?.attributes?.map(
                                        (
                                          feature: IAttribute,
                                          featureIndex: number,
                                        ) => (
                                          <TableRow key={feature?.id}>
                                            <TableCell
                                              sx={{
                                                borderRight:
                                                  "1px solid rgba(224, 224, 224, 1)",
                                              }}
                                            >
                                              <Typography variant="displaySmall">
                                                {feature?.title}
                                              </Typography>
                                            </TableCell>
                                            <TableCell
                                              sx={{
                                                borderRight:
                                                  "1px solid rgba(224, 224, 224, 1)",
                                              }}
                                            >
                                              <Typography variant="displaySmall">
                                                {feature?.description}
                                              </Typography>
                                            </TableCell>
                                          </TableRow>
                                        ),
                                      )}
                                    </TableBody>
                                  </Table>
                                </TableCell>
                              </TableRow>
                            </React.Fragment>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                    <Typography
                      component="div"
                      mt={4}
                      variant="titleLarge"
                      id="maturity-levels"
                      gutterBottom
                    >
                      <Trans i18nKey="maturityLevels" />
                    </Typography>
                    <Typography variant="displaySmall" paragraph>
                      <Trans i18nKey="maturityLevelsDescriptionLastSection" />
                    </Typography>
                    <Box mt={2} sx={{ display: "flex" }}>
                      {assessment?.assessmentKit?.maturityLevels.map(
                        (item: any, index: number) => {
                          const colorCode = colorPallet[item.index - 1];
                          return (
                            <Box
                              sx={{
                                background: colorCode,
                                fontSize: "1rem",
                                py: { xs: "0.16rem", md: 1 },
                                px: { xs: 1, md: 4 },
                                fontWeight: "bold",
                                color: "#fff",
                                borderRadius:
                                  theme.direction === "ltr" && index === 0
                                    ? "8px 0 0 8px"
                                    : theme.direction === "ltr" &&
                                        index ===
                                          assessment?.assessmentKit
                                            ?.maturityLevels?.length -
                                            1
                                      ? "0 8px 8px 0"
                                      : theme.direction === "rtl" &&
                                          index ===
                                            assessment?.assessmentKit
                                              ?.maturityLevels?.length -
                                              1
                                        ? "8px 0 0 8px"
                                        : theme.direction === "rtl" &&
                                            index === 0
                                          ? "0 8px 8px 0"
                                          : "0",
                              }}
                            >
                              <Trans i18nKey={`${item.title}`} />
                            </Box>
                          );
                        },
                      )}
                    </Box>
                    <Box
                      component="ol"
                      paddingLeft={theme.direction === "ltr" ? 6 : "unset"}
                      paddingRight={theme.direction === "rtl" ? 6 : "unset"}
                    >
                      {assessment?.assessmentKit?.maturityLevels.map(
                        (level, index) => (
                          <Box
                            component="li"
                            key={level?.id}
                            sx={{ marginBottom: 1 }}
                          >
                            <Typography
                              variant="displaySmall"
                              sx={{ display: "flex", gap: 1 }}
                            >
                              <strong>
                                {" "}
                                <Trans i18nKey={`${level.title}`} />:{" "}
                              </strong>
                              {level.description}
                            </Typography>
                          </Box>
                        ),
                      )}
                    </Box>
                    <Typography
                      variant="titleLarge"
                      gutterBottom
                      component="div"
                      mt={4}
                      id="questionnaires"
                    >
                      <Trans i18nKey="questionnaires" />
                    </Typography>
                    <Typography variant="displaySmall" paragraph>
                      <Trans
                        i18nKey="questionnairesDescription"
                        values={{
                          questionnairesCount: items?.length,
                          questionsCount: items?.reduce(
                            (previousValue: number, currentValue: any) => {
                              return (
                                previousValue + currentValue?.questionCount
                              );
                            },
                            0,
                          ),
                        }}
                      />
                    </Typography>
                    <TableContainer
                      component={Paper}
                      sx={{ marginBlock: 2, borderRadius: 4 }}
                    >
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell
                              sx={{
                                backgroundColor: "#f5f5f5",
                                borderRight: "1px solid rgba(224, 224, 224, 1)",
                              }}
                            >
                              <Typography variant="titleMedium">
                                <Trans i18nKey="#" />
                              </Typography>{" "}
                            </TableCell>
                            <TableCell
                              sx={{
                                backgroundColor: "#f5f5f5",
                                borderRight: "1px solid rgba(224, 224, 224, 1)",
                              }}
                            >
                              <Typography variant="titleMedium">
                                <Trans i18nKey="questionnaire" />
                              </Typography>
                            </TableCell>
                            <TableCell
                              sx={{
                                backgroundColor: "#f5f5f5",
                                borderRight: "1px solid rgba(224, 224, 224, 1)",
                              }}
                            >
                              <Typography variant="titleMedium">
                                <Trans i18nKey="description" />
                              </Typography>
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {items?.map((questionnaire: any, index: number) => (
                            <TableRow key={questionnaire?.id}>
                              <TableCell
                                sx={{
                                  borderRight:
                                    "1px solid rgba(224, 224, 224, 1)",
                                }}
                              >
                                {" "}
                                <Typography variant="displaySmall">
                                  {index + 1}
                                </Typography>
                              </TableCell>
                              <TableCell
                                sx={{
                                  borderRight:
                                    "1px solid rgba(224, 224, 224, 1)",
                                }}
                              >
                                {" "}
                                <Typography variant="titleMedium">
                                  {questionnaire?.title}
                                </Typography>
                              </TableCell>
                              <TableCell
                                sx={{
                                  borderRight:
                                    "1px solid rgba(224, 224, 224, 1)",
                                }}
                              >
                                {" "}
                                <Typography variant="displaySmall">
                                  {questionnaire?.description}{" "}
                                </Typography>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>
                </Grid>
                <Typography
                  component="div"
                  mt={6}
                  variant="headlineMedium"
                  id="overall-status-report"
                  gutterBottom
                >
                  <Trans i18nKey="overallStatusReport" />
                </Typography>
                <Typography variant="displaySmall" paragraph>
                  <Trans
                    i18nKey="overallStatusReportDescription"
                    values={{
                      maturityLevelTitle: assessment?.maturityLevel?.title,
                      questionCentext:
                        questionsCount !== answersCount
                          ? theme.direction == "rtl"
                            ? ` همه‌ی ${questionsCount} سوال `
                            : `all ${questionsCount} questions`
                          : theme.direction == "rtl"
                            ? `${answersCount} از ${questionsCount} سوال `
                            : `${answersCount} out of ${questionsCount} questions`,
                      confidenceValue: Math?.ceil(confidenceValue ?? 0),
                    }}
                  />
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={12} lg={6} xl={6}>
                    <Tooltip title={<Trans i18nKey={"copy"} />}>
                      <IconButton
                        size="small"
                        onClick={() => handleCopyClick("globalChart")}
                        disabled={loadingId === "globalChart"}
                      >
                        {loadingId === "globalChart" ? (
                          <CircularProgress size={24} />
                        ) : (
                          <ContentCopyOutlinedIcon fontSize="small" />
                        )}
                      </IconButton>
                    </Tooltip>
                    <Box
                      sx={{ height: "370px" }}
                      ref={handleSetRef("globalChart")}
                    >
                      {subjects?.length > 2 ? (
                        <AssessmentSubjectRadarChart
                          data={subjects}
                          maturityLevelsCount={
                            assessmentKit?.maturityLevelCount ?? 5
                          }
                          loading={false}
                        />
                      ) : (
                        <AssessmentSubjectRadialChart
                          data={subjects}
                          loading={false}
                        />
                      )}
                    </Box>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    md={12}
                    lg={6}
                    xl={6}
                    display="flex"
                    flexDirection="column"
                    alignItems="flex-end"
                  >
                    <Tooltip title={<Trans i18nKey={"copy"} />}>
                      <IconButton
                        size="small"
                        onClick={() => handleCopyClick("gauge")}
                        disabled={loadingId === "gauge"}
                      >
                        {loadingId === "gauge" ? (
                          <CircularProgress size={24} />
                        ) : (
                          <ContentCopyOutlinedIcon fontSize="small" />
                        )}
                      </IconButton>
                    </Tooltip>

                    <Box ref={handleSetRef("gauge")} width="100%">
                      <Gauge
                        level_value={maturityLevel?.index ?? 0}
                        maturity_level_status={maturityLevel?.title}
                        maturity_level_number={
                          assessmentKit?.maturityLevelCount
                        }
                        confidence_value={confidenceValue}
                        confidence_text={t("withPercentConfidence")}
                        isMobileScreen={false}
                        hideGuidance={true}
                        height={370}
                        mb={-8}
                        maturity_status_guide={t("overallMaturityLevelIs")}
                      />
                    </Box>
                  </Grid>
                </Grid>
                <br />
                <br />
                <Typography variant="displaySmall" gutterBottom>
                  <Trans i18nKey="subjectsSectionTitle" />
                </Typography>{" "}
                {subjects?.map((subject: ISubject) => (
                  <div key={subject?.id}>
                    <Typography
                      component="div"
                      mt={6}
                      variant="headlineMedium"
                      id={`subject-${subject?.id}`}
                      gutterBottom
                    >
                      <Trans
                        i18nKey="subjectStatusReport"
                        values={{ title: subject?.title }}
                      />
                    </Typography>
                    <Typography variant="displaySmall" paragraph>
                      <Trans
                        i18nKey="subjectStatusReportDescription"
                        values={{
                          title: subject?.title,
                          description: subject?.description,
                          confidenceValue: Math?.ceil(
                            subject?.confidenceValue ?? 0,
                          ),
                          maturityLevelValue: subject?.maturityLevel?.value,
                          maturityLevelTitle: subject?.maturityLevel?.title,
                          maturityLevelCount:
                            assessmentKit?.maturityLevelCount ?? 5,
                          attributesCount: subject?.attributes?.length,
                        }}
                      />
                    </Typography>
                    <Box display="flex" alignItems="flex-start">
                      <Box
                        height={
                          subject?.attributes?.length > 2 ? "400px" : "30vh"
                        }
                        ref={handleSetRef(subject?.id.toString() || "")}
                        flex={1}
                      >
                        {subject?.attributes?.length > 2 ? (
                          <AssessmentSubjectRadarChart
                            data={subject?.attributes}
                            maturityLevelsCount={
                              assessmentKit?.maturityLevelCount ?? 5
                            }
                            loading={false}
                          />
                        ) : (
                          <AssessmentSubjectRadialChart
                            data={subject?.attributes}
                            loading={false}
                          />
                        )}
                      </Box>
                      <Tooltip title={<Trans i18nKey={"copy"} />}>
                        <IconButton
                          size="small"
                          onClick={() =>
                            handleCopyClick(subject?.id.toString() || "")
                          }
                          disabled={loadingId === subject?.id.toString()}
                        >
                          {loadingId === subject?.id.toString() ? (
                            <CircularProgress size={24} />
                          ) : (
                            <ContentCopyOutlinedIcon fontSize="small" />
                          )}
                        </IconButton>
                      </Tooltip>
                    </Box>
                    <TableContainer
                      component={Paper}
                      sx={{ marginBlock: 2, borderRadius: 4 }}
                      className="checkbox-table"
                    >
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell
                              sx={{
                                maxWidth: 140,
                                backgroundColor: "#f5f5f5",
                                borderRight: "1px solid rgba(224, 224, 224, 1)",
                              }}
                            >
                              <Typography variant="titleMedium">
                                <Trans i18nKey="attribute" />
                              </Typography>
                            </TableCell>
                            <TableCell
                              sx={{
                                maxWidth: 300,
                                backgroundColor: "#f5f5f5",
                                borderRight: "1px solid rgba(224, 224, 224, 1)",
                              }}
                            >
                              <Typography variant="titleMedium">
                                <Trans i18nKey="status" />
                              </Typography>
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {subject?.attributes?.map((attribute, index) => (
                            <TableRow key={attribute?.id}>
                              <TableCell
                                sx={{
                                  maxWidth: 140,
                                  wordWrap: "break-word",
                                  borderRight:
                                    "1px solid rgba(224, 224, 224, 1)",
                                }}
                              >
                                <Typography variant="titleMedium">
                                  {attribute?.title}
                                </Typography>
                                <br />
                                <Typography variant="displaySmall">
                                  {attribute?.description}
                                </Typography>
                              </TableCell>
                              <TableCell
                                className="attribute--statusbar"
                                sx={{
                                  maxWidth: 300,
                                  wordWrap: "break-word",
                                  borderRight:
                                    "1px solid rgba(224, 224, 224, 1)",
                                  position: "relative",
                                }}
                              >
                                <Box
                                  display="flex"
                                  flexDirection="column"
                                  gap={0.5}
                                >
                                  <Box display="flex" alignItems="flex-start">
                                    <Box
                                      ref={handleSetRef(
                                        attribute?.id.toString() || "",
                                      )}
                                      flex={1}
                                    >
                                      <AttributeStatusBarContainer
                                        status={attribute?.maturityLevel?.title}
                                        ml={attribute?.maturityLevel?.value}
                                        cl={Math.ceil(
                                          attribute?.confidenceValue ?? 0,
                                        )}
                                        mn={
                                          assessmentKit?.maturityLevelCount ?? 5
                                        }
                                        document
                                      />
                                    </Box>
                                    <Tooltip title={<Trans i18nKey={"copy"} />}>
                                      <IconButton
                                        size="small"
                                        onClick={() =>
                                          handleCopyClick(
                                            attribute?.id.toString() || "",
                                          )
                                        }
                                        disabled={
                                          loadingId === attribute?.id.toString()
                                        } // Disable button when loading
                                      >
                                        {loadingId ===
                                        attribute?.id.toString() ? (
                                          <CircularProgress size={24} />
                                        ) : (
                                          <ContentCopyOutlinedIcon fontSize="small" />
                                        )}
                                      </IconButton>
                                    </Tooltip>
                                  </Box>

                                  {attributesData[attribute?.id?.toString()] ? (
                                    <Typography variant="displaySmall">
                                      {
                                        attributesData[
                                          attribute?.id?.toString()
                                        ]
                                      }
                                    </Typography>
                                  ) : editable &&
                                    loadingAttributes[
                                      attribute?.id?.toString()
                                    ] ? (
                                    <Box display="flex" alignItems="center">
                                      <CircularProgress
                                        size={24}
                                        sx={{
                                          marginRight:
                                            theme.direction === "ltr"
                                              ? 1
                                              : "unset",
                                          marginLeft:
                                            theme.direction === "rtl"
                                              ? 1
                                              : "unset",
                                        }}
                                      />
                                      <Typography variant="displaySmall">
                                        <Trans i18nKey="generatingInsight" />
                                      </Typography>
                                    </Box>
                                  ) : (
                                    editable && (
                                      <Box
                                        sx={{ ...styles.centerV }}
                                        gap={0.5}
                                        my={1}
                                      >
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
                                            <Trans i18nKey={"warning"} />
                                          </Typography>
                                        </Box>
                                        <Typography
                                          variant="titleMedium"
                                          fontWeight={400}
                                          color="#243342"
                                        >
                                          <Trans i18nKey="questionsArentCompleteSoAICantBeGeneratedFirstSection" />{" "}
                                          <Box
                                            component={RouterLink}
                                            to={`./../questionnaires?subject_pk=${subject?.id}`}
                                            sx={{
                                              textDecoration: "none",
                                              color: theme.palette.primary.main,
                                            }}
                                          >
                                            <Typography variant="titleMedium">
                                              the assessment question
                                            </Typography>
                                          </Box>{" "}
                                          <Trans i18nKey="questionsArentCompleteSoAICantBeGeneratedSecondSection" />
                                        </Typography>
                                      </Box>
                                    )
                                  )}
                                  {attributesDataPolicy[
                                    attribute?.id?.toString()
                                  ]?.aiInsight &&
                                    attributesDataPolicy[
                                      attribute?.id?.toString()
                                    ]?.aiInsight.isValid && (
                                      <Box sx={{ ...styles.centerV }} gap={2}>
                                        <AIGenerated />
                                        <Box
                                          sx={{
                                            display: "flex",
                                            alignItems: "flex-start",
                                            backgroundColor:
                                              "rgba(255, 249, 196, 0.31)",
                                            padding: 1,
                                            borderRadius: 2,
                                            maxWidth: "80%",
                                          }}
                                        >
                                          <InfoOutlined
                                            color="primary"
                                            sx={{
                                              marginRight:
                                                theme.direction === "ltr"
                                                  ? 1
                                                  : "unset",
                                              marginLeft:
                                                theme.direction === "rtl"
                                                  ? 1
                                                  : "unset",
                                            }}
                                          />
                                          <Typography
                                            variant="titleMedium"
                                            fontWeight={400}
                                            textAlign={
                                              theme.direction == "rtl"
                                                ? "right"
                                                : "left"
                                            }
                                          >
                                            <Trans i18nKey="invalidAIInsight" />
                                          </Typography>
                                        </Box>
                                      </Box>
                                    )}
                                  {((attributesDataPolicy[
                                    attribute?.id?.toString()
                                  ]?.assessorInsight &&
                                    !attributesDataPolicy[
                                      attribute?.id?.toString()
                                    ]?.assessorInsight?.isValid) ||
                                    (attributesDataPolicy[
                                      attribute?.id?.toString()
                                    ]?.aiInsight &&
                                      !attributesDataPolicy[
                                        attribute?.id?.toString()
                                      ]?.aiInsight?.isValid)) && (
                                    <Box sx={{ ...styles.centerV }} gap={2}>
                                      <Box
                                        sx={{
                                          zIndex: 1,
                                          display: "flex",
                                          justifyContent: "flex-start",
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
                                          <Trans i18nKey="Outdated" />
                                        </Typography>
                                      </Box>
                                      <Box
                                        sx={{
                                          display: "flex",
                                          alignItems: "flex-start",
                                          backgroundColor:
                                            "rgba(255, 249, 196, 0.31)",
                                          padding: 1,
                                          borderRadius: 4,
                                          maxWidth: "100%",
                                        }}
                                      >
                                        <InfoOutlined
                                          color="primary"
                                          sx={{
                                            marginRight:
                                              theme.direction === "ltr"
                                                ? 1
                                                : "unset",
                                            marginLeft:
                                              theme.direction === "rtl"
                                                ? 1
                                                : "unset",
                                          }}
                                        />
                                        <Typography
                                          variant="titleMedium"
                                          fontWeight={400}
                                          textAlign="left"
                                        >
                                          <Trans i18nKey="invalidInsight" />
                                        </Typography>
                                      </Box>
                                    </Box>
                                  )}
                                </Box>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </div>
                ))}
                <>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: { xs: "column", sm: "row" },
                      justifyContent: "space-between",
                      alignItems: { xs: "flex-start", sm: "flex-end" },
                    }}
                  >
                    <Typography
                      component="div"
                      mt={4}
                      variant="headlineMedium"
                      id="recommendations"
                      gutterBottom
                    >
                      <Trans i18nKey="recommendations" />
                    </Typography>
                    {aiGenerated && (
                      <Box>
                        <AIGenerated />
                      </Box>
                    )}
                  </Box>
                  <Typography
                    dangerouslySetInnerHTML={{
                      __html:
                        adviceNarration || (t("noRecommendation") as string),
                    }}
                  ></Typography>
                </>
              </Paper>
            </Box>
          );
        }}
      />
    </PermissionControl>
  );
};

export default AssessmentExportContainer;
