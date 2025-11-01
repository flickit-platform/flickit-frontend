import { useQuestions } from "../model/useQuestion";
import LoadingSkeletonOfQuestions from "@/components/common/loadings/LoadingSkeletonOfQuestions";
import { Box } from "@mui/material";
import QueryData from "@/components/common/QueryData";
import Sidebar from "./Sidebar";
import { useQuestionContext } from "../context";
import useScreenResize from "@/hooks/useScreenResize";

const Layout = ({ children }: any) => {
  const { questionsResultQueryData } = useQuestions();
  const { questions } = useQuestionContext();
  const isSmallScreen = useScreenResize("md");

  return (
    <QueryData
      {...questionsResultQueryData}
      renderLoading={() => <LoadingSkeletonOfQuestions />}
      render={() => {
        return (
          <Box display="flex">
            {!isSmallScreen && <Sidebar questions={questions} />}
            <Box>{children}</Box>{" "}
          </Box>
        );
      }}
    />
  );
};
export default Layout;
