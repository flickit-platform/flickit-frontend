import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Trans } from "react-i18next";
import { Box, Button, Typography, Paper, Hidden, Rating, useTheme } from "@mui/material";
import {
  RadioButtonCheckedRounded,
  RadioButtonUncheckedRounded,
} from "@mui/icons-material";

import doneSvg from "@assets/svg/Done.svg";
import noQuestionSvg from "@assets/svg/noQuestion.svg";
import someQuestionSvg from "@assets/svg/someQuestion.svg";

import { useServiceContext } from "@/providers/ServiceProvider";
import { useQuery } from "@/utils/useQuery";
import { useQuestionContext } from "@/providers/QuestionProvider";
import { useQuestionnaire } from "../dashboard/dashboard-tab/questionnaires/QuestionnaireContainer";
import { farsiFontFamily, primaryFontFamily } from "@/config/theme";
import { styles } from "@styles";
import languageDetector from "@/utils/languageDetector";
import { toCamelCase } from "@/utils/MakeCamelcaseString";
import { ASSESSMENT_MODE } from "@/utils/enumType";

const getQuestionnaireStatus = (
  answered: number,
  total: number,
): "complete" | "empty" | "incomplete" => {
  if (answered === 0) return "empty";
  if (answered === total) return "complete";
  return "incomplete";
};

const AnswerStatusImage = ({ status }: { status: string }) => {
  const imageSrc =
    status === "complete"
      ? doneSvg
      : status === "empty"
        ? noQuestionSvg
        : someQuestionSvg;

  const altText =
    status === "complete"
      ? "questionnaire done"
      : status === "empty"
        ? "questionnaire empty"
        : "questionnaire some answered";

  return <img style={{ width: "100%" }} src={imageSrc} alt={altText} />;
};

export const Review = () => {
  const theme = useTheme();

  const { service } = useServiceContext();
  const { assessmentId = "", questionnaireId = "" } = useParams();
  const navigate = useNavigate();
  const { questionsInfo } = useQuestionContext();
  const [questionnaireTitle, setQuestionnaireTitle] = useState("");
  const [nextQuestionnaire, setNextQuestionnaire] = useState<number | null>(
    null,
  );

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
    if (questionnaireId) {
      fetchPathInfo.query({ questionnaireId }).then((data) => {
        setQuestionnaireTitle(data?.questionnaire?.title ?? "");
      });
      getNextQuestionnaire.query({ questionnaireId }).then((res) => {
        setNextQuestionnaire(res.data?.id ?? null);
      });
    }
  }, [questionnaireId]);

  const renderStatusText = () => {
    switch (status) {
      case "complete":
        return (
          <>
            <Typography
              component="div"
              variant="headlineMedium"
              mb={1}
              color={theme.palette.primary.main}
            >
              <Trans i18nKey="questions.goodJob" />
            </Typography>
            <Typography
              component="div"
              variant="headlineSmall"
              color={theme.palette.primary.main}
            >
              <Trans
                i18nKey="questions.allQuestionsHaveBeenAnswered"
                values={{ questionnaire: questionnaireTitle }}
                components={{
                  style: (
                    <Box
                      component={Link}
                      to="../questionnaires"
                      style={{
                        display: "inline",
                        color: theme.palette.secondary.main,
                        textDecoration: "none",
                        fontFamily: languageDetector(questionnaireTitle)
                          ? farsiFontFamily
                          : primaryFontFamily,
                      }}
                    />
                  ),
                }}
              />
            </Typography>
            <Typography
              component="div"
              variant="semiBoldLarge"
              sx={{ mt: 2, mb: 4, color: "#0A2342" }}
            >
              <Trans
                i18nKey={
                  progress === 100
                    ? "questions.allQuestionsInAllQuestionnaireHaveBeenAnswered"
                    : "questions.allQuestionsInThisQuestionnaireHaveBeenAnswered"
                }
              />
            </Typography>
          </>
        );
      case "empty":
        return (
          <>
            <Typography
              variant="h4"
              sx={{
                fontSize: "2.2rem",
                mb: 1,
                fontWeight: 600,
                color: "#D81E5B",
              }}
            >
              <Trans i18nKey="questions.hmmm" />
            </Typography>
            <Typography
              variant="h4"
              sx={{
                fontSize: "1.5rem",
                mb: 4,
                fontWeight: 600,
                color: "#D81E5B",
              }}
            >
              <Trans
                i18nKey="questions.noQuestionsHaveBeenAnswered"
                values={{ questionnaire: questionnaireTitle }}
              />
            </Typography>
            <Typography
              variant="h4"
              sx={{ opacity: 0.8, mb: 4, fontWeight: 600, color: "#0A2342" }}
            >
              <Trans i18nKey="questions.weHighlyRecommendAnsweringMoreQuestions" />
            </Typography>
          </>
        );
      default:
        return (
          <>
            <Typography
              variant="h4"
              sx={{
                fontSize: "2.2rem",
                mb: 1,
                fontWeight: 600,
                color: "#F9A03F",
              }}
            >
              <Trans i18nKey="questions.nice" />
            </Typography>
            <Typography
              variant="h4"
              sx={{
                fontSize: "1.25rem",
                mb: 4,
                fontWeight: 600,
                color: "#F9A03F",
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
                      style={{
                        display: "inline",
                        color: theme.palette.secondary.main,
                        textDecoration: "none",
                        fontFamily: languageDetector(questionnaireTitle)
                          ? farsiFontFamily
                          : primaryFontFamily,
                      }}
                    />
                  ),
                }}
              />
            </Typography>
            <Typography
              variant="h4"
              sx={{
                opacity: 0.8,
                fontSize: "16px",
                mb: 4,
                fontWeight: 600,
                color: "#0A2342",
              }}
            >
              <Trans i18nKey="questions.someQuestionsHaveNotBeenAnswered" />
            </Typography>
          </>
        );
    }
  };

  return (
    <Box maxWidth="1440px" mx="auto">
      <Box
        my={4}
        sx={{
          background: "white",
          borderRadius: 2,
          p: { xs: 2, sm: 3, md: 6 },
          display: "flex",
          width: { xs: "100%", md: "900px" },
          ...styles.shadowStyle,
        }}
      >
        <Hidden smDown>
          <Box mt="-28px" display="flex" alignItems="center">
            <AnswerStatusImage status={status} />
          </Box>
        </Hidden>
        <Box sx={{ ml: { xs: 0, sm: 2, md: 6, lg: 8 } }}>
          {renderStatusText()}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: { xs: 1, sm: 2 },
            }}
          >
            {isPermitted && (
              <Button
                variant="outlined"
                component={Link}
                to="../../questionnaires"
              >
                <Trans i18nKey="questions.allQuestionnaires" />
              </Button>
            )}
            {nextQuestionnaire && (
              <Button
                variant="contained"
                component={Link}
                to={`../../questionnaires/${nextQuestionnaire}/1`}
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
          const is_farsi = languageDetector(q.title);
          return (
            <Paper
              key={q.id}
              sx={{
                p: 3,
                backgroundColor: "#273248",
                color: "white",
                mb: 2,
                borderRadius: "8px",
                direction: is_farsi ? "rtl" : "ltr",
              }}
              elevation={3}
            >
              <Typography variant="subMedium" sx={{ color: "#b3b3b3" }}>
                <Trans i18nKey="common.question" />
              </Typography>
              <Typography
                variant="h6"
                fontWeight="bold"
                fontFamily={is_farsi ? farsiFontFamily : primaryFontFamily}
              >
                {q.index}.{q.title}
              </Typography>

              {/* Answer */}
              {q.answer?.selectedOption && (
                <Box mt={3}>
                  <Typography variant="subMedium" sx={{ color: "#b3b3b3" }}>
                    <Trans i18nKey="common.yourAnswer" />
                  </Typography>
                  <Typography variant="h6" fontWeight="bold">
                    {q.answer.selectedOption.index}.
                    {q.answer.selectedOption.title}
                  </Typography>
                </Box>
              )}

              {/* N/A */}
              {q.answer?.isNotApplicable && (
                <Box mt={3}>
                  <Typography variant="subMedium" sx={{ color: "#b3b3b3" }}>
                    <Trans i18nKey="common.yourAnswer" />
                  </Typography>
                  <Typography variant="h6" fontWeight="bold">
                    <Trans i18nKey="questions.markedAsNotApplicable" />
                  </Typography>
                </Box>
              )}

              {/* Confidence */}
              {q.answer?.confidenceLevel && isAdvancedMode && (
                <Box mt={3}>
                  <Typography variant="subMedium" sx={{ color: "#b3b3b3" }}>
                    <Trans i18nKey="common.yourConfidence" />
                  </Typography>
                  <Box display="flex" mt={1} alignItems="center">
                    <Typography variant="h6" fontWeight="bold" mr={1}>
                      <Trans
                        i18nKey={toCamelCase(
                          `common.${q.answer.confidenceLevel.title}`,
                        )}
                      />
                    </Typography>
                    <Rating
                      value={Number(q.answer.confidenceLevel.id)}
                      readOnly
                      icon={
                        <RadioButtonCheckedRounded sx={{ color: "#42a5f5" }} />
                      }
                      emptyIcon={
                        <RadioButtonUncheckedRounded
                          sx={{ color: "#fff", opacity: 0.55 }}
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
