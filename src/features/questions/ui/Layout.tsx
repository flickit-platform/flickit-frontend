import { useQuestions } from "../model/question/useQuestion";
import LoadingSkeletonOfQuestions from "@/components/common/loadings/LoadingSkeletonOfQuestions";
import { Box } from "@mui/material";
import QueryData from "@/components/common/QueryData";
import Sidebar from "./sidebar/Sidebar";
import { useQuestionContext } from "../context";
import useScreenResize from "@/hooks/useScreenResize";
import PermissionControl from "@/components/common/PermissionControl";

const Layout = ({ children }: any) => {
  const { questionsQuery } = useQuestions();
  const { questions } = useQuestionContext();
  const isSmallScreen = useScreenResize("md");

  return (
    <PermissionControl error={[questionsQuery.errorObject]}>
      <QueryData
        {...questionsQuery}
        renderLoading={() => <LoadingSkeletonOfQuestions />}
        render={() => {
          return (
            <Box display="flex" width="100%" gap={3}>
              {!isSmallScreen && <Sidebar questions={questions} />}
              <Box width="100%">{children}</Box>{" "}
            </Box>
          );
        }}
      />
    </PermissionControl>
  );
};
export default Layout;
