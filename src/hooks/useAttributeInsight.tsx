import { useCallback, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@/utils/useQuery";
import { useServiceContext } from "@/providers/ServiceProvider";
import { ICustomError } from "@/utils/CustomError";
import toastError from "@/utils/toastError";

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

const useAttributeInsight = ({ id }: UseAttributeInsightProps): UseAttributeInsightReturn => {
  const { service } = useServiceContext();
  const { assessmentId = "" } = useParams();

  const queryArgs = useMemo<QueryArgs>(
    () => ({ assessmentId, attributeId: id }),
    [assessmentId, id],
  );

  const ApprovedAIAttribute = useQuery({
    service: (args = queryArgs, config) =>
      service.ApprovedAIAttribute(args, config),
    runOnMount: false,
  });

  const loadAttributeInsight = useQuery({
    service: (args = queryArgs, config) =>
      service.loadAttributeInsight(args, config),
    runOnMount: false,
  });

  const generateAIInsight = useQuery({
    service: (args = queryArgs, config) =>
      service.generateAIInsight(args, config),
    runOnMount: false,
  });

  const approveAttribute = useCallback(
    async (event: React.SyntheticEvent) => {
      event.stopPropagation();
      try {
        await ApprovedAIAttribute.query();
        await loadAttributeInsight.query();
      } catch (e) {
        toastError(e as ICustomError);
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