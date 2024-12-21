import { t } from "i18next";
import useDocumentTitle from "@utils/useDocumentTitle";
import DashbordContainer from "@components/dashboard/dashbordContainer";

const AssessmentDashboardScreen = () => {
    useDocumentTitle(`${t("document", { title: "" })}`);

    return <DashbordContainer />;
};

export default AssessmentDashboardScreen;
