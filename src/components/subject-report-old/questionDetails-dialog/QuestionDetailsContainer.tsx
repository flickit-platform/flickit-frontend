import { useEffect, useState } from "react";
import { DialogProps } from "@mui/material/Dialog";
import { Trans } from "react-i18next";
import { CEDialog, CEDialogActions } from "@common/dialogs/CEDialog";
import {
  AlertTitle,
  Box,
  Button,
  Chip,
  Divider,
  Typography,
} from "@mui/material";
import { generateColorFromString } from "@styles";
import { CircleRating } from "../MaturityLevelTable";
import { styles } from "@styles";
import {
  ArrowBackIos,
  ArrowForwardIos,
  QuestionAnswer,
} from "@mui/icons-material";
import { theme } from "@/config/theme";
import languageDetector from "@/utils/languageDetector";
import { QuestionTabsTemplate } from "@/components/questions/QuestionCard";
import EmptyState from "@/components/kit-designer/common/EmptyState";
import { t } from "i18next";
import { LoadingButton } from "@mui/lab";
import { Link, useNavigate } from "react-router-dom";
import AlertBox from "@/components/common/AlertBox";

interface IQuestionDetailsDialogDialogProps extends DialogProps {
  onClose: () => void;
  onPreviousQuestion?: () => void;
  onNextQuestion?: () => void;
  context?: any;
}

const QuestionDetailsContainer = (props: IQuestionDetailsDialogDialogProps) => {
  const navigate = useNavigate();

  const {
    onClose: closeDialog,
    onPreviousQuestion,
    onNextQuestion,
    context = {},
    ...rest
  } = props;
  const { questionInfo = {}, questionsInfo, index } = context;

  const [value, setValue] = useState("evidences");

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const close = () => {
    closeDialog();
  };

  useEffect(() => {
    setValue("evidences");
  }, [index]);
  const renderNavigation = () => (
    <Box sx={{ display: "flex", justifyContent: "space-between", my: 2 }}>
      <Button
        onClick={onPreviousQuestion}
        disabled={index - 1 < 0}
        sx={{ ...styles.centerVH, gap: 1, cursor: "pointer" }}
      >
        <ArrowBackIos sx={{ fontSize: ".7rem" }} />
        <Typography
          textTransform="uppercase"
          variant={"semiBoldLarge"}
          sx={{ fontSize: "12px" }}
        >
          <Trans i18nKey={"previousQuestion"} />
        </Typography>
      </Button>
      <Button
        onClick={onNextQuestion}
        disabled={index + 2 > questionsInfo?.length}
        sx={{ ...styles.centerVH, gap: 1, cursor: "pointer" }}
      >
        <Typography variant={"semiBoldLarge"} sx={{ fontSize: "12px" }}>
          <Trans i18nKey={"nextQuestion"} />
        </Typography>
        <ArrowForwardIos sx={{ fontSize: ".7rem" }} />
      </Button>
    </Box>
  );

  const renderQuestionDetails = () => (
    <Box sx={{ ...styles.centerCV, gap: 2 }}>
      <Chip
        label={questionInfo?.questionnaire}
        sx={{
          backgroundColor: generateColorFromString(questionInfo?.questionnaire)
            .backgroundColor,
          color: generateColorFromString(questionInfo?.questionnaire).color,
          marginRight: "auto",
        }}
      />
      <Typography
        sx={{
          ...theme.typography.semiBoldXLarge,
          textAlign: languageDetector(questionInfo?.question?.title ?? "")
            ? "right"
            : "left",
          color: "#2B333B",
        }}
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
          <Typography sx={{ ...theme.typography.bodyMedium }}>
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
            <Typography sx={{ ...theme.typography.bodyMedium }}>
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
        <EmptyState title={t("noOptionSelected")} />
      )}

      <QuestionTabsTemplate
        value={value}
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
        {renderNavigation()}
        <AlertBox
          severity={"error"}
          variant="filled"
          sx={{
            backgroundColor: "rgba(138, 15, 36, 0.04)",
            color: "#8A0F24",
            borderRadius: "8px",
          }}
          action={
            <Button
              variant="outlined"
              color="secondary"
              component={Link}
              to="./../../questionnaires/${questionInfo?.questionnaire?.id}/${questionInfo?.question?.index}"
              startIcon={<QuestionAnswer />}
            >
              <Trans i18nKey="goToQuestion" />
            </Button>
          }
        >
          <AlertTitle>
            <Trans i18nKey={"YouHaveFinishedAllQuestionnaires"} />
          </AlertTitle>
          <Trans i18nKey={"ToChangeYourInsightTryEditingQuestionnaires"} />
        </AlertBox>
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
          variant="contained"
          color="primary"
          component={Link}
          to={`./../../questionnaires/${questionInfo?.questionnaire?.id}/${questionInfo?.question?.index}`}
          startIcon={<QuestionAnswer />}
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
