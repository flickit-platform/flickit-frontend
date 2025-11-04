import { useServiceContext } from "@/providers/service-provider";
import { useQuery } from "@/hooks/useQuery";
import { useCallback, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ECustomErrorType } from "@/types";
import { ICustomError } from "@/utils/custom-error";

const useCalculate = (errorCode?: ICustomError, fetchData?: () => void) => {
  const { service } = useServiceContext();
  const { assessmentId = "" } = useParams();

  const calculateMaturityLevelQuery = useQuery({
    service: (args, config) =>
      service.assessments.info.calculateMaturity(
        args ?? { assessmentId },
        config,
      ),
    runOnMount: false,
  });

  const calculateConfidenceLevelQuery = useQuery({
    service: (args, config) =>
      service.assessments.info.calculateConfidence(
        args ?? { assessmentId },
        config,
      ),
    runOnMount: false,
  });

  const calculate = useCallback(async () => {
    try {
      await calculateMaturityLevelQuery.query();
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }, [calculateMaturityLevelQuery]);

  const calculateConfidence = useCallback(async () => {
    try {
      await calculateConfidenceLevelQuery.query();
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }, [calculateConfidenceLevelQuery]);

  useEffect(() => {
    if (!errorCode) return;

    if (
      errorCode.response?.data.code === ECustomErrorType.CALCULATE_NOT_VALID
    ) {
      calculate().then(fetchData);
    } else if (
      errorCode.response?.data.code ===
      ECustomErrorType.CONFIDENCE_CALCULATION_NOT_VALID
    ) {
      calculateConfidence().then(fetchData);
    } else if (errorCode.response?.data.code === ECustomErrorType.DEPRECATED) {
      service.assessments.info
        .migrateKitVersion({ assessmentId })
        .then(fetchData);
    }
  }, [errorCode?.response?.data.code]);
};

export default useCalculate;
