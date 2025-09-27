import { t } from "i18next";
import { QuestionnaireContainer } from "@/components/dashboard/dashboard-tab/questionnaires/QuestionnaireContainer";
import useDocumentTitle from "@/hooks/useDocumentTitle";

const QuestionnairesScreen = () => {
  useDocumentTitle(t("common.questionnaires") as string);

  return <QuestionnaireContainer />;
};

export default QuestionnairesScreen;
