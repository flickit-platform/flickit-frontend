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
      render={(data) => {
        return (
          <Box display="flex">
            {!isSmallScreen && <Sidebar questions={questions} />}
            <Box width="100%">{children}</Box>{" "}
          </Box>
        );
      }}
    />
  );
};
export default Layout;
