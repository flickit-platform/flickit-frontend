import { actionTypes } from "./actions";

const initialState = {
  pathInfo: null,
  graphicalReport: null,
  graphicalReportUsers: null,
  loading: false,
  error: null,
};

export const assessmentReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case actionTypes.FETCH_PATH_INFO:
      return { ...state, pathInfo: action.payload };

    case actionTypes.FETCH_GRAPHICAL_REPORT:
      return { ...state, graphicalReport: action.payload };

    case actionTypes.FETCH_GRAPHICAL_REPORT_USERS:
      return { ...state, graphicalReportUsers: action.payload };

    case actionTypes.SET_LOADING:
      return { ...state, loading: action.payload };

    case actionTypes.SET_ERROR:
      return { ...state, error: action.payload };

    default:
      return state;
  }
};
