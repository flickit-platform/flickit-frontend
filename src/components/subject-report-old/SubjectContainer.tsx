import { useEffect } from "react";
import Box from "@mui/material/Box";
import { useParams } from "react-router-dom";
import GettingThingsReadyLoading from "@common/loadings/GettingThingsReadyLoading";
import { styles } from "@styles";
import { useServiceContext } from "@providers/ServiceProvider";
import { useQuery } from "@utils/useQuery";
import { SubjectAttributeList } from "./SubjectAttributeList";
import SubjectOverallInsight from "./SubjectOverallInsight";
import QueryBatchData from "@common/QueryBatchData";

const SubjectContainer = (props: any) => {
  const { id } = props;
  const { loading, loaded, hasError, subjectProgressQueryData } = useSubject({
    id,
  });
  return (
    <QueryBatchData
      queryBatchData={[subjectProgressQueryData]}
      error={hasError}
      loading={loading}
      loaded={loaded}
      render={([subjectProgress = {}]) => {
        const { answerCount, questionCount } = subjectProgress;
        const progress = ((answerCount || 0) / (questionCount || 1)) * 100;

        return (
          <Box>
            {loading ? (
              <Box sx={{ ...styles.centerVH }} py={6} mt={5}>
                <GettingThingsReadyLoading color="gray" />
              </Box>
            ) : (
              <Box>
                <SubjectOverallInsight
                  {...props}
                  defaultInsight={props.insight}
                  subjectId={id}
                  loading={loading}
                />
                <SubjectAttributeList
                  {...props}
                  loading={loading}
                  progress={progress}
                />
              </Box>
            )}
          </Box>
        );
      }}
    />
  );
};

export const useSubject = (props: any) => {
  const { id } = props;
  const { service } = useServiceContext();
  const { assessmentId = "" } = useParams();

  const subjectProgressQueryData = useQuery<any>({
    service: (args, config) =>
      service.fetchSubjectProgress({ assessmentId, subjectId: id }, config),
    runOnMount: false,
  });

  const getSubjectQueryData = async () => {
    try {
      await subjectProgressQueryData.query({ assessmentId, subjectId: id });
    } catch (e) {}
  };

  useEffect(() => {
    getSubjectQueryData();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const hasError = subjectProgressQueryData.error;

  const loading = subjectProgressQueryData.loading;
  const loaded = subjectProgressQueryData.loaded;

  return {
    loading,
    loaded,
    hasError,
    subjectProgressQueryData,
  };
};

export default SubjectContainer;
