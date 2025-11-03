import useDocumentTitle from "@/hooks/useDocumentTitle";
import { useQuestionContext } from "../context";
import { Box } from "@mui/material";

const QuestionScreen = () => {
  useDocumentTitle();
  const { selectedQuestion } = useQuestionContext();

  return <Box maxWidth="100%">{selectedQuestion?.title}</Box>;
};

export default QuestionScreen;
