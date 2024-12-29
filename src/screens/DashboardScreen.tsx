import { t } from "i18next";
import useDocumentTitle from "@utils/useDocumentTitle";
import DashbordContainer from "@components/dashboard/dashbordContainer";

const DashboardScreen = () => {
    useDocumentTitle(`${t("document", { title: "" })}`);

    return <DashbordContainer/>;
};

export default DashboardScreen;
