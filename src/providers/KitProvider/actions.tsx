export enum KitLanguageActionType {
  SET_MAIN_LANGUAGE = "SET_MAIN_LANGUAGE",
  SET_TRANSLATED_LANGUAGE = "SET_TRANSLATED_LANGUAGE",
}

export const setMainLanguage = (language: any) => ({
  type: KitLanguageActionType.SET_MAIN_LANGUAGE,
  payload: language,
});

export const setTranslatedLanguage = (language: any) => ({
  type: KitLanguageActionType.SET_TRANSLATED_LANGUAGE,
  payload: language,
});

export const kitActions = {
  setMainLanguage,
  setTranslatedLanguage,
};
