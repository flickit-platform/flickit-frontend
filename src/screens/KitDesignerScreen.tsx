import { t } from "i18next";
import useDocumentTitle from "@utils/useDocumentTitle";
import KitDesignerContainer from "@/components/kit-designer/KitDesignerContainer";
import { KitLanguageProvider } from "@/providers/KitProvider";

const KitDesignerScreen = () => {
  useDocumentTitle(t("kitDesigner") as string);
  return <KitDesignerContainer />;
};

export default KitDesignerScreen;
