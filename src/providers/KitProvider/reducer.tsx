import { ILanguage } from "@/types";
import { KitDesignerActionType } from "./actions";

export interface KitLDesignerState {
  mainLanguage: ILanguage | null;
  translatedLanguage: ILanguage | null;
  questions: any[];
}

export const initialKitLDesignerState: KitLDesignerState = {
  mainLanguage: null,
  translatedLanguage: null,
  questions: [],
};

export const kitLanguageReducer = (
  state: KitLDesignerState,
  action: { type: KitDesignerActionType; payload: any },
): KitLDesignerState => {
  switch (action.type) {
    case KitDesignerActionType.SET_MAIN_LANGUAGE:
      return { ...state, mainLanguage: action.payload };
    case KitDesignerActionType.SET_TRANSLATED_LANGUAGE:
      return { ...state, translatedLanguage: action.payload };
    case KitDesignerActionType.SET_QUESTIONS:
      return { ...state, questions: action.payload };

    default:
      return state;
  }
};
