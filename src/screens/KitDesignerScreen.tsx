import { t } from "i18next";
import useDocumentTitle from "@/hooks/useDocumentTitle";
import KitDesignerContainer from "@/components/kit-designer/KitDesignerContainer";

const KitDesignerScreen = () => {
  useDocumentTitle(t("kitDesigner.kitDesigner") as string);
  return <KitDesignerContainer />;
};

export default KitDesignerScreen;
