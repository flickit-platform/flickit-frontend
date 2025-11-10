export enum QUESTION_ACTIONS_TYPE {
  SET_QUESTIONS = "SET_QUESTIONS",
  SET_SELECTED_QUESTION = "SET_SELECTED_QUESTION",
  SET_FILTERED_QUESTIONS = "SET_FILTERED_QUESTIONS",
  SET_QUESTION_ITEMS = "SET_QUESTION_ITEMS",
  SET_EDITING_EVIDENCE = "SET_EDITING_EVIDENCE",
  SET_DELETE_EVIDENCE = "SET_DELETE_EVIDENCE",
}

export const setQuestions = function (payload: any) {
  return { payload, type: QUESTION_ACTIONS_TYPE.SET_QUESTIONS };
};
export const setQuestionItems = function (payload: any) {
  return { payload, type: QUESTION_ACTIONS_TYPE.SET_QUESTION_ITEMS };
};

export const setFilteredQuestions = function (payload: any) {
  return { payload, type: QUESTION_ACTIONS_TYPE.SET_FILTERED_QUESTIONS };
};

export const setSelectedQuestion = (payload: any) => ({
  type: QUESTION_ACTIONS_TYPE.SET_SELECTED_QUESTION as const,
  payload,
});

export const questionActions = {
  setQuestions,
  setFilteredQuestions,
  setSelectedQuestion,
  setQuestionItems,
};
export type TQuestionActions = typeof questionActions;
