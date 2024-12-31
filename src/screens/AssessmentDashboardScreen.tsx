import { t } from "i18next";
import useDocumentTitle from "@utils/useDocumentTitle";
import DashboardTab from "@/components/dashboard/dashboard-tab/dashboardTab";

const AssessmentDashboardScreen = () => {
    useDocumentTitle(`${t("document", { title: "" })}`);

    return <DashboardTab />;
};

export default AssessmentDashboardScreen;
