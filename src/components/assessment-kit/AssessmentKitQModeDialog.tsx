import React, { useEffect, useMemo, useState } from "react";
import { DialogProps } from "@mui/material/Dialog";
import { useForm } from "react-hook-form";
import { Trans } from "react-i18next";
import { styles } from "@styles";
import { useServiceContext } from "@providers/ServiceProvider";
import setServerFieldErrors from "@utils/setServerFieldError";
import { ICustomError } from "@utils/CustomError";
import { useNavigate, useParams } from "react-router-dom";
import toastError from "@utils/toastError";
import { CEDialog, CEDialogActions } from "@common/dialogs/CEDialog";
import FormProviderWithForm from "@common/FormProviderWithForm";
import { useQuery } from "@utils/useQuery";
import AutocompleteAsyncField, {
  useConnectAutocompleteField,
} from "@common/fields/AutocompleteAsyncField";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { theme } from "@/config/theme";
import NewAssessmentIcon from "@utils/icons/newAssessment";
import LanguageIcon from "@mui/icons-material/Language";
import FolderOutlinedIcon from "@mui/icons-material/FolderOutlined";
import Divider from "@mui/material/Divider";

interface IAssessmentCEFromDialogProps extends DialogProps {
  onClose: () => void;
  onSubmitForm?: () => void;
  openDialog?: any;
  context?: any;
}

const AssessmentKitQModeDialog = (props: IAssessmentCEFromDialogProps) => {
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
  const assessmentId = staticData?.assessment_kit?.id
  const { spaceId } = useParams();
  const formMethods = useForm({ shouldUnregister: true });
  const abortController = useMemo(() => new AbortController(), [rest.open]);
  const navigate = useNavigate();

  const [lang, setLang] = useState<any>([]);
  const queryData = useQuery({
    service: (args, config) =>
        service.assessmentKit.info.getOptions(args, config),
    accessor: "items",
  });

  useEffect(() => {
    const listKits = async () => {
      const kits = await queryData.query();
      const { languages } = kits.find((kit: any) => kit.id == assessmentId);
      setLang(languages);
    };
    listKits();
  }, [assessmentId]);

  const close = () => {
    abortController.abort();
    closeDialog();
    setIsSubmitted(false);
    !!staticData.assessment_kit &&
      createdKitSpaceId &&
      navigate(`/${createdKitSpaceId}/assessments/1`);
    if (window.location.hash) {
      history.replaceState(null, "", window.location.pathname + window.location.search);
    }
  };
  useEffect(() => {
    return () => {
      abortController.abort();
    };
  }, []);

  const onSubmit = async (data: any, event: any, shouldView?: boolean) => {
    const { space, title, language } = data;
    const selectLang = lang.length == 1 ? lang[0].code : language.code
    setLoading(true);
    try {
       await service.assessments.info
            .create(
              {
                data: {
                  spaceId: spaceId ?? space?.id,
                  assessmentKitId: assessmentId,
                  lang: selectLang,
                  title: selectLang  == "EN" ? "Untitled" : "بدون عنوان"
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
      setCreatedKitSpaceId(spaceId ?? space?.id);
    } catch (e) {
      const err = e as ICustomError;
      setLoading(false);
      setServerFieldErrors(err, formMethods);
      formMethods.clearErrors();
      toastError(err);
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

  return (
    <CEDialog
      {...rest}
      closeDialog={close}
      title={
        <Box sx={{ ...styles.centerVH, gap: "6px" }}>
          <NewAssessmentIcon width="20px" height="20px" color="#fff" />
          <Trans i18nKey="createAssessment" />
        </Box>
      }
      titleStyle={{ marginBottom: 0 }}
      contentStyle={{ padding: "32px 32px 16px" }}
      style={{ paddingTop: "32px", background: "#F3F5F6" }}
    >
      <FormProviderWithForm formMethods={formMethods}>
        <Typography
          sx={{
            ...theme.typography.semiBoldLarge,
            color: "#2B333B",
            pb: "32px",
          }}
        >
          <Trans i18nKey={"createAssessmentConfirmSettings"} />
        </Typography>
        <Box display="flex" alignItems="start">
          <Box  flex={1} sx={{ py: "18px" }}>
            <Box
              sx={{
                ...styles.centerVH,
                justifyContent: "flex-start",
                gap: "8px",
                mb: "8px",
              }}
            >
              <FolderOutlinedIcon
                sx={{ color: "#6C8093", background: "transparent" }}
              />
              <Typography>
                <Trans i18nKey={"spaces"} />
              </Typography>
            </Box>
            <Typography
              sx={{
                ...theme.typography.bodySmall,
                color: "#2B333B",
                mb: "42px",
                minHeight: "55px",
              }}
            >
              <Trans i18nKey={"chooseSpace"} />
            </Typography>
            <SpaceField />
          </Box>
          <Divider orientation="vertical" flexItem sx={{ mx: 4 }} />
          <Box flex={1} sx={{ py: "18px" }}>
            <Box
              sx={{
                ...styles.centerVH,
                justifyContent: "flex-start",
                gap: "8px",
                mb: "8px",
              }}
            >
              <LanguageIcon
                sx={{ color: "#6C8093", background: "transparent" }}
              />
              <Typography>
                <Trans i18nKey={"assessmentLanguage"} />
              </Typography>
            </Box>
            <Typography
              sx={{
                ...theme.typography.bodySmall,
                color: "#2B333B",
                mb: "42px",
                minHeight: "55px",
              }}
            >
              <Trans i18nKey={"assessmentSupportsMultipleLanguages"} />
            </Typography>
            <LangField lang={lang} />
          </Box>
        </Box>
        <CEDialogActions
          closeDialog={close}
          submitButtonLabel="continue"
          loading={loading}
          type={type}
          onSubmit={formMethods.handleSubmit(onSubmit)}
        />
      </FormProviderWithForm>
    </CEDialog>
  );
};

export default AssessmentKitQModeDialog;

const LangField = ({lang} : {lang: any}) => {
  return (
    <AutocompleteAsyncField
      name="language"
      label={<Trans i18nKey="assessmentAndReportLanguage" />}
      options={lang}
      data-cy="language"
      required ={lang.length > 1}
    />
  );
};

const SpaceField = () => {
  const { service } = useServiceContext();
  const { spaceId } = useParams();
  const queryData = useConnectAutocompleteField({
    service: (args, config) => service.space.topSpaces(args, config),
  })

  const createSpaceQueryData = useQuery({
    service: (args, config) => service.space.create(args, config),
    runOnMount: false,
  });

  const createItemQuery = async (inputValue: any) => {
    const response = await createSpaceQueryData.query({
      title: inputValue,
      type: "BASIC",
    });
    const newOption = { title: inputValue, id: response.id };
    return newOption;
  };

  const defaultValue = queryData?.options?.find( (item: any) => item.isDefault)

  return (
    <AutocompleteAsyncField
      {...queryData}
      name="space"
      required={true}
      disabled={!!spaceId}
      defaultValue={defaultValue}
      label={<Trans i18nKey="space" />}
      data-cy="space"
      hasAddBtn={true}
      createItemQuery={createItemQuery}
      searchable={false}
    />
  );
};
