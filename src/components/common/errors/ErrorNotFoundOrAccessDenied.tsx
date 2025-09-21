import Box from "@mui/material/Box";
import { styles } from "@styles";
import AccessDeniedImage from "@/assets/svg/404-access-denied.svg";
import Button from "@mui/material/Button";
import { Trans } from "react-i18next";
import { HOME_URL } from "@/config/constants";

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
          src={AccessDeniedImage}
          alt={"not found or access denied"}
          width="100%"
        />
      </Box>
      <Button
        variant="contained"
        size="large"
        onClick={() => {
          window.location.href = HOME_URL;
        }}
      >
        <Trans i18nKey="common.backToHome" />
      </Button>
    </Box>
  );
};
