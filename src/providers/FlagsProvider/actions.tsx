export const SET_SHOW_BUTTON = "SET_SHOW_BUTTON";

interface SetShowButtonAction {
  type: typeof SET_SHOW_BUTTON;
  payload: boolean;
}

export type FlagsAction = SetShowButtonAction;
