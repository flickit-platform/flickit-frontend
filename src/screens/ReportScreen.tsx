import { t } from "i18next";
import useDocumentTitle from "@utils/useDocumentTitle";
import ReportTab from "@components/dashboard/report-tab/reportTab";

const ReportScreen = () => {
    useDocumentTitle(`${t("assessmentReport.report")}`);

    return <ReportTab />;
};

export default ReportScreen;