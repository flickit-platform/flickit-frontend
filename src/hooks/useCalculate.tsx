import { useServiceContext } from "@/providers/service-provider";
import { useQuery } from "@/utils/useQuery";
import { useCallback } from "react";
import { useParams } from "react-router-dom";

const useCalculate = () => {
  const { service } = useServiceContext();
  const { assessmentId = "" } = useParams();

  const calculateMaturityLevelQuery = useQuery({
    service: (args, config) =>
      service.assessments.info.calculateMaturity(args ?? { assessmentId }, config),
    runOnMount: false,
  });

  const calculateConfidenceLevelQuery = useQuery({
    service: (args, config) =>
      service.assessments.info.calculateConfidence(args ?? { assessmentId }, config),
    runOnMount: false,
  });

  const calculate = useCallback(
    async (onSuccessCallback?: () => void) => {
      try {
        await calculateMaturityLevelQuery.query();
        if (onSuccessCallback) {
          onSuccessCallback();
        }
        return true;
      } catch (e) {
        console.error("Error in calculate:", e);
        return false;
      }
    },
    [calculateMaturityLevelQuery],
  );

  const calculateConfidence = useCallback(
    async (onSuccessCallback?: () => void) => {
      try {
        await calculateConfidenceLevelQuery.query();
        if (onSuccessCallback) {
          onSuccessCallback();
        }
        return true;
      } catch (e) {
        console.error("Error in calculateConfidence:", e);
        return false;
      }
    },
    [calculateConfidenceLevelQuery],
  );

  return { calculate, calculateConfidence };
};

export default useCalculate;
