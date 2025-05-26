import { t } from "i18next";
import useDocumentTitle from "@utils/useDocumentTitle";
import AssessmentHtmlContainer from "@/components/assessment-html/AssessmentHtmlContainer";

const AssessmentDocumentScreen = () => {
  useDocumentTitle(`${t("assessmentReport", { title: "" })}`);

  return <AssessmentHtmlContainer />;
};

export default AssessmentDocumentScreen;
