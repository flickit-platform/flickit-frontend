import { useEffect, useMemo, useState } from "react";
import Grid from "@mui/material/Grid";
import { DialogProps } from "@mui/material/Dialog";
import { nanoid } from "nanoid";
import { useForm } from "react-hook-form";
import { Trans } from "react-i18next";
import { InputFieldUC } from "@common/fields/InputField";
import { CEDialog, CEDialogActions } from "@common/dialogs/CEDialog";
import FormProviderWithForm from "@common/FormProviderWithForm";
import { styles } from "@styles";
import { useServiceContext } from "@providers/ServiceProvider";
import { ICustomError } from "@utils/CustomError";
import setServerFieldErrors from "@utils/setServerFieldError";
import toastError from "@utils/toastError";
import CreateNewFolderRoundedIcon from "@mui/icons-material/CreateNewFolderRounded";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { theme } from "@/config/theme";

interface ICreateSpaceDialogProps extends DialogProps {
  onClose: () => void;
  onSubmitForm: () => void;
  openDialog?: any;
  context?: any;
}

const CreateSpaceDialog = (props: ICreateSpaceDialogProps) => {
  const [loading, setLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(true);
  const { service } = useServiceContext();
  const {
    onClose: closeDialog,
    onSubmitForm,
    context = {},
    openDialog,
    ...rest
  } = props;
  const { type, data = {} } = context;
  const { id: spaceId } = data;
  const defaultValues =
    type === "update" ? data : { title: "", code: nanoid(5) };
  const formMethods = useForm({ shouldUnregister: true });
  const abortController = useMemo(() => new AbortController(), [rest.open]);
  const navigate = useNavigate();

  const close = () => {
    abortController.abort();
    closeDialog();
  };

  const onSubmit = async (data: any, event: any, shouldView?: boolean) => {
    setLoading(true);
    try {
      let createdSpaceId = 1;
      type === "update"
        ? (await service.updateSpace(
            { spaceId, data },
            { signal: abortController.signal },
          )) && (await service.seenSpaceList({ spaceId }, {}))
        : await service
            .createSpace(data, { signal: abortController.signal })
            .then((res) => {
              createdSpaceId = res.data.id;
            });
      type !== "update" && navigate(`/${createdSpaceId}/assessments/1`);
      setLoading(false);
      toast.success(
        <Trans
          i18nKey={
            type === "update"
              ? "spaceUpdatedSuccessMessage"
              : "spaceCreatedSuccessMessage"
          }
          values={{ title: data.title }}
        />,
      );
      onSubmitForm();
      close();
    } catch (e) {
      const err = e as ICustomError;
      setLoading(false);
      toastError(err);
      setServerFieldErrors(err, formMethods);
    }
  };

  useEffect(() => {
    return () => {
      abortController.abort();
    };
  }, []);

  useEffect(() => {
    if (openDialog) {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Enter") {
          setIsFocused(false);
          setTimeout(() => {
            setIsFocused(true);
          }, 500);
          formMethods.handleSubmit((data) =>
            onSubmit(formMethods.getValues(), e),
          )();
        }
      };

      document.addEventListener("keydown", handleKeyDown);

      return () => {
        document.removeEventListener("keydown", handleKeyDown);
        abortController.abort();
      };
    }
  }, [openDialog, formMethods, abortController]);

  return (
    <CEDialog
      {...rest}
      closeDialog={close}
      title={
        <>
          <CreateNewFolderRoundedIcon
            sx={{
              marginRight: theme.direction === "ltr" ? 1 : "unset",
              marginLeft: theme.direction === "rtl" ? 1 : "unset",
            }}
          />
          {type === "update" ? (
            <Trans i18nKey="updateSpace" />
          ) : (
            <Trans i18nKey="createSpace" />
          )}
        </>
      }
    >
      <FormProviderWithForm formMethods={formMethods}>
        <Grid container spacing={2} sx={styles.formGrid}>
          {/* <Grid item xs={12}>
            <InputFieldUC
              name="code"
              required={true}
              defaultValue={defaultValues.code || nanoid(5)}
              label={<Trans i18nKey="code" />}
            />
          </Grid> */}
          <Grid item xs={12}>
            <InputFieldUC
              // autoFocus={true}
              name="title"
              defaultValue={defaultValues.title || ""}
              required={true}
              label={<Trans i18nKey="title" />}
              isFocused={isFocused}
            />
          </Grid>
        </Grid>
        <CEDialogActions
          closeDialog={close}
          loading={loading}
          type={type}
          onSubmit={(...args) =>
            formMethods.handleSubmit((data) => onSubmit(data, ...args))
          }
        />
      </FormProviderWithForm>
    </CEDialog>
  );
};

export default CreateSpaceDialog;
