import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { Trans } from "react-i18next";
import { farsiFontFamily, primaryFontFamily, theme } from "@/config/theme";
import languageDetector from "@utils/languageDetector";

export const QuestionThumb = (props: any) => {
  const {
    questionsInfo,
    question = {},
    questionIndex,
    onClose = () => {},
    link,
    isSubmitting,
  } = props;
  const { total_number_of_questions, permissions } = questionsInfo;

  const navigate = useNavigate();
  return (
    <Box py={2.5} px={2.5} minWidth="284px" maxWidth="600px">
      <Box>
        <Typography textTransform={"capitalize"} variant="subMedium">
          <Trans i18nKey="common.question" /> {questionIndex}/
          {total_number_of_questions}
        </Typography>
        <Typography
          variant="h6"
          sx={
            languageDetector(question?.title)
              ? { fontFamily: farsiFontFamily, textAlign: "right" }
              : { fontFamily: primaryFontFamily, textAlign: "left" }
          }
        >
          {question?.title}
        </Typography>
      </Box>
      {question.answer?.selectedOption && (
        <Box mt={3}>
          <Typography variant="subMedium" textTransform="uppercase">
            <Trans i18nKey="common.yourAnswer" />
          </Typography>
          <Typography
            variant="h6"
            sx={{
              fontFamily: languageDetector(
                question.answer?.selectedOption?.title,
              )
                ? farsiFontFamily
                : primaryFontFamily,
            }}
          >
            {question.answer?.selectedOption?.title}
          </Typography>
        </Box>
      )}
      {question.answer?.isNotApplicable && (
        <Box mt={3}>
          <Typography variant="subMedium" textTransform="uppercase">
            <Trans i18nKey="common.yourAnswer" />
          </Typography>
          <Typography variant="h6">
            <Trans i18nKey="questions.markedAsNotApplicable" />
          </Typography>
        </Box>
      )}
      <Box display="flex">
        <Button
          sx={{
            mt: 1,
            ml: theme.direction === "rtl" ? "unset" : "auto",
            mr: theme.direction !== "rtl" ? "unset" : "auto",
          }}
          disabled={isSubmitting}
          onClick={(e: any) => {
            e.stopPropagation();
            navigate(link, { replace: true });
            onClose();
          }}
        >
          {question.answer ||
          !permissions.answerQuestion ||
          question.answer?.isNotApplicable ? (
            <Trans i18nKey="common.edit" />
          ) : (
            <Trans i18nKey="common.submitAnAnswer" />
          )}
        </Button>
      </Box>
    </Box>
  );
};
