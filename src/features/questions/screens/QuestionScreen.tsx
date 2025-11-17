import useDocumentTitle from "@/hooks/useDocumentTitle";
import { Box, Tabs } from "@mui/material";
import { useAssessmentMode } from "@/hooks/useAssessmentMode";
import FooterTabs from "@/features/questions/ui/footer/Tabs";
import useDialog from "@/hooks/useDialog";
import ReportDialog from "@/features/questions/ui/ReportDialog";
import Body from "../ui/Body";

const QuestionScreen = () => {
  useDocumentTitle();

  const { isAdvanced } = useAssessmentMode();
  const dialogProps = useDialog();

  return (
    <Box width="100%" display="flex" flexDirection="column" gap={3}>
      <Body />
      {isAdvanced && <FooterTabs />}
      {dialogProps.open && <ReportDialog {...dialogProps} />}
    </Box>
  );
};

export default QuestionScreen;
