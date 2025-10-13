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
import showToast from "@/utils/toast-error";
import { useAuthContext } from "@/providers/auth-provider";

interface IAssessmentCEFromDialogProps extends DialogProps {
  onClose: () => void;
  refetchData?: () => void;
  openDialog?: any;
  context?: any;
}

const AssessmentCEFromDialog = (props: IAssessmentCEFromDialogProps) => {
  const [loading, setLoading] = useState(false);
  const [createdKitSpaceId, setCreatedKitSpaceId] = useState(undefined);
  const { service } = useServiceContext();
  const {
    onClose: closeDialog,
    refetchData,
    context = {},
    openDialog,
    ...rest
  } = props;
  const { type, data = {}, staticData = {} } = context;
  const { id: assessmentId } = data;
  const defaultValues = type === "update" ? data : {};
  const { spaceId } = useParams();
  const formMethods = useForm({
    shouldUnregister: true,
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  });
  const abortController = useMemo(() => new AbortController(), [rest.open]);
  const navigate = useNavigate();
  const close = () => {
    abortController.abort();
    closeDialog();
    !!staticData.assessment_kit &&
      createdKitSpaceId &&
      navigate(`/${createdKitSpaceId}/assessments/1`);
  };
  useEffect(() => {
    return () => {
      abortController.abort();
    };
  }, []);

  const {
    userInfo: { defaultSpaceId },
  } = useAuthContext();

  const onSubmit = async (data: any, event: any, shouldView?: boolean) => {
    const { space, assessment_kit, title, color, shortTitle, language } = data;
    setLoading(true);
    try {
      type === "update"
        ? await service.assessments.info.update(
            {
              id: assessmentId,
              data: {
                title,
                shortTitle,
                colorId: color,
                lang: language.code,
              },
            },
            { signal: abortController.signal },
          )
        : await service.assessments.info.create(
            {
              data: {
                spaceId: spaceId ?? space?.id ?? defaultSpaceId,
                assessmentKitId: assessment_kit?.id,
                title: title,
                shortTitle: shortTitle === "" ? null : (shortTitle ?? null),
                colorId: color,
                lang: language.code,
              },
            },
            { signal: abortController.signal },
          );

      setLoading(false);
      if (refetchData !== undefined) {
        refetchData();
      }
      close();
      setCreatedKitSpaceId(spaceId ?? space?.id ?? defaultSpaceId);
    } catch (e) {
      const err = e as ICustomError;
      setLoading(false);
      setServerFieldErrors(err, formMethods);
      formMethods.clearErrors();
      showToast(err);
      return () => {
        abortController.abort();
      };
    }
  };

  useEffect(() => {
    return () => {
      abortController.abort();
    };
  }, []);

  const [languages, setLanguages] = useState<any[]>([]);

  useEffect(() => {
    const kit = formMethods.watch("assessment_kit");
    const langs = kit?.languages ?? [];
    const mainLang = kit?.mainLanguage;

    setLanguages(langs);

    if (mainLang) {
      formMethods.setValue("language", mainLang);
    }
  }, [formMethods.watch("assessment_kit")]);

  return (
    <CEDialog
      {...rest}
      closeDialog={close}
      title={
        <>
          <NoteAddRoundedIcon
            sx={{
              marginInlineEnd: 1,
              marginInlineStart: "unset",
            }}
          />
          {type === "update" ? (
            <Trans i18nKey="assessment.updateAssessment" />
          ) : (
            <Trans i18nKey="assessment.createAssessment" />
          )}
        </>
      }
    >
      <FormProviderWithForm formMethods={formMethods}>
        <Grid container spacing={2} sx={styles.formGrid}>
          <Grid item xs={12} md={12}>
            <InputFieldUC
              autoFocus={true}
              defaultValue={defaultValues.title ?? ""}
              name="title"
              required
              label={<Trans i18nKey="common.title" />}
              data-cy="title"
              isFocused
            />
          </Grid>
          <Grid item xs={12} md={12}>
            <InputFieldUC
              autoFocus={false}
              defaultValue={defaultValues.shortTitle ?? null}
              name="shortTitle"
              required={false}
              label={<Trans i18nKey="assessment.shortTitle" />}
              data-cy="title"
              helperText={<Trans i18nKey="assessment.shortTitleInfo" />}
            />
          </Grid>
          <Grid item xs={12} md={7}>
            <AssessmentKitField
              staticData={staticData?.assessment_kit}
              defaultValue={defaultValues?.assessment_kit}
            />
          </Grid>
          <Grid item xs={12} md={5}>
            {" "}
            <AutocompleteAsyncField
              name="language"
              label={<Trans i18nKey="assessment.assessmentAndReportLanguage" />}
              options={languages}
              data-cy="language"
              disabled={languages.length === 1}
              required
              helperText={
                languages.length === 1 ? (
                  <Trans i18nKey="assessment.availableLanguage" />
                ) : (
                  ""
                )
              }
            />
          </Grid>
        </Grid>
        <CEDialogActions
          closeDialog={close}
          loading={loading}
          type={type}
          onSubmit={(...args) =>
            formMethods.handleSubmit((data) => onSubmit(data, ...args))()
          }
        />
      </FormProviderWithForm>
    </CEDialog>
  );
};

const AssessmentKitField = ({
  defaultValue,
  staticData,
}: {
  defaultValue: any;
  staticData: any;
}) => {
  const { service } = useServiceContext();

  const queryData = useConnectAutocompleteField({
    service: (args, config) =>
      service.assessmentKit.info.getOptions(args, config),
    accessor: "items",
  });

  return (
    <AutocompleteAsyncField
      {...(defaultValue
        ? ({ loading: false, loaded: true, options: [] } as any)
        : queryData)}
      name="assessment_kit"
      required={true}
      defaultValue={staticData ?? defaultValue}
      disabled={!!staticData || !!defaultValue}
      label={<Trans i18nKey="assessmentKit.assessmentKit" />}
      data-cy="assessment_kit"
      filterFields={["title", "mainLanguage"]}
      showIconBeforeOption={true}
    />
  );
};

export default AssessmentCEFromDialog;
