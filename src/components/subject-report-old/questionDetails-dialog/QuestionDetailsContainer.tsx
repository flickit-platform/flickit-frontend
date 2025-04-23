import { useEffect, useState } from "react";
import { DialogProps } from "@mui/material/Dialog";
import { Trans } from "react-i18next";
import { CEDialog, CEDialogActions } from "@common/dialogs/CEDialog";
import AlertTitle from "@mui/material/AlertTitle";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import { CircleRating } from "../MaturityLevelTable";
import { styles, generateColorFromString } from "@styles";
import ArrowBackIos from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIos from "@mui/icons-material/ArrowForwardIos";
import QuestionAnswer from "@mui/icons-material/QuestionAnswer";
import { farsiFontFamily, primaryFontFamily, theme } from "@/config/theme";
import languageDetector from "@/utils/languageDetector";
import { QuestionTabsTemplate } from "@/components/questions/QuestionCard";
import LoadingButton from "@mui/lab/LoadingButton";
import { Link } from "react-router-dom";
import AlertBox from "@/components/common/AlertBox";
import NavigationButtons from "@/components/common/buttons/NavigationButtons";

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
    ...rest
  } = props;
  const { questionInfo = {}, questionsInfo, index } = context;

  const [value, setValue] = useState(null);

  const handleChange = (event: React.SyntheticEvent, newValue: any) => {
    setValue(newValue);
  };

  const close = () => {
    closeDialog();
  };

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
      <Typography
        sx={{
          ...theme.typography.semiBoldXLarge,
          textAlign: languageDetector(questionInfo?.question?.title ?? "")
            ? "right"
            : "left",
          ...styles.rtlStyle(
            languageDetector(questionInfo?.question?.title ?? ""),
          ),

          color: "#2B333B",
        }}
        data-testid={"question-detail-title"}
      >
        {questionInfo?.question?.title}
      </Typography>
      {questionInfo?.question?.hint && (
        <Box
          sx={{
            ...styles.centerVH,
            marginInlineEnd: "auto",
            color: "#6C8093",
          }}
        >
          <Typography
            sx={{
              ...theme.typography.bodyMedium,
              textTransform: "capitalize",
            }}
          >
            <Trans i18nKey={"hint"} />:
          </Typography>
          <Typography
            sx={{
              ...theme.typography.bodyMedium,
              fontFamily: languageDetector(questionInfo?.question?.hint)
                ? farsiFontFamily
                : primaryFontFamily,
            }}
          >
            {questionInfo?.question?.hint}
          </Typography>
        </Box>
      )}
    </Box>
  );

  const renderAnswerDetails = () => (
    <Box
      flex={1}
      width="100%"
      sx={{ ...styles.centerCH, alignItems: "flex-start", gap: 2 }}
    >
      <Typography color="#6C8093" sx={{ ...theme.typography.semiBoldMedium }}>
        <Trans i18nKey={"selectedOption"} />:
      </Typography>
      {questionInfo?.answer?.index ? (
        <>
          <Box sx={{ p: 1, border: "1px solid #C7CCD1", borderRadius: 2 }}>
            <Typography
              sx={{
                ...theme.typography.bodyMedium,
                ...styles.rtlStyle(
                  languageDetector(questionInfo?.answer?.title),
                ),
              }}
            >
              {questionInfo?.answer?.index + ". " + questionInfo?.answer?.title}
            </Typography>
          </Box>
          <Box sx={{ ...styles.centerVH, alignSelf: "flex-end", gap: 1 }}>
            <Typography>
              <Trans i18nKey={"yourConfidence"} />
            </Typography>
            <CircleRating value={questionInfo?.answer?.confidenceLevel} />
          </Box>
        </>
      ) : (
        <AlertBox
          severity="error"
          variant="filled"
          sx={{
            backgroundColor: "rgba(138, 15, 36, 0.04)",
            color: "#8A0F24",
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
              <Trans i18nKey="answerNow" />
            </Button>
          }
        >
          <AlertTitle>
            <Trans i18nKey={"noQuestionHasBeenAnswered"} />
          </AlertTitle>
        </AlertBox>
      )}

      <QuestionTabsTemplate
        key={questionInfo?.question?.id}
        value={value}
        setValue={setValue}
        handleChange={handleChange}
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
      />
    </Box>
  );

  return (
    <CEDialog
      {...rest}
      closeDialog={close}
      sx={{ width: "100%", paddingInline: 4 }}
      title={<Trans i18nKey="questionDetails" />}
    >
      <Box overflow="auto" px={2}>
        <NavigationButtons
          onPrevious={onPreviousQuestion}
          onNext={onNextQuestion}
          isPreviousDisabled={index - 1 < 0}
          isNextDisabled={index + 2 > questionsInfo?.length}
          direction={theme.direction}
          previousTextKey="previousQuestion"
          nextTextKey="nextQuestion"
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
          to={`./../../questionnaires/${questionInfo?.questionnaire?.id}/${questionInfo?.question?.index}`}
          startIcon={<QuestionAnswer />}
          target="_blank"
        >
          <Trans i18nKey="goToQuestion" />
        </Button>
        <LoadingButton variant="contained" onClick={closeDialog} sx={{ mx: 1 }}>
          <Trans i18nKey="done" />
        </LoadingButton>
      </CEDialogActions>
    </CEDialog>
  );
};

export default QuestionDetailsContainer;
