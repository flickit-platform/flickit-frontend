import { useEffect, useMemo, useState } from "react";
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
import ErrorOutlinedIcon from "@mui/icons-material/ErrorOutline";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import AssessmentErrorIcon from "@/assets/svg/assessment-error.svg";
import { IconButton } from "@mui/material";
import {
  assessmentActions,
  useAssessmentContext,
} from "@/providers/AssessmentProvider";

interface IAssessmentCEFromDialogProps extends DialogProps {
  onClose: () => void;
  onSubmitForm?: () => void;
  openDialog?: any;
  context?: any;
}

const NewAssessmentDialog = (props: IAssessmentCEFromDialogProps) => {
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
  const { langList, spaceList, queryDataSpaces } = staticData;
  const { spaceId } = useParams();
  const formMethods = useForm({ shouldUnregister: true });
  const abortController = useMemo(() => new AbortController(), [rest.open]);
  const navigate = useNavigate();
  const langSec = langList?.length > 1;
  const spaceSec = spaceList?.length > 1;
  const { dispatch } = useAssessmentContext();

  const close = () => {
    abortController.abort();
    closeDialog();
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

  const handleCreateSpaceWithSave = () => {
    dispatch(assessmentActions.setPendingKit(staticData.assessment_kit));
    closeDialog();
    navigate("/spaces/1#createSpace");
  };

  return (
    <CEDialog
      {...rest}
      closeDialog={close}
      title={
        <Box sx={{ ...styles.centerVH, gap: "6px" }}>
          {type === "create" ? (
            <NewAssessmentIcon width="20px" height="20px" color="#fff" />
          ) : (
            <img
              alt="error"
              width="20px"
              height="20px"
              src={AssessmentErrorIcon}
            />
          )}
          <Trans
            i18nKey={
              type === "create" ? "createAssessment" : "limitExceededSpaces"
            }
          />
        </Box>
      }
      titleStyle={{ marginBottom: 0 }}
      contentStyle={{ padding: "32px 32px 16px" }}
      style={{ paddingTop: "32px", background: "#F3F5F6" }}
    >
      {type === "create" ? (
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
            <Grid
              xs={12}
              sm={langSec ? 5.5 : 12}
              item
              sx={{ py: "18px", display: spaceSec ? "relative" : "none" }}
            >
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
              <SpaceField
                queryDataSpaces={queryDataSpaces}
                spaces={spaceList}
              />
            </Grid>
            <Divider
              orientation="vertical"
              flexItem
              sx={{ mx: 4, display: spaceSec ? "relative" : "none" }}
            />
            <Grid
              item
              xs={12}
              sm={spaceSec ? 5.5 : 12}
              sx={{ py: "18px", display: langSec ? "relative" : "none" }}
            >
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
        </FormProviderWithForm>
      ) : (
        <Box
          sx={{
            ...styles.centerV,
            alignItems:"flex-start",
            justifyContent: "flex-start",
            gap: "8px",
          }}
        >
          <ErrorOutlinedIcon color="error" />
          <Typography>
            <Trans i18nKey={"limitExceededSpacesDesc"} />
          </Typography>
        </Box>
      )}

      <CEDialogActions
        closeDialog={close}
        submitButtonLabel={type === "create" ? "continue" : "createSpace"}
        loading={loading}
        type={type}
        onSubmit={
          type === "create"
            ? formMethods.handleSubmit(onSubmit)
            : handleCreateSpaceWithSave
        }
      />
    </CEDialog>
  );
};

export default NewAssessmentDialog;

const LangField = ({ lang }: { lang: any }) => {
  return (
    <AutocompleteAsyncField
      name="language"
      label={<Trans i18nKey="assessmentAndReportLanguage" />}
      options={lang}
      data-cy="language"
      required={lang?.length > 1}
    />
  );
};

const SpaceField = ({
  queryDataSpaces,
  spaces,
}: {
  queryDataSpaces: any;
  spaces: any;
}) => {
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

  const defaultValue = queryDataSpaces?.options?.find(
    (item: any) => item.isDefault,
  );

  return (
    <AutocompleteAsyncField
      {...{ options: spaces }}
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
