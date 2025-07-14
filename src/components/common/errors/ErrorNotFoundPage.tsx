import Box from "@mui/material/Box";
import PageNotFoundImage from "@assets/svg/404.svg";
import { styles } from "@styles";
import Navbar from "@common/Navbar";
import Button from "@mui/material/Button";
import { Trans } from "react-i18next";

const ErrorNotFoundPage = () => {
  return (
    <>
      <Navbar />
      <Box
        sx={{ ...styles.centerCVH }}
        textAlign="center"
        height="calc(100vh - 264px)"
      >
        <Box
          sx={{ width: { xs: "100vw", sm: "80vw", md: "60vw", lg: "50vw" } }}
        >
          <img src={PageNotFoundImage} alt={"page not found"} width="100%" />
        </Box>
        <Button
          variant="contained"
          size="large"
          onClick={() => {
            window.location.href = "/spaces";
          }}
        >
          <Trans i18nKey="common.backToHome" />
        </Button>
      </Box>
    </>
  );
};

export default ErrorNotFoundPage;
