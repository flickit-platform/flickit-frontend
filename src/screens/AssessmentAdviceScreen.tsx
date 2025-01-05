import { t } from "i18next";
import AssessmentAdviceContainer from "@components/dashboard/advice-tab/AssessmentAdviceContainer";
import useDocumentTitle from "@utils/useDocumentTitle";

const AssessmentAdviceScreen = () => {
  useDocumentTitle(`${t("overallInsights")}`);

  return <AssessmentAdviceContainer />;
};

export default AssessmentAdviceScreen;
