import SuccessCheck from "@/assets/svg/success-check.svg";
import FailureEmoji from "@/assets/svg/failure-emoji.svg";
import WarningEmptyState from "@/assets/svg/warning-empty-state.svg";
import type { TypographyProps } from "@mui/material/Typography";

export type ReviewStatusId = "complete" | "empty" | "incomplete";

export type ReviewTextConfig = {
  i18nKey: string | string[];
  color: string;
  variant: TypographyProps["variant"];
};

export type ReviewStatusConfig = {
  id: ReviewStatusId;
  image: string;
  texts: ReviewTextConfig[];
};

export const REVIEW_STATUS_CONFIG: Record<ReviewStatusId, ReviewStatusConfig> = {
  complete: {
    id: "complete",
    image: SuccessCheck,
    texts: [
      {
        i18nKey: "questions.goodJob",
        color: "primary.main",
        variant: "headlineMedium",
      },
      {
        i18nKey: "questions.allQuestionsHaveBeenAnswered",
        color: "primary.main",
        variant: "headlineSmall",
      },
      {
        i18nKey: [
          "questions.allQuestionsInAllQuestionnaireHaveBeenAnswered",
          "questions.allQuestionsInThisQuestionnaireHaveBeenAnswered",
        ],
        color: "#0A2342",
        variant: "semiBoldLarge",
      },
    ],
  },

  empty: {
    id: "empty",
    image: FailureEmoji,
    texts: [
      {
        i18nKey: "questions.hmmm",
        color: "#D81E5B",
        variant: "headlineMedium",
      },
      {
        i18nKey: "questions.noQuestionsHaveBeenAnswered",
        color: "#D81E5B",
        variant: "headlineSmall",
      },
      {
        i18nKey: "questions.weHighlyRecommendAnsweringMoreQuestions",
        color: "#0A2342",
        variant: "semiBoldLarge",
      },
    ],
  },

  incomplete: {
    id: "incomplete",
    image: WarningEmptyState,
    texts: [
      {
        i18nKey: "questions.nice",
        color: "#F9A03F",
        variant: "headlineMedium",
      },
      {
        i18nKey: "questions.youAnsweredQuestionOf",
        color: "#F9A03F",
        variant: "headlineSmall",
      },
      {
        i18nKey: "questions.someQuestionsHaveNotBeenAnswered",
        color: "#0A2342",
        variant: "semiBoldLarge",
      },
    ],
  },
};

