import useDocumentTitle from "@/hooks/useDocumentTitle";
import { useQuestionContext } from "../context";
import CreateForm from "../ui/CreateForm";
import { Box } from "@mui/material";

const QuestionScreen = () => {
  useDocumentTitle();
  const { selectedQuestion } = useQuestionContext();

  return (
    <Box maxWidth="100%">
      {selectedQuestion?.title}
      <CreateForm />
    </Box>
  );
};

export default QuestionScreen;
