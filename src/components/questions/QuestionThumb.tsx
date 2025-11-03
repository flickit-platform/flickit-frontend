import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { Trans } from "react-i18next";
import { Text } from "../common/Text";

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
        <Text textTransform={"capitalize"} variant="subMedium">
          <Trans i18nKey="common.question" /> {questionIndex}/
          {total_number_of_questions}
        </Text>
        <Text variant="h6">{question?.title}</Text>
      </Box>
      {question.answer?.selectedOption && (
        <Box mt={3} display="flex" flexDirection="column">
          <Text variant="subMedium" textTransform="uppercase">
            <Trans i18nKey="common.yourAnswer" />
          </Text>
          <Text variant="h6">{question.answer?.selectedOption?.title}</Text>
        </Box>
      )}
      {question.answer?.isNotApplicable && (
        <Box mt={3}>
          <Text variant="subMedium" textTransform="uppercase">
            <Trans i18nKey="common.yourAnswer" />
          </Text>
          <Text variant="h6">
            <Trans i18nKey="questions.markedAsNotApplicable" />
          </Text>
        </Box>
      )}
      <Box display="flex">
        <Button
          sx={{
            mt: 1,
            marginInlineStart: "auto",
            marginInlineEnd: "unset",
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
