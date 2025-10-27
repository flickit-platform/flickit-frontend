import { useReducer, FC, useContext, createContext, ReactElement } from "react";
import questionReducer from "./reducer";

interface IQuestionsProviderProps {
  children?: ReactElement | ReactElement[];
}

export interface IQuestionsContext {
  questions: any;
  selectedQuestion: any;
}

export const QuestionsContext = createContext<IQuestionsContext>({
  questions: [],
  selectedQuestion: null,
});

const QuestionsDispatchContext = createContext<any>({
  dispatch: () => {},
});

export const Provider: FC<IQuestionsProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(questionReducer, {
    questions: [],
    selectedQuestion: null,
  });

  return (
    <QuestionsContext.Provider value={state}>
      <QuestionsDispatchContext.Provider value={dispatch}>
        {children}
      </QuestionsDispatchContext.Provider>
    </QuestionsContext.Provider>
  );
};

export const useQuestionContext = () => {
  const context = useContext(QuestionsContext);
  if (context === undefined) {
    throw new Error(
      "useQuestionContext must be used within a QuestionProvider",
    );
  }
  return context;
};

export const useQuestionDispatch = () => {
  const context = useContext(QuestionsDispatchContext);
  if (context === undefined) {
    throw new Error(
      "useAdaptiveDispatch must be used within a AdaptiveProvider or WiseFormProvider",
    );
  }
  return context;
};
