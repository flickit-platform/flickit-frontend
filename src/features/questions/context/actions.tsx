export enum QUESTION_ACTIONS_TYPE {
  SET_QUESTIONS = "SET_QUESTIONS",
  SET_SELECTED_QUESTION = "SET_SELECTED_QUESTION",
  SET_SELECTED_Tab = "SET_SELECTED_Tab",
}

export const setQuestions = function (payload: any) {
  return { payload, type: QUESTION_ACTIONS_TYPE.SET_QUESTIONS };

};export const setTab = function (payload: any) {
  return { payload, type: QUESTION_ACTIONS_TYPE.SET_SELECTED_Tab };
};

export const setSelectedQuestion = (payload: any) => ({
  type: QUESTION_ACTIONS_TYPE.SET_SELECTED_QUESTION as const,
  payload,
});

export const questionActions = {
  setQuestions,
  setSelectedQuestion,
  setTab
};
export type TQuestionActions = typeof questionActions;
