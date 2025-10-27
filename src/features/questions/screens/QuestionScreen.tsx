import { QuestionContainer } from "@/components/questions/QuestionContainer";
import useDocumentTitle from "@/hooks/useDocumentTitle";
import { useQuestionContext } from "../context";

const QuestionScreen = () => {
  useDocumentTitle();
  const { selectedQuestion } = useQuestionContext();
  return <>{selectedQuestion?.title}</>;
};

export default QuestionScreen;
