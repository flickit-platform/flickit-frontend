import { t } from "i18next";
import SpaceContainer from "@components/spaces/SpaceContainer";
import useDocumentTitle from "@/hooks/useDocumentTitle";

const SpacesScreen = () => {
  useDocumentTitle(t("spaces.spaces") as string);

  return <SpaceContainer />;
};

export default SpacesScreen;
