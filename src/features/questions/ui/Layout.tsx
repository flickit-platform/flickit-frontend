import { useQuestions } from "../model/useQuestion";
import LoadingSkeletonOfQuestions from "@/components/common/loadings/LoadingSkeletonOfQuestions";
import { Box } from "@mui/material";
import QueryData from "@/components/common/QueryData";
import Sidebar from "./Sidebar";
import { useQuestionContext } from "../context";
import EvidenceContainer from "@/features/questions/ui/evidences/container";
import {styles} from "@styles";

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
              <Box sx={{...styles.centerCH, flex: 1}}>
                  <Box>{children}</Box>{" "}
                  <EvidenceContainer />
              </Box>
          </Box>
        );
      }}
    />
  );
};
export default Layout;
