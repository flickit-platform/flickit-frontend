import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Skeleton from "@mui/material/Skeleton";

const LoadingAssessmentKit = () => {
  return (
    <Box
      sx={{
        py: 4,
        px: { xxl: 30, xl: 20, lg: 12, xs: 2, sm: 3 },
      }}
    >
      <Skeleton height={40} width="50%" sx={{ mb: 2 }} />
      <Skeleton height={80} width="80%" sx={{ mb: 2 }} />
      <Skeleton height={60} width="50%" sx={{ mb: 2 }} />

      <Grid container spacing={2}>
        <Grid size={{xs: 12, md: 9}}>
          <Skeleton
            variant="rectangular"
            height={180}
            sx={{ borderRadius: 2 }}
          />
        </Grid>
        <Grid size={{xs: 12, md: 3}}>
          <Skeleton
            variant="rectangular"
            height={180}
            sx={{ borderRadius: 2 }}
          />
        </Grid>
        <Grid size={{xs: 12}}>
          <Skeleton
            variant="rectangular"
            height={400}
            sx={{ borderRadius: 2 }}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default LoadingAssessmentKit;
