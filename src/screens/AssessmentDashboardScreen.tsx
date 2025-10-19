import { t } from "i18next";
import useDocumentTitle from "@/hooks/useDocumentTitle";
import DashboardTab from "@/components/dashboard/dashboard-tab/DashboardContainer";

const AssessmentDashboardScreen = () => {
    useDocumentTitle(t("dashboard.dashboard") as string);

    return <DashboardTab />;
};

export default AssessmentDashboardScreen;
