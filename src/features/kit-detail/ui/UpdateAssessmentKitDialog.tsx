import FormProviderWithForm from "@/components/common/FormProviderWithForm";
import { Text } from "@/components/common/Text";
import { useServiceContext } from "@/providers/service-provider";
import { ICustomError } from "@/utils/custom-error";
import showToast from "@/utils/toast-error";
import { Alert, Box, Button, Divider, Grid } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { Trans } from "react-i18next";
import { useParams } from "react-router-dom";
import { styles } from "@styles";
import {
  CEDialog,
  CEDialogActions,
} from "@/components/common/dialogs/CEDialog";
import convertToBytes from "@/utils/convert-to-bytes";
import UploadField from "@/components/common/fields/UploadField";
import { t } from "i18next";
import uniqueId from "@/utils/unique-id";
import { CloudUploadRounded } from "@mui/icons-material";

const UpdateAssessmentKitDialog = (props: any) => {
  const { onClose: closeDialog, ...rest } = props;
  const { service } = useServiceContext();
  const formMethods = useForm({ shouldUnregister: true });
  const abortController = useMemo(() => new AbortController(), [rest.open]);
  const [showErrorLog, setShowErrorLog] = useState<boolean>(false);
  const [syntaxErrorObject, setSyntaxErrorObject] = useState<any>();
  const [updateErrorObject, setUpdateErrorObject] = useState<any>();
  const { assessmentKitId, expertGroupId } = useParams();

  const close = () => {
    setSyntaxErrorObject(null);
    setUpdateErrorObject(null);
    setShowErrorLog(false);
    abortController.abort();
    closeDialog();
  };
  useEffect(() => {
    return () => {
      abortController.abort();
    };
  }, []);
  const onSubmit = async (data: any, event: any, shouldView?: boolean) => {
    event.preventDefault();
    const { dsl_id, ...restOfData } = data;
    const formattedData = {
      kitDslId: dsl_id.kitDslId,
      ...restOfData,
    };
    try {
      await service.assessmentKit.dsl.updateKitFromDsl(
        { data: formattedData, assessmentKitId: assessmentKitId },
        { signal: abortController.signal },
      );
      close();
    } catch (e: any) {
      const err = e as ICustomError;
      if (e?.response?.status == 422) {
        setSyntaxErrorObject(e?.response?.data?.errors);
        setUpdateErrorObject(null);
        setShowErrorLog(true);
      }
      if (e?.response?.data?.code === "UNSUPPORTED_DSL_CONTENT_CHANGE") {
        setUpdateErrorObject(e?.response?.data?.messages);
        setSyntaxErrorObject(null);
        setShowErrorLog(true);
      }

      if (
        e?.response?.status !== 422 &&
        e?.response?.data?.code !== "UNSUPPORTED_DSL_CONTENT_CHANGE"
      ) {
        showToast(err.message);
      }
      formMethods.clearErrors();
      return () => {
        abortController.abort();
      };
    }
  };
  const formContent = (
    <FormProviderWithForm formMethods={formMethods}>
      <Text variant="body1">
        <Trans i18nKey="assessmentKit.pleaseNoteThatThereAreSomeLimitations" />
      </Text>
      <Box ml={4} my={2}>
        <Text component="li" variant="body1" fontWeight={"bold"}>
          <Trans i18nKey="assessmentKit.deletingAQuestionnaire" />
        </Text>
        <Text component="li" variant="body1" fontWeight={"bold"}>
          <Trans i18nKey="assessmentKit.deletingQuestionFromAPreExistingQuestionnaireOrAddingANewOne" />
        </Text>
        <Text component="li" variant="body1" fontWeight={"bold"}>
          <Trans i18nKey="assessmentKit.anyChangesInTheNumberOfOptionsForAPreExistingQuestion" />
        </Text>
      </Box>
      <Grid container spacing={2} sx={styles.formGrid}>
        <Box width="100%" ml={2}>
          <UploadField
            accept={{ "application/zip": [".zip"] }}
            uploadService={(args: any, config: any) =>
              service.assessmentKit.dsl.uploadFile(args, config)
            }
            deleteService={(args: any, config: any) =>
              service.assessmentKit.dsl.deleteLegacyDslFile(args, config)
            }
            setIsValid={false}
            param={expertGroupId}
            name="dsl_id"
            required={true}
            label={<Trans i18nKey="assessmentKit.dsl" />}
            maxSize={convertToBytes(5, "MB")}
            setSyntaxErrorObject={setSyntaxErrorObject}
            setShowErrorLog={setShowErrorLog}
          />
        </Box>
      </Grid>
      <CEDialogActions
        closeDialog={close}
        type="submit"
        submitButtonLabel={t("common.saveChanges") as string}
        onSubmit={formMethods.handleSubmit(onSubmit)}
      />
    </FormProviderWithForm>
  );
  const syntaxErrorContent = (
    <Box>
      {syntaxErrorObject && (
        <Text ml={1} variant="h6">
          <Trans i18nKey="errors.youveGotSyntaxErrorsInYourDslFile" />
        </Text>
      )}
      {updateErrorObject && (
        <Text ml={1} variant="h6">
          <Trans i18nKey="assessmentKit.unsupportedDslContentChange" />
        </Text>
      )}
      <Divider />
      <Box mt={4} maxHeight="260px" overflow="scroll">
        {syntaxErrorObject?.map((e: any) => {
          return (
            <Box key={uniqueId()} sx={{ ml: 1 }}>
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
        {updateErrorObject?.map((e: any) => {
          return (
            <Box key={uniqueId()} ml={1}>
              <Alert severity="error" sx={{ my: 2 }}>
                <Box display="flex">
                  <Text variant="subtitle2" color="error">
                    {e}
                  </Text>
                </Box>
              </Alert>
            </Box>
          );
        })}
      </Box>
      <Grid mt={4} container spacing={2} justifyContent="flex-end">
        <Grid>
          <Button onClick={close} data-cy="cancel">
            <Trans i18nKey="common.cancel" />
          </Button>
        </Grid>
        <Grid>
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
          <CloudUploadRounded />
          {<Trans i18nKey="assessmentKit.updateDSL" />}
        </>
      }
    >
      {!showErrorLog ? formContent : syntaxErrorContent}
    </CEDialog>
  );
};

export default UpdateAssessmentKitDialog;
