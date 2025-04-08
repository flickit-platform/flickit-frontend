import Box from "@mui/material/Box";
import ErrorEmptyData from "@common/errors/ErrorEmptyData";
import { AssessmentSubjectAccordion } from "./AssessmentSubjectCard";
import Grid from "@mui/material/Grid";
import { ISubjectInfo } from "@types";
interface IAssessmentSubjectListProps {
  subjects: ISubjectInfo[];
  colorCode: string;
  maturityLevelCount?: number;
  reloadQuery?: any;
  progress?: number;
}

export const AssessmentSubjectList = (props: IAssessmentSubjectListProps) => {
  const { subjects = [], maturityLevelCount, reloadQuery, progress } = props;
  const isEmpty = subjects.length === 0;

  return (
    <Box mt={2}>
      {isEmpty ? (
        <ErrorEmptyData />
      ) : (
        <Grid container spacing={4}>
          {subjects?.map((subject) => {
            return (
              <Grid item xs={12} sm={12} md={12} lg={12} key={subject?.id}>
                <AssessmentSubjectAccordion
                  {...subject}
                  maturityLevelCount={maturityLevelCount}
                  reloadQuery={reloadQuery}
                  progress={progress}
                />
              </Grid>
            );
          })}
        </Grid>
      )}
    </Box>
  );
};
