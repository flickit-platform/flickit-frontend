import { t } from "i18next";
import useDocumentTitle from "@utils/useDocumentTitle";
import AssessmentSettingContainer from "@components/dashboard/settings_Tab/AssessmentSettingContainer";

const AssessmentSettingScreen = () => {
  useDocumentTitle(`${t("accessManagement")}`);

  return <AssessmentSettingContainer />;
};

export default AssessmentSettingScreen;
