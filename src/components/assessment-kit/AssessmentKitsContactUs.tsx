import Box from "@mui/material/Box";
import useDialog from "@/hooks/useDialog";
import { t } from "i18next";
import { useMediaQuery } from "@mui/material";
import TeamworkBlocks from "@/assets/svg/teamwork-blocks.svg";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import ContactUsDialog from "@/components/common/dialogs/ContactUsDialog";
import { styles } from "@styles";

const AssessmentKitsContactUs = () => {
  const dialogProps = useDialog();
  const isMobileScreen = useMediaQuery((theme: any) =>
    theme.breakpoints.down("sm"),
  );

  return (
    <Box
      display="flex"
      flexDirection={{ xs: "column", sm: "row-reverse" }}
      justifyContent="space-between"
      width="100%"
      bgcolor="primary.bgVariant"
      borderRadius={4}
      px={4}
      pb={{ xs: 4, sm: "unset" }}
    >
      <Box
        component={"img"}
        src={TeamworkBlocks}
        alt="Teamwork Blocks"
        width={{ xs: "100%", md: "495px" }}
        height={{ xs: "256px", md: "291px" }}
        onClick={() => dialogProps.openDialog({})}
      />
      <Box sx={{ ...styles.centerCV }}>
        <Typography
          color="text.primary"
          variant="headlineMedium"
          maxWidth={{ xs: "80%", sm: "unset" }}
          mb={{ xs: "12px", sm: 4 }}
        >
          {t("assessmentKit.lookingForSomethingSpecific")}
        </Typography>
        <Typography
          variant="semiBoldXLarge"
          color="background.onVariant"
          mb={{ xs: 2, sm: 4 }}
        >
          {t("assessmentKit.dropUsNote")}
        </Typography>
        <Button
          variant="contained"
          onClick={() => dialogProps.openDialog({})}
          fullWidth={isMobileScreen}
          sx={{
            mt: { xs: 0, md: 0 },
            alignSelf: "flex-start",
            bgcolor: "primary.main",
            "&:hover": {
              bgcolor: "primary.dark",
            },
          }}
          size="large"
        >
          {t("common.contactUs")}
        </Button>
      </Box>
      <ContactUsDialog {...dialogProps} />
    </Box>
  );
};

export default AssessmentKitsContactUs;
