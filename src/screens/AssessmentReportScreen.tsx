import { t } from "i18next";
import AssessmentReportContainer from "@/components/dashboard/dashboard-tab/assessment-report/AssessmentReportContainer";
import useDocumentTitle from "@/hooks/useDocumentTitle";

const AssessmentReportScreen = () => {
  useDocumentTitle(`${t("common.overallInsights")}`);

  return <AssessmentReportContainer />;
};

export default AssessmentReportScreen;
