import { ASSESSMENT_ACTIONS_TYPE } from "./actions";

const assessmentReducer = (
  prevState: any,
  action: { type: ASSESSMENT_ACTIONS_TYPE; payload: any },
) => {
  if (action.type === ASSESSMENT_ACTIONS_TYPE.SET_PERMISSIONS) {
    return {
      ...prevState,
      permissions: action.payload,
    };
  }

  return prevState;
};

export default assessmentReducer;
