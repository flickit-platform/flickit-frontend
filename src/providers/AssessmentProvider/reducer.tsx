import { ASSESSMENT_ACTIONS_TYPE } from "./actions";

const assessmentReducer = (
  prevState: any,
  action: { type: ASSESSMENT_ACTIONS_TYPE; payload: any },
) => {
  switch (action.type) {
    case ASSESSMENT_ACTIONS_TYPE.SET_PERMISSIONS:
      return {
        ...prevState,
        permissions: action.payload,
      };
    case ASSESSMENT_ACTIONS_TYPE.SET_INFO:
      return {
        ...prevState,
        assessmentInfo: action.payload,
      };
    case ASSESSMENT_ACTIONS_TYPE.SET_PENDING_KIT:
      return {
        ...prevState,
        pendingKitData: action.payload,
      };
    case ASSESSMENT_ACTIONS_TYPE.TARGET_SPACE:
      return {
        ...prevState,
        targetSpace: action.payload,
      };
      case ASSESSMENT_ACTIONS_TYPE.TOP_SPACE:
      return {
        ...prevState,
        topSpace: action.payload,
      };
    default:
      return prevState;
  }
};

export default assessmentReducer;
