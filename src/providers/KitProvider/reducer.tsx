import { ILanguage } from "@/types";
import { KitLanguageActionType } from "./actions";

export interface KitLanguageState {
  mainLanguage: ILanguage | null;
  translatedLanguage: ILanguage | null;
}

export const initialKitLanguageState: KitLanguageState = {
  mainLanguage: null,
  translatedLanguage: null,
};

export const kitLanguageReducer = (
  state: KitLanguageState,
  action: { type: KitLanguageActionType; payload: ILanguage }
): KitLanguageState => {
  switch (action.type) {
    case KitLanguageActionType.SET_MAIN_LANGUAGE:
      return { ...state, mainLanguage: action.payload };

    case KitLanguageActionType.SET_TRANSLATED_LANGUAGE:
      return { ...state, translatedLanguage: action.payload };

    default:
      return state;
  }
};
