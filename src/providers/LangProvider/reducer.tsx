import { LANG_ACTION_TYPES } from "./actions";

export interface LangState {
  lang: string;
}

export const initialLangState: LangState = {
  lang: localStorage.getItem("lang") || "fa",
};

export function langReducer(state: LangState, action: LANG_ACTION_TYPES): LangState {
  switch (action.type) {
    case "SET_LANG":
      return { ...state, lang: action.payload };
    default:
      return state;
  }
}
