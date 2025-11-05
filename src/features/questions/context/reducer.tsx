import { QUESTION_ACTIONS_TYPE } from "./actions";

const clamp = (i: number, n: number) =>
  Math.max(0, Math.min(i, Math.max(n - 1, 0)));

const questionReducer = (
  prevState: any,
  action: { type: QUESTION_ACTIONS_TYPE; payload: any },
) => {
  switch (action.type) {
    case QUESTION_ACTIONS_TYPE.SET_QUESTIONS:
      return {
        ...prevState,
        questions: action.payload,
      };
    case QUESTION_ACTIONS_TYPE.SET_SELECTED_QUESTION: {
      return {
        ...prevState,
        selectedQuestion: action.payload,
      };
    }
    case QUESTION_ACTIONS_TYPE.SET_SELECTED_TAB: {
      return {
        ...prevState,
        tabData: action.payload,
      };
    }
    default:
      return prevState;
  }
};

export default questionReducer;
