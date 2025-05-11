import Box from "@mui/material/Box";
import { styles } from "@styles";
import ErrorNotFoundOrAccessDeniedImage from "@assets/svg/notFoundOrAccessDenied.svg";
import Button from "@mui/material/Button";
import { Trans } from "react-i18next";

export const ErrorNotFoundOrAccessDenied = () => {
  return (
    <Box
      sx={{ ...styles.centerCVH }}
      textAlign="center"
      height="calc(100vh - 200px)"
      pt="20px"
    >
      <Box sx={{ width: { xs: "100vw", md: "70vw", lg: "60vw" } }}>
        <img
          src={ErrorNotFoundOrAccessDeniedImage}
          alt={"not found or access denied"}
          width="100%"
        />
      </Box>
      <Button
        variant="contained"
        size="large"
        onClick={() => {
          window.location.href = "/spaces/1";
        }}
      >
        <Trans i18nKey="backToHome" />
      </Button>
    </Box>
  );
};
