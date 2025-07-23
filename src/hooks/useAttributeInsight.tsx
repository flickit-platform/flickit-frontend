import { useCallback, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@/utils/useQuery";
import { useServiceContext } from "@/providers/ServiceProvider";
import { ICustomError } from "@/utils/CustomError";
import showToast from "@/utils/toastError";

interface UseAttributeInsightProps {
  id: string;
}

interface QueryArgs {
  assessmentId: string;
  attributeId: string;
}

interface UseAttributeInsightReturn {
  ApprovedAIAttribute: ReturnType<typeof useQuery>;
  loadAttributeInsight: ReturnType<typeof useQuery>;
  generateAIInsight: ReturnType<typeof useQuery>;
  approveAttribute: (event: React.SyntheticEvent) => Promise<void>;
}

const useAttributeInsight = ({
  id,
}: UseAttributeInsightProps): UseAttributeInsightReturn => {
  const { service } = useServiceContext();
  const { assessmentId = "" } = useParams();

  const queryArgs = useMemo<QueryArgs>(
    () => ({ assessmentId, attributeId: id }),
    [assessmentId, id],
  );

  const ApprovedAIAttribute = useQuery({
    service: (args, config) =>
      service.assessments.attribute.approveAIInsight(args ?? queryArgs, config),
    runOnMount: false,
  });

  const loadAttributeInsight = useQuery({
    service: (args, config) =>
      service.assessments.attribute.getAttributeInsight(args ?? queryArgs, config),
    runOnMount: false,
  });

  const generateAIInsight = useQuery({
    service: (args, config) =>
      service.assessments.attribute.generateAIInsight(args ?? queryArgs, config),
    runOnMount: false,
  });

  const approveAttribute = useCallback(
    async (event: React.SyntheticEvent) => {
      event.stopPropagation();
      try {
        await ApprovedAIAttribute.query();
        await loadAttributeInsight.query();
      } catch (e) {
        showToast(e as ICustomError);
      }
    },
    [ApprovedAIAttribute, loadAttributeInsight],
  );

  return {
    ApprovedAIAttribute,
    loadAttributeInsight,
    generateAIInsight,
    approveAttribute,
  };
};

export default useAttributeInsight;
