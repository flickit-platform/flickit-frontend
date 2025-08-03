import { LANG_ACTION_TYPES } from "./actions";

export interface LangState {
  lang: string;
}

export const initialLangState: LangState = {
  lang: localStorage.getItem("lang") || "fa",
};

export function langReducer(
  state: LangState,
  action: LANG_ACTION_TYPES,
): LangState {
  if (action.type === "SET_LANG") {
    return { ...state, lang: action.payload };
  } else {
    return state;
  }
}
