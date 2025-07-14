import { Box, Grid, Skeleton } from "@mui/material";

const LoadingAssessmentCards = () => {
  return (
    <Grid container spacing={3}>
      {[...Array(8)].map((_, i) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={i}>
          <Box
            sx={{
              borderRadius: 2,
              padding: 2,
              boxShadow: 1,
              display: "flex",
              flexDirection: "column",
              gap: 1.5,
              minHeight: "250px",
            }}
          >
            <Skeleton variant="text" width="40%" height={24} />
            <Skeleton variant="text" width="60%" height={28} />
            <Skeleton
              variant="circular"
              width={100}
              height={100}
              sx={{ mx: "auto", my: 1 }}
            />
            <Skeleton
              variant="text"
              width="80%"
              height={22}
              sx={{ mx: "auto" }}
            />
            <Skeleton variant="rectangular" width="100%" height={36} />
            <Skeleton variant="rectangular" width="100%" height={36} />
          </Box>
        </Grid>
      ))}
    </Grid>
  );
};

export default LoadingAssessmentCards;
