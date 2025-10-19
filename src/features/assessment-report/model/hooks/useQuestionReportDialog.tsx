import { useEffect } from "react";
import { useQuery } from "@/hooks/useQuery";
import { useServiceContext } from "@/providers/service-provider";
import { TId } from "@/types";

export function useQuestionReportDialog(measureId: TId, attributeId: TId, assessmentId: TId) {
  const { service } = useServiceContext();
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
  const loading = fetchAttributeMeasureQuestions?.loading;
  return { data,loading };
}
