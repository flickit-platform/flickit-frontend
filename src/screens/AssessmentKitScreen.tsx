import { t } from "i18next";
import AssessmentKitContainer from "@/components/assessment-kit/AssessmentKitContainer";
import useDocumentTitle from "@utils/useDocumentTitle";

const AssessmentKitScreen = () => {
  useDocumentTitle(t("assessmentKit", { title: "" }) as string);
  return <AssessmentKitContainer />;
};

export default AssessmentKitScreen;
