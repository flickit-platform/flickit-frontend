import { Box, Skeleton } from "@mui/material";

const ReviewScreenSkeleton = () => {
  return (
    <Box
      width="100%"
      display="flex"
      justifyContent="center"
      flexDirection="column"
    >
      <Box
        bgcolor="background.background"
        borderRadius="12px"
        boxShadow="0 0 0 1px rgba(0,0,0,0.04), 0 8px 8px -8px rgba(0,0,0,0.16)"
        width="100%"
        maxWidth="960px"
        display="flex"
        flexDirection="column"
        alignItems="center"
        gap={3}
        px={3}
        py={2}
      >
        {/* جای عکس وضعیت */}
        <Box flexShrink={0} sx={{ mt: 1 }}>
          <Skeleton
            variant="rectangular"
            width={220}
            height={160}
            sx={{ borderRadius: 2 }}
          />
        </Box>

        <Box flex={1} width="100%">
          <Skeleton variant="text" width="70%" height={32} sx={{ mb: 1.5 }} />
          <Skeleton variant="text" width="90%" height={28} sx={{ mb: 1.5 }} />
          <Skeleton variant="text" width="60%" height={24} />
        </Box>
      </Box>
    </Box>
  );
};

export default ReviewScreenSkeleton;
