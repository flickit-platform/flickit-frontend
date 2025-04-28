import Box from "@mui/material/Box";
import useDialog from "@/utils/useDialog";
import { t } from "i18next";
import { useMediaQuery } from "@mui/material";
import contactUs from "@/assets/svg/contactUs.svg";
import Typography from "@mui/material/Typography";
import { theme } from "@config/theme";
import Button from "@mui/material/Button";

const AssessmentKitsContactUs = () => {
  const dialogProps = useDialog();
  const isMobileScreen = useMediaQuery((theme: any) =>
    theme.breakpoints.down("sm"),
  );

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: {xs: "column", sm: "row-reverse"},
        justifyContent: "space-between",
        width: "100%",
        background: "#D5E5F6",
        borderRadius: 2,
        px: 4,
        pb: {xs: 4,sm: "unset"}
      }}
    >
      <Box
      component={"img"}
      src={contactUs}
      alt="Contact Us"
      sx={{ width: {xs: "100%", md: "495px" }, height: {xs: "256px", md: "291px"} }}
      onClick={() => dialogProps.openDialog({})}
      >
      </Box>
      <Box sx={{display: "flex", flexDirection: "column", justifyContent: "center"}}>
        <Typography
          sx={{
            ...theme.typography.headlineMedium,
            color: "#2B333B",
            maxWidth: { xs: "80%", sm: "unset" } ,
            mb: { xs: "12px", sm: 4 },
          }}
        >
          {t("lookingForSomethingSpecific")}
        </Typography>
        <Typography
          sx={{
            ...theme.typography.semiBoldXLarge,
            color: "#6C8093",
            mb: { xs: 2, sm: 4 },
          }}
        >
          {t("dropUsNote")}
        </Typography>
           <Button
             variant="contained"
             onClick={() => dialogProps.openDialog({})}
             fullWidth={isMobileScreen}
             sx={{
               mt: { xs: 0, md: 0 },
               alignSelf: "flex-start",
               backgroundColor: "primary.main",
               "&:hover": {
                 backgroundColor: "primary.dark",
               },
             }}
             size="large"
           >
             {t("contactUs")}
           </Button>
      </Box>
    </Box>
  );
};

export default AssessmentKitsContactUs;
