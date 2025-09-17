export enum KitDesignerActionType {
  SET_MAIN_LANGUAGE = "SET_MAIN_LANGUAGE",
  SET_TRANSLATED_LANGUAGE = "SET_TRANSLATED_LANGUAGE",
  SET_QUESTIONS = "SET_QUESTIONS",
}

export const setMainLanguage = (language: any) => ({
  type: KitDesignerActionType.SET_MAIN_LANGUAGE,
  payload: language,
});

export const setTranslatedLanguage = (language: any) => ({
  type: KitDesignerActionType.SET_TRANSLATED_LANGUAGE,
  payload: language,
});

export const setQuestions = (questions: any) => ({
  type: KitDesignerActionType.SET_QUESTIONS,
  payload: questions,
});

export const kitActions = {
  setMainLanguage,
  setTranslatedLanguage,
  setQuestions
};
