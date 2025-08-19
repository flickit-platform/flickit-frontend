import { useEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Trans } from "react-i18next";
import { Link, useParams } from "react-router-dom";
import Title from "@common/Title";
import {
  questionActions,
  useQuestionContext,
  useQuestionDispatch,
} from "@/providers/QuestionProvider";
import { t } from "i18next";
import setDocumentTitle from "@utils/setDocumentTitle";
import { useConfigContext } from "@/providers/ConfgProvider";
import { farsiFontFamily, primaryFontFamily } from "@/config/theme";
import { styles } from "@styles";
import languageDetector from "@/utils/languageDetector";
import { QuestionsFilteringDropdown } from "../dashboard/dashboard-tab/questionnaires/QuestionnaireList";
import IconButton from "@mui/material/IconButton";
import ArrowBack from "@mui/icons-material/ArrowBack";
import ArrowForward from "@mui/icons-material/ArrowForward";
import { useQuestionnaire } from "../dashboard/dashboard-tab/questionnaires/QuestionnaireContainer";
import OutlinedProgressButton from "../common/buttons/OutlinedProgressButton";
import { Skeleton, useTheme } from "@mui/material";

const itemNames = [
  {
    translate: t("dashboard.unansweredQuestions"),
    original: "isUnanswered",
  },
  {
    translate: t("dashboard.unapprovedAnswer"),
    original: "hasUnapprovedAnswer",
  },
  {
    translate: t("dashboard.lowConfidenceAnswers"),
    original: "isAnsweredWithLowConfidence",
  },
  {
    translate: t("dashboard.unresolvedComments"),
    original: "unresolvedCommentsCount",
  },
  {
    translate: t("dashboard.answersWithNoEvidence"),
    original: "isAnsweredWithoutEvidences",
  },
];

const QuestionsTitle = (props: { isReview?: boolean; pathInfo: any }) => {
  const { isReview, pathInfo } = props;
  const { questionIndex, questionnaireId } = useParams();
  const isComplete = questionIndex === "completed";
  const { questionnaire } = pathInfo;
  const { config } = useConfigContext();
  const [originalItem, setOriginalItem] = useState<any[]>([]);
  const dispatch = useQuestionDispatch();
  const { questionsInfo } = useQuestionContext();
  const [didMount, setDidMount] = useState(false);
  const initialQuestionsRef = useRef<any[]>([]);
  const { assessmentTotalProgress } = useQuestionnaire();

  useEffect(() => {
    setDidMount(true);
  }, []);
  useEffect(() => {
    if (isComplete) {
      setDocumentTitle(
        `${questionnaire.title} ${t("questions.questionnaireFinished")}`,
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

  useEffect(() => {
    assessmentTotalProgress.query();
  }, [questionIndex]);

  const answersCount = assessmentTotalProgress?.data?.answersCount ?? 0;
  const questionsCount = assessmentTotalProgress?.data?.questionsCount ?? 0;
  const percent = questionsCount ? (answersCount / questionsCount) * 100 : 0;
  const theme = useTheme();

  return (
    <Box>
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
                    <Trans i18nKey="dashboard.highlightQuestionsWithIssues" />
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
                {assessmentTotalProgress.loading && percent == 0 ? (
                  <Skeleton width={80} />
                ) : (
                  <OutlinedProgressButton
                    label={`${answersCount} / ${questionsCount}`}
                    progressPercent={percent}
                    variant="outlined"
                    fillColor="#D0E4FF"
                    fullWidth={false}
                    sx={{
                      marginInlineStart: 1,
                      mt: 0.5,
                      p: 0,
                      bgcolor: "primary.states.selected",
                      cursor: "default",
                    }}
                    disabled
                  />
                )}
              </Box>
            </Box>
          </>
        )}
      </Title>
    </Box>
  );
};

export default QuestionsTitle;
