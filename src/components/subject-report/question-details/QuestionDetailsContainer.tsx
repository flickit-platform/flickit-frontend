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
import LoadingButton from "@mui/lab/LoadingButton";
import { Link } from "react-router-dom";
import AlertBox from "@/components/common/AlertBox";
import NavigationButtons from "@/components/common/buttons/NavigationButtons";
import { useTheme } from "@mui/material";
import { CircleRating } from "../CircleRating";
import { Text } from "@/components/common/Text";
import Tabs from "@/features/questions/ui/footer/Tabs";
import { useQuestionContext } from "@/features/questions/context";

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
  const { selectedQuestion, questions } = useQuestionContext();

  const renderQuestionDetails = () => (
    <Box sx={{ ...styles.centerCV, gap: 2 }}>
      <Chip
        data-testid={"question-detail-questionnaire-title"}
        label={selectedQuestion?.questionnaire?.title}
        sx={{
          backgroundColor: generateColorFromString(
            selectedQuestion?.questionnaire?.title,
          ).backgroundColor,
          color: generateColorFromString(selectedQuestion?.questionnaire?.title)
            .color,
          marginInlineEnd: "auto",
        }}
      />
      <Text
        variant="semiBoldXLarge"
        color="text.primary"
        sx={{
          textAlign: languageDetector(selectedQuestion?.question?.title ?? "")
            ? "right"
            : "left",
          ...styles.rtlStyle(
            languageDetector(selectedQuestion?.question?.title ?? ""),
          ),
        }}
        data-testid={"question-detail-title"}
      >
        {selectedQuestion?.question?.title}
      </Text>
      {selectedQuestion?.question?.hint && (
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
          <Text variant="bodyMedium">{selectedQuestion?.question?.hint}</Text>
        </Box>
      )}
    </Box>
  );

  const renderAnswerDetails = () => {
    return (
      <Box
        flex={1}
        width="100%"
        sx={{ ...styles.centerCH, alignItems: "flex-start", gap: 2 }}
      >
        <Text variant="semiBoldMedium" color="background.onVariant">
          <Trans i18nKey="questions.selectedOption" />:
        </Text>
        {selectedQuestion?.answer?.index ? (
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
                    languageDetector(selectedQuestion?.answer?.title),
                  ),
                }}
              >
                {selectedQuestion?.answer?.index +
                  ". " +
                  selectedQuestion?.answer?.title}
              </Text>
            </Box>
            <Box sx={{ ...styles.centerVH, alignSelf: "flex-end", gap: 1 }}>
              <Text>
                <Trans i18nKey="common.yourConfidence" />
              </Text>
              <CircleRating value={selectedQuestion?.answer?.confidenceLevel} />
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
                to={`./../questionnaires/${selectedQuestion?.questionnaire?.id}/${selectedQuestion?.question?.index}`}
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
        <Box width="100%">{open && <Tabs readonly />}</Box>
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
          isPreviousDisabled={
            questions?.findIndex(
              (x: any) => x.question.id === selectedQuestion?.question?.id,
            ) -
              1 <
            0
          }
          isNextDisabled={
            questions?.findIndex(
              (x: any) => x.question.id === selectedQuestion?.question?.id,
            ) +
              2 >
            questions?.length
          }
          direction={theme.direction}
          previousTextKey="questions.previousQuestion"
          nextTextKey="questions.nextQuestion"
        />
        {renderQuestionDetails()}
        <Divider sx={{ width: "100%", my: 2 }} />
        {renderAnswerDetails()}
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
          to={`./../questionnaires/${selectedQuestion?.questionnaire?.id}/${selectedQuestion?.question?.index}`}
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
