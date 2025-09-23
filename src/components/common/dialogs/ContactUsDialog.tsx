import { useEffect, useMemo, useState } from "react";
import { CEDialog, CEDialogActions } from "@common/dialogs/CEDialog";
import { Trans } from "react-i18next";
import i18next, { t } from "i18next";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/material";
import { DialogProps } from "@mui/material/Dialog";
import { useForm as useFormSpree } from "@formspree/react";
import { useForm } from "react-hook-form";
import { InputFieldUC } from "../fields/InputField";
import telegramIcon from "@/assets/svg/telegram-logo.svg";
import splusIcon from "@/assets/svg/splus-logo.svg";
import { styles } from "@styles";
import FormProviderWithForm from "../FormProviderWithForm";

interface IContactUsDialogProps extends DialogProps {
  onClose: () => void;
  context?: any;
  lng?: string;
  openDialog?: (context: any) => void;
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
  openDialog,
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
  const methods = useForm({
    defaultValues: { email: email ?? "" },
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  });
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

  const onSubmit = async (data: any) => {
    handleSubmitSpree(data).then(() => {
      close();
    });
  };

  const renderFormFields = () => (
    <>
      {type !== "requestAnExpertReview" && (
        <InputFieldUC
          isFocused
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
      closeDialog={close}
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
      <FormProviderWithForm formMethods={methods}>
        <Box px={1} pt={3} fontFamily="inherit">
          <Typography
            variant="bodyLarge"
            textAlign="justify"
            fontFamily="inherit"
          >
            {children}
          </Typography>

          {type === "contactUs" && (
            <Typography component="div" variant="bodyLarge" mb={2}>
              <Trans i18nKey="common.contactUsIntroText" />
            </Typography>
          )}

          {renderFormFields()}

          <Box
            display="flex"
            alignItems="center"
            flexDirection={{ xs: "column", md: "row" }}
            justifyContent="space-between"
            gap={2}
            marginInlineEnd={-1}
          >
            <Box gap={2} sx={{ ...styles.centerVH }}>
              <Typography
                color="text.primary"
                variant="semiBoldLarge"
                whiteSpace="nowrap"
                component="div"
                sx={{ ...styles.rtlStyle(isRTL) }}
              >
                {t("common.moreWaysToReachUs", { lng })}
              </Typography>

              {socialIcon.map((chat) => (
                <Box
                  key={chat.id}
                  onClick={() => window.open(chat.link, "_blank")}
                  sx={{ cursor: "pointer", ...styles.centerVH }}
                >
                  <img
                    src={chat.icon}
                    alt="chat icon"
                    style={{ width: 24, height: 24 }}
                  />
                </Box>
              ))}
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
      </FormProviderWithForm>
    </CEDialog>
  );
};

export default ContactUsDialog;
