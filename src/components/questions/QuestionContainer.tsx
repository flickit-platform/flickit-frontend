import { useEffect, useRef } from "react";
import Checkbox from "@mui/material/Checkbox";
import Collapse from "@mui/material/Collapse";
import FormControlLabel from "@mui/material/FormControlLabel";
import Box from "@mui/material/Box";
import {
  EAssessmentStatus,
  questionActions,
  useQuestionContext,
  useQuestionDispatch,
} from "@providers/QuestionProvider";
import { QuestionCard } from "./QuestionCard";
import { Trans } from "react-i18next";
import { Review } from "./QuestionsReview";
import { TransitionGroup } from "react-transition-group";
import useScreenResize from "@utils/useScreenResize";
import { styles } from "@styles";
import { QuestionsProgress } from "./QuestionsProgress";
import EmptyState from "../kit-designer/common/EmptyState";
import { t } from "i18next";

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
        <Box overflow="hidden">
          {questionsInfo.questions?.[realIndex - 1] && <QuestionsProgress />}
          {assessmentStatus === EAssessmentStatus.DONE ? (
            <Review />
          ) : (
            <Box position="relative" sx={{ ...styles.centerVH }}>
              {questionsInfo.questions?.[realIndex - 1] ? (
                <Box>
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
                  <EmptyState title={t("noQuestionAtTheMoment")} />
                </Box>
              )}
            </Box>
          )}
        </Box>
      )}
    </>
  );
};

export const SubmitOnSelectCheckBox = (props: any) => {
  const { submitOnAnswerSelection } = useQuestionContext();
  const dispatch = useQuestionDispatch();
  const isSmallerScreen = useScreenResize("sm");

  return (
    <FormControlLabel
      sx={{ mr: 0, color: "#fff", display: props?.disabled ? "none" : "block" }}
      data-cy="automatic-submit-check"
      control={
        <Checkbox
          checked={submitOnAnswerSelection}
          sx={{
            color: "#fff",
            "&.Mui-checked": {
              color: "#fff",
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
              ? "submitAnswerAutomatically"
              : "submitAnswerAutomaticallyAndGoToNextQuestion"
          }
        />
      }
    />
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
  useEffect(() => {
    console.log(questionsInfo);
  }, [questionsInfo]);
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
