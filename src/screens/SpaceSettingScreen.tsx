import { t } from "i18next";
import SpaceSettingContainer from "@components/spaces/SpaceSettingContainer";
import useDocumentTitle from "@/hooks/useDocumentTitle";

const SpaceSettingScreen = () => {
  useDocumentTitle(t("spaces.spaceSetting") as string);

  return <SpaceSettingContainer />;
};

export default SpaceSettingScreen;
