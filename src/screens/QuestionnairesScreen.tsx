import { t } from "i18next";
import { QuestionnaireContainer } from "@/components/dashboard/dashboard-tab/questionnaires/QuestionnaireContainer";
import useDocumentTitle from "@utils/useDocumentTitle";

const QuestionnairesScreen = () => {
  useDocumentTitle(t("questionnaires") as string);

  return <QuestionnaireContainer />;
};

export default QuestionnairesScreen;
