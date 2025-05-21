import { IAssessmentInfo } from "@/types";

export enum ASSESSMENT_ACTIONS_TYPE {
  SET_PERMISSIONS = "SET_PERMISSIONS",
  SET_INFO = "SET_INFO",
}

export const setAssessmentInfo = function (payload: IAssessmentInfo) {
  return { payload, type: ASSESSMENT_ACTIONS_TYPE.SET_INFO };
};

export const assessmentActions = {
  setAssessmentInfo,
};
