import useDialog from "@/hooks/useDialog";
import { t } from "i18next";
import keycloakService from "@/service/keycloakService";
import Box from "@mui/material/Box";
import { Text } from "@/components/common/Text";

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
            <Text textAlign="justify" variant="semiBoldLarge">
              {t("common.purchaseModal.accessToKit")}
            </Text>{" "}
            <Text mt={1} textAlign="justify" variant="semiBoldLarge">
              {t("common.purchaseModal.makeSureFitsYourNeeds")}
            </Text>{" "}
            <Text
              mt={1}
              mb={4}
              textAlign="justify"
              variant="semiBoldLarge"
            >
              {t("common.purchaseModal.getInTouch")}
            </Text>
          </Box>
        ),
        primaryActionButtonText: t("common.send"),
        title: kitTitle,
      },
    },
  });
};
