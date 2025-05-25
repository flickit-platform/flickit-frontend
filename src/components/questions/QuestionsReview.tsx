import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Trans } from "react-i18next";
import { Link, useParams } from "react-router-dom";
import { useQuestionContext } from "@/providers/QuestionProvider";
import doneSvg from "@assets/svg/Done.svg";
import noQuestionSvg from "@assets/svg/noQuestion.svg";
import someQuestionSvg from "@assets/svg/someQuestion.svg";
import Hidden from "@mui/material/Hidden";
import { useEffect, useMemo, useState } from "react";
import { useServiceContext } from "@/providers/ServiceProvider";
import { useQuery } from "@/utils/useQuery";
import { farsiFontFamily, primaryFontFamily, theme } from "@/config/theme";
import { useQuestionnaire } from "../dashboard/dashboard-tab/questionnaires/QuestionnaireContainer";
import { styles } from "@styles";
import { IQuestionnairesInfo } from "@/types";
import languageDetector from "@/utils/languageDetector";

export const Review = () => {
  const { service } = useServiceContext();
  const { assessmentId = "", questionnaireId = "" } = useParams();

  const AssessmentInfo = useQuery({
    service: (args, config) =>
      service.assessments.info.getById(args ?? { assessmentId }, config),
    toastError: false,
    toastErrorOptions: { filterByStatus: [404] },
  });

  const isPermitted = useMemo(() => {
    return AssessmentInfo?.data?.viewable;
  }, [AssessmentInfo]);

  const { questionsInfo } = useQuestionContext();
  const [answeredQuestions, setAnsweredQuestions] = useState<number>();
  const [questionnaireTitle, setQuestionnaireTitle] = useState<string>("");
  const [nextQuestionnaire, setNextQuestionnaire] =
    useState<IQuestionnairesInfo | null>(null);
  const [isEmpty, setIsEmpty] = useState<boolean>(false);

  useEffect(() => {
    if (questionsInfo.questions) {
      const answeredQuestionsCount = questionsInfo.questions.filter(
        (question) =>
          question.answer &&
          (question.answer.selectedOption !== null ||
            question.answer.isNotApplicable),
      ).length;
      setAnsweredQuestions(answeredQuestionsCount);
      if (answeredQuestionsCount === 0) {
        setIsEmpty(true);
      }
    }
  }, []);
  const { assessmentTotalProgress, fetchPathInfo, questionnaireQueryData } =
    useQuestionnaire();
  useEffect(() => {
    fetchPathInfo.query({ questionnaireId }).then((data) => {
      setQuestionnaireTitle(data?.questionnaire?.title);
    });
    questionnaireQueryData.query().then((data) => {
      const questionnaireIndex = data.items.findIndex(
        (item: any) => item.id == questionnaireId,
      );
      setNextQuestionnaire(data.items[questionnaireIndex + 1]);
    });
  }, [questionnaireId]);

  const progress =
    ((assessmentTotalProgress?.data?.answersCount ?? 0) /
      (assessmentTotalProgress?.data?.questionsCount || 1)) *
    100;
  return (
    <Box
      maxWidth={"1440px"}
      sx={{
        mx: "auto",
      }}
    >
      <Box
        my={5}
        sx={{
          background: "white",
          borderRadius: 2,
          p: { xs: 2, sm: 3, md: 6 },
          display: "flex",
          width: "100%",
          ...styles.shadowStyle,
        }}
      >
        <Hidden smDown>
          <Box display="flex">
            <Box mt="-28px" alignItems="center" display="flex">
              {answeredQuestions ===
                questionsInfo?.total_number_of_questions && (
                <img
                  style={{ width: "100%" }}
                  src={doneSvg}
                  alt="questionnaire done"
                />
              )}
              {isEmpty && (
                <img
                  style={{ width: "100%" }}
                  src={noQuestionSvg}
                  alt="questionnaire empty"
                />
              )}
              {answeredQuestions !== questionsInfo?.total_number_of_questions &&
                !isEmpty && (
                  <img
                    style={{ width: "100%" }}
                    src={someQuestionSvg}
                    alt="questionnaire some answered"
                  />
                )}
            </Box>
          </Box>
        </Hidden>
        <Box sx={{ ml: { xs: 0, sm: 2, md: 6, lg: 8 } }}>
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            {answeredQuestions === questionsInfo?.total_number_of_questions && (
              <>
                <Typography
                  variant="h4"
                  sx={{
                    fontSize: "2.2rem",
                    mb: 1,
                    fontWeight: 600,
                    color: "#004F83",
                  }}
                >
                  <Trans i18nKey="goodJob" />
                </Typography>
                <Typography
                  variant="h4"
                  sx={{
                    fontSize: "1.5rem",
                    mb: 4,
                    fontWeight: 600,
                    color: "#004F83",
                  }}
                >
                  <Trans
                    i18nKey="allQuestionsHaveBeenAnswered"
                    values={{
                      questionnaire: questionnaireTitle,
                    }}
                    components={{
                      style: (
                        <Box
                          component={Link}
                          to={"../questionnaires"}
                          style={{
                            display: "inline",
                            color: theme.palette.secondary.main,
                            cursor: "pointer",
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
                {progress === 100 ? (
                  <Typography
                    variant="h4"
                    sx={{
                      opacity: 0.8,
                      fontSize: "1rem",
                      mb: 4,
                      fontWeight: 600,
                      color: "#0A2342",
                    }}
                  >
                    <Trans i18nKey="allQuestionsInAllQuestionnaireHaveBeenAnswered" />
                  </Typography>
                ) : (
                  <Typography
                    variant="h4"
                    sx={{
                      opacity: 0.8,
                      fontSize: "1rem",
                      mb: 4,
                      fontWeight: 600,
                      color: "#0A2342",
                    }}
                  >
                    <Trans i18nKey="allQuestionsInThisQuestionnaireHaveBeenAnswered" />
                  </Typography>
                )}
              </>
            )}
            {isEmpty && (
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
                  <Trans i18nKey="hmmm" />
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
                    i18nKey="noQuestionsHaveBeenAnswered"
                    values={{ questionnaire: questionnaireTitle }}
                  />
                </Typography>
                <Typography
                  variant="h4"
                  sx={{
                    opacity: 0.8,
                    mb: 4,
                    fontWeight: 600,
                    color: "#0A2342",
                  }}
                >
                  <Trans i18nKey="weHighlyRecommendAnsweringMoreQuestions" />
                </Typography>
              </>
            )}
            {answeredQuestions !== questionsInfo?.total_number_of_questions &&
              !isEmpty && (
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
                    <Trans i18nKey="nice" />
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
                      i18nKey="youAnsweredQuestionOf"
                      values={{
                        answeredQuestions: answeredQuestions,
                        totalQuestions:
                          questionsInfo?.total_number_of_questions,
                        questionnaire: questionnaireTitle,
                      }}
                      components={{
                        style: (
                          <Box
                            component={Link}
                            to={"../questionnaires"}
                            style={{
                              display: "inline",
                              color: theme.palette.secondary.main,
                              cursor: "pointer",
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
                    <Trans i18nKey="someQuestionsHaveNotBeenAnswered" />
                  </Typography>
                </>
              )}
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: { xs: 1, sm: 2 },
            }}
          >
            <Button
              variant="outlined"
              size="large"
              component={Link}
              to={"./../../../questionnaires"}
              sx={{ display: isPermitted ? "" : "none" }}
            >
              <Trans i18nKey="allQuestionnaires" />
            </Button>
            {nextQuestionnaire && (
              <Button
                variant="contained"
                size="large"
                component={Link}
                to={
                  "./../../../questionnaires" +
                  "/" +
                  (nextQuestionnaire?.id ?? "") +
                  "/" +
                  (nextQuestionnaire?.nextQuestion ?? 1)
                }
              >
                <Trans i18nKey="nextQuestionnaire" />
              </Button>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
