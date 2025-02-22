import { useEffect, useMemo } from "react";
import Box from "@mui/material/Box";
import { QuestionnaireList } from "./QuestionnaireList";
import { Trans } from "react-i18next";
import { styles } from "@styles";
import { useQuery } from "@utils/useQuery";
import { useServiceContext } from "@providers/ServiceProvider";
import { IQuestionnairesModel } from "@types";
import Title from "@common/TitleComponent";
import { useParams, useSearchParams } from "react-router-dom";
import SupTitleBreadcrumb from "@common/SupTitleBreadcrumb";
import PermissionControl from "@common/PermissionControl";
import setDocumentTitle from "@utils/setDocumentTitle";
import { t } from "i18next";
import { useConfigContext } from "@/providers/ConfgProvider";

const QuestionnaireContainer = () => {
  const { service } = useServiceContext();
  const { assessmentId = "" } = useParams();

  const AssessmentInfo = useQuery({
    service: (args = { assessmentId }, config) =>
      service.AssessmentsLoad(args, config),
    toastError: false,
    toastErrorOptions: { filterByStatus: [404] },
  });

  const isPermitted = useMemo(() => {
    return AssessmentInfo?.data?.viewable;
  }, [AssessmentInfo]);

  const { questionnaireQueryData, assessmentTotalProgress, fetchPathInfo } =
    useQuestionnaire();

  const progress =
    ((assessmentTotalProgress?.data?.answersCount || 0) /
      (assessmentTotalProgress?.data?.questionsCount || 1)) *
    100;

  return (
    <PermissionControl
      error={[questionnaireQueryData.errorObject?.response?.data]}
    >
      <Box>
        <Box
          flexWrap={"wrap"}
          sx={{
            ...styles.centerCV,
            transition: "height 1s ease",
            backgroundColor: "#01221e",
            background: questionnaireQueryData.loading
              ? undefined
              : `linear-gradient(135deg, #2e7d72 ${progress}%, #01221e ${progress}%)`,
            px: { xs: 1, sm: 2, md: 3, lg: 4 },
            pt: { xs: 5, sm: 3 },
            pb: 5,
          }}
          borderRadius={2}
          my={2}
          color="white"
          position={"relative"}
        >
          <QuestionnaireList
            assessmentTotalProgress={assessmentTotalProgress}
            questionnaireQueryData={questionnaireQueryData}
          />
        </Box>
      </Box>
    </PermissionControl>
  );
};

export const useQuestionnaire = () => {
  const { service } = useServiceContext();
  const [searchParams] = useSearchParams();
  const { assessmentId } = useParams();
  const subjectIdParam = searchParams.get("subject_pk");

  const questionnaireQueryData = useQuery<IQuestionnairesModel>({
    service: (args = { subject_pk: subjectIdParam }, config) =>
      service.fetchQuestionnaires({ assessmentId, ...(args || {}) }, config),
  });
  const assessmentTotalProgress = useQuery<IQuestionnairesModel>({
    service: (args, config) =>
      service.fetchAssessmentTotalProgress(
        { assessmentId, ...(args || {}) },
        config,
      ),
  });
  const fetchPathInfo = useQuery({
    service: (args, config) =>
      service.fetchPathInfo({ assessmentId, ...(args || {}) }, config),
    runOnMount: true,
  });
  return {
    questionnaireQueryData,
    assessmentTotalProgress,
    fetchPathInfo,
  };
};

const QuestionnaireTitle = (props: any) => {
  const { pathInfo } = props;
  const { spaceId, page } = useParams();
  const { space, assessment } = pathInfo;

  const { config } = useConfigContext();

  useEffect(() => {
    setDocumentTitle(
      `${assessment?.title} ${t("questionnaires")}`,
      config.appTitle,
    );
  }, [assessment]);

  return (
    <Title
      backLink="/"
      size="large"
      sup={
        <SupTitleBreadcrumb
          routes={[
            {
              title: space?.title,
              to: `/${spaceId}/assessments/${page}`,
            },
            {
              title: assessment?.title,
            },
          ]}
        />
      }
    >
      <Trans i18nKey="questionnaires" />
    </Title>
  );
};

export { QuestionnaireContainer };
