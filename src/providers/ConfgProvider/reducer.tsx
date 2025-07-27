import { ActionTypes } from "./actions";

export interface AppState {
  appTitle: string;
  appLogoUrl: string;
  languages: any[];
  isAuthenticated: boolean;
  SurveyBox: boolean
}

export const initialState: AppState = {
  appTitle: "",
  appLogoUrl: "",
  languages: [],
  isAuthenticated: false,
  SurveyBox: false
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
    case ActionTypes.App_Authenticated:
      return {
        ...state,
        isAuthenticated: action.payload,
      };
    case ActionTypes.SurveyBox_STATUS:
      return {
        ...state,
        SurveyBox: action.payload,
      };
    default:
      return state;
  }
};

export default reducer;
