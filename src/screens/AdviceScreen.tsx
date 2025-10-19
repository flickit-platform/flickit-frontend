import { t } from "i18next";
import useDocumentTitle from "@/hooks/useDocumentTitle";
import AssessmentAdviceContainer from "@/components/dashboard/advice-tab/AdviceContainer";

const AdvicesScreen = () => {
    useDocumentTitle(`${t("advice.advices")}`);

     return <AssessmentAdviceContainer />;
};

export default AdvicesScreen;