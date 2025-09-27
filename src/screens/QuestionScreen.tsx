import { QuestionContainer } from "@/components/questions/QuestionContainer";
import useDocumentTitle from "@/hooks/useDocumentTitle";

const QuestionScreen = () => {
  useDocumentTitle();
  return <QuestionContainer />;
};

export default QuestionScreen;
