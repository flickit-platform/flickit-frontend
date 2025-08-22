import { t } from "i18next";
import useDocumentTitle from "@utils/useDocumentTitle";
import AssessmentReport from "@components/assesssment-report/AssessmentReport";

const AssessmentReportScreen = () => {
  useDocumentTitle(`${t("assessmentReport.assessmentReport", { title: "" })}`);

  return <AssessmentReport />;
};

export default AssessmentReportScreen;
