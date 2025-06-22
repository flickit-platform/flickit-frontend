import React, { useEffect, useMemo, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import { useServiceContext } from "@providers/ServiceProvider";
import { useParams } from "react-router-dom";
import { useQuery } from "@utils/useQuery";
import Title from "@common/TitleComponent";
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
import { t } from "i18next";
import useDialog from "@utils/useDialog";
import SupTitleBreadcrumb from "@common/SupTitleBreadcrumb";
import languageDetector from "@utils/languageDetector";
import toastError from "@utils/toastError";
import { ICustomError } from "@utils/CustomError";
import CloudDownloadRoundedIcon from "@mui/icons-material/CloudDownloadRounded";
import CloudUploadRoundedIcon from "@mui/icons-material/CloudUploadRounded";
import { CEDialog, CEDialogActions } from "@common/dialogs/CEDialog";
import { useForm } from "react-hook-form";
import UploadField from "@common/fields/UploadField";
import FormProviderWithForm from "@common/FormProviderWithForm";
import { AssessmentKitDetailsType } from "@/types/index";
import convertToBytes from "@/utils/convertToBytes";
import { useConfigContext } from "@/providers/ConfgProvider";
import { primaryFontFamily, theme } from "@/config/theme";
import LoadingButton from "@mui/lab/LoadingButton";
import uniqueId from "@/utils/uniqueId";

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
  const [loaded, setLoaded] = React.useState<boolean>(false);
  const [loadingExportBtn, setLoadingExportBtn] =
    React.useState<boolean>(false);

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
      toastError(err);
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
        toastError(err);
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
      <Box sx={{ flexDirection: { xs: "column", sm: "row" } }}>
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
                  title: t("expertGroups") as string,
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
                <Typography sx={{ marginInlineEnd: 1 }} variant="button">
                  <Trans i18nKey="updateDSL" />
                </Typography>
                <CloudUploadRoundedIcon />
              </Button>
              <LoadingButton
                variant="contained"
                loading={loadingExportBtn}
                size="small"
                sx={{ ml: 2 }}
                onClick={handleExport}
              >
                <Typography sx={{ marginInlineEnd: 1 }} variant="button">
                  <Trans i18nKey="exportDSL" />
                </Typography>
                <CloudDownloadRoundedIcon />
              </LoadingButton>
              <Button
                variant="contained"
                size="small"
                sx={{ ml: 2 }}
                onClick={handleDownload}
              >
                <Typography sx={{ marginInlineEnd: 1 }} variant="button">
                  <Trans i18nKey="downloadDSL" />
                </Typography>
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
  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
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
                    <Trans i18nKey="maturityLevels" />
                  </Box>
                }
                value="maturityLevels"
              />
              <Tab
                label={
                  <Box sx={{ ...styles.centerV }}>
                    <Trans i18nKey="subjects" />
                  </Box>
                }
                value="subjects"
              />
              <Tab
                label={
                  <Box sx={{ ...styles.centerV }}>
                    <Trans i18nKey="questionnaires" />
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
  const [expanded, setExpanded] = React.useState<string | false>(false);
  const [assessmentKitSubjectDetails, setAssessmentKitSubjectDetails] =
    useState<any>();
  const [subjectId, setSubjectId] = useState<any>();
  const { fetchAssessmentKitSubjectDetailsQuery } = useAssessmentKit();
  const { assessmentKitId } = useParams();
  const handleChange =
    (panel: any) => (event: React.SyntheticEvent, isExpanded: boolean) => {
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
              background: "white",
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
              <Typography
                sx={{
                  flex: 1,
                  fontWeight: "bold",
                  fontSize: "1.2rem",
                  opacity: 1,
                }}
                variant="h6"
              >
                {subject.index}.{subject.title}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box p={1}>
                <Grid container spacing={2} sx={{ mb: 1 }}>
                  <Grid item xs={12} sm={7} md={8} lg={9}>
                    <Box
                      display="flex"
                      sx={{
                        background: "white",
                        py: 0.6,
                        px: 1,
                        borderRadius: 1,
                      }}
                    >
                      <Typography variant="body2">
                        <Trans i18nKey="numberOfQuestions" />:
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ ml: 2 }}
                        fontWeight="bold"
                      >
                        {assessmentKitSubjectDetails?.questionsCount}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={7} md={8} lg={9}>
                    <Box
                      display="flex"
                      sx={{
                        background: "white",
                        py: 0.6,
                        px: 1,
                        borderRadius: 1,
                      }}
                    >
                      <Typography variant="body2">
                        <Trans i18nKey="description" />:
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ ml: 2 }}
                        fontWeight="bold"
                      >
                        {assessmentKitSubjectDetails?.description}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
              <Divider />
              <Box m={1} mt={2}>
                <Typography variant="h6" fontWeight={"bold"} fontSize="1rem">
                  <Trans i18nKey="common.attributes" />
                </Typography>
                {assessmentKitSubjectDetails && (
                  <ListAccordion
                    items={assessmentKitSubjectDetails.attributes}
                    renderItem={(item, index, isExpanded) => {
                      return (
                        <React.Fragment key={item?.id}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: isExpanded ? "stretch" : "center",
                              flexDirection: isExpanded ? "column" : "row",
                            }}
                          >
                            <Typography
                              variant="body1"
                              fontWeight={"bold"}
                              minWidth="180px"
                            >
                              {index + 1}.{item.title}
                            </Typography>
                          </Box>
                          <AssessmentKitQuestionsList
                            isExpanded={isExpanded}
                            attributeId={item.id}
                          />
                        </React.Fragment>
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
  const [expanded, setExpanded] = React.useState<string | false>(false);
  const [questionnaireId, setQuestionnaireId] = useState<any>();
  const [questionnaireDetails, setQuestionnaireDetails] = useState<any>();
  const { fetchAssessmentKitQuestionnairesQuery } = useAssessmentKit();
  const { assessmentKitId } = useParams();
  const handleChange =
    (panel: any) => (event: React.SyntheticEvent, isExpanded: boolean) => {
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
              background: "white",
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
              <Typography
                sx={{
                  flex: 1,
                  fontWeight: "bold",
                  fontSize: "1.2rem",
                  opacity: 1,
                }}
                variant="h6"
              >
                {questionnaire.index}.{questionnaire.title}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid item xs={12} sm={7} md={8} lg={9}>
                <Box
                  display="flex"
                  sx={{
                    background: "white",
                    py: 0.6,
                    px: 1,
                    borderRadius: 1,
                  }}
                >
                  <Typography variant="body2">
                    <Trans i18nKey="numberOfQuestions" />:
                  </Typography>
                  <Typography variant="body2" sx={{ ml: 2 }} fontWeight="bold">
                    {questionnaireDetails?.questionsCount}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={7} md={8} lg={9}>
                <Box
                  display="flex"
                  sx={{
                    background: "white",
                    py: 0.6,
                    px: 1,
                    borderRadius: 1,
                    my: "16px",
                  }}
                >
                  <Typography variant="body2">
                    <Trans i18nKey="relatedSubjects" />:
                  </Typography>
                  {questionnaireDetails?.relatedsubjects?.map(
                    (subject: string) => (
                      <Typography
                        variant="body2"
                        sx={{ ml: 2 }}
                        fontWeight="bold"
                        key={uniqueId()}
                      >
                        {subject}
                      </Typography>
                    ),
                  )}
                </Box>
              </Grid>
              <Grid item xs={12} sm={7} md={8} lg={9}>
                <Box
                  display="flex"
                  sx={{
                    background: "white",
                    py: 0.6,
                    px: 1,
                    borderRadius: 1,
                    my: "16px",
                  }}
                >
                  <Typography variant="body2">
                    <Trans i18nKey="description" />:
                  </Typography>
                  <Typography variant="body2" sx={{ ml: 2 }} fontWeight="bold">
                    {questionnaireDetails?.description}
                  </Typography>
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
  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
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
          sx={{
            background: "white",
            py: 0.6,
            px: 1,
            borderRadius: 1,
          }}
        >
          <Typography variant="body2">
            <Trans i18nKey="numberOfQuestions" />:
          </Typography>
          <Typography variant="body2" sx={{ ml: 2 }} fontWeight="bold">
            {attributesDetails?.questionCount}
          </Typography>
        </Box>
      </Grid>
      <Grid item xs={12} sm={7} md={8} lg={9}>
        <Box
          display="flex"
          sx={{
            background: "white",
            py: 0.6,
            px: 1,
            borderRadius: 1,
          }}
        >
          <Typography variant="body2">
            <Trans i18nKey="weight" />:
          </Typography>
          <Typography variant="body2" sx={{ ml: 2 }} fontWeight="bold">
            {attributesDetails?.weight}
          </Typography>
        </Box>
      </Grid>
      <Grid item xs={12} sm={7} md={8} lg={9}>
        <Box
          display="flex"
          sx={{
            background: "white",
            py: 0.6,
            px: 1,
            borderRadius: 1,
          }}
        >
          <Typography variant="body2">
            <Trans i18nKey="description" />:
          </Typography>
          <Typography variant="body2" sx={{ ml: 2 }} fontWeight="bold">
            {attributesDetails?.description}
          </Typography>
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
                          background: `transparent  !important`,
                        },
                        "&:hover": {
                          backgroundColor: "#e1dede !important",
                          color: `${colorPallet[index]} !important`,
                        },
                        background: `${colorPallet[index]}  !important`,
                        color: "#fff !important",
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
        toastError(err.message);
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
      <Typography variant="body1">
        <Trans i18nKey="pleaseNoteThatThereAreSomeLimitations" />
      </Typography>
      <Box sx={{ ml: 4, my: 2 }}>
        <Typography component="li" variant="body1" fontWeight={"bold"}>
          <Trans i18nKey="deletingAQuestionnaire" />
        </Typography>
        <Typography component="li" variant="body1" fontWeight={"bold"}>
          <Trans i18nKey="deletingQuestionFromAPreExistingQuestionnaireOrAddingANewOne" />
        </Typography>
        <Typography component="li" variant="body1" fontWeight={"bold"}>
          <Trans i18nKey="assessmentKit.anyChangesInTheNumberOfOptionsForAPreExistingQuestion" />
        </Typography>
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
            label={<Trans i18nKey="dsl" />}
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
        submitButtonLabel={t("saveChanges") as string}
        onSubmit={formMethods.handleSubmit(onSubmit)}
      />
    </FormProviderWithForm>
  );
  const syntaxErrorContent = (
    <Box>
      {syntaxErrorObject && (
        <Typography ml={1} variant="h6">
          <Trans i18nKey="youveGotSyntaxErrorsInYourDslFile" />
        </Typography>
      )}
      {updateErrorObject && (
        <Typography ml={1} variant="h6">
          <Trans i18nKey="unsupportedDslContentChange" />
        </Typography>
      )}
      <Divider />
      <Box mt={4} sx={{ maxHeight: "260px", overflow: "scroll" }}>
        {syntaxErrorObject?.map((e: any) => {
          return (
            <Box key={uniqueId()} sx={{ ml: 1 }}>
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
        {updateErrorObject?.map((e: any) => {
          return (
            <Box key={uniqueId()} sx={{ ml: 1 }}>
              <Alert severity="error" sx={{ my: 2 }}>
                <Box sx={{ display: "flex" }}>
                  <Typography variant="subtitle2" color="error">
                    {e}
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
            sx={{
              marginRight: theme.direction === "ltr" ? 1 : "unset",
              marginLeft: theme.direction === "rtl" ? 1 : "unset",
            }}
          />
          {<Trans i18nKey="updateDSL" />}
        </>
      }
    >
      {!showErrorLog ? formContent : syntaxErrorContent}
    </CEDialog>
  );
};
const SubjectQuestionList = (props: any) => {
  const { questions } = props;
  const [expanded, setExpanded] = React.useState<string | false>(false);
  const handleChange =
    (panel: any) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel?.title : false);
    };
  return (
    <Box>
      {questions[0] && (
        <Box m={1} mt={2}>
          <Typography variant="h6" fontWeight={"bold"} fontSize="1rem">
            <Trans i18nKey="questions" />
          </Typography>
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
              paddingLeft: theme.direction === "ltr" ? 2 : "unset",
              paddingRight: theme.direction === "rtl" ? 2 : "unset",
              borderRadius: 2,
              background: "white",
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
              <Typography
                sx={{
                  flex: 1,
                  fontFamily: `${is_farsi ? "VazirMatn" : primaryFontFamily}`,
                  fontWeight: "bold",
                  opacity: 1,
                  display: "flex",
                  flexWrap: "wrap",
                  direction: `${is_farsi ? "rtl" : "ltr"}`,
                }}
                variant="body2"
              >
                {index + 1}.{question.title}
                {question.mayNotBeApplicable && (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: "8px",
                      background: "#1976D2",
                      color: "#fff",
                      fontSize: ".75rem",
                      px: "12px",
                      mx: "4px",
                      height: "24px",
                    }}
                  >
                    <Trans i18nKey="na" />
                  </Box>
                )}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: "8px",
                    background: "#273248",
                    color: "#fff",
                    fontSize: ".75rem",
                    px: "12px",
                    mx: "4px",
                    height: "24px",
                  }}
                >
                  {question.questionnaire}
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: "8px",
                    background: "#7954B3",
                    color: "#fff",
                    fontSize: ".75rem",
                    px: "12px",
                    mx: "4px",
                    height: "24px",
                  }}
                >
                  <Trans
                    i18nKey="weightValue"
                    values={{ weight: question.weight }}
                  />
                </Box>
                {question.advisable && (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: "8px",
                      background: "#004F83",
                      color: "#fff",
                      fontSize: ".75rem",
                      px: "12px",
                      mx: "4px",
                      height: "24px",
                    }}
                  >
                    <Trans i18nKey="advice.advisable" />
                  </Box>
                )}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ maxWidth: "max-content" }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderBottom: "1px solid #4979D1",
                    pb: "8px",
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: "bold",
                      opacity: 0.6,
                      ml: "4px",
                    }}
                  >
                    <Trans i18nKey="options" />
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: "bold",
                      opacity: 0.6,
                      ml: "4px",
                    }}
                  >
                    <Trans i18nKey="value" />
                  </Typography>
                </Box>
                {question.answerOptions.map((item: any) => (
                  <Box
                    key={uniqueId()}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      px: "16px",
                      my: "16px",
                    }}
                  >
                    <Typography
                      variant="subtitle2"
                      sx={{
                        fontWeight: "bold",
                        marginRight:
                          theme.direction === "ltr" ? "64px" : "unset",
                        marginLeft:
                          theme.direction === "rtl" ? "64px" : "unset",
                      }}
                    >
                      {item.index}.{item.title}
                    </Typography>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        fontWeight: "bold",
                      }}
                    >
                      {item.value}
                    </Typography>
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
  const [expanded, setExpanded] = React.useState<string | false>(false);
  const [questionId, setQuestionId] = useState<any>();
  const [questionsDetails, setQuestionsDetails] = useState<any>();
  const { fetchAssessmentKitQuestionnairesQuestionsQuery } = useAssessmentKit();
  const { assessmentKitId } = useParams();
  const handleChange =
    (panel: any) => (event: React.SyntheticEvent, isExpanded: boolean) => {
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
        <Typography variant="h6" fontWeight={"bold"} fontSize="1rem">
          <Trans i18nKey="questions" />
        </Typography>
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
              paddingLeft: theme.direction === "ltr" ? 2 : "unset",
              paddingRight: theme.direction === "rtl" ? 2 : "unset",
              borderRadius: 2,
              background: "white",
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
              <Typography
                sx={{
                  flex: 1,
                  fontFamily: `${is_farsi ? "VazirMatn" : primaryFontFamily}`,
                  fontWeight: "bold",
                  opacity: 1,
                  display: "flex",
                  flexWrap: "wrap",
                  direction: `${is_farsi ? "rtl" : "ltr"}`,
                }}
                variant="body2"
              >
                {index + 1}.{question.title}
                {question.mayNotBeApplicable && (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: "8px",
                      background: "#1976D2",
                      color: "#fff",
                      fontSize: ".75rem",
                      px: "12px",
                      mx: "4px",
                      height: "24px",
                    }}
                  >
                    <Trans i18nKey="na" />
                  </Box>
                )}
                {question.advisable && (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: "8px",
                      background: "#004F83",
                      color: "#fff",
                      fontSize: ".75rem",
                      px: "12px",
                      mx: "4px",
                      height: "24px",
                    }}
                  >
                    <Trans i18nKey="advice.advisable" />
                  </Box>
                )}
              </Typography>
            </AccordionSummary>
            {questionsDetails && (
              <AccordionDetails>
                <Box
                  sx={{
                    maxWidth: "max-content",
                    display: "flex",
                    mb: 4,
                    ml: `${is_farsi ? "auto" : "2"}`,
                    direction: `${is_farsi ? "rtl" : "ltr"}`,
                  }}
                >
                  {questionsDetails?.options.map((option: any) => (
                    <Typography
                      key={option.index}
                      sx={{
                        mx: 2,
                        fontFamily: `${is_farsi ? "Vazirmatn" : primaryFontFamily}`,
                      }}
                      variant="body2"
                    >
                      {option.index}. {option.title}
                    </Typography>
                  ))}
                </Box>
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                  <Box sx={{ width: "90%" }}>
                    <Box sx={{ display: "flex" }}>
                      <Typography
                        sx={{
                          width: "40%",
                          pb: "4px",
                          color: "#767676",
                          display: "block",
                          fontSize: "0.8rem",
                        }}
                      >
                        <Trans i18nKey="affectedQualityAttribute" />
                      </Typography>
                      <Typography
                        sx={{
                          width: "20%",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          pb: "4px",
                          color: "#767676",
                          fontSize: "0.8rem",
                        }}
                      >
                        <Trans i18nKey="assessmentKit.affectedLevel" />
                      </Typography>
                      <Typography
                        sx={{
                          width: "10%",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          pb: "4px",
                          color: "#767676",
                          fontSize: "0.8rem",
                        }}
                      >
                        <Trans i18nKey="weight" />
                      </Typography>
                      <Box
                        sx={{
                          width: "30%",
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        {questionsDetails?.options.map(
                          (option: any, index: number) => (
                            <Typography
                              key={uniqueId()}
                              sx={{
                                color: "#767676",
                                fontSize: "0.8rem",
                                pb: "4px",
                              }}
                            >
                              <Trans
                                i18nKey="optionValue"
                                values={{ index: index + 1 }}
                              />
                            </Typography>
                          ),
                        )}
                      </Box>
                    </Box>
                    <Divider sx={{ background: "#7A589B" }} />
                    <Box>
                      {questionsDetails?.attributeImpacts.map(
                        (attributes: any, index: number) => {
                          return (
                            <Box
                              key={uniqueId()}
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                borderTop: `${
                                  index !== 0 && "1px solid #D3D3D3"
                                }`,
                                py: 1,
                              }}
                            >
                              <Typography
                                sx={{ width: "40%", py: 1 }}
                                variant="body1"
                                fontWeight={"bold"}
                              >
                                {attributes.title}
                              </Typography>
                              <Box
                                sx={{
                                  display: "flex",
                                  flexDirection: "column",
                                  justifyContent: "center",
                                  alignItems: "center",
                                  width: "20%",
                                }}
                              >
                                {attributes?.affectedLevels.map(
                                  (affectedLevel: any) => {
                                    return (
                                      <Typography
                                        key={uniqueId()}
                                        variant="body1"
                                        fontWeight={"bold"}
                                        sx={{ py: 1 }}
                                      >
                                        {affectedLevel.maturityLevel.title} |{" "}
                                        {affectedLevel.maturityLevel.index}
                                      </Typography>
                                    );
                                  },
                                )}
                              </Box>
                              <Box
                                sx={{
                                  display: "flex",
                                  flexDirection: "column",
                                  justifyContent: "center",
                                  alignItems: "center",
                                  width: "10%",
                                }}
                              >
                                {attributes?.affectedLevels.map(
                                  (affectedLevel: any) => {
                                    return (
                                      <Typography
                                        key={uniqueId()}
                                        variant="body1"
                                        fontWeight={"bold"}
                                        sx={{ py: 1 }}
                                      >
                                        {affectedLevel.weight}
                                      </Typography>
                                    );
                                  },
                                )}
                              </Box>
                              <Box
                                sx={{
                                  display: "flex",
                                  flexDirection: "column",
                                  justifyContent: "center",
                                  alignItems: "center",
                                  width: "30%",
                                }}
                              >
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
                                              <Typography
                                                key={uniqueId()}
                                                variant="body1"
                                                fontWeight={"bold"}
                                                sx={{
                                                  py: 1,
                                                }}
                                              >
                                                {formatNumber(option.value)}
                                              </Typography>
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
    <Box sx={{ background: "#fff", px: 4, py: 4, borderRadius: "8px" }}>
      <Typography fontWeight={900} fontSize="1.5rem" mb={8}>
        <Trans i18nKey="maturityLevels" />
      </Typography>
      {maturity_levels
        ?.map((maturity_level: any, key: number) => {
          const { title, competences, index } = maturity_level;
          return (
            <Box
              sx={{
                transform: "skew(-30deg);",
                background: colorPallet[key ?? 0],
                borderRadius: "8px",
                py: "4px",
                paddingLeft: theme.direction === "ltr" ? 2 : "unset",
                paddingRight: theme.direction === "rtl" ? 2 : "unset",
                margin: "16px",
                width: { xs: "90%", sm: `${90 - 10 * key}%` },
              }}
              key={key}
            >
              <Typography
                sx={{ transform: "skew(30deg);" }}
                fontSize="1.5rem"
                fontWeight={900}
                color="#fff"
              >
                {index}.{title}
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  ml: "64px",
                  flexWrap: "wrap",
                  alignItems: "center",
                }}
              >
                <Typography
                  sx={{ transform: "skew(30deg)" }}
                  fontSize=".875rem"
                  color="#fff"
                  fontWeight={900}
                  mr={"4px"}
                >
                  <Trans i18nKey="competences" />:
                </Typography>
                {competences.map((comp: any, key: number) => {
                  const { title, value } = comp;
                  return (
                    <Typography
                      key={uniqueId()}
                      sx={{ transform: "skew(30deg)" }}
                      fontSize=".75rem"
                      color="#fff"
                    >
                      {theme.direction == "ltr" && key != 0 && "   ,"} {title}:{" "}
                      {value}%{" "}
                      {competences.length - 1 !== key &&
                        theme.direction == "rtl" &&
                        ",   "}{" "}
                    </Typography>
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
