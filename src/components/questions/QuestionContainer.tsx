import { useRef } from "react";
import Collapse from "@mui/material/Collapse";
import Box from "@mui/material/Box";
import { useQuestionContext } from "@/providers/question-provider";
import { QuestionCard } from "./QuestionCard";
import { Review } from "./QuestionsReview";
import { TransitionGroup } from "react-transition-group";
import { styles } from "@styles";
import { QuestionsProgress } from "./QuestionsProgress";
import EmptyState from "../kit-designer/common/EmptyState";
import { t } from "i18next";
import { EAssessmentStatus } from "@/types";

export const QuestionContainer = () => {
  const {
    questionInfo,
    container,
    assessmentStatus,
    questionsInfo,
    loaded,
    realIndex,
  } = useQuestion();
  return (
    <>
      {loaded && (
        <Box overflow="hidden" width="100%">
          {questionsInfo.questions?.[realIndex - 1] && <QuestionsProgress />}
          {assessmentStatus === EAssessmentStatus.DONE ? (
            <Review />
          ) : (
            <Box position="relative" sx={{ ...styles.centerVH }} width="100%">
              {questionsInfo.questions?.[realIndex - 1] ? (
                <Box width="100%">
                  <Box
                    display="flex"
                    flexDirection={"column"}
                    flex="1"
                    py={2}
                    sx={{ pt: { xs: 0, sm: 2 } }}
                    ref={container}
                  >
                    <TransitionGroup>
                      <Collapse
                        key={
                          questionsInfo.questions[realIndex - 1].index as any
                        }
                      >
                        <QuestionCard
                          questionsInfo={questionsInfo}
                          questionInfo={questionInfo}
                          key={questionsInfo.questions[realIndex - 1].index}
                        />
                      </Collapse>
                    </TransitionGroup>
                  </Box>
                </Box>
              ) : (
                <Box mt={6}>
                  <EmptyState title={t("questions.noQuestionAtTheMoment")} />
                </Box>
              )}
            </Box>
          )}
        </Box>
      )}
    </>
  );
};

const findQuestion = (
  questions: any[] = [],
  questionIndex?: string | number,
) => {
  return questionIndex
    ? questions.find((question) => question.index == Number(questionIndex))
    : undefined;
};

export const useQuestion = () => {
  const { questionIndex, questionsInfo, assessmentStatus, isSubmitting } =
    useQuestionContext();
  console.log(questionsInfo,"oooo")
  const loaded = !!questionsInfo?.questions;
  const hasAnyQuestion = loaded
    ? (questionsInfo?.questions as any).length > 0
    : false;
  const realIndex =
    questionsInfo.questions.findIndex((item) => item.index === questionIndex) +
    1;

  const questionInfo = findQuestion(questionsInfo.questions, questionIndex);
  const hasNextQuestion =
    hasAnyQuestion && realIndex < questionsInfo.total_number_of_questions;
  const hasPreviousQuestion = hasAnyQuestion && realIndex > 1;
  const container = useRef(null);

  return {
    hasAnyQuestion,
    questionInfo,
    hasNextQuestion,
    hasPreviousQuestion,
    container,
    assessmentStatus,
    questionsInfo,
    questionIndex,
    realIndex,
    isSubmitting,
    loaded,
  };
};
