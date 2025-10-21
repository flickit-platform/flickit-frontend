import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { useCallback, useEffect, useState } from "react";
import { Accept, DropEvent, FileRejection, useDropzone } from "react-dropzone";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import FormLabel from "@mui/material/FormLabel";
import ListItemIcon from "@mui/material/ListItemIcon";
import FilePresentRoundedIcon from "@mui/icons-material/FilePresentRounded";
import { styles } from "@styles";
import FileUploadRoundedIcon from "@mui/icons-material/FileUploadRounded";
import { TQueryServiceFunction, useQuery } from "@/hooks/useQuery";
import { t } from "i18next";
import { ICustomError } from "@/utils/custom-error";
import {
  Controller,
  ControllerRenderProps,
  FieldErrorsImpl,
  FieldValues,
  useFormContext,
} from "react-hook-form";
import formatBytes from "@/utils/format-bytes";
import getFieldError from "@/utils/get-field-error";
import { Trans } from "react-i18next";
import getFileNameFromSrc from "@/utils/get-file-name-from-src";
import { useServiceContext } from "@/providers/service-provider";
import showToast from "@/utils/toast-error";

const UploadField = (props: any) => {
  const { name, required, defaultValue, ...rest } = props;

  const formMethods = useFormContext();
  const { control } = formMethods;
  return (
    <Controller
      name={name}
      control={control}
      rules={{ required }}
      defaultValue={defaultValue}
      render={({ field, formState }) => {
        const { errors } = formState;
        return (
          <Uploader
            fieldProps={field}
            errors={errors}
            required={required}
            defaultValue={defaultValue}
            {...rest}
          />
        );
      }}
    />
  );
};

interface IUploadProps {
  fieldProps: ControllerRenderProps<FieldValues, string>;
  errors: FieldErrorsImpl<{
    [x: string]: any;
  }>;
  label: string | JSX.Element;
  accept?: Accept;
  maxSize?: number;
  required?: boolean;
  defaultValue?: any;
  uploadService?: TQueryServiceFunction<any, any>;
  deleteService?: TQueryServiceFunction<any, any>;
  hideDropText?: boolean;
  shouldFetchFileInfo?: boolean;
  defaultValueType?: string;
  param?: string;
  setSyntaxErrorObject?: any;
  setShowErrorLog?: any;
  setIsValid?: any;
  setButtonStep?: any;
  setZippedData?: any;
  dslGuide?: boolean;
  dropNewFile?: any;
  setConvertData?: any;
  disabled?: boolean;
}

const Uploader = (props: IUploadProps) => {
  const {
    fieldProps,
    errors,
    label,
    accept,
    maxSize,
    required,
    uploadService,
    deleteService,
    hideDropText,
    shouldFetchFileInfo = false,
    defaultValue = [],
    defaultValueType,
    param,
    setSyntaxErrorObject,
    setShowErrorLog,
    setIsValid,
    setButtonStep,
    disabled = false,
    setZippedData,
    setConvertData,
    dropNewFile,
  } = props;

  const { service } = useServiceContext();
  const defaultValueQuery = useQuery({
    service: (args, config) =>
      service.common.getImageBlob(
        args ?? { url: defaultValue?.replace("https://flickit.org", "") },
        config,
      ),
    runOnMount: false,
  });

  const setTheState = () => {
    if (!defaultValue) {
      return [];
    }
    if (typeof defaultValue === "string") {
      return [
        {
          src: defaultValue,
          name: getFileNameFromSrc(defaultValue),
          type: defaultValueType ?? "",
        },
      ] as { src: string; name: string; type: string }[];
    }
    console.warn("Type of default value must be array of strings");
    return [];
  };

  const [limitGuide, setLimitGuide] = useState<string>();
  const [myFiles, setMyFiles] =
    useState<(File | { src: string; name: string; type: string })[]>(
      setTheState,
    );

  useEffect(() => {
    if (maxSize) {
      setLimitGuide(
        t("errors.maximumUploadFileSize", {
          maxSize: maxSize ? formatBytes(maxSize) : "2 MB",
        }) as string,
      );
    }
    if (
      typeof defaultValue === "string" &&
      defaultValue &&
      shouldFetchFileInfo
    ) {
      defaultValueQuery.query().then((data) => {
        const myFile = new File([data], "image.jpeg", { type: data.type });
        fieldProps.onChange(myFile);
      });
    }
  }, []);

  const uploadQueryProps = useQuery({
    service: uploadService || ((() => null) as any),
    runOnMount: false,
  });

  const deleteQueryProps = useQuery({
    service: deleteService || ((() => null) as any),
    runOnMount: false,
  });

  const onDrop = useCallback(
    (acceptedFiles: any, fileRejections: FileRejection[], event: DropEvent) => {
      delete errors[fieldProps.name];
      if (acceptedFiles?.[0]) {
        const reader = new FileReader();
        reader.onload = async () => {
          if (!uploadService) {
            setMyFiles(acceptedFiles);
            fieldProps.onChange(acceptedFiles?.[0]);
            return;
          }
          try {
            const res = await uploadQueryProps.query({
              file: acceptedFiles?.[0],
              expertGroupId: param,
            });
            setIsValid(true);
            setMyFiles(acceptedFiles);
            fieldProps.onChange(res);
          } catch (e: any) {
            const err = e as ICustomError;
            if (err?.response?.status === 422) {
              const responseObject = JSON.parse(err?.response?.data?.message);
              setShowErrorLog(true);
              setSyntaxErrorObject(responseObject.errors);
              setIsValid(false);
            }
            if (err?.response?.status !== 422) {
              if (e?.response?.data?.type == "application/json") {
                const blob = new Blob([err.response?.data as any], {
                  type: "application/json",
                }).text();
                blob.then((res: any) => {
                  showToast(JSON.parse(res)?.message);
                });
              } else {
                showToast(err);
              }
              setMyFiles([]);
              setIsValid(false);
              fieldProps.onChange("");
            }
          }
        };

        reader.readAsArrayBuffer(acceptedFiles[0]);
      }
    },
    [],
  );

  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    accept,
    maxSize,
    onDrop,
    disabled: disabled,
    multiple: false,
    onDropRejected(rejectedFiles, event) {
      if (rejectedFiles.length > 0) {
        const error = rejectedFiles[0].errors;
        if (error.find((e) => e.code === "file-too-large")) {
          errors[fieldProps.name] = {
            type: "maxSize",
            message: t("errors.maximumUploadFileSize", {
              maxSize: maxSize ? formatBytes(maxSize) : "2 MB",
            }) as string,
          };
        } else if (rejectedFiles.length == 1 && error[0]?.message) {
          showToast((error as any)?.pop()?.message as string);
        } else {
          showToast(t("errors.oneFileOnly") as string);
        }
      }
    },
    onError(err) {
      showToast(err.message);
    },
  });

  const file = myFiles?.[0] ?? fieldProps.value?.[0];

  const loading = uploadQueryProps.loading ?? deleteQueryProps.loading;
  const { errorMessage, hasError } = getFieldError(errors, fieldProps.name);

  const selectedFile = dropNewFile?.[0] ?? acceptedFiles?.[0] ?? file;

  return (
    <FormControl sx={{ width: "100%" }} error={hasError}>
      <Box
        sx={{
          minHeight: "40px",
          border: (t) =>
            `1px dashed ${hasError ? t.palette.error.main : t.palette.disabled?.main}`,
          "&:hover": {
            border: (t) =>
              disabled
                ? `1px solid ${hasError ? t.palette.error.dark : "black"}`
                : "",
          },
          borderRadius: 1,
          cursor: disabled ? "default" : "pointer",
          width: "100%",
        }}
      >
        <Box minHeight={"40px"} display="flex" {...getRootProps()}>
          <input {...getInputProps()} name={fieldProps.name} />
          {file || loading ? (
            <List
              dense={true}
              sx={{ width: "100%", direction: "ltr" }}
              onClick={(e: any) => {
                loading && e.stopPropagation();
              }}
            >
              <ListItem
                disabled={loading}
                secondaryAction={
                  <Box
                    p={1}
                    sx={{ backgroundColor: "#ffffffc9", borderRadius: 1 }}
                  >
                    {loading && (
                      <IconButton edge="end">
                        <CircularProgress size="20px" />
                      </IconButton>
                    )}
                    {!loading && (
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={async (e) => {
                          e.stopPropagation();
                          setMyFiles([]);
                          fieldProps.onChange("");
                          setButtonStep(0);
                          setZippedData(null);
                          setConvertData(null);
                        }}
                      >
                        <DeleteOutlinedIcon fontSize="small" />
                      </IconButton>
                    )}
                  </Box>
                }
              >
                <ListItemIcon
                  sx={{
                    minWidth: "20px",
                    maxWidth: "40px",
                    maxHeight: "40px",
                    overflow: "hidden",
                    mx: 1.5,
                    display: { xs: "none", sm: "inline-flex" },
                  }}
                >
                  {file?.type?.includes("image") ? (
                    <Box
                      sx={{
                        maxWidth: "100%",
                        maxHeight: "100%",
                        objectFit: "contain",
                      }}
                      component="img"
                      src={
                        (file as any).src ?? URL.createObjectURL(file as any)
                      }
                      alt={file.name}
                      title={file.name}
                    />
                  ) : (
                    <FilePresentRoundedIcon />
                  )}
                </ListItemIcon>
                <ListItemText
                  title={`${selectedFile} - ${
                    selectedFile?.size ? formatBytes(selectedFile?.size) : ""
                  }`}
                  primaryTypographyProps={{
                    sx: { ...styles.ellipsis, width: "95%" },
                  }}
                  primary={<>{selectedFile?.name}</>}
                  secondary={
                    selectedFile?.size ? formatBytes(selectedFile.size) : null
                  }
                />
              </ListItem>
            </List>
          ) : (
            <>
              <FormLabel
                sx={{
                  ...styles.centerV,
                  paddingInlineStart: 2,
                  paddingInlineEnd: "unset",
                  height: "40px",
                  fontSize: "1rem",
                  cursor: "pointer",
                }}
                required={required}
              >
                {label}
              </FormLabel>
              <Box
                px={2}
                color="disabled.main"
                marginInlineStart="auto"
                marginInlineEnd="unset"
                sx={{ ...styles.centerV }}
              >
                <FileUploadRoundedIcon sx={{ mr: hideDropText ? 0 : 1 }} />
                {!hideDropText && (
                  <>
                    {" "}
                    <Trans i18nKey="common.dropYourFileHere" />
                  </>
                )}
              </Box>
            </>
          )}
        </Box>
      </Box>
      <FormHelperText>{limitGuide ?? (errorMessage as string)}</FormHelperText>
    </FormControl>
  );
};

export default UploadField;
