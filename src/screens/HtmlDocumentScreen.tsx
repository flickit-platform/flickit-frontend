import { t } from "i18next";
import useDocumentTitle from "@utils/useDocumentTitle";
import HtmltExportContainer from "@/components/assessment-html/AssessmentHtmlContainer";

const AssessmentDocumentScreen = () => {
  useDocumentTitle(`${t("assessmentReport", { title: "" })}`);

  return <HtmltExportContainer />;
};

export default AssessmentDocumentScreen;
