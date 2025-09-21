import { t } from "i18next";
import useDocumentTitle from "@/hooks/useDocumentTitle";
import AssessmentSettingContainer from "@/components/dashboard/settings-tab/AssessmentSettingContainer";

const AssessmentSettingScreen = () => {
  useDocumentTitle(`${t("common.settings")}`);

  return <AssessmentSettingContainer />;
};

export default AssessmentSettingScreen;
