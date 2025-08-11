import { useState } from "react";
import Box from "@mui/material/Box";
import { styles } from "@styles";
import IconButton from "@mui/material/IconButton";
import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";
import QuestionDialog from "./QuestionDialog";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import TitleWithTranslation from "@/components/common/fields/TranslationText";
import { useKitDesignerContext } from "@/providers/KitProvider";
import useDialog from "@/utils/useDialog";

const QuestionContain = (props: any) => {
  const { index } = props;
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState<
    number | null
  >(null);
  const { kitState } = useKitDesignerContext();
  const question = kitState.questions[index];

  const langCode = kitState.translatedLanguage?.code;
  const dialogProps = useDialog();

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

  return (
    <>
      <Box sx={{ display: "flex", py: ".5rem", px: "1rem" }}>
        <Box
          sx={{
            ...styles.centerVH,
            background: theme.palette.background.container,
            width: { xs: "65px", md: "95px" },
            justifyContent: "space-around",
          }}
          borderRadius="0.5rem"
          mr={2}
          px={0.2}
        >
          <Typography
            data-testid="question-index"
            variant="semiBoldLarge"
          >{`Q. ${question?.index}`}</Typography>
        </Box>
        <TitleWithTranslation
          title={question.title}
          translation={langCode ? question.translations?.[langCode]?.title : ""}
          variant="semiBoldMedium"
          showCopyIcon
        />{" "}
        <Box
          sx={{
            width: { xs: "20%", md: "10%" },
            display: "flex",
            justifyContent: "center",
          }}
        >
          <IconButton
            data-testid="question-handel-edit"
            onClick={() => handleQuestionClick(index)}
          >
            <ModeEditOutlineOutlinedIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>
      {question.index !== question.total && (
        <Divider sx={{ width: "95%", mx: "auto" }} />
      )}
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
