import {
  useReducer,
  FC,
  useContext,
  Dispatch,
  createContext,
  useMemo, useEffect
} from "react";
import assessmentReducer from "./reducer";
import { IAssessmentInfo } from "@/types";
import { useServiceContext } from "@providers/ServiceProvider";
import { ASSESSMENT_ACTIONS_TYPE } from "./actions";
import { t } from "i18next";

interface IAssessmentProviderProps {
  children?: JSX.Element | JSX.Element[];
}

export interface IAssessmentContext {
  permissions: any;
  assessmentInfo?: IAssessmentInfo;
  pendingKitData: { id?: string; title?: string; display?: boolean };
  dispatch: Dispatch<any>;
  targetSpace: any[];
  topSpace: any[];
}

export const AssessmentContext = createContext<IAssessmentContext>({
  permissions: {},
  assessmentInfo: undefined,
  pendingKitData: {},
  targetSpace: [],
  topSpace: [],
  dispatch: () => {},
});

const AssessmentDispatchContext = createContext<Dispatch<any>>(() => {});

export const AssessmentProvider: FC<IAssessmentProviderProps> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(assessmentReducer, {
    permissions: {},
    assessmentInfo: {},
  });
  const { service } = useServiceContext();
  useEffect(() => {
      service?.space?.getTopSpaces(undefined).then(res =>{
        const updated = res.data.items.map((item: any) =>
          item.isDefault ? { ...item, title: t("assessment.myAssessments") } : item
        );
        dispatch({
          type: ASSESSMENT_ACTIONS_TYPE.TOP_SPACE,
          payload: updated
        })
      })
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
