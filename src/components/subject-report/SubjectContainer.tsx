import Box from "@mui/material/Box";
import { SubjectAttributeList } from "./SubjectAttributeList";
import SubjectOverallInsight from "./SubjectOverallInsight";

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
