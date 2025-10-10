import useDocumentTitle from "@/hooks/useDocumentTitle";
import AssessmentKitDetail from "@/features/kit-detail/ui/KitDetailContainer";

const AssessmentKitDetailViewScreen = () => {
  useDocumentTitle();
  return <AssessmentKitDetail />;
};

export default AssessmentKitDetailViewScreen;
