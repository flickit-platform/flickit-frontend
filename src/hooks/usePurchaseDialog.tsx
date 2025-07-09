import useDialog from "@utils/useDialog";
import { t } from "i18next";
import keycloakService from "@/service/keycloakService";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import React from "react";

export const usePurchaseDialog = () => {
  return useDialog({
    context: {
      type: "purchased",
      data: {
        email:
          keycloakService._kc.tokenParsed?.preferred_username ??
          keycloakService._kc.tokenParsed?.sub,
        dialogTitle: t("assessmentKit.interestedThisKit"),
        children: (
          <Box sx={{ color: "#2B333B", mb: 3 }}>
            <Typography textAlign="justify" variant="semiBoldLarge">
              {t("common.purchaseModal.accessToKit")}
            </Typography>
            <Typography mt={1} textAlign="justify" variant="semiBoldLarge">
              {t("common.purchaseModal.makeSureFitsYourNeeds")}
            </Typography>
            <Typography mt={1} mb={4} textAlign="justify" variant="semiBoldLarge">
              {t("common.purchaseModal.getInTouch")}
            </Typography>
          </Box>
        ),
        primaryActionButtonText: t("common.sendEmail"),
      },
    },
  });
};
