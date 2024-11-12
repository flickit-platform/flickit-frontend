import { useEffect, useMemo, useState } from "react";
import Grid from "@mui/material/Grid";
import { DialogProps } from "@mui/material/Dialog";
import { useForm } from "react-hook-form";
import { Trans } from "react-i18next";
import { InputFieldUC } from "@common/fields/InputField";
import { styles } from "@styles";
import { useServiceContext } from "@providers/ServiceProvider";
import setServerFieldErrors from "@utils/setServerFieldError";
import NoteAddRoundedIcon from "@mui/icons-material/NoteAddRounded";
import { ICustomError } from "@utils/CustomError";
import { useNavigate, useParams } from "react-router-dom";
import toastError from "@utils/toastError";
import { CEDialog, CEDialogActions } from "@common/dialogs/CEDialog";
import FormProviderWithForm from "@common/FormProviderWithForm";
import AutocompleteAsyncField, {
  useConnectAutocompleteField,
} from "@common/fields/AutocompleteAsyncField";
import UploadField from "@common/fields/UploadField";
import RichEditorField from "@common/fields/RichEditorField";
import { Box, Button, Typography, Alert } from "@mui/material";
import Divider from "@mui/material/Divider";
import { keyframes } from "@emotion/react";
import convertToBytes from "@/utils/convertToBytes";
import { useQuery } from "@utils/useQuery";
import { LoadingButton } from "@mui/lab";
import { theme } from "@/config/theme";

interface IAssessmentKitCEFromDialogProps extends DialogProps {
  onClose: () => void;
  assessmentKits?: any;
  openDialog?: any;
  context?: any;
}

const AssessmentKitCEFromDialog = (props: IAssessmentKitCEFromDialogProps) => {
  const [loading, setLoading] = useState(false);
  const [showErrorLog, setShowErrorLog] = useState<boolean>(false);
  const [syntaxErrorObject, setSyntaxErrorObject] = useState<any>();
  const [isPrivate, setIsPrivate] = useState<boolean>(false);
  const [isValid, setIsValid] = useState<boolean>(false);
  const [activeStep, setActiveStep] = useState<number>(0);
  const [convertData, setConvertData] = useState<any>(null);
  const [zippedData, setZippedData] = useState<any>(null);
  const [dropNewFile, setDropNewFile] = useState<any>(null);
  const [buttonStep, setButtonStep] = useState<any>(0);
  const { service } = useServiceContext();
  const {
    onClose: closeDialog,
    assessmentKits,
    context = {},
    openDialog,
    ...rest
  } = props;
  useEffect(() => {
    if (type === "draft") {
      setActiveStep(1);
      setButtonStep(1);
    }
  }, []);
  const { type, data = {} } = context;
  const { expertGroupId: fallbackExpertGroupId } = useParams();
  const { id, expertGroupId = fallbackExpertGroupId } = data;
  const defaultValues = type === "update" ? data : {};
  const formMethods = useForm({ shouldUnregister: true });
  const abortController = useMemo(() => new AbortController(), [rest.open]);
  const navigate = useNavigate();
  const close = () => {
    setShowErrorLog(false);
    setSyntaxErrorObject(null);
    if (type === "draft") {
      setActiveStep(1);
      setButtonStep(1);
    } else {
      setActiveStep(0);
      setButtonStep(0);
    }
    abortController.abort();
    closeDialog();
    setZippedData(null);
    setConvertData(null);
    setIsValid(false);
  };
  const fetchSampleExecl = useQuery({
    service: (args, config) => service.fetchExcelToDSLSampleFile(args, config),
    runOnMount: false,
  });

  useEffect(() => {
    return () => {
      abortController.abort();
    };
  }, []);

  const onSubmit = async (data: any, event: any, shouldView?: boolean) => {
    event.preventDefault();
    const { tags = [], ...restOfData } = data;
    let formattedData = {
      isPrivate: isPrivate,
      tagIds: tags.map((t: any) => t.id),
      expertGroupId: expertGroupId,
      ...restOfData,
    };
    if (type !== "draft") {
      formattedData = { ...formattedData, kitDslId: data?.dsl_id.kitDslId };
      delete formattedData.dsl_id;
    }
    setLoading(true);
    try {
      const { data: res } =
        type === "update"
          ? await service.updateAssessmentKit(
              { data: formattedData, assessmentKitId: id },
              { signal: abortController.signal },
            )
          : type === "create"
            ? await service.createAssessmentKit(
                { data: formattedData },
                { signal: abortController.signal },
              )
            : await service.createAssessmentKitByApplication(
                { data: formattedData },
                { signal: abortController.signal },
              );
      setLoading(false);
      close();
      assessmentKits.query({
        id: expertGroupId,
        size: 10,
        page: 1,
      });
      shouldView && res?.kitId && navigate(`assessment-kits/${res.kitId}`);
    } catch (e: any) {
      const err = e as ICustomError;
      toastError(err);
      setLoading(false);
      setServerFieldErrors(err, formMethods);
      formMethods.clearErrors();

      return () => {
        abortController.abort();
      };
    }
  };
  const handleNext = () => {
    if (activeStep < 1) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };
  const handleDownloadDsl = () => {
    if (zippedData && buttonStep == 1) {
      const link = document.createElement("a");
      link.href = URL.createObjectURL(zippedData);
      link.download = "kit";
      link.click();
      close();
    }
  };
  const handleConvertDsl = async () => {
    const { args, config } = convertData;
    const fileName = args?.file?.name.substring(
      0,
      args?.file?.name.lastIndexOf("."),
    );
    service.convertExcelToDSLFile(args, config).then((res: any) => {
      const { data } = res;
      const zipfile = new Blob([data], { type: "application/zip" });
      const file: any = new File([zipfile], `${fileName}.zip`, {
        type: "application/zip",
        lastModified: new Date().getTime(),
      });
      setZippedData(zipfile);
      setButtonStep(1);
      setDropNewFile([file]);
    });
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const downloadTemplate = async () => {
    try {
      const { url } = await fetchSampleExecl.query();
      if (url) {
        const link = document.createElement("a");
        link.href = url;
        document.body.appendChild(link);
        link.target = "_blank";
        link.click();
        link.remove();
      }
    } catch (e) {
      // console.log(e);
    }
  };

  const formContent = (
    <FormProviderWithForm formMethods={formMethods}>
      <Grid container spacing={type != "convert" ? 2 : 0} sx={styles.formGrid}>
        <Grid
          item
          xs={12}
          md={12}
          sx={{ display: `${activeStep === 0 ? "" : "none"}` }}
        >
          {type === "convert" && buttonStep == 0 && !convertData && (
            <Box sx={{ pb: "10px" }}>
              {" "}
              <Box
                sx={{
                  ...styles.centerV,
                  background: "#E8EBEE",
                  width: "fit-content",
                  px: 1,
                }}
              >
                <Trans i18nKey={"dslDownloadGuide"} />
                <span
                  style={{
                    textDecoration: "underline",
                    color: theme.palette.primary.main,
                    cursor: "pointer",
                    paddingLeft: theme.direction === "ltr" ? "4px" : "unset",
                    paddingRight: theme.direction === "rtl" ? "4px" : "unset",
                  }}
                  aria-hidden={true}
                  onClick={downloadTemplate}
                >
                  <Trans i18nKey={"here"} />
                </span>
              </Box>
            </Box>
          )}

          {type === "convert" && buttonStep == 1 && (
            <Box sx={{ pb: "10px" }}>
              {" "}
              <Box
                sx={{
                  ...styles.centerV,
                  background: "#E8EBEE",
                  width: "fit-content",
                  px: 1,
                }}
              >
                <Trans i18nKey={"dslReadyToDownload"} />
              </Box>
            </Box>
          )}
          {type == "convert" ? (
            <UploadField
              accept={{
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
                  [".xlsx"],
              }}
              uploadService={(args: any, config: any) => {
                setConvertData({ args, config });
                return service.convertExcelToDSLFile(args, config);
              }}
              name="dsl_id"
              param={expertGroupId}
              required={true}
              label={<Trans i18nKey="xlsx" />}
              setShowErrorLog={setShowErrorLog}
              setSyntaxErrorObject={setSyntaxErrorObject}
              setIsValid={setIsValid}
              maxSize={convertToBytes(5, "MB")}
              setZippedData={setZippedData}
              setButtonStep={setButtonStep}
              disabled={buttonStep !== 0}
              dropNewFile={dropNewFile}
              setConvertData={setConvertData}
            />
          ) : (
            type !== "draft" && (
              <UploadField
                accept={{ "application/zip": [".zip"] }}
                uploadService={(args: any, config: any) =>
                  service.uploadAssessmentKitDSLFile(args, config)
                }
                deleteService={(args: any, config: any) =>
                  service.deleteAssessmentKitDSL(args, config)
                }
                name="dsl_id"
                param={expertGroupId}
                required={true}
                label={<Trans i18nKey="dsl" />}
                setShowErrorLog={setShowErrorLog}
                setSyntaxErrorObject={setSyntaxErrorObject}
                setIsValid={setIsValid}
                maxSize={convertToBytes(5, "MB")}
              />
            )
          )}
        </Grid>
        <Grid
          item
          xs={12}
          sm={8}
          md={8}
          sx={{ display: `${activeStep === 0 ? "none" : ""}` }}
        >
          <InputFieldUC
            name="title"
            label={<Trans i18nKey="title" />}
            required
            defaultValue={defaultValues.title || ""}
          />
        </Grid>
        <Grid
          item
          xs={12}
          sm={4}
          md={4}
          sx={{ display: `${activeStep === 0 ? "none" : ""}` }}
        >
          <IsPrivateSwitch setIsPrivate={setIsPrivate} isPrivate={isPrivate} />
        </Grid>
        <Grid
          item
          xs={12}
          md={12}
          sx={{ display: `${activeStep === 0 ? "none" : ""}` }}
        >
          <AutocompleteAsyncField
            {...useConnectAutocompleteField({
              service: (args, config) =>
                service.fetchAssessmentKitTags(args, config),
            })}
            name="tags"
            multiple={true}
            searchOnType={false}
            required={true}
            label={<Trans i18nKey="tags" />}
          />
        </Grid>
        <Grid
          item
          xs={12}
          md={12}
          sx={{ display: `${activeStep === 0 ? "none" : ""}` }}
        >
          <InputFieldUC
            name="summary"
            label={<Trans i18nKey="summary" />}
            required={true}
            defaultValue={defaultValues.summary || ""}
          />
        </Grid>
        <Grid
          item
          xs={12}
          md={12}
          sx={{ display: `${activeStep === 0 ? "none" : ""}` }}
        >
          <RichEditorField
            name="about"
            label={<Trans i18nKey="about" />}
            required={true}
            defaultValue={defaultValues.about || ""}
          />
        </Grid>
      </Grid>
      <Box sx={{ display: `${activeStep === 0 ? "none" : ""}` }}>
        <CEDialogActions
          closeDialog={close}
          loading={loading}
          type={type}
          hasBackBtn={type !== "draft"}
          onBack={handleBack}
          hasViewBtn={true}
          onSubmit={(...args) =>
            formMethods.handleSubmit((data) => onSubmit(data, ...args))
          }
        />
      </Box>
      <Box
        sx={{
          justifyContent: "flex-end",
          mt: 4,
          display: `${activeStep === 0 ? "flex" : "none"}`,
        }}
      >
        <Button onClick={close}>
          <Trans i18nKey="cancel" />
        </Button>
        {type == "convert" && buttonStep == 0 && (
          <LoadingButton
            sx={{ ml: 2 }}
            variant="contained"
            onClick={handleConvertDsl}
            disabled={!isValid}
          >
            <Trans i18nKey="convertToDsl" />
          </LoadingButton>
        )}
        {type == "convert" && buttonStep == 1 && (
          <Button
            sx={{ ml: 2 }}
            variant="contained"
            onClick={handleDownloadDsl}
            disabled={!isValid}
          >
            <Trans i18nKey="download" />
          </Button>
        )}
        {type != "convert" && (
          <Button
            sx={{ ml: 2 }}
            variant="contained"
            onClick={handleNext}
            disabled={!isValid}
          >
            <Trans i18nKey="next" />
          </Button>
        )}
      </Box>
    </FormProviderWithForm>
  );
  const syntaxErrorContent = (
    <Box>
      <Typography ml={1} variant="h6">
        <Trans i18nKey="youveGotSyntaxErrorsInYourDslFile" />
      </Typography>
      <Divider />
      <Box mt={4} sx={{ maxHeight: "260px", overflow: "scroll" }}>
        {syntaxErrorObject &&
          syntaxErrorObject.map((e: any, index: number) => {
            return (
              <Box sx={{ ml: 1 }} key={e?.line}>
                <Alert severity="error" sx={{ my: 2 }}>
                  <Box sx={{ display: "flex", flexDirection: "column" }}>
                    <Typography variant="subtitle2" color="error">
                      <Trans
                        i18nKey="errorAtLine"
                        values={{
                          message: e.message,
                          fileName: e.fileName,
                          line: e.line,
                          column: e.column,
                        }}
                      />
                    </Typography>
                    <Typography variant="subtitle2" color="error">
                      <Trans
                        i18nKey="errorLine"
                        values={{
                          errorLine: e.errorLine,
                        }}
                      />
                    </Typography>
                  </Box>
                </Alert>
              </Box>
            );
          })}
      </Box>
      <Grid mt={4} container spacing={2} justifyContent="flex-end">
        <Grid item>
          <Button onClick={close} data-cy="cancel">
            <Trans i18nKey="cancel" />
          </Button>
        </Grid>
        <Grid item>
          <Button variant="contained" onClick={() => setShowErrorLog(false)}>
            <Trans i18nKey="Back" />
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
  return (
    <CEDialog
      {...rest}
      closeDialog={close}
      title={
        <>
          <NoteAddRoundedIcon
            sx={{
              marginRight: theme.direction === "ltr" ? 1 : "unset",
              marginLeft: theme.direction === "rtl" ? 1 : "unset",
            }}
          />
          {type === "update" && <Trans i18nKey="updateAssessmentKit" />}
          {type === "draft" && <Trans i18nKey="createDraft" />}
          {type === "create" && <Trans i18nKey="createAssessmentKit" />}
          {type === "convert" && <Trans i18nKey="convertExcelToDsl" />}
        </>
      }
    >
      {!showErrorLog ? formContent : syntaxErrorContent}
    </CEDialog>
  );
};

export default AssessmentKitCEFromDialog;

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const IsPrivateSwitch = (props: any) => {
  const { isPrivate, setIsPrivate } = props;
  const handleToggle = (status: boolean) => {
    setIsPrivate(status);
  };
  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            display: "flex",
            background: "#00000014",
            borderRadius: "8px",
            justifyContent: "space-between",
            p: "2px",
            gap: "4px  ",
            height: "40px",
            width: "100%",
          }}
        >
          <Box
            onClick={() => handleToggle(true)}
            sx={{
              padding: 0.5,
              backgroundColor: isPrivate ? "#7954B3;" : "transparent",
              color: isPrivate ? "#fff" : "#000",
              cursor: "pointer",
              transition: "background-color 0.3s ease",
              animation: `${fadeIn} 0.5s ease`,
              borderRadius: "6px",
              width: "50%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography
              variant="body2"
              fontWeight="700"
              textTransform={"uppercase"}
              sx={{ userSelect: "none" }}
              fontSize="0.825rem"
            >
              <Trans i18nKey="private" />
            </Typography>
          </Box>
          <Box
            onClick={() => handleToggle(false)}
            sx={{
              padding: 0.5,
              backgroundColor: !isPrivate ? "gray" : "transparent",
              cursor: "pointer",
              transition: "background-color 0.3s ease",
              animation: `${fadeIn} 0.5s ease`,
              borderRadius: "6px",
              color: !isPrivate ? "#fff" : "#000",
              width: "50%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography
              variant="body2"
              fontWeight="700"
              textTransform={"uppercase"}
              sx={{ userSelect: "none" }}
              fontSize="0.825rem"
            >
              <Trans i18nKey="public" />
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
