import { useEffect, useMemo, useState } from "react";
import Grid from "@mui/material/Grid";
import { DialogProps } from "@mui/material/Dialog";
import { useForm } from "react-hook-form";
import { Trans } from "react-i18next";
import { InputFieldUC } from "@common/fields/InputField";
import { styles } from "@styles";
import { useServiceContext } from "@/providers/service-provider";
import setServerFieldErrors from "@/utils/set-server-field-error";
import NoteAddRoundedIcon from "@mui/icons-material/NoteAddRounded";
import { ICustomError } from "@/utils/custom-error";
import { useNavigate, useParams } from "react-router-dom";
import { CEDialog, CEDialogActions } from "@common/dialogs/CEDialog";
import FormProviderWithForm from "@common/FormProviderWithForm";
import AutocompleteAsyncField, {
  useConnectAutocompleteField,
} from "@common/fields/AutocompleteAsyncField";
import UploadField from "@common/fields/UploadField";
import RichEditorField from "@common/fields/RichEditorField";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import Divider from "@mui/material/Divider";
import { keyframes } from "@emotion/react";
import convertToBytes from "@/utils/convert-to-bytes";
import { useQuery } from "@/hooks/useQuery";
import LoadingButton from "@mui/lab/LoadingButton";
import uniqueId from "@/utils/unique-id";
import i18n from "i18next";
import showToast from "@/utils/toast-error";
import { v3Tokens } from "@/config/tokens";
import { Text } from "../common/Text";
import SelectLanguage from "../common/SelectLanguage";

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
  const { id, expertGroupId = fallbackExpertGroupId, languages } = data;
  const [lang, setLang] = useState({ code: "", title: "" });
  const defaultValues = type === "update" ? data : {};
  const formMethods = useForm({
    shouldUnregister: true,
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  });
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
    setDropNewFile(null);
    setConvertData(null);
    setIsValid(false);
    setLang(languages[0]);
  };
  const fetchSampleExecl = useQuery({
    service: (args, config) =>
      service.assessmentKit.dsl.getExcelSample(args, config),
    runOnMount: false,
  });

  useEffect(() => {
    return () => {
      abortController.abort();
    };
  }, []);

  useEffect(() => {
    if (languages) {
      let appLang = languages.find(
        (item: { code: string; title: string }) =>
          item.code == i18n.language.toUpperCase(),
      );
      setLang(appLang);
    }
  }, [languages]);

  const onSubmit = async (data: any, event: any, shouldView?: boolean) => {
    event.preventDefault();
    const { tags = [], ...restOfData } = data;
    let formattedData = {
      isPrivate: isPrivate,
      tagIds: tags.map((t: any) => t.id),
      expertGroupId: expertGroupId,
      lang: lang.code,
      ...restOfData,
    };
    if (type !== "draft") {
      formattedData = { ...formattedData, kitDslId: data?.dsl_id.kitDslId };
      delete formattedData.dsl_id;
    }
    setLoading(true);
    try {
      const opts = { signal: abortController.signal };
      let requestPromise: Promise<{ data: any }>;

      if (type === "update") {
        requestPromise = service.assessmentKit.info.updateByDSL(
          { data: formattedData, assessmentKitId: id },
          opts,
        );
      } else if (type === "create") {
        requestPromise = service.assessmentKit.dsl.createKitFromDsl(
          { data: formattedData },
          opts,
        );
      } else {
        requestPromise = service.assessmentKit.info.create(
          { data: formattedData },
          opts,
        );
      }

      const { data: res } = await requestPromise;

      setLoading(false);
      close();
      assessmentKits.query({ id: expertGroupId, size: 10, page: 1 });
      if (shouldView && res?.kitId) {
        navigate(`assessment-kits/${res.kitId}`);
      }
    } catch (e: any) {
      const err = e as ICustomError;
      showToast(err);
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
    if (zippedData.file && buttonStep == 1) {
      const link = document.createElement("a");
      link.href = URL.createObjectURL(zippedData.file);
      link.download = zippedData.name;
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
    service.assessmentKit.dsl
      .convertExcelToDsl(args, config)
      .then((res: any) => {
        const { data } = res;
        const zipfile = new Blob([data], { type: "application/zip" });
        const file: any = new File([zipfile], `${fileName}.zip`, {
          type: "application/zip",
          lastModified: new Date().getTime(),
        });
        setZippedData({ file: zipfile, name: fileName });
        setButtonStep(1);
        setDropNewFile([file]);
      });
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const downloadTemplate = async () => {
    const { url } = await fetchSampleExecl.query();
    if (url) {
      const link = document.createElement("a");
      link.href = url;
      document.body.appendChild(link);
      link.target = "_blank";
      link.click();
      link.remove();
    }
  };

  const handleSelectedChange = (e: any) => {
    const { value } = e.target;
    let adjustValue = languages.find(
      (item: { code: string; title: string }) => item.title == value,
    );
    setLang(adjustValue);
  };

  const formContent = (
    <FormProviderWithForm formMethods={formMethods}>
      <Grid container spacing={type != "convert" ? 2 : 0} sx={styles.formGrid}>
        <Grid item xs={12} md={12} display={activeStep === 0 ? "" : "none"}>
          {type === "convert" && buttonStep == 0  && (
            <Box pb="10px">
              <Box
                bgcolor="background.containerHighest"
                width="fit-content"
                px={1}
                sx={{ ...styles.centerV }}
              >
                <Trans i18nKey="assessmentKit.dslDownloadGuide" />
                <span
                  color="primary.main"
                  aria-hidden={true}
                  onClick={downloadTemplate}
                  style={{
                    textDecoration: "underline",
                    cursor: "pointer",
                    paddingInlineStart: "4px",
                    paddingInlineEnd: "unset",
                  }}
                >
                  <Trans i18nKey="common.here" />
                </span>
              </Box>
            </Box>
          )}

          {type === "convert" && buttonStep == 1 && (
            <Box pb="10px">
              <Box
                bgcolor="background.containerHighest"
                width="fit-content"
                px={1}
                sx={{ ...styles.centerV }}
              >
                <Trans i18nKey="assessmentKit.dslReadyToDownload" />
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
                return service.assessmentKit.dsl.convertExcelToDsl(
                  args,
                  config,
                );
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
                  service.assessmentKit.dsl.uploadFile(args, config)
                }
                deleteService={(args: any, config: any) =>
                  service.assessmentKit.dsl.deleteLegacyDslFile(args, config)
                }
                name="dsl_id"
                param={expertGroupId}
                required={true}
                label={<Trans i18nKey="assessmentKit.dsl" />}
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
          display={activeStep === 0 ? "none" : ""}
        >
          <InputFieldUC
            name="title"
            label={<Trans i18nKey="common.title" />}
            required
            defaultValue={defaultValues.title ?? ""}
            isFocused
          />
        </Grid>
        <Grid
          item
          xs={12}
          sm={4}
          md={4}
          display={activeStep === 0 ? "none" : ""}
        >
          <IsPrivateSwitch setIsPrivate={setIsPrivate} isPrivate={isPrivate} />
        </Grid>
        <Grid
          item
          xs={12}
          sm={8}
          md={8}
          display={activeStep === 0 ? "none" : ""}
        >
          <AutocompleteAsyncField
            {...useConnectAutocompleteField({
              service: (args, config) =>
                service.assessmentKit.info.getTags(args, config),
            })}
            name="tags"
            multiple={true}
            searchOnType={false}
            required={true}
            label={<Trans i18nKey="common.tags" />}
          />
        </Grid>
        <Grid
          item
          xs={12}
          sm={4}
          md={4}
          display={activeStep === 0 ? "none" : ""}
        >
          <SelectLanguage
            handleChange={handleSelectedChange}
            mainLanguage={lang}
            languages={languages}
          />
        </Grid>
        <Grid item xs={12} md={12} display={activeStep === 0 ? "none" : ""}>
          <InputFieldUC
            name="summary"
            label={<Trans i18nKey="common.summary" />}
            required={true}
            defaultValue={defaultValues.summary ?? ""}
          />
        </Grid>
        <Grid item xs={12} md={12} display={activeStep === 0 ? "none" : ""}>
          <RichEditorField
            bgcolor={v3Tokens.primary.bg}
            name="about"
            label={<Trans i18nKey="common.about" />}
            required={true}
            defaultValue={defaultValues.about ?? ""}
          />
        </Grid>
      </Grid>
      <Box display={activeStep === 0 ? "none" : ""}>
        <CEDialogActions
          closeDialog={close}
          loading={loading}
          type={type}
          hasBackBtn={type !== "draft"}
          onBack={handleBack}
          hasViewBtn={true}
          onSubmit={(...args) =>
            formMethods.handleSubmit((data) => onSubmit(data, ...args))()
          }
        />
      </Box>
      <Box
        display={activeStep === 0 ? "flex" : "none"}
        justifyContent="flex-end"
        mt={4}
      >
        <Button onClick={close}>
          <Trans i18nKey="common.cancel" />
        </Button>
        {type == "convert" && buttonStep == 0 && (
          <LoadingButton
            sx={{ ml: 2 }}
            variant="contained"
            onClick={handleConvertDsl}
            disabled={!isValid}
          >
            <Trans i18nKey="assessmentKit.convertToDsl" />
          </LoadingButton>
        )}
        {type == "convert" && buttonStep == 1 && (
          <Button
            sx={{ ml: 2 }}
            variant="contained"
            onClick={handleDownloadDsl}
            disabled={!isValid}
          >
            <Trans i18nKey="common.download" />
          </Button>
        )}
        {type != "convert" && (
          <Button
            sx={{ ml: 2 }}
            variant="contained"
            onClick={handleNext}
            disabled={!isValid}
          >
            <Trans i18nKey="common.next" />
          </Button>
        )}
      </Box>
    </FormProviderWithForm>
  );
  const syntaxErrorContent = (
    <Box>
      <Text ml={1} variant="h6">
        <Trans i18nKey="errors.youveGotSyntaxErrorsInYourDslFile" />
      </Text>
      <Divider />
      <Box mt={4} maxHeight="260px" overflow="scroll">
        {syntaxErrorObject?.map((e: any) => {
          return (
            <Box ml={1} key={uniqueId()}>
              <Alert severity="error" sx={{ my: 2 }}>
                <Box display="flex" flexDirection="column">
                  <Text variant="subtitle2" color="error">
                    <Trans
                      i18nKey="errors.errorAtLine"
                      values={{
                        message: e.message,
                        fileName: e.fileName,
                        line: e.line,
                        column: e.column,
                      }}
                    />
                  </Text>
                  <Text variant="subtitle2" color="error">
                    <Trans
                      i18nKey="errors.errorLine"
                      values={{
                        errorLine: e.errorLine,
                      }}
                    />
                  </Text>
                </Box>
              </Alert>
            </Box>
          );
        })}
      </Box>
      <Grid mt={4} container spacing={2} justifyContent="flex-end">
        <Grid item>
          <Button onClick={close} data-cy="cancel">
            <Trans i18nKey="common.cancel" />
          </Button>
        </Grid>
        <Grid item>
          <Button variant="contained" onClick={() => setShowErrorLog(false)}>
            <Trans i18nKey="common.back" />
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
            sx={{ marginInlineEnd: 1, marginInlineStart: "unset" }}
          />
          {type === "update" && (
            <Trans i18nKey="assessmentKit.updateAssessmentKit" />
          )}
          {type === "draft" && <Trans i18nKey="assessmentKit.createDraft" />}
          {type === "create" && (
            <Trans i18nKey="assessmentKit.createAssessmentKit" />
          )}
          {type === "convert" && (
            <Trans i18nKey="assessmentKit.convertExcelToDsl" />
          )}
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
      <Box sx={{ ...styles.centerV }}>
        <Box
          display="flex"
          bgcolor="#00000014"
          borderRadius="8px"
          justifyContent="space-between"
          p="2px"
          gap="4px"
          height="40px"
          width="100%"
        >
          <Box
            onClick={() => handleToggle(true)}
            padding={0.5}
            bgcolor={isPrivate ? "#7954B3" : "transparent"}
            color={isPrivate ? "background.containerLowest" : "text.primary"}
            borderRadius="6px"
            width="50%"
            sx={{
              cursor: "pointer",
              transition: "background-color 0.3s ease",
              animation: `${fadeIn} 0.5s ease`,
              ...styles.centerVH,
            }}
          >
            <Text
              variant="body2"
              fontWeight="700"
              textTransform={"uppercase"}
              sx={{ userSelect: "none" }}
              fontSize="0.825rem"
            >
              <Trans i18nKey="common.private" />
            </Text>
          </Box>
          <Box
            onClick={() => handleToggle(false)}
            padding={0.5}
            bgcolor={!isPrivate ? "disabled.main" : "transparent"}
            color={!isPrivate ? "background.containerLowest" : "text.primary"}
            borderRadius="6px"
            width="50%"
            sx={{
              cursor: "pointer",
              transition: "background-color 0.3s ease",
              animation: `${fadeIn} 0.5s ease`,
              ...styles.centerVH,
            }}
          >
            <Text
              variant="body2"
              fontWeight="700"
              textTransform="uppercase"
              sx={{ userSelect: "none" }}
              fontSize="0.825rem"
            >
              <Trans i18nKey="common.public" />
            </Text>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
