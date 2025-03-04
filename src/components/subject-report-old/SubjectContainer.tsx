import { useEffect } from "react";
import Paper from "@mui/material/Paper";
import Skeleton from "@mui/material/Skeleton";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { Trans } from "react-i18next";
import { Link, useParams } from "react-router-dom";
import GettingThingsReadyLoading from "@common/loadings/GettingThingsReadyLoading";
import Title from "@common/Title";
import { styles } from "@styles";
import { useServiceContext } from "@providers/ServiceProvider";
import { useQuery } from "@utils/useQuery";
import { SubjectAttributeList } from "./SubjectAttributeList";
import SubjectOverallInsight from "./SubjectOverallInsight";
import { ErrorCodes, ISubjectReportModel } from "@types";
import hasStatus from "@utils/hasStatus";
import Button from "@mui/material/Button";
import SupTitleBreadcrumb from "@common/SupTitleBreadcrumb";
import { t } from "i18next";
import setDocumentTitle from "@utils/setDocumentTitle";
import QueryBatchData from "@common/QueryBatchData";
import { useConfigContext } from "@/providers/ConfgProvider";
import { theme } from "@/config/theme";
import useCalculate from "@/hooks/useCalculate";

const SubjectContainer = (props: any) => {
  const { subjectId } = props;
  const {
    loading,
    loaded,
    hasError,
    subjectQueryData,
    subjectProgressQueryData,
    fetchPathInfo,
  } = useSubject({ subjectId });
  return (
    <QueryBatchData
      queryBatchData={[
        subjectQueryData,
        subjectProgressQueryData,
        fetchPathInfo,
      ]}
      error={hasError}
      loading={loading}
      loaded={loaded}
      render={([data = {}, subjectProgress = {}, pathInfo = {}]) => {
        const { subject } = data;
        const { isConfidenceValid, isCalculateValid, title } = subject;
        const { answerCount, questionCount } = subjectProgress;
        const progress = ((answerCount || 0) / (questionCount || 1)) * 100;

        return (
          <Box>
            {loading ? (
              <Box sx={{ ...styles.centerVH }} py={6} mt={5}>
                <GettingThingsReadyLoading color="gray" />
              </Box>
            ) : !loaded ? null : !isCalculateValid || !isConfidenceValid ? (
              <NoInsightYetMessage
                title={title}
                no_insight_yet_message={!isCalculateValid || !isConfidenceValid}
                subjectId={subjectId}
              />
            ) : (
              <Box>
                <SubjectOverallInsight
                  {...subjectQueryData}
                  subjectId={subjectId}
                  loading={loading}
                />
                <SubjectAttributeList
                  {...subjectQueryData}
                  loading={loading}
                  progress={progress}
                />
              </Box>
            )}
          </Box>
        );
      }}
    />
  );
};

export const useSubject = (props: any) => {
  const { subjectId } = props;
  const { service } = useServiceContext();
  const { assessmentId } = useParams();
  const { calculate, calculateConfidence } = useCalculate();

  const subjectQueryData = useQuery<ISubjectReportModel>({
    service: (args: { subjectId: string; assessmentId: string }, config) =>
      service.fetchSubject(args, config),
    runOnMount: false,
  });
  const subjectProgressQueryData = useQuery<any>({
    service: (args: { subjectId: string; assessmentId: string }, config) =>
      service.fetchSubjectProgress(args, config),
    runOnMount: false,
  });

  const fetchPathInfo = useQuery({
    service: (args, config) =>
      service.fetchPathInfo({ assessmentId, ...(args || {}) }, config),
    runOnMount: false,
  });

  const getSubjectQueryData = async () => {
    try {
      await subjectQueryData.query({ subjectId, assessmentId });
      await subjectProgressQueryData.query({ subjectId, assessmentId });
    } catch (e) {}
  };

  useEffect(() => {
    if (
      subjectQueryData.errorObject?.response?.data?.code ==
      ErrorCodes.CalculateNotValid
    ) {
      calculate(getSubjectQueryData);
    }
    if (
      subjectQueryData.errorObject?.response?.data?.code ==
      ErrorCodes.ConfidenceCalculationNotValid
    ) {
      calculateConfidence(getSubjectQueryData);
    }
  }, [subjectQueryData.errorObject]);
  useEffect(() => {
    getSubjectQueryData();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const hasError = subjectQueryData.error || subjectProgressQueryData.error;

  const loading = subjectQueryData.loading || subjectProgressQueryData.loading;
  const loaded = subjectQueryData.loaded || subjectProgressQueryData.loaded;

  const noStatus = !hasStatus(subjectQueryData.data?.status);

  return {
    noStatus,
    loading,
    loaded,
    hasError,
    subjectQueryData,
    subjectProgressQueryData,
    fetchPathInfo,
  };
};

const SubjectTitle = (props: {
  data: ISubjectReportModel;
  loading: boolean;
  pathInfo: any;
}) => {
  const { data, loading, pathInfo } = props;
  const { subject } = data || {};
  const { title } = subject;
  const { spaceId, assessmentId, page } = useParams();
  const { space, assessment } = pathInfo;
  const { config } = useConfigContext();

  useEffect(() => {
    setDocumentTitle(`${title} ${t("insight")}`, config.appTitle);
  }, [title]);
  return (
    <Title
      size="large"
      letterSpacing=".08em"
      backLink={"/"}
      id="insight"
      inPageLink="insight"
      sup={
        <SupTitleBreadcrumb
          routes={[
            {
              title: space?.title,
              to: `/${spaceId}/assessments/${page}`,
            },
            {
              title: t("insightsWithTitle", { title: assessment?.title }),
              to: `/${spaceId}/assessments/${page}/${assessmentId}/insights`,
            },
            {
              title: title || t("technicalDueDiligence"),
            },
          ]}
        />
      }
    >
      <Box sx={{ ...styles.centerV, unicodeBidi: "plaintext" }}>
        {loading && (
          <Skeleton
            width={"84px"}
            sx={{
              marginRight: theme.direction === "ltr" ? 0.5 : "unset",
              marginLeft: theme.direction === "rtl" ? 0.5 : "unset",
              display: "inline-block",
            }}
          />
        )}{" "}
        {t("insightsWithTitle", { title: assessment?.title })}{" "}
      </Box>
    </Title>
  );
};

const NoInsightYetMessage = (props: {
  title: string;
  no_insight_yet_message: boolean;
  subjectId: any;
}) => {
  const { subjectId } = props;
  const { title, no_insight_yet_message } = props;
  return (
    <Box mt={2}>
      <Paper
        sx={{
          ...styles.centerCVH,
          background: "gray",
          color: "white",
          p: 3,
          py: 8,
          borderRadius: 2,
          textAlign: "center",
        }}
      >
        {no_insight_yet_message ? (
          <Typography variant="h4" fontFamily={"Roboto"}>
            {no_insight_yet_message}
          </Typography>
        ) : (
          <>
            <Typography variant="h4" fontFamily={"Roboto"}>
              <Trans i18nKey="moreQuestionsNeedToBeAnswered" />
            </Typography>
            <Typography
              variant="h5"
              fontFamily={"Roboto"}
              fontWeight="300"
              sx={{ mt: 2 }}
            >
              <Trans i18nKey="completeSomeOfQuestionnaires" />
            </Typography>
          </>
        )}
        <Button
          sx={{ mt: 3 }}
          variant="contained"
          component={Link}
          to={`./../../questionnaires?subject_pk=${subjectId}`}
        >
          {title} <Trans i18nKey="questionnaires" />
        </Button>
      </Paper>
    </Box>
  );
};

export default SubjectContainer;
