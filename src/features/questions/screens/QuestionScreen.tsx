import useDocumentTitle from "@/hooks/useDocumentTitle";
import { useQuestionContext } from "../context";
import {useAssessmentContext} from "@providers/assessment-provider";
import {useMemo} from "react";
import {ASSESSMENT_MODE} from "@utils/enum-type";
import FooterTabs from "@/features/questions/ui/footer/FooterTabs";

const QuestionScreen = () => {
  const { assessmentInfo } = useAssessmentContext();


  const isAdvanceMode = useMemo(() => {
    return ASSESSMENT_MODE.ADVANCED === assessmentInfo?.mode?.code;
  }, [assessmentInfo?.mode?.code]);


  useDocumentTitle();
  const { selectedQuestion } = useQuestionContext();
  return <>
    {selectedQuestion?.title}
    {isAdvanceMode && <FooterTabs />}
  </>;
};

export default QuestionScreen;
