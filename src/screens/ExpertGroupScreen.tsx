import { t } from "i18next";
import ExpertGroupContainer from "@components/expert-groups/ExpertGroupContainer";
import { useAuthContext } from "@/providers/auth-provider";
import getUserName from "@/utils/get-username";
import useDocumentTitle from "@/hooks/useDocumentTitle";

const ExpertGroupScreen = () => {
  const { userInfo } = useAuthContext();
  useDocumentTitle(`${t("expertGroups.expertGroup")}: ${getUserName(userInfo)}`);

  return <ExpertGroupContainer />;
};

export default ExpertGroupScreen;
