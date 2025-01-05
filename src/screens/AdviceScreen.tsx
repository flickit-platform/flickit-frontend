import { t } from "i18next";
import useDocumentTitle from "@utils/useDocumentTitle";
import AdviceTab from "@components/dashboard/advice-tab/adviceTab";

const AdvicesScreen = () => {
    useDocumentTitle(`${t("advices")}`);

     return <AdviceTab />;
};

export default AdvicesScreen;