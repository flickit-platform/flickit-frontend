import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Trans } from "react-i18next";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Hidden from "@mui/material/Hidden";
import Rating from "@mui/material/Rating";
import RadioButtonCheckedRounded from "@mui/icons-material/RadioButtonCheckedRounded";
import RadioButtonUncheckedRounded from "@mui/icons-material/RadioButtonUncheckedRounded";
import SuccessCheck from "@/assets/svg/success-check.svg";
import FailureEmoji from "@/assets/svg/failure-emoji.svg";
import WarningEmptyState from "@/assets/svg/warning-empty-state.svg";
import { useServiceContext } from "@/providers/service-provider";
import { useQuery } from "@/hooks/useQuery";
import { useQuestionContext } from "@/providers/question-provider";
import { useQuestionnaire } from "../dashboard/dashboard-tab/questionnaires/QuestionnaireContainer";
import { farsiFontFamily, primaryFontFamily } from "@/config/theme";
import { styles } from "@styles";
import languageDetector from "@/utils/language-detector";
import { IQuestionnaire } from "@/types";
import { toCamelCase } from "@/utils/make-camel-case-string";
import { ASSESSMENT_MODE } from "@/utils/enum-type";
import { Text } from "../common/Text";

const getQuestionnaireStatus = (
  answered: number,
  total: number,
): "complete" | "empty" | "incomplete" => {
  if (answered === 0) return "empty";
  if (answered === total) return "complete";
  return "incomplete";
};

const AnswerStatusImage = ({ status }: { status: string }) => {
  let imageSrc: string;
  let altText: string;

  if (status === "complete") {
    imageSrc = SuccessCheck;
    altText = "questionnaire done";
  } else if (status === "empty") {
    imageSrc = FailureEmoji;
    altText = "questionnaire empty";
  } else {
    imageSrc = WarningEmptyState;
    altText = "questionnaire some answered";
  }

  return <img style={{ width: "100%" }} src={imageSrc} alt={altText} />;
};

export const Review = () => {
  const { service } = useServiceContext();
  const { assessmentId = "", questionnaireId = "" } = useParams();
  const navigate = useNavigate();
  const { questionsInfo } = useQuestionContext();
  const [questionnaireTitle, setQuestionnaireTitle] = useState("");
  const [nextQuestionnaire, setNextQuestionnaire] =
    useState<IQuestionnaire | null>(null);

  const AssessmentInfo = useQuery({
    service: (args, config) =>
      service.assessments.info.getById(args ?? { assessmentId }, config),
    toastError: false,
    toastErrorOptions: { filterByStatus: [404] },
  });

  const isPermitted = useMemo(
    () => AssessmentInfo?.data?.viewable,
    [AssessmentInfo],
  );

  const isAdvancedMode = useMemo(
    () => AssessmentInfo?.data?.mode?.code === ASSESSMENT_MODE.ADVANCED,
    [AssessmentInfo],
  );

  const answered = useMemo(() => {
    return (
      questionsInfo.questions?.filter(
        (q) =>
          q.answer &&
          (q.answer.selectedOption !== null || q.answer.isNotApplicable),
      )?.length ?? 0
    );
  }, [questionsInfo.questions]);

  const totalQuestions = questionsInfo?.total_number_of_questions ?? 0;
  const status = useMemo(
    () => getQuestionnaireStatus(answered, totalQuestions),
    [answered, totalQuestions],
  );

  const { assessmentTotalProgress, fetchPathInfo, getNextQuestionnaire } =
    useQuestionnaire();

  const progress = useMemo(() => {
    const total = assessmentTotalProgress?.data?.questionsCount || 1;
    const answered = assessmentTotalProgress?.data?.answersCount || 0;
    return (answered / total) * 100;
  }, [assessmentTotalProgress]);

  useEffect(() => {
    if (!questionnaireId || !window.location.pathname.includes("/completed"))
      return;

    const controller = new AbortController();

    fetchPathInfo
      .query({ questionnaireId }, { signal: controller.signal })
      .then((data) => {
        setQuestionnaireTitle(data?.questionnaire?.title ?? "");
      })
      .catch((error) => {
        if (error.name === "CanceledError") {
          return;
        }
      });

    getNextQuestionnaire
      .query({ questionnaireId })
      .then((res) => {
        const nextQuestionnaire = res.data;
        setNextQuestionnaire(nextQuestionnaire);
      })
      .catch((error) => {
        if (error.name === "CanceledError") return;
      });

    return () => {
      controller.abort();
    };
  }, [questionnaireId]);

  const renderStatusText = () => {
    switch (status) {
      case "complete":
        return (
          <>
            <Text
              component="div"
              variant="headlineMedium"
              mb={1}
              color="primary.main"
            >
              <Trans i18nKey="questions.goodJob" />
            </Text>
            <Text component="div" variant="headlineSmall" color="primary.main">
              <Trans
                i18nKey="questions.allQuestionsHaveBeenAnswered"
                values={{ questionnaire: questionnaireTitle }}
                components={{
                  style: (
                    <Box
                      component={Link}
                      to="../questionnaires"
                      display="inline"
                      color="secondary.main"
                      sx={{
                        textDecoration: "none",
                        fontFamily: languageDetector(questionnaireTitle)
                          ? farsiFontFamily
                          : primaryFontFamily,
                      }}
                    />
                  ),
                }}
              />
            </Text>
            <Text
              component="div"
              variant="semiBoldLarge"
              color="#0A2342"
              sx={{ mt: 2, mb: 4 }}
            >
              <Trans
                i18nKey={
                  progress === 100
                    ? "questions.allQuestionsInAllQuestionnaireHaveBeenAnswered"
                    : "questions.allQuestionsInThisQuestionnaireHaveBeenAnswered"
                }
              />
            </Text>
          </>
        );
      case "empty":
        return (
          <>
            <Text
              variant="h4"
              color="#D81E5B"
              sx={{
                fontSize: "2.2rem",
                mb: 1,
                fontWeight: 600,
              }}
            >
              <Trans i18nKey="questions.hmmm" />
            </Text>
            <Text
              variant="h4"
              color="#D81E5B"
              sx={{
                fontSize: "1.5rem",
                mb: 4,
                fontWeight: 600,
              }}
            >
              <Trans
                i18nKey="questions.noQuestionsHaveBeenAnswered"
                values={{ questionnaire: questionnaireTitle }}
              />
            </Text>
            <Text
              variant="h4"
              color="#0A2342"
              sx={{ opacity: 0.8, mb: 4, fontWeight: 600 }}
            >
              <Trans i18nKey="questions.weHighlyRecommendAnsweringMoreQuestions" />
            </Text>
          </>
        );
      default:
        return (
          <>
            <Text
              variant="h4"
              color="#F9A03F"
              sx={{
                fontSize: "2.2rem",
                mb: 1,
                fontWeight: 600,
              }}
            >
              <Trans i18nKey="questions.nice" />
            </Text>
            <Text
              variant="h4"
              color="#F9A03F"
              sx={{
                fontSize: "1.25rem",
                mb: 4,
                fontWeight: 600,
              }}
            >
              <Trans
                i18nKey="questions.youAnsweredQuestionOf"
                values={{
                  answeredQuestions: answered,
                  totalQuestions,
                  questionnaire: questionnaireTitle,
                }}
                components={{
                  style: (
                    <Box
                      component={Link}
                      to="../questionnaires"
                      color="secondary.main"
                      display="inline"
                      style={{
                        textDecoration: "none",
                        fontFamily: languageDetector(questionnaireTitle)
                          ? farsiFontFamily
                          : primaryFontFamily,
                      }}
                    />
                  ),
                }}
              />
            </Text>
            <Text
              variant="h4"
              color="#0A2342"
              sx={{
                opacity: 0.8,
                fontSize: "16px",
                mb: 4,
                fontWeight: 600,
              }}
            >
              <Trans i18nKey="questions.someQuestionsHaveNotBeenAnswered" />
            </Text>
          </>
        );
    }
  };

  return (
    <Box maxWidth="1440px" mx="auto">
      <Box
        my={4}
        sx={{
          bgcolor: "background.containerLowest",
          borderRadius: 2,
          p: { xs: 2, sm: 3, md: 6 },
          display: "flex",
          width: { xs: "100%", md: "900px" },
          ...styles.shadowStyle,
        }}
      >
        <Hidden smDown>
          <Box mt="-28px" sx={{ ...styles.centerV }}>
            <AnswerStatusImage status={status} />
          </Box>
        </Hidden>
        <Box sx={{ ml: { xs: 0, sm: 2, md: 6, lg: 8 } }}>
          {renderStatusText()}
          <Box gap={{ xs: 1, sm: 2 }} sx={{ ...styles.centerV }}>
            {isPermitted && (
              <Button
                variant="outlined"
                component={Link}
                to="../../questionnaires"
              >
                <Trans i18nKey="questions.allQuestionnaires" />
              </Button>
            )}
            {nextQuestionnaire?.id && (
              <Button
                variant="contained"
                component={Link}
                to={`../../questionnaires/${nextQuestionnaire.id}/${nextQuestionnaire.questionIndex ?? 1}`}
              >
                <Trans i18nKey="questions.nextQuestionnaire" />
              </Button>
            )}
          </Box>
        </Box>
      </Box>

      {/* Answer Review List */}
      <Box mt={2}>
        {questionsInfo.questions.map((q) => {
          const is_farsi_title = languageDetector(q.title);

          return (
            <Paper
              key={q.id}
              sx={{
                p: 3,
                backgroundColor: "#273248",
                color: "white",
                mb: 2,
                borderRadius: "8px",
                direction: is_farsi_title ? "rtl" : "ltr",
              }}
              elevation={3}
            >
              <Text variant="subMedium" color="#b3b3b3">
                <Trans i18nKey="common.question" />
              </Text>
              <Text variant="h6" fontWeight="bold">
                {q.index}.{q.title}
              </Text>

              {/* Answer */}
              {q.answer?.selectedOption && (
                <Box mt={3}>
                  <Text variant="subMedium" color="#b3b3b3">
                    <Trans i18nKey="common.yourAnswer" />
                  </Text>
                  <Text variant="h6" fontWeight="bold">
                    {q.answer.selectedOption.index}.
                    {q.answer.selectedOption.title}
                  </Text>
                </Box>
              )}

              {/* N/A */}
              {q.answer?.isNotApplicable && (
                <Box mt={3}>
                  <Text variant="subMedium" color="#b3b3b3">
                    <Trans i18nKey="common.yourAnswer" />
                  </Text>
                  <Text variant="h6" fontWeight="bold">
                    <Trans i18nKey="questions.markedAsNotApplicable" />
                  </Text>
                </Box>
              )}

              {/* Confidence */}
              {q.answer?.confidenceLevel && isAdvancedMode && (
                <Box mt={3}>
                  <Text variant="subMedium" color="#b3b3b3">
                    <Trans i18nKey="common.yourConfidence" />
                  </Text>
                  <Box mt={1} sx={{ ...styles.centerV }}>
                    <Text variant="h6" fontWeight="bold" mr={1}>
                      <Trans
                        i18nKey={toCamelCase(
                          `common.${q.answer.confidenceLevel.title}`,
                        )}
                      />
                    </Text>
                    <Rating
                      value={Number(q.answer.confidenceLevel.id)}
                      readOnly
                      icon={
                        <RadioButtonCheckedRounded sx={{ color: "#42a5f5" }} />
                      }
                      emptyIcon={
                        <RadioButtonUncheckedRounded
                          sx={{
                            color: "background.containerLowest",
                            opacity: 0.55,
                          }}
                        />
                      }
                    />
                  </Box>
                </Box>
              )}

              <Box display="flex" mt={2}>
                <Button
                  variant="contained"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`../${q.index}`);
                  }}
                >
                  {q.answer ||
                  !questionsInfo?.permissions?.answerQuestion ||
                  q.is_not_applicable ? (
                    <Trans i18nKey="common.edit" />
                  ) : (
                    <Trans i18nKey="common.submit" />
                  )}
                </Button>
              </Box>
            </Paper>
          );
        })}
      </Box>
    </Box>
  );
};
