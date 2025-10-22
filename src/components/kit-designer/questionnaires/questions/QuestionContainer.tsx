import { useState } from "react";
import Box from "@mui/material/Box";
import { styles } from "@styles";
import IconButton from "@mui/material/IconButton";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import QuestionDialog from "./QuestionDialog";
import Divider from "@mui/material/Divider";
import { Text } from "@/components/common/Text";
import TitleWithTranslation from "@/components/common/fields/TranslationText";
import { kitActions, useKitDesignerContext } from "@/providers/kit-provider";
import useDialog from "@/hooks/useDialog";
import { DeleteConfirmationDialog } from "@/components/common/dialogs/DeleteConfirmationDialog";
import { useTranslation } from "react-i18next";
import { useQuery } from "@/hooks/useQuery";
import { useServiceContext } from "@/providers/service-provider";
import { useParams } from "react-router-dom";
import showToast from "@/utils/toast-error";
import { ICustomError } from "@/utils/custom-error";
import { SwapVertRounded } from "@mui/icons-material";

const QuestionContain = (props: any) => {
  const { t } = useTranslation();
  const { kitVersionId = "" } = useParams();
  const { service } = useServiceContext();
  const { index } = props;
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState<
    number | null
  >(null);
  const { kitState, dispatch } = useKitDesignerContext();
  const question = kitState.questions[index];
  const deleteQuestion = useQuery({
    service: (args, config) =>
      service.kitVersions.questions.remove(args, config),
    runOnMount: false,
  });

  const langCode = kitState.translatedLanguage?.code;
  const dialogProps = useDialog();
  const deleteDialogProps = useDialog();

  const handleQuestionClick = (index: number) => {
    setSelectedQuestionIndex(index);
    dialogProps.openDialog({
      type: "details",
      index: index,
    });
  };

  const navigateToPreviousQuestion = () => {
    if (selectedQuestionIndex !== null && selectedQuestionIndex > 0) {
      const newIndex = selectedQuestionIndex - 1;
      setSelectedQuestionIndex(newIndex);
      dialogProps.openDialog({
        type: "details",
        index: selectedQuestionIndex - 1,
      });
    }
  };

  const navigateToNextQuestion = () => {
    if (
      selectedQuestionIndex !== null &&
      selectedQuestionIndex < kitState.questions.length - 1
    ) {
      const newIndex = selectedQuestionIndex + 1;
      setSelectedQuestionIndex(newIndex);
      dialogProps.openDialog({
        type: "details",
        index: selectedQuestionIndex + 1,
      });
    }
  };

  const handleDelete = async () => {
    try {
      let questionId = question.id;
      await deleteQuestion.query({ kitVersionId, questionId });

      const updatedQuestions = kitState.questions.filter(
        (q) => q.id !== question.id,
      );

      dispatch(kitActions.setQuestions(updatedQuestions));
    } catch (e) {
      const err = e as ICustomError;
      showToast(err);
    }
    deleteDialogProps.onClose();
  };

  return (
    <>
      <Box sx={{ display: "flex", py: ".5rem", px: "1rem" }} gap={1}>
        <Box
          sx={{
            ...styles.centerCVH,
            bgcolor: "background.container",
          }}
          borderRadius="0.5rem"
          mr={2}
          p={0.25}
        >
          <Text variant="semiBoldLarge">{index + 1}</Text>
          <Divider orientation="horizontal" flexItem sx={{ mx: 1 }} />
          <IconButton size="small">
            <SwapVertRounded fontSize="small" />
          </IconButton>
        </Box>
        <TitleWithTranslation
          title={question.title}
          translation={langCode ? question.translations?.[langCode]?.title : ""}
          variant="semiBoldMedium"
          showCopyIcon
        />{" "}
        <Box width={{ xs: "20%", md: "10%" }} sx={{ ...styles.centerH }}>
          <IconButton
            data-testid="question-handel-edit"
            onClick={() => handleQuestionClick(index)}
            color="primary"
          >
            <EditOutlinedIcon fontSize="small" />
          </IconButton>
          <IconButton onClick={deleteDialogProps.openDialog} color="primary">
            <DeleteOutlinedIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>
      {question.index !== question.total && (
        <Divider sx={{ width: "95%", mx: "auto" }} />
      )}

      <DeleteConfirmationDialog
        open={deleteDialogProps.open}
        onClose={deleteDialogProps.onClose}
        onConfirm={handleDelete}
        content={{
          category: t("common.question"),
          title: question.index,
        }}
      />

      {dialogProps.open && (
        <QuestionDialog
          {...dialogProps}
          onClose={() => dialogProps.onClose()}
          onPreviousQuestion={navigateToPreviousQuestion}
          onNextQuestion={navigateToNextQuestion}
        />
      )}
    </>
  );
};

export default QuestionContain;
