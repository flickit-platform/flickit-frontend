import { Fragment, SyntheticEvent, useEffect, useMemo, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import { useServiceContext } from "@/providers/service-provider";
import { useParams } from "react-router-dom";
import { useQuery } from "@/hooks/useQuery";
import { Trans } from "react-i18next";
import Tab from "@mui/material/Tab";
import TabList from "@mui/lab/TabList";
import { styles, getMaturityLevelColors } from "@styles";
import TabPanel from "@mui/lab/TabPanel";
import TabContext from "@mui/lab/TabContext";
import Tabs from "@mui/material/Tabs";
import Grid from "@mui/material/Grid";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Divider from "@mui/material/Divider";
import AssessmentKitSectionGeneralInfo from "./AssessmentKitSectionGeneralInfo";
import ListAccordion from "@common/lists/ListAccordion";
import setDocumentTitle from "@utils/setDocumentTitle";
import i18next, { t } from "i18next";
import useDialog from "@/hooks/useDialog";
import SupTitleBreadcrumb from "@common/SupTitleBreadcrumb";
import languageDetector from "@/utils/language-detector";
import { ICustomError } from "@/utils/custom-error";
import CloudDownloadRoundedIcon from "@mui/icons-material/CloudDownloadRounded";
import CloudUploadRoundedIcon from "@mui/icons-material/CloudUploadRounded";
import { CEDialog, CEDialogActions } from "@common/dialogs/CEDialog";
import { useForm } from "react-hook-form";
import UploadField from "@common/fields/UploadField";
import FormProviderWithForm from "@common/FormProviderWithForm";
import { AssessmentKitDetailsType } from "@/types/index";
import convertToBytes from "@/utils/convert-to-bytes";
import { useConfigContext } from "@/providers/config-provider";
import LoadingButton from "@mui/lab/LoadingButton";
import uniqueId from "@/utils/unique-id";
import showToast from "@/utils/toast-error";
import Title from "@common/Title";
import { Text } from "../common/Text";

const AssessmentKitExpertViewContainer = () => {
  const { fetchAssessmentKitDetailsQuery, fetchAssessmentKitDownloadUrlQuery } =
    useAssessmentKit();
  const dialogProps = useDialog();
  const { config } = useConfigContext();
  const [forceUpdate, setForceUpdate] = useState<boolean>(false);
  const { expertGroupId, assessmentKitId = "" } = useParams();
  const [details, setDetails] = useState<AssessmentKitDetailsType>();
  const [expertGroup, setExpertGroup] = useState<any>();
  const [assessmentKitTitle, setAssessmentKitTitle] = useState<any>();
  const [hasActiveVersion, setHasActiveVersion] = useState<any>(false);
  const [loaded, setLoaded] = useState<boolean>(false);
  const [loadingExportBtn, setLoadingExportBtn] = useState<boolean>(false);

  const { service } = useServiceContext();

  const AssessmentKitDetails = async () => {
    const data: AssessmentKitDetailsType = hasActiveVersion
      ? await fetchAssessmentKitDetailsQuery.query()
      : undefined;
    setDetails(data);
  };
  const handleDownload = async () => {
    try {
      const response = await fetchAssessmentKitDownloadUrlQuery.query();
      const fileUrl = response.url;
      const a = document.createElement("a");
      a.href = fileUrl;
      a.download = `${assessmentKitTitle}.zip`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (e) {
      const err = e as ICustomError;
      showToast(err);
    }
  };
  const handleExport = async () => {
    setLoadingExportBtn(true);
    service.assessmentKit.dsl
      .getExportUrl({ assessmentKitId }, {})
      .then((res) => {
        setLoadingExportBtn(false);
        const { data } = res;
        const zipFile = new Blob([data], { type: "application/zip" });
        const blobUrl = URL.createObjectURL(zipFile);
        const a = document.createElement("a");
        a.href = blobUrl;
        a.download = `export-${assessmentKitTitle}.zip`;
        document.body.appendChild(a);
        a.click();
        a.remove();
      })
      .catch((e) => {
        setLoadingExportBtn(false);
        const err = e as ICustomError;
        showToast(err);
      });
  };
  useEffect(() => {
    if (!loaded) {
      AssessmentKitDetails();
    }
  }, [loaded, forceUpdate, hasActiveVersion]);
  useEffect(() => {
    setDocumentTitle(
      `${t("assessmentKit.assessmentKit")}: ${assessmentKitTitle ?? ""}`,
      config.appTitle,
    );
  }, [assessmentKitTitle]);
  return (
    <Box>
      <Box flexDirection={{ xs: "column", sm: "row" }}>
        <Title
          backLink={"/"}
          size="large"
          wrapperProps={{
            sx: {
              flexDirection: { xs: "column", md: "row" },
              alignItems: { xs: "flex-start", md: "flex-end" },
            },
          }}
          sup={
            <SupTitleBreadcrumb
              routes={[
                {
                  title: t("expertGroups.expertGroups") as string,
                  to: `/user/expert-groups`,
                },
                {
                  title: expertGroup?.title,
                  to: `/user/expert-groups/${expertGroupId}`,
                },
                {
                  title: assessmentKitTitle,
                },
              ]}
              displayChip
            />
          }
          toolbar={
            <Box>
              <Button
                variant="contained"
                size="small"
                sx={{ ml: 2 }}
                onClick={() => {
                  dialogProps.openDialog({});
                }}
              >
                <Text marginInlineEnd={1} variant="button">
                  <Trans i18nKey="assessmentKit.updateDSL" />
                </Text>
                <CloudUploadRoundedIcon />
              </Button>
              <LoadingButton
                variant="contained"
                loading={loadingExportBtn}
                size="small"
                sx={{ ml: 2 }}
                onClick={handleExport}
              >
                <Text marginInlineEnd={1} variant="button">
                  <Trans i18nKey="assessmentKit.exportDSL" />
                </Text>
                <CloudDownloadRoundedIcon />
              </LoadingButton>
              <Button
                variant="contained"
                size="small"
                sx={{ ml: 2 }}
                onClick={handleDownload}
              >
                <Text marginInlineEnd={1} variant="button">
                  <Trans i18nKey="assessmentKit.downloadDSL" />
                </Text>
                <CloudDownloadRoundedIcon />
              </Button>
            </Box>
          }
        >
          {assessmentKitTitle}
        </Title>
        <Box mt={3}>
          <AssessmentKitSectionGeneralInfo
            setExpertGroup={setExpertGroup}
            setAssessmentKitTitle={setAssessmentKitTitle}
            setHasActiveVersion={setHasActiveVersion}
          />
          <UpdateAssessmentKitDialog
            setForceUpdate={setForceUpdate}
            setLoaded={setLoaded}
            loaded={loaded}
            {...dialogProps}
          />
          <AssessmentKitSectionsTabs update={forceUpdate} details={details} />
        </Box>
      </Box>
    </Box>
  );
};
const AssessmentKitSectionsTabs = (props: {
  details: any;
  update: boolean;
}) => {
  const [value, setValue] = useState("maturityLevels");
  const handleTabChange = (event: SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };
  const { details, update } = props;
  return (
    <Box mt={6}>
      {details && (
        <TabContext value={value}>
          <Box>
            <TabList onChange={handleTabChange}>
              <Tab
                label={
                  <Box sx={{ ...styles.centerV }}>
                    <Trans i18nKey="common.maturityLevels" />
                  </Box>
                }
                value="maturityLevels"
              />
              <Tab
                label={
                  <Box sx={{ ...styles.centerV }}>
                    <Trans i18nKey="common.subjects" />
                  </Box>
                }
                value="subjects"
              />
              <Tab
                label={
                  <Box sx={{ ...styles.centerV }}>
                    <Trans i18nKey="common.questionnaires" />
                  </Box>
                }
                value="questionnaires"
              />
            </TabList>
          </Box>
          <TabPanel value="subjects" sx={{ py: { xs: 1, sm: 3 }, px: 0.2 }}>
            <AssessmentKitSubjects details={details.subjects} update={update} />
          </TabPanel>
          <TabPanel
            value="questionnaires"
            sx={{ py: { xs: 1, sm: 3 }, px: 0.2 }}
          >
            <AssessmentKitQuestionnaires
              update={update}
              details={details.questionnaires}
            />
          </TabPanel>
          <TabPanel
            value="maturityLevels"
            sx={{ py: { xs: 1, sm: 3 }, px: 0.2 }}
          >
            <MaturityLevelsDetails
              maturity_levels={details?.maturityLevels}
              update={update}
            />
          </TabPanel>
        </TabContext>
      )}
    </Box>
  );
};
const AssessmentKitSubjects = (props: { details: any[]; update: boolean }) => {
  const { details, update } = props;
  const [expanded, setExpanded] = useState<string | false>(false);
  const [assessmentKitSubjectDetails, setAssessmentKitSubjectDetails] =
    useState<any>();
  const [subjectId, setSubjectId] = useState<any>();
  const { fetchAssessmentKitSubjectDetailsQuery } = useAssessmentKit();
  const { assessmentKitId } = useParams();
  const handleChange =
    (panel: any) => (event: SyntheticEvent, isExpanded: boolean) => {
      if (isExpanded) {
        setSubjectId(panel?.id);
      }
      setExpanded(isExpanded ? panel?.title : false);
    };
  useEffect(() => {
    if (subjectId) {
      fetchAssessmentKitSubjectDetail();
    }
  }, [subjectId, update]);
  const fetchAssessmentKitSubjectDetail = async () => {
    const data = await fetchAssessmentKitSubjectDetailsQuery.query({
      assessmentKitId: assessmentKitId,
      subjectId: subjectId,
    });
    setAssessmentKitSubjectDetails(data);
  };

  return (
    <Box>
      {details.map((subject) => {
        const isExpanded = expanded === subject.title;
        return (
          <Accordion
            key={subject?.id}
            expanded={isExpanded}
            onChange={handleChange(subject)}
            sx={{
              mb: 1,
              borderRadius: 2,
              bgcolor: "background.containerLowest",
              boxShadow: "none",
              border: "none,",
              "&::before": {
                display: "none",
              },
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon sx={{ color: "#287c71" }} />}
              aria-controls="panel1bh-content"
              id="panel1bh-header"
            >
              <Text flex={1} fontSize="1.2rem" fontWeight="bold" variant="h6">
                {subject.index}.{subject.title}
              </Text>
            </AccordionSummary>
            <AccordionDetails>
              <Box p={1}>
                <Grid container spacing={2} mb={1}>
                  <Grid item xs={12} sm={7} md={8} lg={9}>
                    <Box
                      display="flex"
                      bgcolor="background.containerLowest"
                      py={0.6}
                      px={1}
                      borderRadius={1}
                    >
                      <Text variant="body2">
                        <Trans i18nKey="assessmentKit.numberOfQuestions" />:
                      </Text>
                      <Text variant="body2" ml={2} fontWeight="bold">
                        {assessmentKitSubjectDetails?.questionsCount}
                      </Text>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={7} md={8} lg={9}>
                    <Box
                      display="flex"
                      bgcolor="background.containerLowest"
                      py={0.6}
                      px={1}
                      borderRadius={1}
                    >
                      <Text variant="body2">
                        <Trans i18nKey="common.description" />:
                      </Text>
                      <Text variant="body2" ml={2} fontWeight="bold">
                        {assessmentKitSubjectDetails?.description}
                      </Text>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
              <Divider />
              <Box m={1} mt={2}>
                <Text variant="titleMedium">
                  <Trans i18nKey="common.attributes" />
                </Text>
                {assessmentKitSubjectDetails && (
                  <ListAccordion
                    items={assessmentKitSubjectDetails.attributes}
                    renderItem={(item, index, isExpanded) => {
                      return (
                        <Fragment key={item?.id}>
                          <Box
                            display="flex"
                            alignItems={isExpanded ? "stretch" : "center"}
                            flexDirection={isExpanded ? "column" : "row"}
                          >
                            <Text
                              variant="body1"
                              fontWeight="bold"
                              minWidth="180px"
                            >
                              {index + 1}.{item.title}
                            </Text>
                          </Box>
                          <AssessmentKitQuestionsList
                            isExpanded={isExpanded}
                            attributeId={item.id}
                          />
                        </Fragment>
                      );
                    }}
                  />
                )}
              </Box>
            </AccordionDetails>
          </Accordion>
        );
      })}
    </Box>
  );
};
const AssessmentKitQuestionnaires = (props: {
  details: any[];
  update: boolean;
}) => {
  const { details, update } = props;
  const [expanded, setExpanded] = useState<string | false>(false);
  const [questionnaireId, setQuestionnaireId] = useState<any>();
  const [questionnaireDetails, setQuestionnaireDetails] = useState<any>();
  const { fetchAssessmentKitQuestionnairesQuery } = useAssessmentKit();
  const { assessmentKitId } = useParams();
  const handleChange =
    (panel: any) => (event: SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel.title : false);
      setQuestionnaireId(panel.id);
    };
  useEffect(() => {
    if (questionnaireId) {
      fetchAssessmentKitQuestionnaires();
    }
  }, [questionnaireId, update]);
  const fetchAssessmentKitQuestionnaires = async () => {
    const data = await fetchAssessmentKitQuestionnairesQuery.query({
      assessmentKitId: assessmentKitId,
      questionnaireId: questionnaireId,
    });
    setQuestionnaireDetails(data);
  };
  return (
    <Box>
      {details.map((questionnaire) => {
        const isExpanded = expanded === questionnaire.title;
        return (
          <Accordion
            key={questionnaire?.id}
            expanded={isExpanded}
            onChange={handleChange(questionnaire)}
            sx={{
              mb: 1,
              borderRadius: 2,
              bgcolor: "background.containerLowest",
              boxShadow: "none",
              border: "none,",
              "&::before": {
                display: "none",
              },
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon sx={{ color: "#287c71" }} />}
              aria-controls="panel1bh-content"
              id="panel1bh-header"
            >
              <Text flex={1} fontWeight="bold" fontSize="1.2rem" variant="h6">
                {questionnaire.index}.{questionnaire.title}
              </Text>
            </AccordionSummary>
            <AccordionDetails>
              <Grid item xs={12} sm={7} md={8} lg={9}>
                <Box
                  display="flex"
                  bgcolor="background.containerLowest"
                  py={0.6}
                  px={1}
                  borderRadius={1}
                >
                  <Text variant="body2">
                    <Trans i18nKey="assessmentKit.numberOfQuestions" />:
                  </Text>
                  <Text variant="body2" ml={2} fontWeight="bold">
                    {questionnaireDetails?.questionsCount}
                  </Text>
                </Box>
              </Grid>
              <Grid item xs={12} sm={7} md={8} lg={9}>
                <Box
                  display="flex"
                  bgcolor="background.containerLowest"
                  py={0.6}
                  px={1}
                  borderRadius={1}
                >
                  <Text variant="body2">
                    <Trans i18nKey="assessmentKit.relatedSubjects" />:
                  </Text>
                  {questionnaireDetails?.relatedsubjects?.map(
                    (subject: string) => (
                      <Text
                        variant="body2"
                        ml={2}
                        fontWeight="bold"
                        key={uniqueId()}
                      >
                        {subject}
                      </Text>
                    ),
                  )}
                </Box>
              </Grid>
              <Grid item xs={12} sm={7} md={8} lg={9}>
                <Box
                  display="flex"
                  bgcolor="background.containerLowest"
                  py={0.6}
                  px={1}
                  borderRadius={1}
                  my={2}
                >
                  <Text variant="body2">
                    <Trans i18nKey="common.description" />:
                  </Text>
                  <Text variant="body2" sx={{ ml: 2 }} fontWeight="bold">
                    {questionnaireDetails?.description}
                  </Text>
                </Box>
              </Grid>
              <Divider />
              <QuestionnairesQuestionList
                questions={questionnaireDetails?.questions}
              />
            </AccordionDetails>
          </Accordion>
        );
      })}
    </Box>
  );
};
const AssessmentKitQuestionsList = (props: {
  attributeId: number;
  isExpanded: boolean;
}) => {
  const { attributeId, isExpanded } = props;
  const {
    fetchAssessmentKitSubjectAttributesDetailsQuery,
    fetchMaturityLevelQuestionsQuery,
  } = useAssessmentKit();
  const { assessmentKitId } = useParams();
  const [attributesDetails, setAttributesDetails] = useState<any>();
  const [maturityLevelQuestions, setMaturityLevelQuestions] = useState<any>();

  const fetchAttributesDetails = async () => {
    const data = await fetchAssessmentKitSubjectAttributesDetailsQuery.query({
      assessmentKitId: assessmentKitId,
      attributeId: attributeId,
    });
    setAttributesDetails(data);
  };
  const fetchMaturityLevelQuestions = async () => {
    const data = await fetchMaturityLevelQuestionsQuery.query({
      assessmentKitId: assessmentKitId,
      attributeId: attributeId,
      maturityLevelId: value,
    });
    setMaturityLevelQuestions(data);
  };
  useEffect(() => {
    if (isExpanded && attributeId) {
      fetchAttributesDetails();
    }
  }, [isExpanded]);
  const [value, setValue] = useState("");
  const [selectedTabIndex, setSelectedTabIndex] = useState("");
  const handleTabChange = (event: SyntheticEvent, newValue: string) => {
    setValue(newValue);
    setSelectedTabIndex(
      attributesDetails?.maturityLevels.findIndex(
        (obj: any) => obj.id === newValue,
      ),
    );
  };
  const colorPallet = getMaturityLevelColors(
    attributesDetails?.maturityLevels
      ? attributesDetails?.maturityLevels.length
      : 5,
  );
  useEffect(() => {
    if (value) {
      fetchMaturityLevelQuestions();
    }
  }, [value]);
  return (
    <Box m={1} mt={5}>
      <Grid item xs={12} sm={7} md={8} lg={9}>
        <Box
          display="flex"
          bgcolor="background.containerLowest"
          py={0.6}
          px={1}
          borderRadius={1}
        >
          <Text variant="body2">
            <Trans i18nKey="assessmentKit.numberOfQuestions" />:
          </Text>
          <Text variant="body2" ml={2} fontWeight="bold">
            {attributesDetails?.questionCount}
          </Text>
        </Box>
      </Grid>
      <Grid item xs={12} sm={7} md={8} lg={9}>
        <Box
          display="flex"
          bgcolor="background.containerLowest"
          py={0.6}
          px={1}
          borderRadius={1}
        >
          <Text variant="body2">
            <Trans i18nKey="common.weight" />:
          </Text>
          <Text variant="body2" sx={{ ml: 2 }} fontWeight="bold">
            {attributesDetails?.weight}
          </Text>
        </Box>
      </Grid>
      <Grid item xs={12} sm={7} md={8} lg={9}>
        <Box
          display="flex"
          bgcolor="background.containerLowest"
          py={0.6}
          px={1}
          borderRadius={1}
        >
          <Text variant="body2">
            <Trans i18nKey="common.description" />:
          </Text>
          <Text variant="body2" sx={{ ml: 2 }} fontWeight="bold">
            {attributesDetails?.description}
          </Text>
        </Box>
      </Grid>
      <Box mt={4}>
        <TabContext value={value}>
          <Box>
            <Tabs
              value={value}
              onChange={handleTabChange}
              sx={{
                "& .MuiTabs-indicator": {
                  backgroundColor: `${
                    colorPallet[selectedTabIndex ?? 0]
                  } !important`,
                },
              }}
            >
              {attributesDetails?.maturityLevels.map(
                (item: any, index: number) => {
                  return (
                    <Tab
                      key={uniqueId()}
                      sx={{
                        "&.Mui-selected": {
                          color: `${colorPallet[index]}  !important`,
                          bgcolor: `transparent  !important`,
                        },
                        "&:hover": {
                          backgroundColor: "#e1dede !important",
                          color: `${colorPallet[index]} !important`,
                        },
                        bgcolor: `${colorPallet[index]}  !important`,
                        color: (theme) =>
                          theme.palette.background.containerLowest +
                          " !important",
                      }}
                      label={
                        <Box sx={{ ...styles.centerV }}>
                          {item.title}|{item.questionCount}
                        </Box>
                      }
                      value={item.id}
                    />
                  );
                },
              )}
            </Tabs>
          </Box>
          <TabPanel value={value} sx={{ py: { xs: 1, sm: 3 }, px: 0.2 }}>
            {maturityLevelQuestions && (
              <SubjectQuestionList
                questions={maturityLevelQuestions?.questions}
                questions_count={maturityLevelQuestions?.questionsCount}
              />
            )}
          </TabPanel>
        </TabContext>
      </Box>
    </Box>
  );
};
const UpdateAssessmentKitDialog = (props: any) => {
  const {
    onClose: closeDialog,
    setForceUpdate,
    setLoaded,
    loaded,
    ...rest
  } = props;
  const { service } = useServiceContext();
  const formMethods = useForm({ shouldUnregister: true });
  const abortController = useMemo(() => new AbortController(), [rest.open]);
  const [showErrorLog, setShowErrorLog] = useState<boolean>(false);
  const [syntaxErrorObject, setSyntaxErrorObject] = useState<any>();
  const [updateErrorObject, setUpdateErrorObject] = useState<any>();
  const { assessmentKitId } = useParams();
  const { expertGroupId } = useParams();
  const setIsValid = () => {
    return false;
  };
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
    setLoaded(true);
    try {
      await service.assessmentKit.dsl.updateKitFromDsl(
        { data: formattedData, assessmentKitId: assessmentKitId },
        { signal: abortController.signal },
      );
      setForceUpdate((prev: boolean) => !prev);
      setLoaded(false);
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
      setLoaded(false);
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
            setIsValid={setIsValid}
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
        loading={loaded}
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
          <CloudUploadRoundedIcon
            sx={{ marginInlineEnd: 1, marginInlineStart: "unset" }}
          />
          {<Trans i18nKey="assessmentKit.updateDSL" />}
        </>
      }
    >
      {!showErrorLog ? formContent : syntaxErrorContent}
    </CEDialog>
  );
};
const SubjectQuestionList = (props: any) => {
  const { questions } = props;
  const [expanded, setExpanded] = useState<string | false>(false);
  const handleChange =
    (panel: any) => (event: SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel?.title : false);
    };

  return (
    <Box>
      {questions[0] && (
        <Box m={1} mt={2}>
          <Text variant="titleMedium">
            <Trans i18nKey="common.questions" />
          </Text>
        </Box>
      )}
      {questions.map((question: any, index: number) => {
        const is_farsi = languageDetector(question.title);
        const isExpanded = expanded === question.title;
        return (
          <Accordion
            key={question?.id}
            expanded={isExpanded}
            onChange={handleChange(question)}
            sx={{
              mt: 2,
              mb: 1,
              paddingInlineStart: 2,
              borderRadius: 2,
              bgcolor: "background.containerLowest",
              boxShadow: "none",
              border: "none",
              "&::before": {
                display: "none",
              },
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon sx={{ color: "#287c71" }} />}
              aria-controls="panel1bh-content"
              id="panel1bh-header"
            >
              <Box flex={1} display="flex" flexWrap="wrap" fontWeight="bold">
                <Text variant="body2" fontWeight="bold">
                  {index + 1}.{question.title}
                </Text>
                {question.mayNotBeApplicable && (
                  <Box
                    borderRadius="8px"
                    bgcolor="#1976D2"
                    color="background.containerLowest"
                    fontSize=".75rem"
                    px="12px"
                    mx="4px"
                    height="24px"
                    sx={{ ...styles.centerVH }}
                  >
                    <Text variant="body2" fontWeight="bold">
                      <Trans i18nKey="common.na" />
                    </Text>
                  </Box>
                )}
                <Box
                  borderRadius="8px"
                  bgcolor="#273248"
                  color="background.containerLowest"
                  fontSize=".75rem"
                  px="12px"
                  mx="4px"
                  height="24px"
                  sx={{ ...styles.centerVH }}
                >
                  <Text variant="body2" fontWeight="bold">
                    {question.questionnaire}
                  </Text>
                </Box>
                <Box
                  borderRadius="8px"
                  bgcolor="#7954B3"
                  color="background.containerLowest"
                  fontSize=".75rem"
                  px="12px"
                  mx="4px"
                  height="24px"
                  sx={{ ...styles.centerVH }}
                >
                  <Text variant="body2" fontWeight="bold">
                    <Trans
                      i18nKey="advice.weightValue"
                      values={{ weight: question.weight }}
                    />{" "}
                  </Text>
                </Box>
                {question.advisable && (
                  <Box
                    borderRadius="8px"
                    bgcolor="#004F83"
                    color="background.containerLowest"
                    fontSize=".75rem"
                    px="12px"
                    mx="4px"
                    height="24px"
                    sx={{ ...styles.centerVH }}
                  >
                    <Text variant="body2" fontWeight="bold">
                      <Trans i18nKey="advice.advisable" />
                    </Text>
                  </Box>
                )}
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ maxWidth: "max-content" }}>
                <Box
                  justifyContent="space-between"
                  borderBottom="1px solid #4979D1"
                  pb="8px"
                  sx={{ ...styles.centerV }}
                >
                  <Text
                    variant="body2"
                    fontWeight="bold"
                    ml="4px"
                    sx={{ opacity: 0.6 }}
                  >
                    <Trans i18nKey="common.options" />
                  </Text>
                  <Text
                    variant="body2"
                    fontWeight="bold"
                    ml="4px"
                    sx={{ opacity: 0.6 }}
                  >
                    <Trans i18nKey="common.value" />
                  </Text>
                </Box>
                {question.answerOptions.map((item: any) => (
                  <Box
                    key={uniqueId()}
                    justifyContent="space-between"
                    px="16px"
                    my="16px"
                    sx={{ ...styles.centerV }}
                  >
                    <Text
                      variant="subtitle2"
                      fontWeight="bold"
                      marginInlineEnd="64px"
                    >
                      {item.index}.{item.title}
                    </Text>
                    <Text variant="subtitle2" fontWeight="bold">
                      {item.value}
                    </Text>
                  </Box>
                ))}
              </Box>
            </AccordionDetails>
          </Accordion>
        );
      })}
    </Box>
  );
};
const QuestionnairesQuestionList = (props: any) => {
  const { questions } = props;
  const [expanded, setExpanded] = useState<string | false>(false);
  const [questionId, setQuestionId] = useState<any>();
  const [questionsDetails, setQuestionsDetails] = useState<any>();
  const { fetchAssessmentKitQuestionnairesQuestionsQuery } = useAssessmentKit();
  const { assessmentKitId } = useParams();

  const handleChange =
    (panel: any) => (event: SyntheticEvent, isExpanded: boolean) => {
      setQuestionId(panel.id);
      setExpanded(isExpanded ? panel?.title : false);
    };
  useEffect(() => {
    if (questionId) {
      fetchAssessmentKitQuestionnaires();
    }
  }, [questionId]);
  const fetchAssessmentKitQuestionnaires = async () => {
    const data = await fetchAssessmentKitQuestionnairesQuestionsQuery.query({
      assessmentKitId: assessmentKitId,
      questionId: questionId,
    });
    setQuestionsDetails(data);
  };
  function formatNumber(value: any) {
    if (Number.isInteger(value)) {
      return parseFloat(value).toFixed(1);
    }
    return value.toString();
  }
  return (
    <Box>
      <Box m={1} mt={2}>
        <Text variant="h6" fontWeight={"bold"} fontSize="1rem">
          <Trans i18nKey="common.questions" />
        </Text>
      </Box>

      {questions?.map((question: any, index: number) => {
        const isExpanded = expanded === question.title;
        const is_farsi = languageDetector(question.title);
        return (
          <Accordion
            key={question?.id}
            expanded={isExpanded}
            onChange={handleChange(question)}
            sx={{
              mt: 2,
              mb: 1,
              paddingInlineStart: 2,
              borderRadius: 2,
              bgcolor: "background.containerLowest",
              boxShadow: "none",
              border: "none,",
              "&::before": {
                display: "none",
              },
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon sx={{ color: "#287c71" }} />}
              aria-controls="panel1bh-content"
              id="panel1bh-header"
            >
              <Text
                display="flex"
                flex={1}
                fontWeight="bold"
                flexWrap="wrap"
                sx={{ ...styles.rtlStyle(is_farsi) }}
                variant="body2"
              >
                {index + 1}.{question.title}
                {question.mayNotBeApplicable && (
                  <Box
                    borderRadius={1}
                    bgcolor="#1976D2"
                    color="background.containerLowest"
                    fontSize="0.75rem"
                    px="12px"
                    mx="4px"
                    height="24px"
                    sx={{ ...styles.centerVH }}
                  >
                    <Trans i18nKey="common.na" />
                  </Box>
                )}
                {question.advisable && (
                  <Box
                    borderRadius={1}
                    bgcolor="#004F83"
                    color="background.containerLowest"
                    fontSize="0.75rem"
                    px="12px"
                    mx="4px"
                    height="24px"
                    sx={{ ...styles.centerVH }}
                  >
                    <Trans i18nKey="advice.advisable" />
                  </Box>
                )}
              </Text>
            </AccordionSummary>
            {questionsDetails && (
              <AccordionDetails>
                <Box
                  display="flex"
                  maxWidth="max-content"
                  mb={4}
                  ml={is_farsi ? "auto" : "2"}
                  sx={{ direction: is_farsi ? "rtl" : "ltr" }}
                >
                  {questionsDetails?.options.map((option: any) => (
                    <Text key={option.index} mx={2} variant="body2">
                      {option.index}. {option.title}
                    </Text>
                  ))}
                </Box>
                <Box sx={{ ...styles.centerH }}>
                  <Box width="90%">
                    <Box display="flex">
                      <Text
                        width="40%"
                        pb="4px"
                        color="#767676"
                        display="block"
                        fontSize="0.8rem"
                      >
                        <Trans i18nKey="affectedQualityAttribute" />
                      </Text>
                      <Text
                        width="20%"
                        pb="4px"
                        color="#767676"
                        fontSize="0.8rem"
                        sx={{ ...styles.centerVH }}
                      >
                        <Trans i18nKey="assessmentKit.affectedLevel" />
                      </Text>
                      <Text
                        width="10%"
                        pb="4px"
                        color="#767676"
                        fontSize="0.8rem"
                        sx={{ ...styles.centerVH }}
                      >
                        <Trans i18nKey="common.weight" />
                      </Text>
                      <Box
                        width="30%"
                        display="flex"
                        justifyContent="space-between"
                      >
                        {questionsDetails?.options.map(
                          (option: any, index: number) => (
                            <Text
                              key={uniqueId()}
                              color="#767676"
                              pb="4px"
                              fontSize="0.8rem"
                            >
                              <Trans
                                i18nKey="assessmentKit.optionValue"
                                values={{ index: index + 1 }}
                              />
                            </Text>
                          ),
                        )}
                      </Box>
                    </Box>
                    <Divider sx={{ bgcolor: "#7A589B" }} />
                    <Box>
                      {questionsDetails?.attributeImpacts.map(
                        (attributes: any, index: number) => {
                          return (
                            <Box
                              key={uniqueId()}
                              display="flex"
                              justifyContent="space-between"
                              borderTop={`${
                                index !== 0 && "1px solid #D3D3D3"
                              }`}
                              py={1}
                            >
                              <Text
                                width="40%"
                                py={1}
                                variant="body1"
                                fontWeight="bold"
                              >
                                {attributes.title}
                              </Text>
                              <Box width="20%" sx={{ ...styles.centerCVH }}>
                                {attributes?.affectedLevels.map(
                                  (affectedLevel: any) => {
                                    return (
                                      <Text
                                        key={uniqueId()}
                                        variant="body1"
                                        fontWeight="bold"
                                        py={1}
                                      >
                                        {affectedLevel.maturityLevel.title} |{" "}
                                        {affectedLevel.maturityLevel.index}
                                      </Text>
                                    );
                                  },
                                )}
                              </Box>
                              <Box width="10%" sx={{ ...styles.centerCVH }}>
                                {attributes?.affectedLevels.map(
                                  (affectedLevel: any) => {
                                    return (
                                      <Text
                                        key={uniqueId()}
                                        variant="body1"
                                        fontWeight={"bold"}
                                        sx={{ py: 1 }}
                                      >
                                        {affectedLevel.weight}
                                      </Text>
                                    );
                                  },
                                )}
                              </Box>
                              <Box width="30%" sx={{ ...styles.centerCVH }}>
                                {attributes?.affectedLevels.map(
                                  (affectedLevel: any) => {
                                    return (
                                      <Box
                                        key={uniqueId()}
                                        sx={{
                                          display: "flex",
                                          justifyContent: "space-between",
                                          width: "100%",
                                        }}
                                      >
                                        {affectedLevel.optionValues.map(
                                          (option: any) => {
                                            return (
                                              <Text
                                                key={uniqueId()}
                                                variant="body1"
                                                fontWeight={"bold"}
                                                sx={{
                                                  py: 1,
                                                }}
                                              >
                                                {formatNumber(option.value)}
                                              </Text>
                                            );
                                          },
                                        )}
                                      </Box>
                                    );
                                  },
                                )}
                              </Box>
                            </Box>
                          );
                        },
                      )}
                    </Box>
                  </Box>
                </Box>
              </AccordionDetails>
            )}
          </Accordion>
        );
      })}
    </Box>
  );
};
const MaturityLevelsDetails = (props: any) => {
  const { maturity_levels } = props;
  const colorPallet = getMaturityLevelColors(
    maturity_levels ? maturity_levels.length : 5,
  );

  return (
    <Box bgcolor="background.containerLowest" p={4} borderRadius={1}>
      <Text fontWeight={900} fontSize="1.5rem" mb={8}>
        <Trans i18nKey="common.maturityLevels" />
      </Text>
      {maturity_levels
        ?.map((maturity_level: any, key: number) => {
          const { title, competences, index } = maturity_level;
          return (
            <Box
              bgcolor={colorPallet[key ?? 0]}
              borderRadius={1}
              py="4px"
              paddingInlineStart={2}
              margin={2}
              width={{ xs: "90%", sm: `${90 - 10 * key}%` }}
              sx={{ transform: "skew(-30deg)" }}
              key={key}
            >
              <Text
                sx={{ transform: "skew(30deg)" }}
                fontSize="1.5rem"
                fontWeight={900}
                color="background.containerLowest"
              >
                {index}.{title}
              </Text>
              <Box ml={8} flexWrap="wrap" sx={{ ...styles.centerV }}>
                <Text
                  sx={{ transform: "skew(30deg)" }}
                  fontSize=".875rem"
                  color="background.containerLowest"
                  fontWeight={900}
                  mr={"4px"}
                >
                  <Trans i18nKey="common.competences" />:
                </Text>
                {competences.map((comp: any, key: number) => {
                  const { title, value } = comp;
                  return (
                    <Text
                      key={uniqueId()}
                      sx={{ transform: "skew(30deg)" }}
                      fontSize=".75rem"
                      color="background.containerLowest"
                    >
                      {i18next.language === "en" && key != 0 && "   ,"} {title}:{" "}
                      {value}%{" "}
                      {competences.length - 1 !== key &&
                        i18next.language === "fa" &&
                        ",   "}{" "}
                    </Text>
                  );
                })}
              </Box>
            </Box>
          );
        })
        .reverse()}
    </Box>
  );
};
const useAssessmentKit = () => {
  const { service } = useServiceContext();
  const { assessmentKitId } = useParams();
  const fetchAssessmentKitDetailsQuery = useQuery({
    service: (args, config) =>
      service.assessmentKit.details.getKit(args ?? { assessmentKitId }, config),
    runOnMount: false,
  });
  const fetchAssessmentKitSubjectDetailsQuery = useQuery({
    service: (args, config) =>
      service.assessmentKit.details.getSubject(args, config),
    runOnMount: false,
  });
  const fetchAssessmentKitSubjectAttributesDetailsQuery = useQuery({
    service: (args, config) =>
      service.assessmentKit.details.getAttribute(args, config),
    runOnMount: false,
  });
  const fetchMaturityLevelQuestionsQuery = useQuery({
    service: (args, config) =>
      service.assessmentKit.details.getMaturityLevelQuestions(args, config),
    runOnMount: false,
  });
  const fetchAssessmentKitQuestionnairesQuery = useQuery({
    service: (args, config) =>
      service.assessmentKit.details.getQuestionnaire(args, config),
    runOnMount: false,
  });
  const fetchAssessmentKitQuestionnairesQuestionsQuery = useQuery({
    service: (args, config) =>
      service.assessmentKit.details.getQuestion(args, config),
    runOnMount: false,
  });
  const fetchAssessmentKitDownloadUrlQuery = useQuery({
    service: (args, config) =>
      service.assessmentKit.dsl.getDownloadUrl(
        args ?? { assessmentKitId },
        config,
      ),
    runOnMount: false,
  });

  return {
    fetchAssessmentKitDetailsQuery,
    fetchAssessmentKitSubjectDetailsQuery,
    fetchAssessmentKitSubjectAttributesDetailsQuery,
    fetchMaturityLevelQuestionsQuery,
    fetchAssessmentKitQuestionnairesQuery,
    fetchAssessmentKitQuestionnairesQuestionsQuery,
    fetchAssessmentKitDownloadUrlQuery,
  };
};
export default AssessmentKitExpertViewContainer;
