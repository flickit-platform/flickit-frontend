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
  const { id, reloadQuery, progress } = props;

  return (
    <Box>
      <SubjectOverallInsight
        {...props}
        defaultInsight={props.insight}
        subjectId={id}
      />
      <SubjectAttributeList
        {...props}
        progress={progress}
        reloadQuery={reloadQuery}
      />
    </Box>
  );
};

export default SubjectContainer;
