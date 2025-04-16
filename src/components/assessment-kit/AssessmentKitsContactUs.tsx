import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FaContactUs from "@/assets/svg/fa-contactus.svg";
import EnContactUs from "@/assets/svg/en-contactus.svg";
import useDialog from "@/utils/useDialog";
import ContactUsDialog from "./ContactUsDialog";
import i18next, { t } from "i18next";
import { useMediaQuery } from "@mui/material";

const AssessmentKitsContactUs = () => {
  const dialogProps = useDialog();
  const isMobileScreen = useMediaQuery((theme: any) =>
    theme.breakpoints.down(960),
  );

  return (
    <Box
      mt={10}
      sx={{
        position: "relative",
        width: "100%",
      }}
    >
      <Box
        component="img"
        src={i18next.language === "fa" ? FaContactUs : EnContactUs}
        alt="Contact Us"
        sx={{ width: "100%", display: "block" }}
        onClick={() => dialogProps.openDialog({})}
      />

      <Button
        variant="contained"
        onClick={() => dialogProps.openDialog({})}
        fullWidth={isMobileScreen}
        sx={{
          mt: { xs: 0, md: 0 },
          position: { sm: "static", md: "absolute" },
          bottom: { sm: "62px" },
          left: { sm: "3.8%" },
          alignSelf: { sm: "center", md: "flex-start" },
          backgroundColor: "primary.main",
          "&:hover": {
            backgroundColor: "primary.dark",
          },
        }}
        size="large"
      >
        {t("contactUs")}
      </Button>
      <ContactUsDialog {...dialogProps} />
    </Box>
  );
};

export default AssessmentKitsContactUs;
