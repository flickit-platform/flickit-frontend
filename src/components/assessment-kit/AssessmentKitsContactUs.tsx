import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ContactUs from "@/assets/svg/ContactUs.svg";
import useDialog from "@/utils/useDialog";
import ContactUsDialog from "./ContactUsDialog";
import { t } from "i18next";
import { useMediaQuery } from "@mui/material";

const AssessmentKitsContactUs = () => {
  const dialogProps = useDialog();
  const isMobileScreen = useMediaQuery((theme: any) =>
    theme.breakpoints.down(960),
  );

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        maxWidth: "1277px",
        mx: "auto",
      }}
    >
      <Box
        component="img"
        src={ContactUs}
        alt="Contact Us"
        sx={{ width: "100%", display: "block" }}
      />

      <Button
        variant="contained"
        onClick={() => dialogProps.openDialog({})}
        fullWidth={isMobileScreen}
        sx={{
          mt: { xs: 0, md: 0 },
          position: { sm: "static", md: "absolute" },
          bottom: { sm: "92px" },
          left: { sm: "48px" },
          alignSelf: { sm: "center", md: "flex-start" },
          backgroundColor: "primary.main",
          "&:hover": {
            backgroundColor: "primary.dark",
          },
        }}
      >
        {t("contactUs")}
      </Button>
      <ContactUsDialog {...dialogProps} />
    </Box>
  );
};

export default AssessmentKitsContactUs;
