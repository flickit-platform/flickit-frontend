import { useReducer, FC, useContext, createContext, ReactElement } from "react";
import questionReducer from "./reducer";

interface IQuestionsProviderProps {
  children?: ReactElement | ReactElement[];
}

export interface IQuestionsContext {
  questions: any;
  confidenceLevels: any[];
  selectedQuestion: any;
  questionItems: any;
  filteredQuestions: any;
  evidences: any[];
  comments: any[];
  answerHistory: any[];
  selectedConfidence: number;
}

export const QuestionsContext = createContext<IQuestionsContext>({
  questions: [],
  confidenceLevels: [],
  selectedQuestion: null,
  questionItems: [],
  filteredQuestions: null,
  evidences: [],
  comments: [],
  answerHistory: [],
  selectedConfidence: 0,
});

const QuestionsDispatchContext = createContext<any>({
  dispatch: () => {},
});

export const Provider: FC<IQuestionsProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(questionReducer, {
    questions: [],
    confidenceLevels: [],
    selectedQuestion: null,
    questionItems: [],
    filteredQuestions: null,
    evidences: [],
    comments: [],
    answerHistory: [],
    selectedConfidence: 0,
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
