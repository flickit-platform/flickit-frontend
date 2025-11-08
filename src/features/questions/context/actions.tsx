export enum QUESTION_ACTIONS_TYPE {
  SET_QUESTIONS = "SET_QUESTIONS",
  SET_SELECTED_QUESTION = "SET_SELECTED_QUESTION",
  SET_SELECTED_Tab = "SET_SELECTED_Tab",
  SET_EDITING = "SET_EDITING",
  SET_DELETE_ITEM = "SET_DELETE_ITEM",
}

export const setQuestions = function (payload: any) {
  return { payload, type: QUESTION_ACTIONS_TYPE.SET_QUESTIONS };

};
export const setTab = function (payload: any) {
  return { payload, type: QUESTION_ACTIONS_TYPE.SET_SELECTED_Tab };
};

export const setEditingMode = function (payload: any) {
  return { payload, type: QUESTION_ACTIONS_TYPE.SET_EDITING };
};
export const setDelete = function (payload: any) {
  return { payload, type: QUESTION_ACTIONS_TYPE.SET_DELETE_ITEM };
};

export const setSelectedQuestion = (payload: any) => ({
  type: QUESTION_ACTIONS_TYPE.SET_SELECTED_QUESTION as const,
  payload,
});

export const questionActions = {
  setQuestions,
  setSelectedQuestion,
  setTab,
  setEditingMode,
  setDelete
};
export type TQuestionActions = typeof questionActions;
