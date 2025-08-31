import { useEffect } from "react";
import { useQuery } from "@utils/useQuery";
import { ReportAccessUsersResponse } from "@/features/assessment-report/model/hooks/useShareDialog";
import { useServiceContext } from "@providers/ServiceProvider";
import { useParams } from "react-router";

export function useQuestionReportDialog(measureId: any, attributeId: any) {
  const { service } = useServiceContext();
  const { assessmentId = "" } = useParams();
  const fetchAttributeMeasureQuestions = useQuery<any>({
    service: (args, config) =>
      service.assessments.report.fetchAttributeMeasureQuestions(
        { assessmentId, attributeId, measureId, ...(args ?? {}) },
        config,
      ),
    runOnMount: false,
  });

  useEffect(() => {
    fetchAttributeMeasureQuestions.query();
  }, [measureId]);
  const data = fetchAttributeMeasureQuestions?.data;
  return { data };
}
