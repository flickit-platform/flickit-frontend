import React, { useEffect, useMemo, useState } from "react";
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
import FormControl from "@mui/material/FormControl";
import { InputLabel, MenuItem, OutlinedInput, Select } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useQuery } from "@utils/useQuery";
import { ISpaceType } from "@types";
import premiumIcon from "@/assets/svg/premium-icon.svg";
import {SelectField} from "@common/fields/SelectField";
interface ICreateSpaceDialogProps extends DialogProps {
  onClose: () => void;
  onSubmitForm: () => void;
  openDialog?: any;
  context?: any;
}

const CreateSpaceDialog = (props: ICreateSpaceDialogProps) => {
  const [loading, setLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(true);
  const [spaceType, setSpaceType] = useState<ISpaceType[]>([]);
  const [selectedType, setSelectedType] = useState<string>("BASIC");
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
    setSelectedType("");
  };

  const fetchSpaceType = useQuery({
    service: (args, config) => service.fetchSpaceType(args, config),
    runOnMount: false,
  });

  const allSpacesType = async () => {
    let data = await fetchSpaceType.query();
    if(data){
      const { spaceTypes: getSpaceType } = data
      setSpaceType(getSpaceType);
    }

  };

  useEffect(() => {
    allSpacesType().then();
  }, []);

  const onSubmit = async (data: any, event: any, shouldView?: boolean) => {
    if (type !== "update") {
      data = { ...data, type: selectedType };
    }
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

  const handleChange = (e: any) => {
    const { value } = e.target;
    setSelectedType(value);
  };

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
          <Grid item xs={type == "update" ? 12 : 9}>
            <InputFieldUC
              name="title"
              defaultValue={defaultValues.title || ""}
              required={true}
              label={<Trans i18nKey="title" />}
              isFocused={isFocused}
            />
          </Grid>
          {type !== "update" && (
            <Grid item xs={3}>
              <FormControl sx={{ width: "100%" }}>
                <SelectField
                  // disabled={editable != undefined ? !editable : false}
                  id="spaceType-name-label"
                  size="small"
                  label={<Trans i18nKey={"spaceType"} />}
                  value={selectedType}
                  IconComponent={KeyboardArrowDownIcon}
                  displayEmpty
                  name={"spaceType-select"}
                  defaultValue={spaceType[0]?.title}
                  required={true}
                  nullable={false}
                  input={<OutlinedInput label="spaceType" />}
                  onChange={(e) => handleChange(e)}
                  sx={{
                    fontSize: "14px",
                    background: "#fff",
                    px: "0px",
                    height: "40px",
                    "& .MuiSelect-select": {
                      display: "flex",
                      alignItems: "center",
                      padding: "12px !important",
                      gap: 1,
                    },
                  }}
                >
                  {spaceType?.map((type: any) => (
                    <MenuItem
                      sx={{
                        color: "#2B333B",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor:
                          type.code == "PREMIUM" ? "transparent" : "unset",
                        backgroundImage:
                          type.code == "PREMIUM"
                            ? "linear-gradient(to right, #1B4D7E, #2D80D2, #1B4D7E )"
                            : "unset",
                        gap: 1,
                        marginLeft: type.code != "PREMIUM" ? "24px" : "unset",
                      }}
                      disabled={type.code == "PREMIUM"}
                      key={type}
                      value={type.code}
                    >
                      {type.code == "PREMIUM" && (
                        <img
                          src={premiumIcon}
                          alt={"premium"}
                          style={{ width: "16px", height: "21px" }}
                        />
                      )}
                      <Trans i18nKey={type.title} />
                    </MenuItem>
                  ))}
                </SelectField>
              </FormControl>
            </Grid>
          )}
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
