import { useMemo, useState } from "react";
import { CEDialog, CEDialogActions } from "@common/dialogs/CEDialog";
import { theme } from "@config/theme";
import { Trans } from "react-i18next";
import { t } from "i18next";

import Typography from "@mui/material/Typography";
import { Box, Button } from "@mui/material";
import AssessmentError from "@/assets/svg/AssessmentError.svg";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import { DialogProps } from "@mui/material/Dialog";
import { useForm as useFormSpree } from "@formspree/react";
import { FormProvider, useForm } from "react-hook-form";
import { InputFieldUC } from "../common/fields/InputField";

interface IContactUsDialogProps extends DialogProps {
  onClose: () => void;
}

const ContactUsDialog = (props: IContactUsDialogProps) => {
  const { onClose, ...rest } = props;
  const abortController = useMemo(() => new AbortController(), [rest.open]);

  const [state, handleSubmitSpree] = useFormSpree("myzeoqrg");
  const methods = useForm();
  const [emailError, setEmailError] = useState<any>("");

  const [dialogKey, setDialogKey] = useState(0);

  const close = () => {
    abortController.abort();
    setEmailError("");
    methods.reset();
    setDialogKey((prev) => prev + 1);
    onClose();
  };

  const onSubmit = (data: any) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      setEmailError(t("invalidEmail"));
      return;
    }

    setEmailError("");
    handleSubmitSpree(data);
  };

  return (
    <CEDialog
      key={dialogKey}
      {...rest}
      closeDialog={close}
      title={
        <>
          <Typography sx={theme.typography.semiBoldXLarge} textTransform="none">
            <Trans i18nKey="contactUs" />
          </Typography>
        </>
      }
    >
      {state.succeeded ? (
        <Box>
          <Box
            mt={2}
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
              <Trans i18nKey="thankYouForYourMessage" />
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              <Trans i18nKey="weWillGetBackToYouSoon" />
            </Typography>
          </Box>
          <CEDialogActions
            hideCancelButton
            submitButtonLabel={t("okGotIt")}
            closeDialog={close}
            onSubmit={close}
          />
        </Box>
      ) : (
        <FormProvider {...methods}>
          <form
            onSubmit={methods.handleSubmit(onSubmit)}
            style={{ padding: 24 }}
          >
            <Typography variant="body1" sx={{ mb: 2 }}>
              <Trans i18nKey="contactUsIntroText" />
            </Typography>

            <InputFieldUC
              name="email"
              label={t("yourEmail")}
              required
              error={!!emailError}
              helperText={emailError}
            />

            <Box sx={{ mt: 2 }}>
              <InputFieldUC
                name="message"
                label={t("yourMessage")}
                multiline
                rows={4}
                required
              />
            </Box>

            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 2,
                mt: 3,
              }}
            >
              <Button onClick={close}>{t("cancel")}</Button>
              <Button
                type="submit"
                variant="contained"
                disabled={state.submitting}
              >
                {t("confirm")}
              </Button>
            </Box>
          </form>
        </FormProvider>
      )}
    </CEDialog>
  );
};

export default ContactUsDialog;
