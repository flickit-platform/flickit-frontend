import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import { Trans } from "react-i18next";
import { useParams } from "react-router-dom";
import { styles } from "@styles";
import { useQuestionContext } from "@/providers/question-provider";
import Typography from "@mui/material/Typography";
import { QuestionThumb } from "./QuestionThumb";
import { QuestionPopover } from "./QuestionPopover";
import Tooltip from "@mui/material/Tooltip";
import uniqueId from "@/utils/unique-id";
import usePopover from "@/hooks/usePopover";
import { ASSESSMENT_MODE } from "@/utils/enum-type";
import { useAssessmentContext } from "@/providers/assessment-provider";
import { EAssessmentStatus } from "@/types";

const QuestionsProgress = () => {
  const { assessmentStatus, questionIndex, questionsInfo, isSubmitting } =
    useQuestionContext();
  const { questions = [] } = questionsInfo;

  return (
    <Box position="relative" sx={{ my: { xs: 1, sm: 3 } }}>
      <Box
        sx={{
          display: {
            xs: "none",
            sm: "none",
            md: questions.length > 20 ? "none" : "inherit",
            lg: questions.length > 23 ? "none" : "inherit",
            xl: questions.length > 32 ? "none" : "inherit",
            xxl: questions.length > 40 ? "none" : "inherit",
          },
        }}
      >
        <Box
          position={"absolute"}
          sx={{
            ...styles.centerV,
            width: "calc(100% - 70px)",
            marginInlineStart: "30px",
          }}
          height="100%"
          justifyContent="space-evenly"
        >
          {questions.map((question) => {
            return (
              <QuestionProgressItem
                isSubmitting={isSubmitting}
                key={question.id}
                question={question}
                questionsInfo={questionsInfo}
                to={`./../${question.index}`}
              />
            );
          })}
        </Box>
      </Box>
      <LinearProgress
        sx={{ flex: 1, borderRadius: 4 }}
        variant="determinate"
        value={
          assessmentStatus === EAssessmentStatus.DONE
            ? 100
            : (99 / (questions.length + 1)) *
            (questions.findIndex((item) => item.index === questionIndex) + 1)
        }
      />
    </Box>
  );
};

export const QuestionProgressItem = (props: any) => {
  const { question, to, questionsInfo } = props;
  const { assessmentInfo } = useAssessmentContext();

  const { questionIndex } = useParams();
  const { handlePopoverOpen, ...popoverProps } = usePopover();

  const hasIssue =
    ASSESSMENT_MODE.ADVANCED === assessmentInfo?.mode?.code
      ? question?.issues?.isUnanswered ||
      question?.issues?.hasUnapprovedAnswer ||
      question?.issues?.isAnsweredWithLowConfidence ||
      question?.issues?.isAnsweredWithoutEvidences ||
      question?.issues?.unresolvedCommentsCount
      : question?.issues?.isUnanswered;

  return (
    <Box
      sx={{
        width: "20px",
        zIndex: 1,
        height: "20px",
        cursor: questionIndex != question.index ? "pointer" : "auto",
        backgroundColor: (t: any) =>
          hasIssue && questionsInfo.permissions.viewDashboard
            ? `${t.palette.secondary.main}`
            : question?.answer?.selectedOption ||
              question?.answer?.isNotApplicable
              ? `${t.palette.primary.main}`
              : "white",
        border: (t: any) => `3px solid white`,
        outline: (t: any) =>
          `${hasIssue && questionsInfo.permissions.viewDashboard
            ? `${t.palette.secondary.main}`
            : question?.answer?.selectedOption ||
              question?.answer?.isNotApplicable
              ? t.palette.primary.main
              : "#a7caed"
          } solid 5px`,
        transition: "background-color .3s ease, transform .2s ease",
        borderRadius: "8px",
        transform: question.index == questionIndex ? "scale(1.3)" : "scale(.9)",
        "&:hover p.i-p-i-n": {
          opacity: 1,
        },
      }}
    >
      <Tooltip
        title={
          hasIssue && questionsInfo.permissions.viewDashboard ? (
            <Box>
              {[
                question?.issues.isUnanswered && (
                  <Trans i18nKey="dashboard.unansweredQuestions" />
                ),
                question?.issues.hasUnapprovedAnswer && (
                  <Trans i18nKey="dashboard.unapprovedAnswer" />
                ),
                question?.issues.isAnsweredWithLowConfidence && (
                  <Trans i18nKey="dashboard.lowConfidenceAnswers" />
                ),
                question?.issues.isAnsweredWithoutEvidences && (
                  <Trans i18nKey="dashboard.answersWithNoEvidence" />
                ),
                question?.issues.unresolvedCommentsCount > 0 && (
                  <>
                    {question?.issues.unresolvedCommentsCount}{" "}
                    <Trans
                      i18nKey={
                        question?.issues.unresolvedCommentsCount !== 1
                          ? "dashboard.unresolvedComments"
                          : "dashboard.unresolvedComment"
                      }
                    />
                  </>
                ),
              ]
                .filter(Boolean)
                .map((item) => (
                  <div key={uniqueId()}>{item}</div>
                ))}
            </Box>
          ) : (
            ""
          )
        }
      >
        <Box
          sx={{ zIndex: 1, width: "100%", height: "100%" }}
          onClick={(e: any) => {
            questionIndex != question.index && handlePopoverOpen(e);
          }}
        >
          <Typography
            color={question?.answer?.selectedOption ||
              question?.answer?.isNotApplicable ||
              (hasIssue && questionsInfo.permissions.viewDashboard)
              ? `white`
              : "disabled.main"}
            sx={{
              fontSize: question.index == questionIndex ? ".75rem" : ".7rem",
              textAlign: "center",
              lineHeight: "13px",
              opacity: question.index == questionIndex ? 1 : 0.6,
              transition: "opacity .1s ease",
            }}
            className="i-p-i-n"
          >
            {question.index}
          </Typography>
        </Box>
      </Tooltip>
      <QuestionPopover
        open={popoverProps.open}
        anchorEl={popoverProps.anchorEl}
        onClose={popoverProps.handlePopoverClose}
      >
        <QuestionThumb
          {...props}
          onClose={popoverProps.handlePopoverClose}
          questionIndex={question.index}
          link={to || `${question.index}`}
        />
      </QuestionPopover>
    </Box>
  );
};

export { QuestionsProgress };
