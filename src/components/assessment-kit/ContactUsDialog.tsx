import { useEffect, useMemo, useState } from "react";
import { CEDialog, CEDialogActions } from "@common/dialogs/CEDialog";
import { theme } from "@config/theme";
import { Trans } from "react-i18next";
import { t } from "i18next";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/material";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import { DialogProps } from "@mui/material/Dialog";
import { useForm as useFormSpree } from "@formspree/react";
import { FormProvider, useForm } from "react-hook-form";
import { InputFieldUC } from "../common/fields/InputField";
import whatsApp from "@assets/svg/whatsApp.svg";
import BaleIcon from "@assets/svg/baleIcon.svg";

interface IContactUsDialogProps extends DialogProps {
  onClose: () => void;
  context?: any;
}

const phoneNumber = "+989966529108";
const WhatsappLink = `whatsapp://send?phone=${phoneNumber}`;
const WhatsappWebLink = `https://web.whatsapp.com/send?phone=${phoneNumber}`;
const BaleWebLink= `https://web.bale.ai/chat?uid=1294957316`;

const ContactUsDialog = (props: IContactUsDialogProps) => {
  const { onClose, context, ...rest } = props;
  const abortController = useMemo(() => new AbortController(), [rest.open]);
  const { data = {}, type } = context ?? {};
  const { email, dialogTitle, content, primaryActionButtonText, children } =
    data;
  const [state, handleSubmitSpree] = useFormSpree(
    import.meta.env.VITE_FORM_SPREE,
  );
  const methods = useForm({
    defaultValues: { email: email ?? "" },
  });

  const [dialogKey, setDialogKey] = useState(0);

  useEffect(() => {
    methods.setValue("email", email);
  }, [email]);
  const close = () => {
    abortController.abort();
    methods.reset();
    setDialogKey((prev) => prev + 1);
    onClose();
    if (type === "requestAnExpertReview") {
      methods.setValue(
        "type" as any,
        "User asked help in " + window.location.href + " report.",
      );
    }
  };

  const handleSucceeded = () => {
    handleSubmitSpree({});
    close();
  };

  useEffect(() => {
    methods.setValue(
      "type" as any,
      type === "requestAnExpertReview"
        ? `Expert Review - ${window.location.href}`
        : "Contact Us - Flickit",
    );
  }, []);

  const onSubmit = async (data: any) => {
    handleSubmitSpree(data);
  };

  const socialIcon = [
    {
      id: 1,
      icon: whatsApp,
      bg: "#3D8F3D14",
      link: { WhatsappLink, WhatsappWebLink },
    },
    {
      id: 2,
      icon: BaleIcon,
      bg: "#3D8F3D14",
      link: { BaleWebLink },
    },
  ];

  return (
    <CEDialog
      key={dialogKey}
      {...rest}
      closeDialog={state.succeeded ? handleSucceeded : close}
      title={
        <Typography sx={theme.typography.semiBoldXLarge}>
          {dialogTitle ?? <Trans i18nKey="common.contactUs" />}
        </Typography>
      }
    >
      {state.succeeded ? (
        <Box
          mt={2}
          sx={{ minHeight: { xs: "calc(100vh - 100px)", sm: "unset" } }}
        >
          <Box
            height="94%"
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
            }}
          >
            <CheckCircleOutlineRoundedIcon
              sx={{ fontSize: 64, color: "success.main", mb: 1 }}
            />
            <Typography variant="h5" sx={{ fontWeight: "bold", mb: 1 }}>
              {t("common.thankYouForYourMessage")}
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              {t("common.weWillGetBackToYouSoon")}
            </Typography>
          </Box>

          <CEDialogActions
            hideCancelButton
            submitButtonLabel={t("common.okGotIt")}
            closeDialog={handleSucceeded}
            onSubmit={handleSucceeded}
          />
        </Box>
      ) : (
        <FormProvider {...methods}>
          <Box px={1} pt={3}>
            <form onSubmit={methods.handleSubmit(onSubmit)}>
              <Typography
                variant="bodyLarge"
                sx={{ mb: 2 }}
                textAlign="justify"
              >
                {children}
              </Typography>

              {type !== "requestAnExpertReview" && (
                <InputFieldUC name="email" label={t("user.yourEmail")} required />
              )}

              <Box sx={{ mt: 2 }}>
                <InputFieldUC
                  name="message"
                  label={t("common.yourMessage")}
                  multiline
                  rows={4}
                  required
                />
              </Box>
            </form>

            <CEDialogActions
              cancelLabel={t("common.cancel")}
              contactSection={socialIcon}
              submitButtonLabel={primaryActionButtonText ?? t("common.confirm")}
              onClose={close}
              loading={state.submitting}
              onSubmit={methods.handleSubmit(onSubmit)}
              sx={{
                flexDirection: { xs: "column-reverse", sm: "row" },
                gap: 2,
              }}
            />
          </Box>
        </FormProvider>
      )}
    </CEDialog>
  );
};

export default ContactUsDialog;
