import { t } from "i18next";
import AssessmentReportContainer from "@/components/dashboard/dashboard-tab/assessment-report/AssessmentReportContainer";
import useDocumentTitle from "@utils/useDocumentTitle";
import AssessmentReport from "@/components/assesssment-report/AssessmentReport";

const AssessmentReportScreen = () => {
  useDocumentTitle(`${t("common.overallInsights")}`);

  return <AssessmentReport />;
};

export default AssessmentReportScreen;
