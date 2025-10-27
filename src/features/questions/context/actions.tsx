export enum QUESTION_ACTIONS_TYPE {
  SET_QUESTIONS = "SET_QUESTIONS",
  SET_SELECTED_QUESTION = "SET_SELECTED_QUESTION",
}

export const setQuestions = function (payload: any) {
  return { payload, type: QUESTION_ACTIONS_TYPE.SET_QUESTIONS };
};

export const setSelectedQuestion = (payload: any) => ({
  type: QUESTION_ACTIONS_TYPE.SET_SELECTED_QUESTION as const,
  payload,
});

export const questionActions = {
  setQuestions,
  setSelectedQuestion,
};
export type TQuestionActions = typeof questionActions;
