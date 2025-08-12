import Skeleton from "@mui/material/Skeleton";
import Box from "@mui/material/Box";
import { styles } from "@styles";

const MaturityLevelCardSkeleton = () => {
  return (
    <Box
      p={2}
      mb={2}
      bgcolor="gray.100"
      borderRadius="8px"
      border="0.3px solid #73808c30"
      sx={{ ...styles.centerV }}
    >
      <Box mr={2} minWidth={50} sx={{ ...styles.centerCH }}>
        <Skeleton variant="text" width={20} height={20} />
        <Skeleton variant="circular" width={24} height={24} sx={{ mt: 1 }} />
      </Box>

      <Box sx={{ flexGrow: 1 }}>
        <Skeleton variant="text" width="50%" height={28} sx={{ mb: 1 }} />
        <Skeleton variant="text" width="80%" height={20} />
      </Box>

      <Box sx={{ display: "flex", ml: "auto" }}>
        <Skeleton variant="circular" width={24} height={24} sx={{ mx: 0.5 }} />
        <Skeleton variant="circular" width={24} height={24} sx={{ mx: 0.5 }} />
      </Box>
    </Box>
  );
};

export const LoadingSkeletonKitCard = () => {
  return (
    <Box>
      <MaturityLevelCardSkeleton />
      <MaturityLevelCardSkeleton />
      <MaturityLevelCardSkeleton />
      <MaturityLevelCardSkeleton />
    </Box>
  );
};
