import { t } from "i18next";
import useDocumentTitle from "@utils/useDocumentTitle";
import AssessmentSettingContainer from "@/components/dashboard/settings-tab/AssessmentSettingContainer";

const AssessmentSettingScreen = () => {
  useDocumentTitle(`${t("common.settings")}`);

  return <AssessmentSettingContainer />;
};

export default AssessmentSettingScreen;
