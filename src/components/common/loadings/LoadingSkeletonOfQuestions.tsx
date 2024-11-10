import { theme } from "@/config/theme";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import { styles } from "@styles";

const LoadingSkeletonOfQuestions = () => {
  return (
    <Box py={3}>
      <Box
        sx={{ ...styles.centerV }}
        justifyContent={"space-between"}
        height="60px"
      >
        <Skeleton width="180px" height="100%" />
        <Box
          height="100%"
          alignItems={"center"}
          sx={{ display: { xs: "none", sm: "flex" } }}
        >
          <Skeleton
            width="110px"
            sx={{
              marginRight: theme.direction === "ltr" ? 1 : "unset",
              marginLeft: theme.direction === "rtl" ? 1 : "unset",
            }}
            height="80%"
          />
          <Skeleton width="80px" height="80%" />
        </Box>
      </Box>
      <Box>
        <Skeleton />
      </Box>
      <Box mt={3}>
        <Skeleton
          height="320px"
          variant="rectangular"
          sx={{ borderRadius: 2 }}
        />
      </Box>
    </Box>
  );
};

export default LoadingSkeletonOfQuestions;
