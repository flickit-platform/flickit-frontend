import { useEffect, useMemo, useState } from "react";
import { CEDialog, CEDialogActions } from "@common/dialogs/CEDialog";
import { theme } from "@config/theme";
import { Trans } from "react-i18next";
import i18next, { t } from "i18next";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/material";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import { DialogProps } from "@mui/material/Dialog";
import { useForm as useFormSpree } from "@formspree/react";
import { FormProvider, useForm } from "react-hook-form";
import { InputFieldUC } from "../common/fields/InputField";
import telegramIcon from "@assets/svg/telegram.svg";
import splusIcon from "@assets/svg/splusLogo.svg";
import { styles } from "@styles";
import { toast } from "react-toastify";

interface IContactUsDialogProps extends DialogProps {
  onClose: () => void;
  context?: any;
  lng?: string;
}

const TelegramLink = "https://web.telegram.org/a/#8179187991";
const SplusWebLink = "https://web.splus.ir/#45047257";

const socialIcon = [
  { id: 1, icon: telegramIcon, bg: "#2466A814", link: TelegramLink },
  { id: 2, icon: splusIcon, bg: "#196ff014", link: SplusWebLink },
];

const getInputLabelSx = (isRTL: boolean, isSameLang: boolean) => {
  let marginInlineStart = "initial";
  let focusedMarginInlineStart = "initial";

  if (!isSameLang) {
    marginInlineStart = isRTL ? "32px !important" : "16px !important";
    focusedMarginInlineStart = isRTL ? "10px !important" : "-10px !important";
  }

  return {
    ...styles.rtlStyle(isRTL),
    marginInlineStart,
    "&.Mui-focused": {
      ...styles.rtlStyle(isRTL),
      marginInlineStart: focusedMarginInlineStart,
    },
  };
};

const ContactUsDialog = ({
  title,
  onClose,
  context,
  lng,
  ...rest
}: IContactUsDialogProps) => {
  const { data = {}, type = "contactUs" } = context ?? {};
  const { email, dialogTitle, primaryActionButtonText, children } = data;
  const isRTL = lng === "fa" || (!lng && i18next.language === "fa");
  const isSameLang = lng === i18next.language || !lng;

  const abortController = useMemo(() => new AbortController(), [rest.open]);
  const [state, handleSubmitSpree] = useFormSpree(
    import.meta.env.VITE_FORM_SPREE,
  );
  const methods = useForm({ defaultValues: { email: email ?? "" } });
  const [dialogKey, setDialogKey] = useState(0);

  useEffect(() => {
    methods.setValue("email", email);
  }, [email]);

  useEffect(() => {
    let typeValue = "Contact Us - Flickit";

    if (type === "requestAnExpertReview") {
      typeValue = `Expert Review - ${window.location.href}`;
    } else if (type === "purchased") {
      typeValue = `Purchase - ${title}`;
    }

    methods.setValue("type" as any, typeValue);

    methods.setValue("type" as any, typeValue);
  }, []);

  const close = () => {
    abortController.abort();
    methods.reset();
    setDialogKey((prev) => prev + 1);
    onClose();
  };

  const handleSucceeded = () => {
    handleSubmitSpree({});
    close();
  };

  const onSubmit = async (data: any) => {
    handleSubmitSpree(data).then(() => {
      if (type === "purchased") {
        handleSucceeded();
        toast(t("common.thankYouForYourMessage", { lng }), { type: "success" });
      }
    });
  };

  const renderFormFields = () => (
    <>
      {type !== "requestAnExpertReview" && (
        <InputFieldUC
          name="email"
          label={t("user.yourEmailAddress", { lng })}
          required
          InputLabelProps={{ sx: getInputLabelSx(isRTL, isSameLang) }}
        />
      )}

      <Box sx={{ mt: 2 }}>
        <InputFieldUC
          name="mobile"
          label={t("user.yourPhoneNumber", { lng })}
          placeholder={t("user.pleaseEnterYourPhoneNumber", { lng })}
          InputLabelProps={{ sx: getInputLabelSx(isRTL, isSameLang) }}
        />
      </Box>

      <Box sx={{ mt: 2 }}>
        <InputFieldUC
          name="message"
          label={
            type === "purchased"
              ? t("assessmentKit.tellUsWhatYouLookingFor", { lng })
              : t("common.yourMessage", { lng })
          }
          multiline
          rows={4}
          required
          InputLabelProps={{ sx: getInputLabelSx(isRTL, isSameLang) }}
          lng={lng}
        />
      </Box>
    </>
  );

  return (
    <CEDialog
      key={dialogKey}
      {...rest}
      closeDialog={state.succeeded ? handleSucceeded : close}
      title={
        <Typography
          variant="semiBoldXLarge"
          sx={styles.rtlStyle(isRTL)}
          fontFamily="inherit"
        >
          {dialogTitle ?? <Trans i18nKey="common.contactUs" />}
        </Typography>
      }
      sx={styles.rtlStyle(isRTL)}
    >
      {state.succeeded && type !== "purchased" ? (
        <Box
          mt={2}
          sx={{ minHeight: { xs: "calc(100vh - 100px)", sm: "unset" } }}
        >
          <Box height="94%" sx={{ ...styles.centerCVH, textAlign: "center" }}>
            <CheckCircleOutlineRoundedIcon
              sx={{ fontSize: 64, color: "success.main", mb: 1 }}
            />
            <Typography variant="h5" sx={{ fontWeight: "bold", mb: 1 }}>
              {t("common.thankYouForYourMessage", { lng })}
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              {t("common.weWillGetBackToYouSoon", { lng })}
            </Typography>
          </Box>

          <CEDialogActions
            hideCancelButton
            submitButtonLabel={t("common.okGotIt", { lng })}
            closeDialog={handleSucceeded}
            onSubmit={handleSucceeded}
          />
        </Box>
      ) : (
        <FormProvider {...methods}>
          <Box px={1} pt={3} fontFamily="inherit">
            <form onSubmit={methods.handleSubmit(onSubmit)}>
              <Typography
                variant="bodyLarge"
                textAlign="justify"
                fontFamily="inherit"
              >
                {children}
              </Typography>

              {type === "contactUs" && (
                <Typography component="div" variant="bodyLarge" sx={{ mb: 2 }}>
                  <Trans i18nKey="common.contactUsIntroText" />
                </Typography>
              )}

              {renderFormFields()}
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
                    ...styles.rtlStyle(isRTL),
                  }}
                >
                  {t("common.moreWaysToReachUs", { lng })}
                </Typography>

                <Box sx={{ display: "flex", gap: 2 }}>
                  {socialIcon.map((chat) => (
                    <Box
                      key={chat.id}
                      onClick={() => window.open(chat.link, "_blank")}
                      sx={{ cursor: "pointer" }}
                    >
                      <img
                        src={chat.icon}
                        alt="chat icon"
                        style={{ width: 24, height: 24 }}
                      />
                    </Box>
                  ))}
                </Box>
              </Box>

              <CEDialogActions
                cancelLabel={t("common.cancel", { lng })}
                submitButtonLabel={
                  primaryActionButtonText ?? t("common.confirm", { lng })
                }
                onClose={close}
                loading={state.submitting}
                onSubmit={methods.handleSubmit(onSubmit)}
                sx={{
                  flexDirection: { xs: "column-reverse", sm: "row" },
                  gap: 2,
                  ...styles.rtlStyle(isRTL),
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
