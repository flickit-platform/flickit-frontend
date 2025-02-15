export const actionTypes = {
  FETCH_PATH_INFO: "FETCH_PATH_INFO",
  FETCH_GRAPHICAL_REPORT: "FETCH_GRAPHICAL_REPORT",
  FETCH_GRAPHICAL_REPORT_USERS: "FETCH_GRAPHICAL_REPORT_USERS",
  SET_LOADING: "SET_LOADING",
  SET_ERROR: "SET_ERROR",
};

export const fetchPathInfo = (data: any) => ({
  type: actionTypes.FETCH_PATH_INFO,
  payload: data,
});

export const fetchGraphicalReport = (data: any) => ({
  type: actionTypes.FETCH_GRAPHICAL_REPORT,
  payload: data,
});

export const fetchGraphicalReportUsers = (data: any) => ({
  type: actionTypes.FETCH_GRAPHICAL_REPORT_USERS,
  payload: data,
});

export const setLoading = (loading: boolean) => ({
  type: actionTypes.SET_LOADING,
  payload: loading,
});

export const setError = (error: any) => ({
  type: actionTypes.SET_ERROR,
  payload: error,
});
