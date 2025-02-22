export const ActionTypes = {
  SET_APP_TITLE: "SET_APP_TITLE",
  SET_APP_LOGO_URL: "SET_APP_LOGO_URL",
  App_Languages: "App_Languages"
};
export const appLang = ([]) => ({
  type: ActionTypes.App_Languages,
  payload: []
});
export const setAppTitle = (title: string) => ({
  type: ActionTypes.SET_APP_TITLE,
  payload: title,
});

export const setAppLogoUrl = (url: string) => ({
  type: ActionTypes.SET_APP_LOGO_URL,
  payload: url,
});
