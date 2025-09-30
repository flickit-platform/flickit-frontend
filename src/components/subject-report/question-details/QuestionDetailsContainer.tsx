import { useState } from "react";
import { DialogProps } from "@mui/material/Dialog";
import { Trans } from "react-i18next";
import { CEDialog, CEDialogActions } from "@common/dialogs/CEDialog";
import AlertTitle from "@mui/material/AlertTitle";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import { styles, generateColorFromString } from "@styles";
import QuestionAnswer from "@mui/icons-material/QuestionAnswer";
import languageDetector from "@/utils/language-detector";
import { QuestionTabsTemplate } from "@/components/questions/QuestionCard";
import LoadingButton from "@mui/lab/LoadingButton";
import { Link } from "react-router-dom";
import AlertBox from "@/components/common/AlertBox";
import NavigationButtons from "@/components/common/buttons/NavigationButtons";
import { useTheme } from "@mui/material";
import { CircleRating } from "../CircleRating";
import { Text } from "@/components/common/Text";

interface IQuestionDetailsDialogDialogProps extends DialogProps {
  onClose: () => void;
  onPreviousQuestion?: () => void;
  onNextQuestion?: () => void;
  context?: any;
}

const QuestionDetailsContainer = (props: IQuestionDetailsDialogDialogProps) => {
  const {
    onClose: closeDialog,
    onPreviousQuestion,
    onNextQuestion,
    context = {},
    open,
    ...rest
  } = props;
  const { questionInfo = {}, questionsInfo, index } = context;

  const [value, setValue] = useState("");

  const renderQuestionDetails = () => (
    <Box sx={{ ...styles.centerCV, gap: 2 }}>
      <Chip
        data-testid={"question-detail-questionnaire-title"}
        label={questionInfo?.questionnaire?.title}
        sx={{
          backgroundColor: generateColorFromString(
            questionInfo?.questionnaire?.title,
          ).backgroundColor,
          color: generateColorFromString(questionInfo?.questionnaire?.title)
            .color,
          marginInlineEnd: "auto",
        }}
      />
      <Text
        variant="semiBoldXLarge"
        color="text.primary"
        sx={{
          textAlign: languageDetector(questionInfo?.question?.title ?? "")
            ? "right"
            : "left",
          ...styles.rtlStyle(
            languageDetector(questionInfo?.question?.title ?? ""),
          ),
        }}
        data-testid={"question-detail-title"}
      >
        {questionInfo?.question?.title}
      </Text>
      {questionInfo?.question?.hint && (
        <Box
          sx={{
            ...styles.centerVH,
            marginInlineEnd: "auto",
            color: "background.onVariant",
          }}
        >
          <Text
            variant="bodyMedium"
            sx={{
              textTransform: "capitalize",
            }}
          >
            <Trans i18nKey="common.hint" />:
          </Text>
          <Text variant="bodyMedium">
            {questionInfo?.question?.hint}
          </Text>
        </Box>
      )}
    </Box>
  );

  const renderAnswerDetails = (props: any) => {
    const { position } = props;
    return (
      <Box
        flex={1}
        width="100%"
        sx={{ ...styles.centerCH, alignItems: "flex-start", gap: 2 }}
      >
        <Text variant="semiBoldMedium" color="background.onVariant">
          <Trans i18nKey="questions.selectedOption" />:
        </Text>
        {questionInfo?.answer?.index ? (
          <>
            <Box
              sx={{
                p: 1,
                border: "1px solid #E2E5E9",
                borderRadius: 2,
              }}
            >
              <Text
                variant="bodyMedium"
                sx={{
                  ...styles.rtlStyle(
                    languageDetector(questionInfo?.answer?.title),
                  ),
                }}
              >
                {questionInfo?.answer?.index +
                  ". " +
                  questionInfo?.answer?.title}
              </Text>
            </Box>
            <Box sx={{ ...styles.centerVH, alignSelf: "flex-end", gap: 1 }}>
              <Text>
                <Trans i18nKey="common.yourConfidence" />
              </Text>
              <CircleRating value={questionInfo?.answer?.confidenceLevel} />
            </Box>
          </>
        ) : (
          <AlertBox
            severity="error"
            variant="filled"
            sx={{
              backgroundColor: "rgba(138, 15, 36, 0.04)",
              color: "error.main",
              borderRadius: "8px",
              mb: 2,
              width: "100%",
            }}
            action={
              <Button
                variant="outlined"
                color="error"
                component={Link}
                target="_blank"
                to={`./../questionnaires/${questionInfo?.questionnaire?.id}/${questionInfo?.question?.index}`}
              >
                <Trans i18nKey="subject.answerNow" />
              </Button>
            }
          >
            <AlertTitle>
              <Trans i18nKey="subject.noQuestionHasBeenAnswered" />
            </AlertTitle>
          </AlertBox>
        )}

        {open && (
          <QuestionTabsTemplate
            value={value}
            setValue={setValue}
            questionsInfo={{
              ...questionsInfo,
              permissions: {
                addEvidence: false,
                viewAnswerHistory: true,
                viewEvidenceList: true,
                readonly: true,
              },
            }}
            questionInfo={{
              ...questionInfo?.question,
              questionId: questionInfo?.question?.id,
            }}
            position={position}
          />
        )}
      </Box>
    );
  };
  const theme = useTheme();

  return (
    <CEDialog
      {...rest}
      open={open}
      closeDialog={closeDialog}
      sx={{ width: "100%", paddingInline: 4 }}
      title={<Trans i18nKey="questions.questionDetails" />}
    >
      <Box overflow="auto" px={2}>
        <NavigationButtons
          onPrevious={onPreviousQuestion}
          onNext={onNextQuestion}
          isPreviousDisabled={index - 1 < 0}
          isNextDisabled={index + 2 > questionsInfo?.length}
          direction={theme.direction}
          previousTextKey="questions.previousQuestion"
          nextTextKey="questions.nextQuestion"
        />
        {renderQuestionDetails()}
        <Divider sx={{ width: "100%", my: 2 }} />
        {renderAnswerDetails({ position: "dialog" })}
      </Box>
      <CEDialogActions
        type="close"
        loading={false}
        onClose={closeDialog}
        hideSubmitButton
        hideCancelButton
      >
        <Button
          variant="outlined"
          color="primary"
          component={Link}
          to={`./../questionnaires/${questionInfo?.questionnaire?.id}/${questionInfo?.question?.index}`}
          startIcon={<QuestionAnswer />}
          target="_blank"
        >
          <Trans i18nKey="common.goToQuestion" />
        </Button>
        <LoadingButton variant="contained" onClick={closeDialog} sx={{ mx: 1 }}>
          <Trans i18nKey="common.done" />
        </LoadingButton>
      </CEDialogActions>
    </CEDialog>
  );
};

export default QuestionDetailsContainer;
