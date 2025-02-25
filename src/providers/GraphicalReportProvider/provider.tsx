import { createContext, useReducer, useContext } from "react";
import { assessmentReducer } from "./reducer";

const AssessmentContext = createContext<any>(null);

export const AssessmentProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(assessmentReducer, {
    pathInfo: null,
    graphicalReport: null,
    graphicalReportUsers: null,
    loading: false,
    error: null,
  });

  return (
    <AssessmentContext.Provider value={{ state, dispatch }}>
      {children}
    </AssessmentContext.Provider>
  );
};

export const useAssessmentContext = () => {
  return useContext(AssessmentContext);
};
