import { useQuestions } from "../model/useQuestion";
import LoadingSkeletonOfQuestions from "@/components/common/loadings/LoadingSkeletonOfQuestions";
import { Box } from "@mui/material";
import QueryData from "@/components/common/QueryData";
import Sidebar from "./sidebar/Sidebar";
import { useQuestionContext } from "../context";
import useScreenResize from "@/hooks/useScreenResize";

const Layout = ({ children }: any) => {
  const { questionsQuery } = useQuestions();
  const { questions } = useQuestionContext();
  const isSmallScreen = useScreenResize("md");

  return (
    <QueryData
      {...questionsQuery}
      renderLoading={() => <LoadingSkeletonOfQuestions />}
      render={() => {
        return (
          <Box display="flex"  width="100%" gap={3}>
            {!isSmallScreen && <Sidebar questions={questions} />}
            <Box width="100%">{children}</Box>{" "}
          </Box>
        );
      }}
    />
  );
};
export default Layout;
