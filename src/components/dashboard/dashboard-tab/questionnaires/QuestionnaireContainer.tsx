import Box from "@mui/material/Box";
import { QuestionnaireList } from "./QuestionnaireList";
import { styles } from "@styles";
import { useQuery } from "@utils/useQuery";
import { useServiceContext } from "@providers/ServiceProvider";
import { IQuestionnairesModel } from "@/types/index";
import { useParams, useSearchParams } from "react-router-dom";
import PermissionControl from "@common/PermissionControl";
import { useMemo } from "react";

const QuestionnaireContainer = () => {
  const { questionnaireQueryData, assessmentTotalProgress } =
    useQuestionnaire();

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
            background: `radial-gradient(circle, #123354 50%, #0D263F 100%)`,
            px: { xs: 1, sm: 2, md: 3, lg: 4 },
            pt: { xs: 5, sm: 3 },
            pb: 5,
          }}
          borderRadius={2}
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
  const abortController = useMemo(() => new AbortController(), []);

  const { service } = useServiceContext();
  const [searchParams] = useSearchParams();
  const { assessmentId = "" } = useParams();
  const subjectIdParam = searchParams.get("subject_pk");

  const questionnaireQueryData = useQuery<IQuestionnairesModel>({
    service: (args, config) =>
      service.assessments.questionnaire.getAll(
        { assessmentId, ...(args ?? { subject_pk: subjectIdParam }) },
        { signal: abortController.signal },
      ),
  });

  const getNextQuestionnaire = useQuery<IQuestionnairesModel>({
    service: (args, config) =>
      service.assessments.questionnaire.getNext(
        { assessmentId, ...(args ?? {}) },
        { signal: abortController.signal },
      ),
    runOnMount: false,
  });

  const assessmentTotalProgress = useQuery<IQuestionnairesModel>({
    service: (args, config) =>
      service.assessments.info.getProgress(
        { assessmentId, ...(args ?? {}) },
        { signal: abortController.signal },
      ),
  });
  const fetchPathInfo = useQuery({
    service: (args, config) =>
      service.common.getPathInfo(
        { assessmentId, ...(args ?? {}) },
        { signal: abortController.signal },
      ),
    runOnMount: true,
  });
  return {
    questionnaireQueryData,
    assessmentTotalProgress,
    fetchPathInfo,
    getNextQuestionnaire,
  };
};

export { QuestionnaireContainer };
