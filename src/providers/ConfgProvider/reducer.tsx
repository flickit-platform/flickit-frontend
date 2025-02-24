import { ActionTypes } from "./actions";

export interface AppState {
  appTitle: string;
  appLogoUrl: string;
  languages: []
}

export const initialState: AppState = {
  appTitle: "",
  appLogoUrl: "",
  languages: []
};

const reducer = (state: AppState, action: any): AppState => {
  switch (action.type) {
    case ActionTypes.SET_APP_TITLE:
      return {
        ...state,
        appTitle: action.payload,
      };
    case ActionTypes.SET_APP_LOGO_URL:
      return {
        ...state,
        appLogoUrl: action.payload,
      };
    case ActionTypes.App_Languages:
      return {
        ...state,
        languages: action.payload,
      };
    default:
      return state;
  }
};

export default reducer;
