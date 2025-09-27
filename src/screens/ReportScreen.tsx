import { t } from "i18next";
import useDocumentTitle from "@/hooks/useDocumentTitle";
import ReportTab from "@/components/dashboard/report-tab/MetadataContainer";

const ReportScreen = () => {
    useDocumentTitle(`${t("assessmentReport.report")}`);

    return <ReportTab />;
};

export default ReportScreen;