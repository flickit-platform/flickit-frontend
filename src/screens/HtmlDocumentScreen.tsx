import { t } from "i18next";
import useDocumentTitle from "@utils/useDocumentTitle";
import AssessmentReport from "@components/assesssment-report/AssessmentReport";

const AssessmentDocumentScreen = () => {
  useDocumentTitle(`${t("assessmentReport.assessmentReport", { title: "" })}`);

  return <AssessmentReport />;
};

export default AssessmentDocumentScreen;
