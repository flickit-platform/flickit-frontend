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
import AutocompleteAsyncField from "@common/fields/AutocompleteAsyncField";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { theme } from "@/config/theme";
import NewAssessmentIcon from "@utils/icons/newAssessment";
import LanguageIcon from "@mui/icons-material/Language";
import FolderOutlinedIcon from "@mui/icons-material/FolderOutlined";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";

interface IAssessmentCEFromDialogProps extends DialogProps {
  onClose: () => void;
  onSubmitForm?: () => void;
  openDialog?: any;
  context?: any;
}

const AssessmentKitQModeDialog = (props: IAssessmentCEFromDialogProps) => {
  const [loading, setLoading] = useState(false);
  const [createdKitSpaceId, setCreatedKitSpaceId] = useState(undefined);
  const { service } = useServiceContext();

  const {
    onClose: closeDialog,
    onSubmitForm,
    context = {},
    openDialog,
    ...rest
  } = props;

  const { type, staticData = {} } = context;
  const assessmentId = staticData?.assessment_kit?.id;
  const { langList, spaceList, queryDataSpaces } = staticData
  const { spaceId } = useParams();
  const formMethods = useForm({ shouldUnregister: true });
  const abortController = useMemo(() => new AbortController(), [rest.open]);
  const navigate = useNavigate();
  const [displaySection,setDisplaySection] = useState({langSec: false, spaceSec: false})

  useEffect(()=>{
    if(spaceList?.length > 1 ){
      setDisplaySection((prev: any) => ({...prev, spaceSec : true}))
    }
    if(langList?.length > 1 ){
      setDisplaySection((prev: any) => ({...prev, langSec : true}))
    }
  },[spaceList, langList])

  const close = () => {
    abortController.abort();
    closeDialog();
    setDisplaySection({langSec: false, spaceSec: false})
    !!staticData.assessment_kit &&
      createdKitSpaceId &&
      navigate(`/${createdKitSpaceId}/assessments/1`);
    if (window.location.hash) {
      history.replaceState(
        null,
        "",
        window.location.pathname + window.location.search,
      );
    }
  };

  const onSubmit = async (data: any, event: any, shouldView?: boolean) => {
    const { space, language } = data;
    const spaceIdNumber = spaceId ?? space?.id;
    const selectLang = langList.length == 1 ? langList[0].code : language.code;
    setLoading(true);
    try {
      await service.assessments.info
        .create(
          {
            data: {
              spaceId: spaceIdNumber,
              assessmentKitId: assessmentId,
              lang: selectLang,
              title: selectLang == "EN" ? "Untitled" : "بدون عنوان",
            },
          },
          { signal: abortController.signal },
        )
        .then((res: any) => {
          if (window.location.hash) {
            history.replaceState(
              null,
              "",
              window.location.pathname + window.location.search,
            );
          }
          return navigate(
            `/${spaceIdNumber}/assessments/1/${res.data?.id}/questionnaires`,
          );
        });
      setLoading(false);
      if (onSubmitForm !== undefined) {
        onSubmitForm();
      }
      setCreatedKitSpaceId(spaceIdNumber);
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
        <Grid container display="flex" alignItems="start">
          <Grid  xs={12} sm={displaySection.langSec ? 5.5 : 12} item sx={{ py: "18px" ,display: displaySection.spaceSec ? "relative" : "none" }}>
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
                <Trans i18nKey={"targetSpace"} />
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
            <SpaceField queryData={queryDataSpaces} />
          </Grid>
          <Divider orientation="vertical" flexItem sx={{ mx: 4, display: displaySection.spaceSec ? "relative" : "none" }} />
          <Grid  item xs={12} sm={displaySection.spaceSec ? 5.5 : 12} sx={{ py: "18px", display: displaySection.langSec ? "relative" : "none" }}>
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
            <LangField lang={langList} />
          </Grid>
        </Grid>
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

const LangField = ({ lang }: { lang: any }) => {
  return (
    <AutocompleteAsyncField
      name="language"
      label={<Trans i18nKey="assessmentAndReportLanguage" />}
      options={lang}
      data-cy="language"
      required={lang.length > 1}
    />
  );
};

const SpaceField = ({ queryData }: { queryData: any }) => {
  const { service } = useServiceContext();
  const { spaceId } = useParams();

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

  const defaultValue = queryData?.options?.find((item: any) => item.isDefault);

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
