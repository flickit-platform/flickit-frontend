import { t } from "i18next";
import AssessmentAdviceContainer from "@/components/dashboard/advice-tab/AdviceContainer";
import useDocumentTitle from "@/hooks/useDocumentTitle";

const AssessmentAdviceScreen = () => {
  useDocumentTitle(`${t("common.overallInsights")}`);

  return <AssessmentAdviceContainer />;
};

export default AssessmentAdviceScreen;
