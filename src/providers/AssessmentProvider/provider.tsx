import React, {
  useReducer,
  FC,
  useContext,
  Dispatch,
  createContext,
  useMemo,
} from "react";
import assessmentReducer from "./reducer";

interface IAssessmentProviderProps {
  children?: JSX.Element | JSX.Element[];
}

export interface IAssessmentContext {
  permissions: any;
  dispatch: Dispatch<any>;
}

export const AssessmentContext = createContext<IAssessmentContext>({
  permissions: {},
  dispatch: () => {},
});

const AssessmentDispatchContext = createContext<Dispatch<any>>(() => {});

export const AssessmentProvider: FC<IAssessmentProviderProps> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(assessmentReducer, {
    permissions: {},
  });

  const contextValue = useMemo(
    () => ({ ...state, dispatch }),
    [state, dispatch],
  );

  return (
    <AssessmentContext.Provider value={contextValue}>
      <AssessmentDispatchContext.Provider value={dispatch}>
        {children}
      </AssessmentDispatchContext.Provider>
    </AssessmentContext.Provider>
  );
};

export const useAssessmentContext = () => {
  const context = useContext(AssessmentContext);
  if (context === undefined) {
    throw new Error(
      "useAssessmentContext must be used within an AssessmentProvider",
    );
  }
  return context;
};

export const useAssessmentDispatch = () => {
  const context = useContext(AssessmentDispatchContext);
  if (context === undefined) {
    throw new Error(
      "useAssessmentDispatch must be used within an AssessmentProvider",
    );
  }
  return context;
};
