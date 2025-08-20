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
import { Link, useNavigate, useParams } from "react-router-dom";
import { CEDialog, CEDialogActions } from "@common/dialogs/CEDialog";
import FormProviderWithForm from "@common/FormProviderWithForm";
import AutocompleteAsyncField, {
  useConnectAutocompleteField,
} from "@common/fields/AutocompleteAsyncField";
import CheckmarkGif from "../common/success/Checkmark";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import showToast from "@utils/toastError";
import { useAuthContext } from "@/providers/AuthProvider";

interface IAssessmentCEFromDialogProps extends DialogProps {
  onClose: () => void;
  onSubmitForm?: () => void;
  openDialog?: any;
  context?: any;
}

const AssessmentCEFromDialog = (props: IAssessmentCEFromDialogProps) => {
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedTitle, setSubmittedTitle] = useState("");
  const [isFocused, setIsFocused] = useState(true);
  const [createdKitId, setCreatedKitId] = useState("");
  const [createdKitSpaceId, setCreatedKitSpaceId] = useState(undefined);
  const { service } = useServiceContext();
  const {
    onClose: closeDialog,
    onSubmitForm,
    context = {},
    openDialog,
    ...rest
  } = props;
  const { type, data = {}, staticData = {} } = context;
  const { id: assessmentId } = data;
  const defaultValues = type === "update" ? data : {};
  const { spaceId } = useParams();
  const formMethods = useForm({ shouldUnregister: true });
  const abortController = useMemo(() => new AbortController(), [rest.open]);
  const navigate = useNavigate();
  const close = () => {
    abortController.abort();
    closeDialog();
    setIsSubmitted(false);
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
        : await service.assessments.info
            .create(
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
            )
            .then((res: any) => {
              setCreatedKitId(res.data?.id);
            });
      setLoading(false);
      setSubmittedTitle(title);
      setIsSubmitted(true);
      if (onSubmitForm !== undefined) {
        onSubmitForm();
      }
      if (type === "update") {
        close();
      }
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
      {!isSubmitted ? (
        <FormProviderWithForm formMethods={formMethods}>
          <Grid container spacing={2} sx={styles.formGrid}>
            <Grid item xs={12} md={12}>
              <InputFieldUC
                autoFocus={true}
                defaultValue={defaultValues.title ?? ""}
                name="title"
                required={true}
                label={<Trans i18nKey="common.title" />}
                data-cy="title"
                isFocused={isFocused}
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
                label={
                  <Trans i18nKey="assessment.assessmentAndReportLanguage" />
                }
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
            onSubmit={formMethods.handleSubmit(onSubmit)}
          />
        </FormProviderWithForm>
      ) : (
        <FormProviderWithForm formMethods={formMethods}>
          <Box textAlign="center" sx={{ ...styles.centerCVH }}>
            <CheckmarkGif />
            <Typography variant="titleLarge">
              <Trans
                i18nKey="assessment.successCreatedAssessmentTitleFirstPart"
                values={{ title: submittedTitle }}
              />{" "}
              <Typography variant="headlineMedium">{submittedTitle}</Typography>{" "}
              <Trans
                i18nKey="assessment.successCreatedAssessmentTitleSecondPart"
                values={{ title: submittedTitle }}
              />
            </Typography>
            <Typography variant="displaySmall" mt={2}>
              <Trans i18nKey="assessment.successCreatedAssessmentMessage" />
            </Typography>
          </Box>
          <CEDialogActions
            closeDialog={close}
            loading={loading}
            type={undefined}
            cancelLabel="common.close"
            hideSubmitButton
          >
            <Link
              to={`/${
                spaceId ?? createdKitSpaceId ?? defaultSpaceId
              }/assessments/1/${createdKitId}/settings/`}
              style={{ textDecoration: "none" }}
            >
              <Button variant="contained">
                <Trans i18nKey="assessment.assessmentSettings" />
              </Button>
            </Link>
          </CEDialogActions>
        </FormProviderWithForm>
      )}
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
    />
  );
};

export default AssessmentCEFromDialog;
