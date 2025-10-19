import { useEffect, useMemo, useState } from "react";
import Grid from "@mui/material/Grid";
import { DialogProps } from "@mui/material/Dialog";
import { useForm } from "react-hook-form";
import { Trans } from "react-i18next";
import { InputFieldUC } from "@common/fields/InputField";
import { styles } from "@styles";
import { useServiceContext } from "@/providers/service-provider";
import setServerFieldErrors from "@/utils/set-server-field-error";
import AccountBoxRoundedIcon from "@mui/icons-material/AccountBoxRounded";
import { ICustomError } from "@/utils/custom-error";
import { CEDialog, CEDialogActions } from "@common/dialogs/CEDialog";
import FormProviderWithForm from "@common/FormProviderWithForm";
import languageDetector from "@/utils/language-detector";
import showToast from "@/utils/toast-error";

interface IUserCEFormDialogProps extends DialogProps {
  onClose: () => void;
  onSubmitForm: () => void;
  openDialog?: any;
  context?: any;
}

const UserCEFormDialog = (props: IUserCEFormDialogProps) => {
  const [loading, setLoading] = useState(false);
  const { service } = useServiceContext();
  const {
    onClose: closeDialog,
    onSubmitForm,
    context = {},
    openDialog,
    ...rest
  } = props;
  const { type, data = {} } = context;
  const { id } = data;
  const defaultValues = type === "update" ? data : {};
  const formMethods = useForm({ shouldUnregister: true });
  const abortController = useMemo(() => new AbortController(), [rest.open]);
  const close = () => {
    abortController.abort();
    closeDialog();
  };

  useEffect(() => {
    return () => {
      abortController.abort();
    };
  }, []);

  const onSubmit = async (data: any) => {
    if (type !== "update") {
      return;
    }
    setLoading(true);
    try {
      const tempData = { ...data };
      tempData.linkedin === "" && delete tempData.linkedin;
      tempData.bio === "" && delete tempData.bio;
      await service.user.updateProfile(
        {
          id,
          data: tempData,
        },
        { signal: abortController.signal },
      );
      setLoading(false);
      onSubmitForm();
      close();
    } catch (e) {
      const err = e as ICustomError;
      setLoading(false);
      setServerFieldErrors(err, formMethods);
      showToast(err);
    }
  };

  return (
    <CEDialog
      {...rest}
      closeDialog={close}
      title={
        <>
          <AccountBoxRoundedIcon
            sx={{ marginInlineEnd: 1, marginInlineStart: "unset" }}
          />
          <Trans i18nKey="user.updateUser" />
        </>
      }
    >
      <FormProviderWithForm formMethods={formMethods}>
        <Grid container spacing={2} sx={styles.formGrid}>
          <Grid item xs={12} sm={12}>
            <InputFieldUC
              autoFocus={true}
              defaultValue={defaultValues.displayName ?? ""}
              name="displayName"
              required={true}
              label={<Trans i18nKey="common.name" />}
              isFarsi={languageDetector(defaultValues?.displayName)}
            />
          </Grid>
          <Grid item xs={12} sm={8}>
            <InputFieldUC
              multiline
              defaultValue={defaultValues.bio ?? ""}
              name="bio"
              label={<Trans i18nKey="common.bio" />}
              isFarsi={languageDetector(defaultValues?.bio)}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <InputFieldUC
              defaultValue={defaultValues.linkedin ?? ""}
              name="linkedin"
              label={<Trans i18nKey="common.linkedin" />}
            />
          </Grid>
        </Grid>
        <CEDialogActions
          closeDialog={close}
          loading={loading}
          type={type}
          onSubmit={formMethods.handleSubmit(onSubmit)}
        />
      </FormProviderWithForm>
    </CEDialog>
  );
};

export default UserCEFormDialog;
