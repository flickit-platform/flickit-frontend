import { useMemo } from "react";
import { useAssessmentContext } from "@/providers/assessment-provider";
import { ASSESSMENT_MODE } from "@/utils/enum-type";

export function useAssessmentMode() {
  const { assessmentInfo } = useAssessmentContext();
  const modeCode = assessmentInfo?.mode?.code;

  const isAdvanced = useMemo(
    () => modeCode === ASSESSMENT_MODE.ADVANCED,
    [modeCode],
  );

  const isBasic = useMemo(
    () => modeCode === ASSESSMENT_MODE.QUICK,
    [modeCode],
  );

  return {
    modeCode,
    isAdvanced: !!isAdvanced,
    isBasic: !!isBasic,
  };
}
