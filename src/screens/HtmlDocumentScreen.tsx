import { t } from "i18next";
import useDocumentTitle from "@/hooks/useDocumentTitle";
import AssessmentReport from "../features/assessment-report/ui/AssessmentReportPage";

const AssessmentReportScreen = () => {
  useDocumentTitle(`${t("assessmentReport.assessmentReport", { title: "" })}`);

  return <AssessmentReport />;
};

export default AssessmentReportScreen;
