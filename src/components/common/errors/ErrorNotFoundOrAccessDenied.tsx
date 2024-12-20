import Box from "@mui/material/Box";
import { styles } from "@styles";
import ErrorNotFoundOrAccessDeniedImage from "@assets/svg/notFoundOrAccessDenied.svg";

export const ErrorNotFoundOrAccessDenied = () => {
  return (
    <Box
      sx={{ ...styles.centerCVH }}
      textAlign="center"
      height="calc(100vh - 118px)"
      pt="74px"
    >
      <Box sx={{ width: { xs: "100vw", md: "70vw", lg: "60vw" } }}>
        <img
          src={ErrorNotFoundOrAccessDeniedImage}
          alt={"not found or access denied"}
          width="100%"
        />
      </Box>
    </Box>
  );
};
