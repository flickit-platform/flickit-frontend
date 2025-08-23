import { IAssessmentInfo } from "@/types";

export enum ASSESSMENT_ACTIONS_TYPE {
  SET_PERMISSIONS = "SET_PERMISSIONS",
  SET_INFO = "SET_INFO",
  SET_PENDING_KIT = "SET_PENDING_KIT",
  TARGET_SPACE = "TARGET_SPACE",
  TOP_SPACE = "TOP_SPACE",
}

export const setAssessmentInfo = function (payload: IAssessmentInfo) {
  return { payload, type: ASSESSMENT_ACTIONS_TYPE.SET_INFO };
};

export const setPendingKit = function (payload: {
  title?: string;
  id?: string;
  display?: boolean;
}) {
  return { payload, type: ASSESSMENT_ACTIONS_TYPE.SET_PENDING_KIT };
};

export const assessmentActions = {
  setAssessmentInfo,
  setPendingKit,
};
