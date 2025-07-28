import Grid from "@mui/material/Grid";
import { LoadingSkeleton } from "./LoadingSkeleton";

const LoadingSkeletonOfQuestionnaires = () => {
  return (
    <Grid container spacing={2} mt={2}>
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map((item) => {
        return (
          <Grid item xl={4} md={4} sm={12} xs={12} key={item}>
            <LoadingSkeleton height="120px" />
          </Grid>
        );
      })}
    </Grid>
  );
};

export default LoadingSkeletonOfQuestionnaires;
