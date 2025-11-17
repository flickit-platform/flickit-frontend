export enum QUESTION_ACTIONS_TYPE {
  SET_QUESTIONS = "SET_QUESTIONS",
  SET_SELECTED_QUESTION = "SET_SELECTED_QUESTION",
  SET_FILTERED_QUESTIONS = "SET_FILTERED_QUESTIONS",
  SET_QUESTION_ITEMS = "SET_QUESTION_ITEMS",

  // Evidences
  SET_EVIDENCES = "SET_EVIDENCES",
  ADD_EVIDENCE = "ADD_EVIDENCE",
  UPDATE_EVIDENCE = "UPDATE_EVIDENCE",
  DELETE_EVIDENCE = "DELETE_EVIDENCE",

  // Comments
  SET_COMMENTS = "SET_COMMENTS",
  ADD_COMMENT = "ADD_COMMENT",
  UPDATE_COMMENT = "UPDATE_COMMENT",
  DELETE_COMMENT = "DELETE_COMMENT",

  // Answer history
  SET_ANSWER_HISTORY = "SET_ANSWER_HISTORY",
  ADD_ANSWER_HISTORY = "ADD_ANSWER_HISTORY",
}
export const setQuestions = function (payload: any[]) {
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

export const setEvidences = (payload: any[]) => ({
  type: QUESTION_ACTIONS_TYPE.SET_EVIDENCES as const,
  payload,
});

export const addEvidence = (payload: any) => ({
  type: QUESTION_ACTIONS_TYPE.ADD_EVIDENCE as const,
  payload,
});

export const deleteEvidence = (payload: any) => ({
  type: QUESTION_ACTIONS_TYPE.DELETE_EVIDENCE as const,
  payload,
});

export const updateEvidence = (payload: any) => ({
  type: QUESTION_ACTIONS_TYPE.UPDATE_EVIDENCE as const,
  payload,
});

export const setComments = (payload: any[]) => ({
  type: QUESTION_ACTIONS_TYPE.SET_COMMENTS as const,
  payload,
});

export const addComment = (payload: any) => ({
  type: QUESTION_ACTIONS_TYPE.ADD_COMMENT as const,
  payload,
});

export const deleteComment = (payload: any) => ({
  type: QUESTION_ACTIONS_TYPE.DELETE_COMMENT as const,
  payload,
});

export const updateComment = (payload: any) => ({
  type: QUESTION_ACTIONS_TYPE.UPDATE_COMMENT as const,
  payload,
});

export const setAnswerHistory = (payload: any[]) => ({
  type: QUESTION_ACTIONS_TYPE.SET_ANSWER_HISTORY as const,
  payload,
});

export const addAnswerHistory = (payload: any) => ({
  type: QUESTION_ACTIONS_TYPE.ADD_ANSWER_HISTORY as const,
  payload,
});

export const questionActions = {
  setQuestions,
  setFilteredQuestions,
  setSelectedQuestion,
  setQuestionItems,

  setEvidences,
  addEvidence,
  updateEvidence,
  deleteEvidence,

  setComments,
  addComment,
  updateComment,
  deleteComment,

  setAnswerHistory,
  addAnswerHistory,
};

export type TQuestionActions = typeof questionActions;
