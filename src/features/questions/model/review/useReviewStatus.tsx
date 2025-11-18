import { IQuestionnairesModel } from "@/types";
import { useQuestionContext } from "../../context";
import { useSidebar } from "../sidebar/useSidebar";
import {
  REVIEW_STATUS_CONFIG,
  ReviewStatusConfig,
  ReviewStatusId,
} from "./config";
import { useServiceContext } from "@/providers/service-provider";
import { useQuery } from "@/hooks/useQuery";
import { useParams } from "react-router-dom";

export function useReviewStatus(): ReviewStatusConfig & {
  status: ReviewStatusId;
  completionPercent: number;
  getNextQuestionnaire: any;
  fetchPathInfo: any;
} {
  const { questions } = useQuestionContext();
  const { completionPercent } = useSidebar(questions);
  const { service } = useServiceContext();
  const { assessmentId = "", questionnaireId = "" } = useParams();

  const getNextQuestionnaire = useQuery<IQuestionnairesModel>({
    service: (args, config) =>
      service.assessments.questionnaire.getNext({
        assessmentId,
        questionnaireId,
      }),
    runOnMount: true,
  });

  const fetchPathInfo = useQuery({
    service: (args, config) =>
      service.common.getPathInfo(
        { questionnaireId, assessmentId, ...args },
        config,
      ),
    runOnMount: true,
  });

  const percent = completionPercent ?? 0;

  let status: ReviewStatusId;
  if (percent <= 0) {
    status = "empty";
  } else if (percent >= 100) {
    status = "complete";
  } else {
    status = "incomplete";
  }

  const config = REVIEW_STATUS_CONFIG[status];

  return {
    ...config,
    status,
    completionPercent: percent,
    getNextQuestionnaire,
    fetchPathInfo,
  };
}
