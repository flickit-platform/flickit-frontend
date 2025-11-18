import useDocumentTitle from "@/hooks/useDocumentTitle";
import { Box } from "@mui/material";
import { useAssessmentMode } from "@/hooks/useAssessmentMode";
import Tabs from "@/features/questions/ui/footer/Tabs";
import Body from "../ui/question/Body";
import { useAssessmentContext } from "@/providers/assessment-provider";

const QuestionScreen = () => {
  useDocumentTitle();

  const { isAdvanced } = useAssessmentMode();
  const { permissions } = useAssessmentContext();

  return (
    <Box width="100%" display="flex" flexDirection="column" gap={3}>
      <Body permissions={permissions} />
      {isAdvanced && (
        <Tabs
          readonly={!permissions?.addEvidence}
          hideAnswerHistory={!permissions?.viewAnswerHistory}
        />
      )}
    </Box>
  );
};

export default QuestionScreen;
