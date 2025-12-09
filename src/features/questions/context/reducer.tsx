import { QUESTION_ACTIONS_TYPE } from "./actions";
const questionReducer = (
  prevState: any,
  action: { type: QUESTION_ACTIONS_TYPE; payload: any },
) => {
  switch (action.type) {
    case QUESTION_ACTIONS_TYPE.SET_QUESTIONS:
      return {
        ...prevState,
        questions: action.payload,
      };
    case QUESTION_ACTIONS_TYPE.SET_SELECTED_QUESTION: {
      const { payload } = action;

      const prevQuestions = Array.isArray(prevState.questions)
        ? prevState.questions
        : [];

      const shouldUpdateQuestions = !payload?.readonly;

      const updatedQuestions = shouldUpdateQuestions
        ? prevQuestions.length > 0
          ? prevQuestions.map((question: any) =>
              question.id === payload?.id
                ? { ...question, ...payload }
                : question,
            )
          : [payload]
        : prevQuestions;

      return {
        ...prevState,
        selectedQuestion: payload,
        questions: updatedQuestions,
      };
    }

    case QUESTION_ACTIONS_TYPE.SET_QUESTION_ITEMS:
      return {
        ...prevState,
        questionItems: action.payload,
      };
    case QUESTION_ACTIONS_TYPE.SET_FILTERED_QUESTIONS: {
      return {
        ...prevState,
        filteredQuestions: action.payload,
      };
    }

    case QUESTION_ACTIONS_TYPE.SET_SELECTED_CONFIDENCE: {
      return {
        ...prevState,
        selectedConfidence: action.payload,
      };
    }

    case QUESTION_ACTIONS_TYPE.SET_CONFIDENCE_LEVELS:
      return {
        ...prevState,
        confidenceLevels: action.payload,
      };

    // ======================
    // Evidences
    // ======================
    case QUESTION_ACTIONS_TYPE.SET_EVIDENCES:
      return {
        ...prevState,
        evidences: action.payload,
      };

    case QUESTION_ACTIONS_TYPE.ADD_EVIDENCE: {
      const prevEvidences = prevState.evidences ?? [];
      return {
        ...prevState,
        evidences: [action.payload, ...prevEvidences],
      };
    }

    case QUESTION_ACTIONS_TYPE.UPDATE_EVIDENCE: {
      const prevEvidences = prevState.evidences ?? [];

      const updatedEvidences = prevEvidences.map((ev: any) =>
        ev.id === action.payload.id ? { ...ev, ...action.payload } : ev,
      );

      return {
        ...prevState,
        evidences: updatedEvidences,
      };
    }

    case QUESTION_ACTIONS_TYPE.DELETE_EVIDENCE: {
      const prevEvidences = prevState.evidences ?? [];

      const remainingEvidences = prevEvidences.filter(
        (ev: any) => ev.id !== action.payload.id,
      );

      return {
        ...prevState,
        evidences: remainingEvidences,
      };
    }

    // ======================
    // Comments
    // ======================
    case QUESTION_ACTIONS_TYPE.SET_COMMENTS:
      return {
        ...prevState,
        comments: action.payload,
      };

    case QUESTION_ACTIONS_TYPE.ADD_COMMENT: {
      const prevComments = prevState.comments ?? [];
      return {
        ...prevState,
        comments: [action.payload, ...prevComments],
      };
    }

    case QUESTION_ACTIONS_TYPE.UPDATE_COMMENT: {
      const prevComments = prevState.comments ?? [];

      const updatedComments = prevComments.map((c: any) =>
        c.id === action.payload.id ? { ...c, ...action.payload } : c,
      );

      return {
        ...prevState,
        comments: updatedComments,
      };
    }

    case QUESTION_ACTIONS_TYPE.DELETE_COMMENT: {
      const prevComments = prevState.comments ?? [];

      const remainingComments = prevComments.filter(
        (c: any) => c.id !== action.payload.id,
      );

      return {
        ...prevState,
        comments: remainingComments,
      };
    }

    // ======================
    // Answer history
    // ======================
    case QUESTION_ACTIONS_TYPE.SET_ANSWER_HISTORY:
      return {
        ...prevState,
        answerHistory: action.payload,
      };
    case QUESTION_ACTIONS_TYPE.ADD_ANSWER_HISTORY: {
      const prevanAwerHistory = prevState.answerHistory ?? [];
      return {
        ...prevState,
        answerHistory: [action.payload, ...prevanAwerHistory],
      };
    }

    default:
      return prevState;
  }
};

export default questionReducer;
