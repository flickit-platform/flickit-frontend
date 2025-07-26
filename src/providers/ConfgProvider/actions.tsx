export const ActionTypes = {
  SET_APP_TITLE: "SET_APP_TITLE",
  SET_APP_LOGO_URL: "SET_APP_LOGO_URL",
  App_Languages: "App_Languages",
  App_Authenticated: "App_Authenticated",
  SurveyBox_STATUS: "SurveyBox_STATUS",
};

export const setAppTitle = (title: string) => ({
  type: ActionTypes.SET_APP_TITLE,
  payload: title,
});

export const setAppLogoUrl = (url: string) => ({
  type: ActionTypes.SET_APP_LOGO_URL,
  payload: url,
});
export const setSurveyBox = (status: boolean) => ({
  type: ActionTypes.SurveyBox_STATUS,
  payload: status,
});
