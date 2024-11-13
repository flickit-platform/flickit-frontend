import { useEffect, useMemo, useState } from "react";
import Grid from "@mui/material/Grid";
import { DialogProps } from "@mui/material/Dialog";
import { useForm } from "react-hook-form";
import { Trans } from "react-i18next";
import { InputFieldUC } from "@common/fields/InputField";
import { styles } from "@styles";
import { useServiceContext } from "@providers/ServiceProvider";
import setServerFieldErrors from "@utils/setServerFieldError";
import AccountBoxRoundedIcon from "@mui/icons-material/AccountBoxRounded";
import { ICustomError } from "@utils/CustomError";
import toastError from "@utils/toastError";
import { CEDialog, CEDialogActions } from "@common/dialogs/CEDialog";
import FormProviderWithForm from "@common/FormProviderWithForm";
import { theme } from "@/config/theme";

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
      await service.updateUserInfo(
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
      toastError(err);
    }
  };

  return (
    <CEDialog
      {...rest}
      closeDialog={close}
      title={
        <>
          <AccountBoxRoundedIcon
            sx={{
              marginRight: theme.direction === "ltr" ? 1 : "unset",
              marginLeft: theme.direction === "rtl" ? 1 : "unset",
            }}
          />
          <Trans i18nKey="updateUser" />
        </>
      }
    >
      <FormProviderWithForm formMethods={formMethods}>
        <Grid container spacing={2} sx={styles.formGrid}>
          {/* <Grid item xs={12} sm={6}>
            <UploadField
              accept={{
                "image/jpeg": [".jpeg", ".jpg"],
                "image/png": [".png"],
              }}
              defaultValueType="image"
              defaultValue={defaultValues.pictureLink}
              shouldFetchFileInfo={true}
              name="picture"
              label={<Trans i18nKey="accountPicture" />}
              maxSize={convertToBytes(2, "MB")}
              />
          </Grid> */}
          <Grid item xs={12} sm={12}>
            <InputFieldUC
              autoFocus={true}
              defaultValue={defaultValues.displayName || ""}
              name="displayName"
              required={true}
              label={<Trans i18nKey="displayName" />}
            />
          </Grid>
          <Grid item xs={12} sm={8}>
            <InputFieldUC
              multiline
              defaultValue={defaultValues.bio || ""}
              name="bio"
              label={<Trans i18nKey="bio" />}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <InputFieldUC
              defaultValue={defaultValues.linkedin || ""}
              name="linkedin"
              label={<Trans i18nKey="linkedin" />}
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
