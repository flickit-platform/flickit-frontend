import Grid from "@mui/material/Grid";
import { LoadingSkeleton } from "./LoadingSkeleton";

const LoadingSkeletonOfQuestionnaires = () => {
  return (
    <Grid container spacing={2} mt={2}>
      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((item) => {
        return (
          <Grid size={{ xs: 12, sm: 12, md: 4, xl: 4 }} key={item}>
            <LoadingSkeleton
              height="168px"
              color="white"
              sx={{ bgcolor: "info.main" }}
            />
          </Grid>
        );
      })}
    </Grid>
  );
};

export default LoadingSkeletonOfQuestionnaires;
