import useDocumentTitle from "@/hooks/useDocumentTitle";
import { Box } from "@mui/material";
import { useAssessmentMode } from "@/hooks/useAssessmentMode";
import FooterTabs from "@/features/questions/ui/footer/Tabs";
import Body from "../ui/Body";

const QuestionScreen = () => {
  useDocumentTitle();

  const { isAdvanced } = useAssessmentMode();

  return (
    <Box width="100%" display="flex" flexDirection="column" gap={3}>
      <Body />
      {isAdvanced && <FooterTabs />}
    </Box>
  );
};

export default QuestionScreen;
