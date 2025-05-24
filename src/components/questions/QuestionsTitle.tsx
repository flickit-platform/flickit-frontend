import { useEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Trans } from "react-i18next";
import { Link, useParams } from "react-router-dom";
import Title from "@common/Title";
import {
  EAssessmentStatus,
  questionActions,
  useQuestionContext,
  useQuestionDispatch,
} from "@/providers/QuestionProvider";
import { t } from "i18next";
import setDocumentTitle from "@utils/setDocumentTitle";
import { useConfigContext } from "@/providers/ConfgProvider";
import { farsiFontFamily, primaryFontFamily, theme } from "@/config/theme";
import { styles } from "@styles";
import languageDetector from "@/utils/languageDetector";
import { QuestionsFilteringDropdown } from "../questionnaires/QuestionnaireList";
import IconButton from "@mui/material/IconButton";
import ArrowBack from "@mui/icons-material/ArrowBack";
import ArrowForward from "@mui/icons-material/ArrowForward";

const itemNames = [
  {
    translate: t("unansweredQuestions"),
    original: "isUnanswered",
  },
  {
    translate: t("unapprovedAnswer"),
    original: "hasUnapprovedAnswer",
  },
  {
    translate: t("lowConfidenceAnswers"),
    original: "isAnsweredWithLowConfidence",
  },
  {
    translate: t("unresolvedComments"),
    original: "unresolvedCommentsCount",
  },
  {
    translate: t("answersWithNoEvidence"),
    original: "isAnsweredWithoutEvidences",
  },
];

const QuestionsTitle = (props: { isReview?: boolean; pathInfo: any }) => {
  const { isReview, pathInfo } = props;
  const {
    questionsInfo: { total_number_of_questions },
    assessmentStatus,
  } = useQuestionContext();
  const { questionIndex, questionnaireId } = useParams();
  const isComplete = questionIndex === "completed";
  const { questionnaire } = pathInfo;
  const { config } = useConfigContext();
  const [originalItem, setOriginalItem] = useState<any[]>([]);
  const dispatch = useQuestionDispatch();
  const { questionsInfo } = useQuestionContext();
  const [didMount, setDidMount] = useState(false);
  const initialQuestionsRef = useRef<any[]>([]);

  useEffect(() => {
    setDidMount(true);
  }, []);
  useEffect(() => {
    if (isComplete) {
      setDocumentTitle(
        `${questionnaire.title} ${t("questionnaireFinished")}`,
        config.appTitle,
      );
    }
  }, [questionnaire, isComplete, questionnaireId]);

  useEffect(() => {
    if (initialQuestionsRef.current.length === 0) {
      initialQuestionsRef.current = [...questionsInfo.questions];
    }

    const filteredItems = questionsInfo.questions.map(
      (currentItem: any, index: number) => {
        const initialItem = initialQuestionsRef.current[index];
        const updatedIssues = { ...currentItem.issues };
        if (initialItem?.issues) {
          Object.keys(initialItem?.issues).forEach((key) => {
            if (!(key in updatedIssues)) {
              updatedIssues[key] = initialItem?.issues[key];
            }
          });
        }

        Object.keys(updatedIssues).forEach((key) => {
          if (!originalItem.includes(key)) {
            delete updatedIssues[key];
          }
        });

        return { ...currentItem, issues: updatedIssues };
      },
    );

    if (originalItem.length === 0 && didMount === false) return;

    const questionsHaveChanged = !filteredItems.every((item, index) => {
      return (
        JSON.stringify(item) === JSON.stringify(questionsInfo.questions[index])
      );
    });
    if (questionsHaveChanged) {
      dispatch(
        questionActions.setQuestionsInfo({
          total_number_of_questions: questionsInfo.total_number_of_questions,
          resultId: questionsInfo.resultId,
          questions: filteredItems,
          permissions: questionsInfo.permissions,
        }),
      );
    }
  }, [originalItem, questionsInfo]);

  return (
    <Box sx={{ pt: 1, pb: 0 }}>
      <Title
        size="large"
        wrapperProps={{
          sx: {
            flexDirection: { xs: "column", md: "row" },
            alignItems: { xs: "flex-start", md: "center" },
            display: { xs: "block", sm: "flex" },
          },
        }}
        toolbar={
          <Box sx={{ mt: { xs: 1.5, sm: 0 } }}>
            {!window.location.pathname.includes("review") &&
              questionsInfo.permissions?.viewDashboard && (
                <QuestionsFilteringDropdown
                  setOriginalItem={setOriginalItem}
                  originalItem={originalItem}
                  itemNames={itemNames}
                  dropdownLabel={
                    <Trans i18nKey="highlightQuestionsWithIssues" />
                  }
                  allSelected
                />
              )}
          </Box>
        }
      >
        {isReview ? (
          <div
            style={{
              display: "flex",
              flexDirection: theme.direction === "rtl" ? "row-reverse" : "row",
            }}
          ></div>
        ) : (
          <>
            <Box display="block">
              <Box sx={{ ...styles.centerVH }}>
                <IconButton component={Link} to={isReview ? "./../.." : "./.."}>
                  {theme.direction === "ltr" ? (
                    <ArrowBack color="primary" />
                  ) : (
                    <ArrowForward color="primary" />
                  )}
                </IconButton>
                <Typography
                  display="inline-block"
                  variant="h5"
                  fontWeight={"bold"}
                  style={{
                    fontFamily: languageDetector(questionnaire.title)
                      ? farsiFontFamily
                      : primaryFontFamily,
                  }}
                >
                  {questionnaire.title}
                </Typography>{" "}
              </Box>
            </Box>
          </>
        )}
      </Title>
    </Box>
  );
};

export default QuestionsTitle;
