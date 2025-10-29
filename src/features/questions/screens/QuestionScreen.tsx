import useDocumentTitle from "@/hooks/useDocumentTitle";
import { useQuestionContext } from "../context";
import {useAssessmentContext} from "@providers/assessment-provider";
import {useMemo} from "react";
import {ASSESSMENT_MODE} from "@utils/enum-type";
import EvidenceContainer from "@/features/questions/ui/evidences/container";

const QuestionScreen = ({questionsInfo}) => {
  const { assessmentInfo } = useAssessmentContext();


  const isAdvanceMode = useMemo(() => {
    return ASSESSMENT_MODE.ADVANCED === assessmentInfo?.mode?.code;
  }, [assessmentInfo?.mode?.code]);


  useDocumentTitle();
  const { selectedQuestion } = useQuestionContext();
  return <>
    {selectedQuestion?.title}
    {isAdvanceMode && <EvidenceContainer selectedQuestion={selectedQuestion} />}
  </>;
};

export default QuestionScreen;
