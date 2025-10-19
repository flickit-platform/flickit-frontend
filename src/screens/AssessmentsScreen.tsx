import { t } from "i18next";
import AssessmentContainer from "@components/assessments/AssessmentContainer";
import useDocumentTitle from "@/hooks/useDocumentTitle";

const AssessmentsScreen = () => {
  useDocumentTitle(t("assessment.assessments") as string);
  return <AssessmentContainer />;
};

export default AssessmentsScreen;
