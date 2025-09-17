import { useEffect, useRef, useState, useMemo, Fragment } from "react";
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import Paper from "@mui/material/Paper";
import ToggleButton from "@mui/material/ToggleButton";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useNavigate, useParams } from "react-router-dom";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import FormControlLabel from "@mui/material/FormControlLabel";
import {
  questionActions,
  useQuestionContext,
  useQuestionDispatch,
} from "@/providers/QuestionProvider";
import {
  EAssessmentStatus,
  IAnswerHistory,
  IPermissions,
  IQuestionInfo,
  IQuestionsModel,
  TAnswer,
  TQuestionsInfo,
} from "@/types/index";
import { Trans } from "react-i18next";
import TabPanel from "@mui/lab/TabPanel";
import LoadingButton from "@mui/lab/LoadingButton";
import { useServiceContext } from "@providers/ServiceProvider";
import { ICustomError } from "@utils/CustomError";
import useDialog from "@utils/useDialog";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import { FormProvider, useForm } from "react-hook-form";
import { styles } from "@styles";
import { InputFieldUC } from "@common/fields/InputField";
import setDocumentTitle from "@utils/setDocumentTitle";
import { t } from "i18next";
import { useQuery } from "@utils/useQuery";
import QueryData from "../common/QueryData";
import languageDetector from "@utils/languageDetector";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import Rating from "@mui/material/Rating";
import RadioButtonUncheckedRoundedIcon from "@mui/icons-material/RadioButtonUncheckedRounded";
import RadioButtonCheckedRoundedIcon from "@mui/icons-material/RadioButtonCheckedRounded";
import Avatar from "@mui/material/Avatar";
import stringAvatar from "@utils/stringAvatar";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import IconButton from "@mui/material/IconButton";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { useConfigContext } from "@/providers/ConfgProvider";
import DoneIcon from "@mui/icons-material/Done";
import ClearIcon from "@mui/icons-material/Clear";
import { useTheme } from "@mui/material/styles";
import arrowBtn from "../../assets/svg/arrow.svg";
import PreAttachment from "@components/questions/iconFiles/preAttachments";
import FileSvg from "@components/questions/iconFiles/fileSvg";
import Tooltip from "@mui/material/Tooltip";
import Skeleton from "@mui/material/Skeleton";
import { farsiFontFamily, primaryFontFamily } from "@config/theme";
import { ASSESSMENT_MODE, evidenceAttachmentType } from "@utils/enumType";
import { downloadFile } from "@utils/downloadFile";
import CircularProgress from "@mui/material/CircularProgress";
import { toCamelCase } from "@/utils/MakeCamelcaseString";
import ArrowBack from "@mui/icons-material/ArrowBack";
import ArrowForward from "@mui/icons-material/ArrowForward";
import CheckOutlined from "@mui/icons-material/CheckOutlined";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import EmptyState from "../kit-designer/common/EmptyState";
import convertLinksToClickable from "@utils/convertTextToClickableLink";
import { DeleteConfirmationDialog } from "../common/dialogs/DeleteConfirmationDialog";
import { QuestionGuide } from "./QuestionCard/QuestionGuide";
import { EvidenceAttachmentsDialogs } from "./QuestionCard/EvidenceAttachmentsDialogs";
import Stack from "@mui/material/Stack";
import Pagination from "@mui/material/Pagination";
import { getReadableDate } from "@utils/readableDate";
import { useAssessmentContext } from "@providers/AssessmentProvider";
import showToast from "@utils/toastError";
import uniqueId from "@/utils/uniqueId";
import useScreenResize from "@/utils/useScreenResize";

interface IQuestionCardProps {
  questionInfo: IQuestionInfo;
  questionsInfo: TQuestionsInfo;
}

export const QuestionCard = (props: IQuestionCardProps) => {
  const { questionInfo, questionsInfo } = props;
  const { answer, title, hint, mayNotBeApplicable } = questionInfo;
  const { questionIndex } = useQuestionContext();
  const abortController = useRef(new AbortController());
  const [notApplicable, setNotApplicable] = useState<boolean>(false);
  const [disabledConfidence, setDisabledConfidence] = useState<boolean>(true);
  const [confidenceLebels, setConfidenceLebels] = useState<any>([]);
  const { service } = useServiceContext();
  const { assessmentInfo } = useAssessmentContext();
  const { config } = useConfigContext();
  useEffect(() => {
    return () => {
      abortController.current.abort();
    };
  }, []);

  const is_farsi = languageDetector(title);

  const isAdvanceMode = useMemo(() => {
    return ASSESSMENT_MODE.ADVANCED === assessmentInfo?.mode?.code;
  }, [assessmentInfo?.mode?.code]);

  useEffect(() => {
    setDocumentTitle(
      `${t("common.question")} ${questionIndex}: ${title}`,
      config.appTitle,
    );
    setNotApplicable(answer?.isNotApplicable ?? false);
    if (!isAdvanceMode) {
      dispatch(questionActions.setSelectedConfidenceLevel(3));
      return;
    }
    if (answer?.confidenceLevel) {
      dispatch(
        questionActions.setSelectedConfidenceLevel(
          answer?.confidenceLevel?.id
            ? answer?.confidenceLevel?.id
            : (answer?.confidenceLevel ?? null),
        ),
      );
    }
  }, [title, answer?.confidenceLevel]);

  const ConfidenceListQueryData = useQuery({
    service: (args, config) =>
      service.questions.info.getConfidenceLevels(args ?? {}, config),
    toastError: false,
  });

  const { selcetedConfidenceLevel } = useQuestionContext();
  const dispatch = useQuestionDispatch();
  const [value, setValue] = useState("evidences");

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <Box>
      <Paper
        sx={{
          px: { xs: 2.5, sm: 4, md: 5 },
          py: { xs: 3, sm: 5 },
          backgroundColor: `${notApplicable ? "#000000cc" : "#273248"}`,
          flex: 1,
          color: "white",
          background: `radial-gradient(circle, #123354 50%, #0D263F 100%)`,
          position: "relative",
          overflow: "hidden",
          mx: { xs: 2, sm: "auto" },
          mb: "0 !important",
          borderRadius: "8px 8px 0 0",
        }}
        elevation={3}
      >
        <Box>
          <Box sx={{ px: 6, ...styles.rtlStyle(languageDetector(title)) }}>
            <Typography
              component="div"
              variant="semiBoldSmall"
              color="background.onVariant"
              sx={{
                opacity: 0.65,
                textAlign: [is_farsi ? "right" : "left"],
              }}
            >
              <Trans i18nKey="common.question" />
            </Typography>
            <Typography
              letterSpacing={is_farsi ? "0" : ".05em"}
              variant="semiBoldXLarge"
              color="background.containerLow"
              sx={{
                fontFamily: languageDetector(title)
                  ? farsiFontFamily
                  : primaryFontFamily,
                pt: 0.5,
              }}
            >
              {title.split("\n").map((line) => (
                <Fragment key={line}>
                  {questionIndex}. {line}
                  <br />
                </Fragment>
              ))}
            </Typography>

            {hint && <QuestionGuide hint={hint} />}
          </Box>

          {/* Answer template */}
          <AnswerTemplate
            abortController={abortController}
            questionInfo={questionInfo}
            questionIndex={questionIndex}
            questionsInfo={questionsInfo}
            is_farsi={is_farsi}
            setNotApplicable={setNotApplicable}
            notApplicable={notApplicable}
            may_not_be_applicable={mayNotBeApplicable ?? false}
            setDisabledConfidence={setDisabledConfidence}
            selcetedConfidenceLevel={selcetedConfidenceLevel}
            confidenceLebels={confidenceLebels}
          />
        </Box>
      </Paper>
      {isAdvanceMode && (
        <Box sx={{ px: { xs: 2, sm: 0 } }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              bgcolor: `${notApplicable ? "#273248" : "#000000cc"}`,
              flexDirection: { xs: "column", md: "row" },
              borderRadius: " 0 0 8px 8px ",
              px: { xs: 1.75, sm: 2, md: 2.5 },
              py: { xs: 1.5, sm: 2.5 },
            }}
          >
            <SubmitOnSelectCheckBox
              disabled={!questionsInfo?.permissions?.answerQuestion}
            />
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                flexDirection: { xs: "column", md: "row" },
              }}
            >
              <QueryData
                {...ConfidenceListQueryData}
                loading={false}
                error={false}
                render={(data) => {
                  const labels = data.confidenceLevels;
                  setConfidenceLebels(labels);
                  return (
                    <Box sx={{ ...styles.centerV }}>
                      {selcetedConfidenceLevel !== null ? (
                        <Box
                          marginInlineStart="unset"
                          marginInlineEnd={2}
                          color="background.containerLowest"
                        >
                          <Box
                            sx={{ display: "flex", fontSize: { xs: ".85rem" } }}
                          >
                            <Trans
                              i18nKey={
                                questionsInfo?.permissions?.answerQuestion
                                  ? "common.selectedConfidenceLevel"
                                  : "common.confidenceLevel"
                              }
                            />
                            <Typography
                              fontWeight={900}
                              sx={{ borderBottom: "1px solid", mx: 1 }}
                            >
                              <Trans
                                i18nKey={toCamelCase(
                                  `common.${labels[selcetedConfidenceLevel - 1]?.title}`,
                                )}
                              />
                            </Typography>
                          </Box>
                        </Box>
                      ) : (
                        <Box
                          sx={{
                            marginInlineEnd: 1,
                            color: `${disabledConfidence ? "background.containerLowest" : "secondary.light"}`,
                          }}
                        >
                          <Typography>
                            <Trans
                              i18nKey={
                                disabledConfidence
                                  ? "questions.selectConfidenceLevel"
                                  : "questions.toContinueToSubmitAnAnswer"
                              }
                            />
                          </Typography>
                        </Box>
                      )}
                      <Box sx={{ position: "relative" }}>
                        <Rating
                          disabled
                          value={Number(answer?.confidenceLevel?.id)}
                          size="medium"
                          icon={
                            <RadioButtonCheckedRoundedIcon
                              sx={{
                                mx: 0.25,
                                color: "transparent",
                                borderRadius: "100%",
                                border: "2px solid #42a5f5",
                              }}
                              fontSize="inherit"
                            />
                          }
                          emptyIcon={
                            <RadioButtonUncheckedRoundedIcon
                              sx={{
                                mx: 0.25,
                                color: "background.containerLowest",
                              }}
                              fontSize="inherit"
                            />
                          }
                          sx={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            zIndex: 1,
                          }}
                        />
                        <Rating
                          disabled={!questionsInfo?.permissions?.answerQuestion}
                          value={
                            selcetedConfidenceLevel !== null
                              ? selcetedConfidenceLevel
                              : null
                          }
                          size="medium"
                          onChange={(event, newValue) => {
                            dispatch(
                              questionActions.setSelectedConfidenceLevel(
                                newValue,
                              ),
                            );
                          }}
                          icon={
                            <RadioButtonCheckedRoundedIcon
                              sx={{ mx: 0.25, color: "#42a5f5" }}
                              fontSize="inherit"
                            />
                          }
                          emptyIcon={
                            <RadioButtonUncheckedRoundedIcon
                              sx={{ mx: 0.25, color: "transparent" }}
                              fontSize="inherit"
                            />
                          }
                          sx={{
                            position: "relative",
                            zIndex: 2,
                          }}
                        />
                      </Box>
                    </Box>
                  );
                }}
              />
            </Box>
          </Box>
        </Box>
      )}
      {isAdvanceMode && (
        <QuestionTabsTemplate
          value={value}
          setValue={setValue}
          handleChange={handleChange}
          questionsInfo={questionsInfo}
          questionInfo={questionInfo}
        />
      )}
    </Box>
  );
};

export const QuestionTabsTemplate = (props: any) => {
  const { value, setValue, questionsInfo, questionInfo, position } = props;
  const [isExpanded, setIsExpanded] = useState(true);
  const { service } = useServiceContext();
  const { assessmentId = "" } = useParams();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [counts, setCounts] = useState<any>({
    evidences: 0,
    history: 0,
    comments: 0,
  });

  const toggleTabs = () => {
    setIsExpanded((prev) => !prev);

    if (!value) {
      const next =
        (["evidences", "history", "comments"] as const).find(
          (k) => counts[k],
        ) ?? "";
      setValue(next);
    }
  };

  const updateCount = (type: string, count: number) => {
    setCounts((prev: any) => ({ ...prev, [type]: count }));
  };

  // Queries
  const queryData = useQuery({
    service: (args, config) =>
      service.assessments.answer.getHistory(
        args ?? {
          questionId: questionInfo.id,
          assessmentId,
          page: currentPage,
          size: 10,
        },
        config,
      ),
    toastError: true,
    runOnMount: Boolean(questionsInfo?.permissions?.viewAnswerHistory),
  });
  const evidencesQueryData = useQuery({
    service: (args, config) =>
      service.questions.evidences.getAll(
        args ?? {
          questionId: questionInfo.id,
          assessmentId,
          page: currentPage,
          size: 10,
        },
        config,
      ),
    toastError: true,
    runOnMount: true,
  });

  const commentesQueryData = useQuery({
    service: (args, config) =>
      service.questions.comments.getAll(
        args ?? {
          questionId: questionInfo.id,
          assessmentId,
          page: currentPage,
          size: 10,
        },
        config,
      ),
    toastError: true,
    runOnMount: true,
  });

  // Effects
  useEffect(() => {
    if (questionsInfo?.permissions?.readonly) {
      setIsExpanded(false);
      evidencesQueryData.query();
      commentesQueryData.query();
    }
  }, [questionsInfo?.permissions?.readonly, questionInfo]);

  useEffect(() => {
    if (questionsInfo?.permissions?.viewAnswerHistory) {
      queryData.query();
    }
  }, [questionInfo.answer]);

  useEffect(() => {
    if (value) {
      setIsExpanded(true);
    }
  }, [value]);

  useEffect(() => {
    if (queryData.data?.items) {
      updateCount("history", queryData.data.total ?? 0);
    }
    if (evidencesQueryData.data?.items) {
      updateCount("evidences", evidencesQueryData.data.total ?? 0);
    }
    if (commentesQueryData.data?.items) {
      updateCount("comments", commentesQueryData.data.total ?? 0);
    }
  }, [queryData.data, evidencesQueryData.data, commentesQueryData.data]);

  useEffect(() => {
    if (!isExpanded && questionsInfo.permissions.readonly) {
      setValue("");
    }
  }, [isExpanded]);

  const handleChangePage = (
    event: React.ChangeEvent<unknown>,
    value: number,
  ) => {
    setCurrentPage(value);
  };

  const total = useMemo(() => {
    return Math.ceil(counts[value] / 10);
  }, [value, counts]);

  useEffect(() => {
    if (currentPage > total && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  }, [total]);

  useEffect(() => {
    if (value == "evidences") {
      evidencesQueryData.query();
    } else if (value == "comments") {
      commentesQueryData.query();
    } else if (value == "history") {
      queryData.query();
    }
  }, [currentPage]);

  useEffect(() => {
    if (position == "dialog") {
      if (counts.evidences) {
        setValue("evidences");
      } else if (counts.history) {
        setValue("history");
      } else if (counts.comments) {
        setValue("comments");
      } else {
        setValue(() => {
          if (position == "dialog") {
            return "";
          } else {
            return "evidences";
          }
        });
      }
    }
  }, [counts.evidences, counts.history, counts.comments]);
  const theme = useTheme();

  return (
    <TabContext value={value}>
      <Box sx={{ px: { xs: 2, sm: 0 }, mt: 2, width: "100%" }}>
        <TabList
          scrollButtons="auto"
          variant="scrollable"
          sx={{ ...styles.centerV }}
          key={uniqueId()}
        >
          <Tab
            sx={{ textTransform: "none", ...theme.typography.semiBoldLarge }}
            label={
              <Box sx={{ ...styles.centerV }}>
                <Trans i18nKey="common.evidences" />
                {` (${counts.evidences})`}
              </Box>
            }
            onClick={() => setValue("evidences")}
            value="evidences"
            disabled={questionsInfo.permissions.readonly && !counts.evidences}
          />
          {questionsInfo?.permissions?.viewAnswerHistory && (
            <Tab
              sx={{ textTransform: "none", ...theme.typography.semiBoldLarge }}
              label={
                <Box sx={{ ...styles.centerV }}>
                  <Trans i18nKey="questions.answerHistory" />
                  {` (${counts.history})`}
                </Box>
              }
              value="history"
              onClick={() => setValue("history")}
              disabled={questionsInfo.permissions.readonly && !counts.history}
            />
          )}
          <Tab
            sx={{ textTransform: "none", ...theme.typography.semiBoldLarge }}
            label={
              <Box sx={{ ...styles.centerV }}>
                <Trans i18nKey="questions.comments" />
                {` (${counts.comments})`}
              </Box>
            }
            value="comments"
            onClick={() => setValue("comments")}
            disabled={questionsInfo.permissions.readonly && !counts.comments}
          />
          <Tab
            sx={{ display: "none" }}
            value={""}
            onClick={() => setValue("comments")}
            disabled={questionsInfo.permissions.readonly && !counts.comments}
          />
          <IconButton
            onClick={toggleTabs}
            sx={{
              ml: 2,
              padding: 0,
              alignSelf: "center",
              marginInlineStart: "auto",
            }}
            disabled={
              questionsInfo.permissions.readonly &&
              !counts.comments &&
              !counts.evidences &&
              !counts.history
            }
          >
            {isExpanded ? (
              <ExpandLess fontSize="small" />
            ) : (
              <ExpandMore fontSize="small" />
            )}
          </IconButton>
        </TabList>
      </Box>
      {isExpanded && (
        <>
          <TabPanel value="evidences" sx={{ width: "100%" }}>
            <Box mt={2} width="100%">
              <AnswerDetails
                questionInfo={questionInfo}
                type="evidence"
                permissions={questionsInfo?.permissions}
                queryData={evidencesQueryData}
              />
            </Box>
          </TabPanel>
          <TabPanel value="history" sx={{ width: "100%" }}>
            <Box mt={2}>
              <AnswerDetails
                questionInfo={questionInfo}
                type="history"
                permissions={questionsInfo?.permissions}
                queryData={queryData}
              />
            </Box>
          </TabPanel>
          <TabPanel value="comments" sx={{ width: "100%" }}>
            <Box mt={2} width="100%">
              <AnswerDetails
                questionInfo={questionInfo}
                type="comment"
                permissions={questionsInfo?.permissions}
                queryData={commentesQueryData}
              />
            </Box>
          </TabPanel>
          <Stack spacing={2} mt={3} sx={{ ...styles.centerVH }}>
            <Pagination
              variant="outlined"
              color="primary"
              count={total}
              onChange={handleChangePage}
              page={currentPage}
            />
          </Stack>
        </>
      )}
    </TabContext>
  );
};

const getArrowColor = (isActive: boolean) =>
  isActive ? "white" : "disabled.main";

const NavigationButton = ({
  onClick,
  disabled,
  icon: Icon,
  marginStyle,
  isActive,
  id,
}: any) => (
  <IconButton onClick={onClick} disabled={disabled} sx={marginStyle} id={id}>
    <Icon sx={{ color: getArrowColor(isActive), fontSize: "48px" }} />
  </IconButton>
);

const AnswerTemplate = (props: {
  questionInfo: IQuestionInfo;
  questionIndex: number;
  questionsInfo: TQuestionsInfo;
  abortController: React.MutableRefObject<AbortController>;
  setNotApplicable: any;
  notApplicable: boolean;
  may_not_be_applicable: boolean;
  is_farsi?: boolean;
  setDisabledConfidence: any;
  selcetedConfidenceLevel: any;
  confidenceLebels: any;
}) => {
  const { submitOnAnswerSelection, isSubmitting } = useQuestionContext();
  const {
    questionInfo,
    questionsInfo,
    questionIndex,
    abortController,
    setNotApplicable,
    notApplicable,
    may_not_be_applicable,
    is_farsi,
    setDisabledConfidence,
    selcetedConfidenceLevel,
    confidenceLebels,
  } = props;
  const [openDeleteDialog, setOpenDeleteDialog] = useState<{
    status: boolean;
    id: string;
  }>({ status: false, id: "" });

  const { options, answer } = questionInfo;
  const { total_number_of_questions, permissions } = questionsInfo;
  const { service } = useServiceContext();
  const dispatch = useQuestionDispatch();
  const { assessmentInfo } = useAssessmentContext();
  const { assessmentId = "", questionnaireId = "" } = useParams();
  const [notApp, setNotApp] = useState<boolean>(false);
  const questionsResultQueryData = useQuery<IQuestionsModel>({
    service: (args, config) =>
      service.assessments.questionnaire.getQuestionnaireAnswers(
        { questionnaireId, assessmentId, page: args?.page ?? 0, size: 50 },
        config,
      ),
    runOnMount: false,
  });

  const isAdvanceMode = useMemo(() => {
    return ASSESSMENT_MODE.ADVANCED === assessmentInfo?.mode?.code;
  }, [assessmentInfo?.mode?.code]);

  const [value, setValue] = useState<TAnswer | null>(
    answer?.selectedOption || null,
  );
  const navigate = useNavigate();
  const isLastQuestion = questionIndex == total_number_of_questions;
  const isSelectedValueTheSameAsAnswer = useMemo(() => {
    return (
      (questionInfo?.answer?.selectedOption?.index === value?.index &&
        questionInfo.answer?.confidenceLevel?.id === selcetedConfidenceLevel &&
        questionInfo?.answer?.isNotApplicable === notApplicable) ||
      (questionInfo?.mayNotBeApplicable &&
        questionInfo?.answer?.isNotApplicable === true &&
        notApplicable === true) ||
      (questionInfo?.answer === null &&
        value === null &&
        notApplicable === false) ||
      (questionInfo?.answer?.selectedOption === null &&
        questionInfo.answer?.confidenceLevel === null &&
        value === null &&
        questionInfo?.answer?.isNotApplicable === notApplicable) ||
      (questionInfo?.answer?.selectedOption === null &&
        questionInfo.answer?.confidenceLevel === null &&
        value === null &&
        !questionInfo.mayNotBeApplicable)
    );
  }, [questionInfo?.answer, value, notApplicable, selcetedConfidenceLevel]);

  const changeHappened = useRef(false);
  const onChange = (
    event: React.MouseEvent<HTMLElement>,
    v: TAnswer | null,
  ) => {
    changeHappened.current = true;
    if (value?.index !== v?.index || !questionInfo?.mayNotBeApplicable) {
      setDisabledConfidence(false);
    } else {
      setDisabledConfidence(true);
    }
    setValue((prevValue) => (prevValue?.index === v?.index ? null : v));
  };
  useEffect(() => {
    if (notApplicable) {
      setValue(null);
    }
  }, [notApplicable]);
  useEffect(() => {
    if (answer?.selectedOption) {
      setDisabledConfidence(false);
    }
    if (value == null && !notApplicable) {
      setDisabledConfidence(true);
    }
  }, [answer, value]);

  const approveAnswer = useQuery({
    service: (args, config) =>
      service.assessments.answer.approve(
        args ?? { assessmentId, data: { questionId: questionInfo.id } },
        config,
      ),
    runOnMount: false,
  });

  const submitQuestion = async () => {
    dispatch(questionActions.setIsSubmitting(true));
    try {
      if (permissions?.answerQuestion) {
        await service.assessments.answer.submit(
          {
            assessmentId,
            data: {
              questionnaireId: questionnaireId,
              questionId: questionInfo?.id,
              answerOptionId: value?.id || null,
              isNotApplicable: notApplicable,
              confidenceLevelId:
                value?.id || submitOnAnswerSelection || notApplicable
                  ? selcetedConfidenceLevel
                  : null,
            },
          },
          { signal: abortController.current.signal },
        );
      }

      if (isAdvanceMode) {
        if (questionsInfo.permissions?.viewAnswerHistory) {
          await service.assessments.questionnaire
            .getQuestionIssues(
              {
                assessmentId,
                questionId: questionInfo?.id,
              },
              { signal: abortController.current.signal },
            )
            .then((res: any) => {
              dispatch(
                questionActions.setQuestionInfo({
                  ...questionInfo,
                  answer: {
                    selectedOption: value,
                    isNotApplicable: notApplicable,
                    confidenceLevel:
                      confidenceLebels[selcetedConfidenceLevel - 1] ?? null,
                  } as TAnswer,
                  issues: res.data,
                }),
              );
            });
        } else {
          dispatch(
            questionActions.setQuestionInfo({
              ...questionInfo,
              answer: {
                selectedOption: value,
                isNotApplicable: notApplicable,
                confidenceLevel:
                  confidenceLebels[selcetedConfidenceLevel - 1] ?? null,
              } as TAnswer,
            }),
          );
        }
      } else {
        dispatch(
          questionActions.setQuestionInfo({
            ...questionInfo,
            answer: {
              selectedOption: value,
              isNotApplicable: notApplicable,
              confidenceLevel:
                confidenceLebels[selcetedConfidenceLevel - 1] ?? null,
            } as TAnswer,
            issues: {
              ...questionInfo.issues,
              isUnanswered: !value || notApplicable,
            },
          }),
        );
      }

      dispatch(questionActions.setIsSubmitting(false));

      if (value) {
        dispatch(
          questionActions.setAssessmentStatus(EAssessmentStatus.INPROGRESS),
        );
      }
    } catch (e) {
      dispatch(questionActions.setIsSubmitting(false));
      const err = e as ICustomError;
      showToast(err);
    }
    if (submitOnAnswerSelection) {
      const newQuestionIndex = questionIndex + 1;
      if (isLastQuestion) {
        dispatch(questionActions.setAssessmentStatus(EAssessmentStatus.DONE));
        navigate(`../completed`, { replace: true });
        return;
      }
      dispatch(questionActions.goToQuestion(newQuestionIndex));
      navigate(`../${newQuestionIndex}`, {
        replace: true,
      });
    }
    setNotApp(false);
  };

  useEffect(() => {
    if (notApp && !value?.id && !isAdvanceMode) {
      submitQuestion();
    }
  }, [notApp, value?.id]);

  const goToQuestion = async (order: "desc" | "asc") => {
    try {
      if (isLastQuestion && order === "asc") {
        dispatch(questionActions.setAssessmentStatus(EAssessmentStatus.DONE));
        navigate(`../completed`, { replace: true });
        return;
      }
      const newQuestionIndex =
        order === "desc" ? questionIndex - 1 : questionIndex + 1;
      dispatch(questionActions.goToQuestion(newQuestionIndex));
      navigate(`../${newQuestionIndex}`, {
        replace: true,
      });
    } catch (e) {
      dispatch(questionActions.setIsSubmitting(false));
      const err = e as ICustomError;
      showToast(err);
    }
  };

  const notApplicableonChanhe = (e: any) => {
    setNotApplicable(e.target.checked || false);
    setNotApp(true);
    if (e.target.checked) {
      setDisabledConfidence(false);
    } else {
      setDisabledConfidence(true);
    }
  };
  const theme = useTheme();

  const isLTR = theme.direction === "ltr";

  const handleForwardClick = () => {
    if (isLTR) {
      if (!isAdvanceMode) {
        goToQuestion("asc");
        return;
      }
      isSelectedValueTheSameAsAnswer
        ? goToQuestion("asc")
        : setOpenDeleteDialog({ ...openDeleteDialog, status: true });
    } else {
      goToQuestion("desc");
    }
  };

  const handleBackwardClick = () => {
    if (isLTR) {
      if (!isAdvanceMode) {
        goToQuestion("desc");
        return;
      }
      isSelectedValueTheSameAsAnswer
        ? goToQuestion("desc")
        : setOpenDeleteDialog({ ...openDeleteDialog, status: true });
    } else {
      goToQuestion("asc");
    }
  };

  const onApprove = async () => {
    try {
      await approveAnswer.query();
      await questionsResultQueryData.query({ page: 0 }).then((response) => {
        const { items = [] } = response;
        dispatch(
          questionActions.setQuestionsInfo({
            ...questionsInfo,
            questions: items,
          }),
        );
        if (isLastQuestion) {
          dispatch(questionActions.setAssessmentStatus(EAssessmentStatus.DONE));
          navigate(`../completed`, { replace: true });
        } else {
          const newQuestionIndex = questionIndex + 1;
          if (submitOnAnswerSelection) {
            dispatch(questionActions.goToQuestion(newQuestionIndex));
            navigate(`../${newQuestionIndex}`, { replace: true });
          }
        }
      });
    } catch (e) {
      const err = e as ICustomError;
      showToast(err);
    }
  };

  useEffect(() => {
    if (changeHappened.current && !isAdvanceMode) {
      submitQuestion();
      changeHappened.current = false;
    }
  }, [value]);

  return (
    <>
      <Box
        display={"flex"}
        justifyContent="space-around"
        mt={4}
        sx={{ direction: "rtl" }}
      >
        <NavigationButton
          direction={theme.direction}
          onClick={handleForwardClick}
          disabled={isSubmitting ? true : isLTR ? false : questionIndex === 1}
          icon={ArrowForward}
          marginStyle={{ marginInlineStart: { sm: 0, md: "-30px" } }}
          isActive={isSubmitting ? false : isLTR ? true : questionIndex !== 1}
          id="next"
        />
        <Box
          display={"flex"}
          sx={{
            flexDirection: { xs: "column", md: "row" },
            width: { xs: "100%", sm: "80%", md: "auto" },
            direction: is_farsi ? "rtl" : "ltr",
          }}
          flexWrap={"wrap"}
        >
          {options?.map((option: any) => {
            const { index: defaultSelectedIndex, title } = option ?? {};
            return (
              <Box
                key={option?.id}
                mb={2}
                mr={2}
                sx={{ minWidth: { xs: "180px", sm: "320px" } }}
              >
                <ToggleButton
                  data-cy="answer-option"
                  color="success"
                  fullWidth
                  size="large"
                  value={option}
                  selected={defaultSelectedIndex === value?.index}
                  onChange={onChange}
                  disabled={
                    isSubmitting ||
                    notApplicable ||
                    !permissions?.answerQuestion
                  }
                  sx={{
                    ...theme.typography.titleMedium,
                    color: "background.containerLow",
                    p: { xs: 0.6, sm: 1 },
                    textAlign: "left",
                    justifyContent: "flex-start",
                    boxShadow: `0 0 3px ${
                      !!answer?.approved &&
                      answer?.selectedOption?.index === defaultSelectedIndex
                        ? !answer?.approved && permissions?.approveAnswer
                          ? "tertiary.main"
                          : "#0acb89"
                        : "white"
                    }`,
                    borderWidth: "2px",
                    borderColor:
                      !!answer?.approved &&
                      answer?.selectedOption?.index === defaultSelectedIndex &&
                      !answer?.approved &&
                      permissions?.approveAnswer
                        ? "tertiary.main"
                        : "transparent",
                    "&.Mui-selected": {
                      "&:hover": {
                        backgroundColor: !isSelectedValueTheSameAsAnswer
                          ? "success.main"
                          : !!answer?.approved &&
                              !answer?.approved &&
                              permissions?.approveAnswer
                            ? "tertiary.main"
                            : "success.main",
                      },
                      color: "background.containerLowest",
                      backgroundColor: !isSelectedValueTheSameAsAnswer
                        ? "success.main"
                        : !!answer?.approved &&
                            !answer?.approved &&
                            permissions?.approveAnswer
                          ? "tertiary.main"
                          : "success.main",
                      borderColor: "transparent",
                      zIndex: 2,
                      position: "relative",
                    },
                    "&.Mui-disabled": {
                      color: "#ffffff78",
                    },
                    fontFamily: languageDetector(title)
                      ? farsiFontFamily
                      : primaryFontFamily,
                  }}
                >
                  <Checkbox
                    disableRipple={true}
                    checked={defaultSelectedIndex === value?.index}
                    disabled
                    sx={{
                      position: "absoulte",
                      zIndex: 1,
                      color: "background.containerLowest",
                      p: 0,
                      mx: "8px",
                      opacity: 0.8,
                      "& svg": { fontSize: { xs: "2.1rem", sm: "2.5rem" } },
                      "&.Mui-checked": { color: "white", opacity: 1 },
                      "&.Mui-disabled": {
                        color:
                          notApplicable || !permissions?.answerQuestion
                            ? "disabled.main"
                            : "white",
                      },
                    }}
                  />
                  {defaultSelectedIndex}. {title}
                </ToggleButton>
              </Box>
            );
          })}
        </Box>
        <NavigationButton
          direction={theme.direction}
          onClick={handleBackwardClick}
          disabled={isSubmitting ? true : isLTR ? questionIndex === 1 : false}
          icon={ArrowBack}
          marginStyle={{ marginInlineEnd: { sm: 0, md: "-30px" } }}
          isActive={isSubmitting ? false : isLTR ? questionIndex !== 1 : true}
          id="back"
        />
      </Box>
      {notApplicable && (
        <Box sx={{ ...styles.centerV }}>
          <WarningAmberRoundedIcon color="error" />
          <Typography variant="subtitle2" color="error" mt="4px" ml="4px">
            <Trans i18nKey="questions.theOptionSelectionIsDisabled" />
          </Typography>
        </Box>
      )}
      <Box
        sx={{
          mt: { xs: 4, md: 1 },
          px: 4,
          display: "flex",
          flexDirection: "row-reverse",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {isAdvanceMode && (
          <Box gap={2} sx={{ ...styles.centerVH }}>
            <LoadingButton
              variant="contained"
              loading={isSubmitting}
              sx={{
                fontSize: "1.2rem",
                "&.Mui-disabled": {
                  bgcolor: "#C2CCD650",
                  color: "black",
                },
              }}
              onClick={submitQuestion}
              disabled={
                isSelectedValueTheSameAsAnswer ||
                ((value || notApplicable) && !selcetedConfidenceLevel)
              }
            >
              <Trans i18nKey="common.submit" />
            </LoadingButton>{" "}
          </Box>
        )}
        {isSelectedValueTheSameAsAnswer &&
          value &&
          answer?.hasOwnProperty("approved") &&
          !answer?.approved &&
          permissions?.approveAnswer && (
            <Box
              bgcolor="tertiary.main"
              borderRadius="4px"
              p={2}
              gap={4}
              height="40px"
              boxSizing="border-box"
              sx={{ ...styles.centerVH }}
            >
              <Typography variant="labelMedium" color="teritary.light">
                <Trans i18nKey="questions.answerNeedApprove" />
              </Typography>
              <Button
                onClick={onApprove}
                sx={{
                  bgcolor: "tertiary.main",
                  boxShadow: "0px 1px 5px 0px rgba(0, 0, 0, 0.12)",
                  "&:hover": {
                    boxShadow: "0px 1px 5px 0px rgba(0, 0, 0, 0.12)",
                    bgcolor: "tertiary.main",
                  },
                }}
              >
                <Typography
                  variant="bodySmall"
                  color="background.containerLowest"
                >
                  <Trans i18nKey="common.approve" />
                </Typography>
              </Button>
            </Box>
          )}
        {may_not_be_applicable && (
          <Box sx={styles.centerVH} gap={2}>
            <FormControlLabel
              sx={{ color: "background.containerLowest" }}
              data-cy="automatic-submit-check"
              id="not-applicable"
              control={
                <Checkbox
                  checked={notApplicable}
                  onChange={(e) => notApplicableonChanhe(e)}
                  sx={{
                    color: "background.containerLowest",
                    "&.Mui-checked": {
                      color: "background.containerLowest",
                    },
                  }}
                />
              }
              label={<Trans i18nKey="questions.notApplicable" />}
            />
          </Box>
        )}
        <DeleteConfirmationDialog
          open={openDeleteDialog.status}
          onClose={() =>
            setOpenDeleteDialog({ ...openDeleteDialog, status: false })
          }
          onConfirm={() => goToQuestion("asc")}
          title="common.warning"
          content="questions.areYouSureYouWantSkipThisQuestion"
          confirmButtonText={t("common.continue")}
        />
      </Box>
    </>
  );
};

const AnswerDetails = ({
  questionInfo,
  type,
  permissions,
  queryData,
}: {
  questionInfo: any;
  type: string;
  permissions?: IPermissions;
  queryData: any;
}) => {
  const [page, setPage] = useState(0);
  const [data, setData] = useState<IAnswerHistory[]>([]);
  const dialogProps = useDialog();
  const { assessmentId = "" } = useParams();

  useEffect(() => {
    if (queryData.data?.items && type === "history") {
      setData((prevData) => {
        const mergedData = [...prevData, ...queryData.data.items];
        const uniqueData = Array.from(
          new Map(mergedData.map((item) => [item.creationTime, item])).values(),
        );
        return uniqueData;
      });
    }
  }, [queryData.data]);

  const handleShowMore = () => {
    setPage((prevPage) => prevPage + 1);
    queryData.query({
      questionId: questionInfo.id,
      assessmentId,
      page: page + 1,
      size: 10,
    });
  };

  return (
    <Box mt={2} width="100%" my={4}>
      {type === "evidence" || type === "comment" ? (
        <Box
          display="flex"
          alignItems={"baseline"}
          sx={{
            flexDirection: "column",
            px: 2,
            width: "100%",
            wordBreak: "break-word",
          }}
        >
          <Evidence
            {...dialogProps}
            type={type}
            questionInfo={questionInfo}
            evidencesQueryData={queryData}
            permissions={permissions}
          />
        </Box>
      ) : data.length > 0 ? (
        <Box
          alignItems={"baseline"}
          overflow="auto"
          width="100%"
          sx={{
            ...styles.centerCH,
            wordBreak: "break-word",
          }}
        >
          {data.map((item: IAnswerHistory, index: number) => (
            <Box key={item?.creationTime} width="96%">
              <AnswerHistoryItem item={item} questionInfo={questionInfo} />
              <Divider sx={{ width: "100%", marginBlock: 2 }} />
            </Box>
          ))}
          {queryData?.data?.total >
            queryData?.data?.size * (queryData?.data?.page + 1) && (
            <Button onClick={handleShowMore}>
              <Trans i18nKey="showMore" />
            </Button>
          )}
        </Box>
      ) : (
        <Box sx={{ ...styles.centerCVH }} textAlign="center">
          <Typography variant="displayMedium" color="background.onVariant">
            <Trans i18nKey="questions.emptyAnswerHistoryTitle" />
          </Typography>
          <Typography variant="bodyLarge" color="background.onVariant">
            <Trans i18nKey="questions.emptyAnswerHistoryDescription" />
          </Typography>
        </Box>
      )}
    </Box>
  );
};

const AnswerHistoryItem = (props: any) => {
  const { item }: { item: IAnswerHistory } = props;

  return (
    <Grid container spacing={2} px={1}>
      <Grid
        item
        xs={12}
        md={12}
        lg={4}
        xl={4}
        gap={2}
        width="100%"
        sx={{ ...styles.centerV }}
      >
        <Avatar
          src={item?.createdBy?.pictureLink ?? undefined}
          sx={{
            width: 46,
            height: 46,
          }}
        ></Avatar>
        <Typography
          variant="titleMedium"
          color="primary.dark"
          sx={{
            fontFamily: languageDetector(item?.createdBy?.displayName)
              ? farsiFontFamily
              : primaryFontFamily,
          }}
        >
          {item?.createdBy?.displayName}
        </Typography>
      </Grid>
      {item.answer.isNotApplicable ? (
        <Grid item xs={12} md={12} lg={5} xl={5}>
          <Typography variant="titleMedium" color="primary.dark">
            <Trans i18nKey="questions.uestionIsMarkedAsNotApplicable" />:
          </Typography>
        </Grid>
      ) : (
        <Grid
          item
          xs={12}
          md={12}
          lg={5}
          xl={5}
          display="flex"
          flexDirection="column"
          gap={1.5}
        >
          <Box sx={{ ...styles.centerV }} gap={1.5}>
            <Typography variant="titleSmall">
              <Trans i18nKey="common.confidence" />:
            </Typography>
            <Rating
              disabled={true}
              value={
                item?.answer?.confidenceLevel?.id !== null
                  ? (item?.answer?.confidenceLevel?.id as number)
                  : null
              }
              size="medium"
              icon={
                <RadioButtonCheckedRoundedIcon
                  sx={{ mx: 0.25, color: "#42a5f5" }}
                  fontSize="inherit"
                />
              }
              emptyIcon={
                <RadioButtonUncheckedRoundedIcon
                  style={{ opacity: 0.55 }}
                  fontSize="inherit"
                />
              }
            />
          </Box>
          <Box sx={{ ...styles.centerV }} gap={1.5}>
            <Typography variant="titleSmall">
              <Trans i18nKey="questions.selectedOption" />:
            </Typography>
            <Typography
              variant="bodyMedium"
              maxWidth="400px"
              sx={{
                fontFamily: languageDetector(
                  item?.answer?.selectedOption?.title,
                )
                  ? farsiFontFamily
                  : primaryFontFamily,
              }}
            >
              {item?.answer?.selectedOption ? (
                <>
                  {" "}
                  {item?.answer?.selectedOption?.index}.
                  {item?.answer?.selectedOption?.title}
                </>
              ) : (
                <Trans i18nKey="questions.noOptionSelected" />
              )}
            </Typography>
          </Box>
        </Grid>
      )}
      <Grid
        item
        xs={12}
        md={12}
        lg={3}
        xl={3}
        display="flex"
        justifyContent="flex-end"
      >
        <Typography variant="bodyMedium">
          {getReadableDate(item.creationTime, "relativeWithDate", true)}
        </Typography>
      </Grid>
    </Grid>
  );
};

const Evidence = (props: any) => {
  const dispatch = useQuestionDispatch();
  const LIMITED = 500;
  const [valueCount, setValueCount] = useState("");
  const [evidencesData, setEvidencesData] = useState<any[]>([]);
  const [expandedDeleteDialog, setExpandedDeleteDialog] =
    useState<boolean>(false);
  const [expandedDeleteAttachmentDialog, setExpandedDeleteAttachmentDialog] =
    useState<any>({ expended: false, id: "" });
  const [expandedAttachmentsDialogs, setExpandedAttachmentsDialogs] =
    useState<any>({ expended: false, count: 0 });
  const [attachmentData, setAttachmentData] = useState<boolean>(false);
  const is_farsi = languageDetector(valueCount);
  const { service } = useServiceContext();
  const [evidenceId, setEvidenceId] = useState("");
  const theme = useTheme();
  const {
    questionInfo,
    permissions,
    type,
    evidencesQueryData,
  }: {
    questionInfo: IQuestionInfo;
    permissions: IPermissions;
    type: string;
    evidencesQueryData: any;
  } = props;
  const { assessmentId = "" } = useParams();
  const formMethods = useForm({ shouldUnregister: true });

  const addEvidence = useQuery({
    service: (args, config) => service.questions.evidences.save(args, config),
    runOnMount: false,
  });

  const fetchEvidenceAttachments = useQuery({
    service: (args, config) =>
      service.questions.evidences.getAttachments(args, config),
    runOnMount: false,
  });

  useEffect(() => {
    if (evidencesQueryData.data?.items) {
      setEvidencesData(evidencesQueryData.data?.items);
    }
  }, [evidencesQueryData.data]);

  const [value, setValue] = useState<any>("POSITIVE");
  const [createAttachment, setCreateAttachment] = useState(false);
  const [loadingEvidence, setLoadingEvidence] = useState(false);

  const [evidenceBG, setEvidenceBG] = useState<any>({
    background: theme.palette.primary.main,
    borderColor: theme.palette.primary.dark,
    borderHover: theme.palette.primary.states.selected,
  });
  useEffect(() => {
    if (value === null) {
      setEvidenceBG({
        background: "rgba(25, 28, 31, 0.08)",
        borderColor: "#191C1F",
        borderHover: "#061528",
      });
    }
    if (value === "POSITIVE") {
      setEvidenceBG({
        background: "rgba(32, 95, 148, 0.08)",
        borderColor: "#205F94",
        borderHover: "#117476",
      });
    } else if (value === "NEGATIVE") {
      setEvidenceBG({
        background: "rgba(139, 0, 53, 0.08)",
        borderColor: "#8B0035",
        borderHover: "#821237",
      });
    }
  }, [value]);

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };
  //if there is a evidence we should use addEvidence service
  const onSubmit = async (data: any) => {
    try {
      if (data.evidence.length <= LIMITED) {
        let { id } = await addEvidence.query({
          description: data.evidence,
          questionId: questionInfo.id,
          assessmentId,
          type: value,
        });
        if (createAttachment) {
          setExpandedAttachmentsDialogs({ count: 0, expended: true });
          setEvidenceId(id);
        }
        setCreateAttachment(false);
        const { items } = await evidencesQueryData.query();
        setEvidencesData(items);
        setValueCount("");
        if (permissions?.viewDashboard) {
          service.assessments.questionnaire
            .getQuestionIssues(
              {
                assessmentId,
                questionId: questionInfo?.id,
              },
              {},
            )
            .then((res: any) => {
              dispatch(
                questionActions.setQuestionInfo({
                  ...questionInfo,
                  issues: res.data,
                }),
              );
            });
        }
      }
    } catch (e) {
      const err = e as ICustomError;
      showToast(err?.response?.data.description[0]);
    } finally {
      formMethods.reset();
    }
  };

  const deleteEvidence = useQuery({
    service: (args, config) =>
      service.questions.evidences.remove(args ?? { id: evidenceId }, config),
    runOnMount: false,
  });

  const RemoveEvidenceAttachments = useQuery({
    service: (args, config) =>
      service.questions.evidences.removeAttachment(args, {}),
    runOnMount: false,
  });

  const deleteItem = async () => {
    try {
      await deleteEvidence.query();
      setExpandedDeleteDialog(false);
      const { items } = await evidencesQueryData.query();
      setEvidencesData(items);
      if (permissions?.viewDashboard) {
        service.assessments.questionnaire
          .getQuestionIssues(
            {
              assessmentId,
              questionId: questionInfo?.id,
            },
            {},
          )
          .then((res: any) => {
            dispatch(
              questionActions.setQuestionInfo({
                ...questionInfo,
                issues: res.data,
              }),
            );
          });
      }
    } catch (e) {
      const err = e as ICustomError;
      showToast(err);
    }
  };
  const deleteAttachment = async () => {
    try {
      const attachmentId = expandedDeleteAttachmentDialog.id;
      await RemoveEvidenceAttachments.query({ evidenceId, attachmentId });
      setExpandedDeleteAttachmentDialog({
        ...expandedDeleteAttachmentDialog,
        expended: false,
      });
      if (!createAttachment) {
        const { items } = await evidencesQueryData.query();
        setEvidencesData(items);
      }
      setAttachmentData(true);
    } catch (e) {
      const err = e as ICustomError;
      showToast(err);
    }
  };
  const fetchAttachments = async (args: any) => {
    return fetchEvidenceAttachments.query({ ...args });
  };

  const rtl = localStorage.getItem("lang") === "fa";
  useEffect(() => {
    if (type === "comment") {
      setValue(null);
    } else {
      setValue(evidenceAttachmentType.positive);
    }
  }, [type]);

  return evidencesQueryData.loading ? (
    <Box sx={{ ...styles.centerVH }} height="10vh" width="100%">
      <CircularProgress />
    </Box>
  ) : (
    <Box
      display={"flex"}
      flexDirection={"column"}
      width="100%"
      px={!permissions?.readonly ? { xs: 0, sm: 10 } : 0}
    >
      {permissions?.addEvidence && (
        <FormProvider {...formMethods}>
          <form
            onSubmit={formMethods.handleSubmit(onSubmit)}
            style={{ flex: 1, display: "flex", flexDirection: "column" }}
          >
            <Grid
              container
              display={"flex"}
              justifyContent={"end"}
              sx={styles.formGrid}
            >
              <TabContext value={value}>
                <TabList
                  onChange={handleChange}
                  sx={{
                    width: "100%",
                    "&.MuiTabs-root": {
                      borderBottomColor: "transparent",
                      justifyContent: "space-between",
                      display: "flex",
                    },
                    ".MuiTabs-indicator": {
                      backgroundColor: evidenceBG.borderColor,
                    },
                  }}
                >
                  {type === "evidence" && (
                    <Tab
                      label={<Trans i18nKey="questions.negativeEvidence" />}
                      value={evidenceAttachmentType.negative}
                      sx={{
                        display: "flex",
                        flex: 1,
                        maxWidth: "unset",
                        "&.Mui-selected": {
                          color: `${evidenceBG.borderColor}  !important`,
                        },
                        ...theme.typography.headlineSmall,
                        fontSize: { xs: "1rem !important" },
                      }}
                    />
                  )}
                  {type === "comment" && (
                    <Tab
                      label={
                        <Box
                          sx={{
                            ...styles.centerV,
                          }}
                        >
                          <Trans i18nKey="questions.comment" />
                        </Box>
                      }
                      sx={{
                        display: "flex",
                        flex: 1,
                        maxWidth: "unset",

                        "&.Mui-selected": {
                          color: `${evidenceBG.borderColor}  !important`,
                        },
                        ...theme.typography.headlineSmall,
                        fontSize: { xs: "1rem !important" },
                      }}
                      value={null}
                    />
                  )}
                  {type === "evidence" && (
                    <Tab
                      label={<Trans i18nKey="questions.positiveEvidence" />}
                      sx={{
                        display: "flex",
                        flex: 1,
                        maxWidth: "unset",

                        "&.Mui-selected": {
                          color: `${evidenceBG.borderColor}  !important`,
                        },
                        ...theme.typography.headlineSmall,
                        fontSize: { xs: "1rem !important" },
                      }}
                      value={evidenceAttachmentType.positive}
                    />
                  )}
                </TabList>
              </TabContext>
              <Grid item xs={12} position={"relative"}>
                <InputFieldUC
                  multiline
                  minRows={3}
                  maxRows={8}
                  minLength={3}
                  maxLength={LIMITED}
                  autoFocus={false}
                  defaultValue={""}
                  pallet={evidenceBG}
                  name="evidence"
                  label={null}
                  required={true}
                  placeholder={t("questions.evidencePlaceholder") as string}
                  borderRadius={"12px"}
                  setValueCount={setValueCount}
                  hasCounter={true}
                  isFarsi={is_farsi}
                  rtl={rtl}
                  inputProps={{
                    sx: {
                      "&::placeholder": {
                        ...theme.typography.bodyMedium,
                      },
                    },
                  }}
                />
                <FormControlLabel
                  sx={{
                    color: theme.palette.primary.main,
                    position: "absolute",
                    bottom: "20px",
                    left: theme.direction === "ltr" ? "20px" : "unset",
                    right: theme.direction === "rtl" ? "20px" : "unset",
                  }}
                  data-cy="automatic-submit-check"
                  control={
                    <Checkbox
                      disabled={!permissions?.addEvidenceAttachment}
                      checked={createAttachment}
                      onChange={() => setCreateAttachment((prev) => !prev)}
                      sx={{
                        color: evidenceBG.borderColor,
                        "&.Mui-checked": {
                          color: evidenceBG.borderColor,
                        },
                      }}
                    />
                  }
                  label={
                    <Typography color="text.primary" variant="titleSmall">
                      <Trans i18nKey="questions.needsToAddAttachments" />
                    </Typography>
                  }
                />
                <Typography
                  color={valueCount.length > LIMITED ? "#D81E5B" : "#9DA7B3"}
                  style={is_farsi || rtl ? { left: 10 } : { right: 10 }}
                  sx={{
                    position: "absolute",
                    top: 20,
                    fontSize: ".875rem",
                    fontWeight: 300,
                  }}
                >
                  {valueCount.length ?? 0} / {LIMITED}
                </Typography>
                <Grid
                  item
                  xs={12}
                  sx={
                    is_farsi
                      ? { position: "absolute", top: 15, left: 5 }
                      : {
                          position: "absolute",
                          top: 15,
                          right: 5,
                        }
                  }
                ></Grid>
              </Grid>
              <Box display={"flex"} justifyContent={"end"} mt={2}>
                <LoadingButton
                  sx={{
                    borderRadius: "4px",
                    px: 3,
                    bgcolor: evidenceBG.borderColor,
                    "&:hover": {
                      bgcolor: evidenceBG.borderColor,
                    },
                    ...theme.typography.titleMedium,
                  }}
                  type="submit"
                  variant="contained"
                  loading={evidencesQueryData.loading}
                  onClick={() =>
                    permissions?.viewDashboard &&
                    service.assessments.questionnaire
                      .getQuestionIssues(
                        {
                          assessmentId,
                          questionId: questionInfo?.id,
                        },
                        {},
                      )
                      .then((res: any) => {
                        dispatch(
                          questionActions.setQuestionInfo({
                            ...questionInfo,
                            issues: res.data,
                          }),
                        );
                      })
                  }
                >
                  <Trans
                    i18nKey="questions.createEvidence"
                    values={{ title: t(`questions.${type}`).toLowerCase() }}
                  />
                </LoadingButton>
              </Box>
            </Grid>
          </form>
        </FormProvider>
      )}
      <Box mt={3} width="100%">
        {loadingEvidence ? (
          <Box width="100%" sx={{ ...styles.centerH }}>
            <CircularProgress size="3.25rem" />
          </Box>
        ) : (
          evidencesData &&
          permissions?.viewEvidenceList && (
            <>
              {!evidencesData.length && permissions?.readonly ? (
                <Box width="100%" sx={{ ...styles.centerH }}>
                  <EmptyState
                    title={
                      type === "evidence"
                        ? t("questions.noEvidence")
                        : t("questions.noComment")
                    }
                  />
                </Box>
              ) : (
                <>
                  {evidencesData.map((item: any, index: number) => (
                    <EvidenceDetail
                      key={item?.id}
                      setValue={setValue}
                      item={item}
                      setLoadingEvidence={setLoadingEvidence}
                      evidencesData={evidencesData}
                      setEvidencesData={setEvidencesData}
                      setExpandedDeleteDialog={setExpandedDeleteDialog}
                      setExpandedDeleteAttachmentDialog={
                        setExpandedDeleteAttachmentDialog
                      }
                      setExpandedAttachmentsDialogs={
                        setExpandedAttachmentsDialogs
                      }
                      expandedAttachmentsDialogs={expandedAttachmentsDialogs}
                      setEvidenceId={setEvidenceId}
                      evidenceId={evidenceId}
                      evidencesQueryData={evidencesQueryData}
                      questionInfo={questionInfo}
                      assessmentId={assessmentId}
                      fetchAttachments={fetchAttachments}
                      attachmentData={attachmentData}
                      setAttachmentData={setAttachmentData}
                      deleteAttachment={deleteAttachment}
                      permissions={permissions}
                    />
                  ))}
                </>
              )}
            </>
          )
        )}
        <EvidenceAttachmentsDialogs
          expanded={expandedAttachmentsDialogs}
          onClose={() =>
            setExpandedAttachmentsDialogs({
              ...expandedAttachmentsDialogs,
              expended: false,
            })
          }
          assessmentId={assessmentId}
          setEvidencesData={setEvidencesData}
          evidenceId={evidenceId}
          evidencesQueryData={evidencesQueryData}
          title={<Trans i18nKey="common.addNewMember" />}
          uploadAnother={<Trans i18nKey="common.uploadAnother" />}
          uploadAttachment={<Trans i18nKey="common.uploadAttachment" />}
          fetchAttachments={fetchAttachments}
          setAttachmentData={setAttachmentData}
          createAttachment={createAttachment}
        />
        <DeleteConfirmationDialog
          open={expandedDeleteDialog}
          onClose={() => setExpandedDeleteDialog(false)}
          onConfirm={deleteItem}
          title="common.warning"
          content="questions.areYouSureYouWantDeleteThisItem"
        />
        <DeleteConfirmationDialog
          open={expandedDeleteAttachmentDialog.expended}
          onClose={() =>
            setExpandedDeleteAttachmentDialog({
              ...expandedAttachmentsDialogs,
              expended: false,
            })
          }
          onConfirm={deleteAttachment}
          title="common.warning"
          content="questions.areYouSureYouWantDeleteThisAttachment"
          confirmButtonText={t("common.yesDeleteIt")}
          cancelButtonText={t("common.letMeSeeItAgain")}
        />
      </Box>
    </Box>
  );
};

const EvidenceDetail = (props: any) => {
  const {
    item,
    evidencesQueryData,
    questionInfo,
    assessmentId,
    setEvidenceId,
    setExpandedDeleteDialog,
    setExpandedAttachmentsDialogs,
    setEvidencesData,
    fetchAttachments,
    expandedAttachmentsDialogs,
    attachmentData,
    setAttachmentData,
    setExpandedDeleteAttachmentDialog,
    evidenceId,
    evidencesData,
    setLoadingEvidence,
  } = props;
  const { permissions }: { permissions: IPermissions } = props;
  const LIMITED = 500;
  const [valueCount, setValueCount] = useState("");
  const [value, setValue] = useState<any>("POSITIVE");
  const [expandedEvidenceBox, setExpandedEvidenceBox] =
    useState<boolean>(false);
  const addEvidence = useQuery({
    service: (args, config) => service.questions.evidences.save(args, config),
    runOnMount: false,
  });

  const resolveComment = useQuery({
    service: (args, config) => service.questions.comments.resolve(args, config),
    runOnMount: false,
  });

  useEffect(() => {
    if (id === evidencesData[0].id) {
      setExpandedEvidenceBox(false);
    }
  }, [evidencesData.length]);

  const {
    description,
    lastModificationTime,
    createdBy,
    id,
    type,
    attachmentsCount,
    editable,
    deletable,
    resolvable,
  } = item;
  const dispatch = useQuestionDispatch();
  const { displayName, pictureLink } = createdBy;
  const is_farsi = languageDetector(description);
  const [evidenceBG, setEvidenceBG] = useState<any>();

  const { service } = useServiceContext();
  const [isEditing, setIsEditing] = useState(false);
  const [attachments, setAttachments] = useState<any[]>([]);
  const [loadingFile, setLoadingFile] = useState<boolean>(false);

  const submitRef = useRef<any>(null);

  const formMethods = useForm({ shouldUnregister: true });

  const onSubmit = async (data: any) => {
    try {
      if (data.evidenceDetail.length <= LIMITED) {
        await addEvidence.query({
          description: data.evidenceDetail,
          questionId: questionInfo.id,
          assessmentId,
          type: value,
          id: id,
        });
        const { items } = await evidencesQueryData.query();
        setEvidencesData(items);
        setExpandedEvidenceBox(false);
        setIsEditing(false);
        setValueCount("");
      }
    } catch (e) {
      const err = e as ICustomError;
      showToast(err?.response?.data.description[0]);
    } finally {
      formMethods.reset();
      setLoadingEvidence(false);
    }
  };

  const onUpdate = async () => {
    setIsEditing((prev) => !prev);

    if (type === "Positive") {
      setValue(evidenceAttachmentType.positive);
    }
    if (type === "Negative") {
      setValue(evidenceAttachmentType.negative);
    }
    if (type === null) {
      setValue(null);
    }
  };

  const onResolve = async (id: string) => {
    try {
      await resolveComment.query({
        id: id,
      });
      const { items } = await evidencesQueryData.query();
      setEvidencesData(items);
      setExpandedEvidenceBox(false);
      setIsEditing(false);
      setValueCount("");
      if (permissions?.viewDashboard) {
        service.assessments.questionnaire
          .getQuestionIssues(
            {
              assessmentId,
              questionId: questionInfo?.id,
            },
            {},
          )
          .then((res: any) => {
            dispatch(
              questionActions.setQuestionInfo({
                ...questionInfo,
                issues: res.data,
              }),
            );
          });
      }
    } catch (e) {
      const err = e as ICustomError;
      showToast(err?.response?.data.description[0]);
    } finally {
      formMethods.reset();
      setLoadingEvidence(false);
    }
  };

  const EditEvidence = () => {
    setLoadingEvidence(true);
    if (submitRef?.current) {
      submitRef?.current.click();
    }
  };

  useEffect(() => {
    if (type === "Positive") {
      setEvidenceBG({
        background: "rgba(32, 95, 148, 0.08)",
        borderColor: "#205F94",
        borderHover: "#117476",
      });
    } else if (type === "Negative") {
      setEvidenceBG({
        background: "rgba(139, 0, 53, 0.08)",
        borderColor: "#8B0035",
        borderHover: "#821237",
      });
    } else {
      setValue(null);
      setEvidenceBG({
        background: "rgba(25, 28, 31, 0.08)",
        borderColor: "#191C1F",
        borderHover: "#061528",
      });
    }
  }, [type]);

  const theme = useTheme();
  useEffect(() => {
    (async () => {
      if (attachmentData && evidenceId == id) {
        const { attachments } = await fetchAttachments({ evidence_id: id });
        setAttachments(attachments);
        setExpandedAttachmentsDialogs({
          ...expandedAttachmentsDialogs,
          count: attachmentsCount,
        });
        setAttachmentData(false);
      }
    })();
  }, [attachmentData, evidenceId]);

  const expandedEvidenceBtm = async () => {
    setLoadingFile(true);
    setExpandedEvidenceBox((prev) => !prev);
    if (!expandedEvidenceBox) {
      const { attachments } = await fetchAttachments({ evidence_id: id });
      setLoadingFile(false);
      setAttachments(attachments);
    } else {
      setLoadingFile(false);
    }
  };

  const skeleton = Array.from(Array(attachmentsCount).keys());
  return (
    <Box display="flex" flexDirection="column" width="100%">
      <Box sx={{ display: "flex", gap: { xs: "7px", sm: "1rem" }, mb: 4 }}>
        <Tooltip title={displayName}>
          <Avatar
            {...stringAvatar(displayName.toUpperCase())}
            src={pictureLink}
            sx={{ width: 56, height: 56 }}
          ></Avatar>
        </Tooltip>
        {isEditing ? (
          <>
            <FormProvider {...formMethods}>
              <Box
                component={"form"}
                onSubmit={formMethods.handleSubmit(onSubmit)}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  height: "fit-content",
                  width: { xs: "100%", sm: "60%" },
                  borderRadius: "12px",
                  border: `1px solid ${evidenceBG.borderColor}`,
                }}
              >
                <Grid container display={"flex"} justifyContent={"end"}>
                  <Grid item xs={12} position={"relative"}>
                    <Typography
                      color={evidenceBG.borderColor}
                      sx={{
                        fontSize: "1.125rem",
                        fontWeight: "bold",
                        position: "absolute",
                        top: 10,
                        left: theme.direction === "ltr" ? 15 : "unset",
                        right: theme.direction === "rtl" ? 15 : "unset",
                        zIndex: 1,
                      }}
                    >
                      <Trans i18nKey="common.edit" />
                    </Typography>
                    <InputFieldUC
                      multiline
                      minRows={3}
                      maxRows={8}
                      minLength={3}
                      maxLength={LIMITED}
                      autoFocus={false}
                      defaultValue={description}
                      pallet={evidenceBG}
                      name="evidenceDetail"
                      label={null}
                      required={true}
                      borderRadius={"12px"}
                      setValueCount={setValueCount}
                      hasCounter={true}
                      isFarsi={is_farsi}
                      isEditing={isEditing}
                    />
                    <Typography
                      color={
                        valueCount.length > LIMITED ? "#D81E5B" : "#9DA7B3"
                      }
                      style={is_farsi ? { left: 20 } : { right: 20 }}
                      sx={{
                        position: "absolute",
                        top: 7,
                        fontSize: ".875rem",
                        fontWeight: 300,
                      }}
                    >
                      {valueCount.length ?? 0} / {LIMITED}
                    </Typography>
                    <Grid
                      item
                      xs={12}
                      sx={
                        is_farsi
                          ? { position: "absolute", top: 15, left: 5 }
                          : {
                              position: "absolute",
                              top: 15,
                              right: 5,
                            }
                      }
                    ></Grid>
                  </Grid>
                </Grid>
                <IconButton
                  ref={submitRef}
                  type={"submit"}
                  sx={{ display: "none" }}
                />
              </Box>
            </FormProvider>
            <Box gap={1} sx={{ ...styles.centerCV }}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  gap: 2,
                }}
              >
                <IconButton
                  aria-label="edit"
                  size="small"
                  sx={{
                    boxShadow: 2,
                    p: 1,
                    bgcolor: evidenceBG?.background,
                  }}
                  onClick={EditEvidence}
                >
                  <DoneIcon
                    fontSize="small"
                    style={{ color: evidenceBG?.borderColor }}
                  />
                </IconButton>
                <IconButton
                  aria-label="delete"
                  size="small"
                  sx={{ boxShadow: 2, p: 1 }}
                  onClick={onUpdate}
                >
                  <ClearIcon fontSize="small" style={{ color: "#D81E5B" }} />
                </IconButton>
              </Box>
            </Box>
          </>
        ) : (
          <>
            <Box
              px={{ xs: "12px", sm: "32px" }}
              py={{ xs: "8px", sm: "16px" }}
              height="fit-content"
              display="flex"
              flexDirection="column"
              bgcolor={evidenceBG?.background}
              color="#0A2342"
              borderRadius={
                theme.direction == "ltr"
                  ? "0 24px 24px 24px "
                  : "24px 0px 24px 24px "
              }
              gap="16px"
              textAlign={is_farsi ? "right" : "left"}
              border={`1px solid ${evidenceBG?.borderColor}`}
              sx={{ direction: `${is_farsi ? "rtl" : "ltr"}` }}
            >
              <Box
                display="flex"
                flexDirection={{ xs: "column", sm: "row" }}
                alignItems="flex-end"
                gap={{ xs: "24px", sm: "48px" }}
              >
                <Box
                  display="flex"
                  flexDirection="column"
                  gap="1.7rem"
                  minWidth={{ xs: "auto", sm: "320px" }}
                >
                  <Typography
                    variant="bodyLarge"
                    fontWeight="normal"
                    sx={{
                      fontFamily: languageDetector(description)
                        ? farsiFontFamily
                        : primaryFontFamily,
                    }}
                    dangerouslySetInnerHTML={{
                      __html: convertLinksToClickable(description),
                    }}
                  />
                  <Box display="flex" flexDirection="column" gap="10px">
                    {(!permissions.readonly || attachmentsCount) && (
                      <Box
                        onClick={() => expandedEvidenceBtm()}
                        sx={{ display: "flex", cursor: "pointer" }}
                      >
                        {!attachmentsCount ? (
                          <Typography
                            variant="titleMedium"
                            sx={{
                              fontSize: { xs: "10px", sm: "unset" },
                            }}
                          >
                            <Trans i18nKey={"questions.addAttachment"} />
                          </Typography>
                        ) : (
                          <Typography
                            variant="titleMedium"
                            display="flex"
                            gap="5px"
                          >
                            {t("questions.attachmentCount", {
                              attachmentsCount,
                            })}
                          </Typography>
                        )}
                        <img
                          style={
                            expandedEvidenceBox
                              ? {
                                  rotate: "180deg",
                                  transition: "all .2s ease",
                                }
                              : { rotate: "0deg", transition: "all .2s ease" }
                          }
                          src={arrowBtn}
                          alt="arrow"
                        />
                      </Box>
                    )}
                    <Grid
                      display="flex"
                      flexDirection="column"
                      gap="0.5rem"
                      container
                      style={
                        expandedEvidenceBox
                          ? {}
                          : {
                              maxHeight: 0,
                              overflow: "hidden",
                            }
                      }
                      sx={{ transition: "all .2s ease" }}
                    >
                      <Box display="flex" gap="0.5rem" flexWrap="wrap">
                        {(permissions?.viewEvidenceAttachment ||
                          permissions.readonly) && (
                          <>
                            {loadingFile
                              ? skeleton.map((item) => {
                                  return (
                                    <Skeleton
                                      key={item}
                                      animation="wave"
                                      variant="rounded"
                                      width={40}
                                      height={40}
                                    />
                                  );
                                })
                              : attachments.map((item) => {
                                  return (
                                    <FileIcon
                                      evidenceId={id}
                                      setEvidenceId={setEvidenceId}
                                      item={item}
                                      setExpandedDeleteAttachmentDialog={
                                        setExpandedDeleteAttachmentDialog
                                      }
                                      evidenceBG={evidenceBG}
                                      downloadFile={downloadFile}
                                      key={item?.id}
                                    />
                                  );
                                })}
                          </>
                        )}
                        {attachments.length < 5 &&
                          permissions?.addEvidenceAttachment && (
                            <Grid
                              item
                              onClick={() => {
                                setExpandedAttachmentsDialogs({
                                  expended: true,
                                  count: attachments.length,
                                });
                                setEvidenceId(id);
                              }}
                            >
                              <PreAttachment
                                mainColor={evidenceBG?.borderColor}
                              />
                            </Grid>
                          )}
                      </Box>
                      {attachments.length == 5 && (
                        <Box>
                          <Typography
                            color="#821237"
                            fontSize="11px"
                            alignItems="start"
                            textAlign="justify"
                            width={{ xs: "150px", sm: "250px" }}
                            sx={{ ...styles.centerV }}
                          >
                            <InfoOutlinedIcon
                              sx={{
                                marginInlineStart: "unset",
                                marginInlineEnd: 1,
                                width: "15px",
                                height: "15px",
                              }}
                            />
                            <Trans i18nKey="questions.evidenceIsLimited" />
                          </Typography>
                        </Box>
                      )}
                    </Grid>
                    <Typography
                      fontSize="12px"
                      variant="overline"
                      whiteSpace="nowrap"
                      lineHeight="12px"
                      mt={-2}
                      textAlign="end"
                      sx={{
                        fontFamily:
                          theme.direction == "rtl"
                            ? farsiFontFamily
                            : primaryFontFamily,
                      }}
                    >
                      {getReadableDate(lastModificationTime)}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
            <Box gap={1} sx={{ ...styles.centerCV }}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  gap: 2,
                }}
              >
                {permissions?.updateEvidence && editable && (
                  <IconButton
                    aria-label="edit"
                    size="small"
                    sx={{ boxShadow: 2, p: 1 }}
                    onClick={onUpdate}
                  >
                    <EditRoundedIcon
                      fontSize="small"
                      style={{ color: "#004F83" }}
                    />
                  </IconButton>
                )}
                {permissions?.deleteEvidence && deletable && (
                  <IconButton
                    aria-label="delete"
                    size="small"
                    sx={{ boxShadow: 2, p: 1 }}
                    onClick={() => {
                      setExpandedDeleteDialog(true);
                      setEvidenceId(id);
                    }}
                  >
                    <DeleteRoundedIcon
                      fontSize="small"
                      style={{ color: "#D81E5B" }}
                    />
                  </IconButton>
                )}
                {resolvable && !permissions.readonly && (
                  <Tooltip title={<Trans i18nKey="common.resolve" />}>
                    <IconButton
                      aria-label="resolve"
                      size="small"
                      sx={{ boxShadow: 2, p: 1 }}
                      onClick={() => onResolve(id)}
                      color="success"
                    >
                      <CheckOutlined fontSize="small" />
                    </IconButton>
                  </Tooltip>
                )}
              </Box>
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
};

const FileIcon = (props: any): any => {
  const {
    evidenceBG,
    setEvidenceId,
    evidenceId,
    downloadFile,
    item,
    setExpandedDeleteAttachmentDialog,
  } = props;

  const [hover, setHover] = useState(false);

  const { link } = item;
  const reg = /\/([^/?]+)\?/;
  const match = link?.match(reg);
  const name = match ? match[1] : null;
  const exp = name?.substring(name.lastIndexOf("."));
  return (
    <Tooltip
      title={
        <>
          <Typography
            sx={{
              fontSize: "11px",
              lineHeight: "12px",
              letterSpacing: "0.5px",
            }}
          >
            {name}
          </Typography>
          <Typography
            sx={{
              fontSize: "11px",
              lineHeight: "12px",
              letterSpacing: "0.5px",
            }}
          >
            {item?.description}
          </Typography>
        </>
      }
    >
      <Box
        position="relative"
        display="inline-block"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <FileSvg
          evidenceId={evidenceId}
          setEvidenceId={setEvidenceId}
          setExpandedDeleteAttachmentDialog={setExpandedDeleteAttachmentDialog}
          downloadFile={downloadFile}
          item={item}
          name={name}
          mainColor={evidenceBG?.borderColor}
          backgroundColor={evidenceBG?.background}
          hover={hover}
          exp={exp}
        />
        {hover && (
          <Box
            position="absolute"
            top={0}
            left={0}
            width="40px"
            height="40px"
            bgcolor="rgba(0, 0, 0, 0.6)"
            borderRadius="6px"
            sx={{ cursor: "pointer", ...styles.centerVH }}
          ></Box>
        )}
      </Box>
    </Tooltip>
  );
};

export const SubmitOnSelectCheckBox = (props: any) => {
  const { submitOnAnswerSelection } = useQuestionContext();
  const dispatch = useQuestionDispatch();
  const isSmallerScreen = useScreenResize("sm");

  return (
    <FormControlLabel
      sx={{
        mr: 0,
        color: "background.containerLowest",
        display: props?.disabled ? "none" : "block",
      }}
      data-cy="automatic-submit-check"
      control={
        <Checkbox
          checked={submitOnAnswerSelection}
          sx={{
            color: "background.containerLowest",
            "&.Mui-checked": {
              color: "background.containerLowest",
            },
          }}
          onChange={(e) => {
            dispatch(
              questionActions.setSubmitOnAnswerSelection(
                e.target.checked || false,
              ),
            );
          }}
        />
      }
      label={
        <Trans
          i18nKey={
            isSmallerScreen
              ? "questions.submitAnswerAutomatically"
              : "questions.submitAnswerAutomaticallyAndGoToNextQuestion"
          }
        />
      }
    />
  );
};
