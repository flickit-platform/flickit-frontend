import { useQuestions } from "../model/useQuestion";
import LoadingSkeletonOfQuestions from "@/components/common/loadings/LoadingSkeletonOfQuestions";
import { Box } from "@mui/material";
import QueryData from "@/components/common/QueryData";
import Sidebar from "./Sidebar";
import { useQuestionContext } from "../context";

const Layout = ({ children }: any) => {
  const { questionsResultQueryData } = useQuestions();
  const { questions } = useQuestionContext();

  return (
    <QueryData
      {...questionsResultQueryData}
      renderLoading={() => <LoadingSkeletonOfQuestions />}
      render={(data) => {
        return (
          <Box display="flex">
            <Sidebar questions={questions} />
            <Box>{children}</Box>{" "}
          </Box>
        );
      }}
    />
  );
};
export default Layout;
