import useDialog from "@/hooks/useDialog";
import { t } from "i18next";
import keycloakService from "@/service/keycloakService";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export const usePurchaseDialog = (kitTitle?: string) => {
  return useDialog({
    context: {
      type: "purchased",
      data: {
        email:
          keycloakService._kc.tokenParsed?.preferred_username ??
          keycloakService._kc.tokenParsed?.sub,
        dialogTitle: t("assessmentKit.interestedThisKit"),
        children: (
          <Box color="text.primary" mb={3}>
            <Typography textAlign="justify" variant="semiBoldLarge">
              {t("common.purchaseModal.accessToKit")}
            </Typography>{" "}
            <Typography mt={1} textAlign="justify" variant="semiBoldLarge">
              {t("common.purchaseModal.makeSureFitsYourNeeds")}
            </Typography>{" "}
            <Typography
              mt={1}
              mb={4}
              textAlign="justify"
              variant="semiBoldLarge"
            >
              {t("common.purchaseModal.getInTouch")}
            </Typography>
          </Box>
        ),
        primaryActionButtonText: t("common.send"),
        title: kitTitle,
      },
    },
  });
};
