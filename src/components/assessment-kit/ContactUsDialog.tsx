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
import telegramIcon from "@assets/svg/telegram.svg";
import eitaaIcon from "@assets/svg/eitaa_logo.svg";
import { styles } from "@styles";
import { toast } from "react-toastify";

interface IContactUsDialogProps extends DialogProps {
  onClose: () => void;
  context?: any;
}

const TelegramLink = 'https://web.telegram.org/a/#8179187991';
const EitaaWebLink = 'https://web.eitaa.com/#67786801';
const socialIcon = [
  {
    id: 1,
    icon: telegramIcon,
    bg: "#2466A814",
    link: TelegramLink,
  },
  {
    id: 2,
    icon: eitaaIcon,
    bg: "#f7632314",
    link: EitaaWebLink,
  },
];

const ContactUsDialog = (props: IContactUsDialogProps) => {
  const { onClose, context, ...rest } = props;
  const abortController = useMemo(() => new AbortController(), [rest.open]);
  const { data = {}, type } = context ?? {};
  const { email, dialogTitle, primaryActionButtonText, children } =
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
    handleSubmitSpree(data).then(() =>{
      if(type == "purchased"){
        handleSucceeded()
        toast(t("common.thankYouForYourMessage"),{type: "success"})
      }
    });
  };

  const openChat = (link: any) => {
      window.open(link, "_blank");
  };
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
      {state.succeeded && type != "purchased" ? (
        <Box
          mt={2}
          sx={{ minHeight: { xs: "calc(100vh - 100px)", sm: "unset" } }}
        >
          <Box
            height="94%"
            sx={{
              ...styles.centerCVH,
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
                textAlign="justify"
              >
                {children}
              </Typography>

              {type !== "requestAnExpertReview" && (
                <InputFieldUC
                  name="email"
                  label={t("user.yourEmailAddress")}
                  required
                />
              )}

              <Box sx={{ mt: 2 }}>
                <InputFieldUC
                  name="message"
                  label={t("assessmentKit.tellUsWhatYouLookingFor")}
                  multiline
                  rows={4}
                  required
                />
              </Box>
            </form>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                flexDirection: { xs: "column", md: "row" },
                justifyContent: "space-between",
                gap: 2,
                ml: -1,
              }}
            >
              <Box sx={{ ...styles.centerVH, gap: 2, mt: 3 }}>
                <Typography
                  sx={{
                    ...theme.typography.semiBoldLarge,
                    color: "#000",
                    whiteSpace: "nowrap",
                  }}
                >
                  <Trans i18nKey="common.moreWaysToReachUs" />
                </Typography>
                <Box sx={{ display: "flex", gap: 2 }}>
                  {socialIcon.map((chat) => {
                    return (
                      <Box
                        key={chat.id}
                        onClick={() => openChat(chat.link)}
                        sx={{ cursor: "pointer" }}
                      >
                        <img
                          style={{
                            height: 24,
                            width: 24,
                          }}
                          src={chat.icon}
                          alt={`chat icon`}
                        />
                      </Box>
                    );
                  })}
                </Box>
              </Box>
              <CEDialogActions
                cancelLabel={t("common.cancel")}
                submitButtonLabel={
                  primaryActionButtonText ?? t("common.confirm")
                }
                onClose={close}
                loading={state.submitting}
                onSubmit={methods.handleSubmit(onSubmit)}
                sx={{
                  flexDirection: { xs: "column-reverse", sm: "row" },
                  gap: 2,
                }}
              />
            </Box>
          </Box>
        </FormProvider>
      )}
    </CEDialog>
  );
};

export default ContactUsDialog;
