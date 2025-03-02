import { useServiceContext } from "@/providers/ServiceProvider";
import { useQuery } from "@/utils/useQuery";
import { useCallback } from "react";
import { useParams } from "react-router-dom";

const useCalculate = () => {
  const { service } = useServiceContext();
  const { assessmentId } = useParams();

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

  const calculate = useCallback(
    async (onSuccessCallback: () => void) => {
      try {
        await calculateMaturityLevelQuery.query();
        onSuccessCallback();
      } catch (e) {
        console.error("Error in calculate:", e);
      }
    },
    [calculateMaturityLevelQuery],
  );

  const calculateConfidence = useCallback(
    async (onSuccessCallback: () => void) => {
      try {
        await calculateConfidenceLevelQuery.query();
        onSuccessCallback();
      } catch (e) {
        console.error("Error in calculateConfidence:", e);
      }
    },
    [calculateConfidenceLevelQuery],
  );

  return { calculate, calculateConfidence };
};

export default useCalculate;
