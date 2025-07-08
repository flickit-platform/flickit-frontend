import { t } from "i18next";
import useDocumentTitle from "@utils/useDocumentTitle";
import AssessmentAdviceContainer from "@/components/dashboard/advice-tab/AssessmentAdviceContainer";

const AdvicesScreen = () => {
    useDocumentTitle(`${t("advice.advices")}`);

     return <AssessmentAdviceContainer />;
};

export default AdvicesScreen;