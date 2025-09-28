import { IAssessmentInfo } from "@/types";

export enum ASSESSMENT_ACTIONS_TYPE {
  SET_PERMISSIONS = "SET_PERMISSIONS",
  SET_INFO = "SET_INFO",
  SET_PENDING_KIT = "SET_PENDING_KIT",
  SET_PENDING_REPORT_SHARE = "SET_PENDING_REPORT_SHARE",
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
export const setPendingShareReport = function (payload: {
  assessmentId?: string;
  spaceId?: string;
  title?: string;
  display?: boolean;
}) {
  return { payload, type: ASSESSMENT_ACTIONS_TYPE.SET_PENDING_REPORT_SHARE };
};

export const assessmentActions = {
  setAssessmentInfo,
  setPendingKit,
  setPendingShareReport
};
