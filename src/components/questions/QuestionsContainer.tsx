import { PropsWithChildren, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { useNavigate, useParams } from "react-router-dom";
import {
  questionActions,
  useQuestionDispatch,
} from "@/providers/QuestionProvider";
import { useServiceContext } from "@providers/ServiceProvider";
import { useQuery } from "@utils/useQuery";
import LoadingSkeletonOfQuestions from "@common/loadings/LoadingSkeletonOfQuestions";
import QuestionsTitle from "./QuestionsTitle";
import QueryBatchData from "@common/QueryBatchData";
import { EAssessmentStatus, IQuestion, IQuestionnaireModel, IQuestionsModel } from "@/types/index";
import toastError from "@/utils/toastError";
import { ICustomError } from "@/utils/CustomError";
import { useQuestion } from "./QuestionContainer";

const QuestionsContainer = (
  props: PropsWithChildren<{ isReview?: boolean }>,
) => {
  const { questionIndex } = useParams();
  const dispatch = useQuestionDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!props.isReview && !questionIndex) {
      navigate("./1", { replace: true });
      return;
    }
    if (
      !props.isReview &&
      questionIndex !== "completed" &&
      (isNaN(Number(questionIndex)) ||
        Number(questionIndex) === 0 ||
        Number(questionIndex) < 0)
    ) {
      navigate("./1", { replace: true });
      return;
    }

    if (questionIndex == "completed") {
      dispatch(questionActions.setAssessmentStatus(EAssessmentStatus.DONE));
      return;
    }
    dispatch(questionActions.setAssessmentStatus(EAssessmentStatus.INPROGRESS));
    dispatch(questionActions.goToQuestion(questionIndex));
  }, [questionIndex]);

  return (
    <Box>
      <QuestionsContainerC {...props} />
    </Box>
  );
};

export const QuestionsContainerC = (
  props: PropsWithChildren<{ isReview?: boolean }>,
) => {
  const { children, isReview = false } = props;
  const { questionsResultQueryData, fetchPathInfo } = useQuestions();
  const { questionnaireId } = useParams();

  useEffect(() => {
    fetchPathInfo.query();
  }, [questionnaireId]);
  return (
    <QueryBatchData<IQuestionsModel | IQuestionnaireModel>
      queryBatchData={[fetchPathInfo]}
      loaded={questionsResultQueryData.loaded}
      renderLoading={() => <LoadingSkeletonOfQuestions />}
      render={([pathInfo = {}]) => {
        return (
          <Box sx={{ overflowX: "hidden" }}>
            <Box py={1}>
              <QuestionsTitle isReview={isReview} pathInfo={pathInfo} />
            </Box>
            <Box display="flex" justifyContent="center">
              {children}
            </Box>
          </Box>
        );
      }}
    />
  );
};

export const useUpdateQuestionInfo = () => {
  const dispatch = useQuestionDispatch();
  const { service } = useServiceContext();
  const { questionInfo } = useQuestion();
  const { assessmentId = "" } = useParams();

  const fetchQuestionIssues = useQuery<IQuestionsModel>({
    service: (args, config) =>
      service.assessments.questionnaire.getQuestionIssues(
        { assessmentId, questionId: questionInfo?.id },
        config,
      ),
    runOnMount: false,
  });

  const updateQuestionInfo = async () => {
    try {
      const issues = await fetchQuestionIssues.query();

      dispatch(
        questionActions.setQuestionInfo({
          ...questionInfo,
          issues: issues,
        }),
      );
    } catch (e) {
      console.error("Error fetching question issues:", e);
    }
  };

  return { updateQuestionInfo };
};

export const useQuestions = () => {
  const { service } = useServiceContext();
  const [questions, setQuestions] = useState<IQuestion[]>([]);
  const [page, setPage] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const dispatch = useQuestionDispatch();
  const {
    questionnaireId = "",
    assessmentId = "",
    questionIndex = 0,
  } = useParams();
  const pageSize = 50;

  const questionsResultQueryData = useQuery<IQuestionsModel>({
    service: (args, config) =>
      service.assessments.questionnaire.getQuestionnaireAnswers(
        { questionnaireId, assessmentId, page: args.page ?? 0, size: pageSize },
        config,
      ),
    runOnMount: false, // We'll handle the initial run ourselves
  });

  const fetchPathInfo = useQuery({
    service: (args, config) =>
      service.common.getPathInfo(
        { questionnaireId, assessmentId, ...(args ?? {}) },
        config,
      ),
    runOnMount: true,
  });

  // Fetch the initial set of questions (page 0) on mount
  useEffect(() => {
    questionsResultQueryData
      .query({ page: 0 })
      .then((response) => {
        if (response) {
          const { items = [], permissions, total } = response;
          setQuestions(items);
          setTotalQuestions(total);
          dispatch(
            questionActions.setQuestionsInfo({
              total_number_of_questions: total,
              resultId: "",
              questions: items,
              permissions: permissions,
            }),
          );
        }
      })
      .catch((e) => {
        console.error("Failed to load initial questions", e);
        toastError(e as ICustomError);
      });
  }, [questionnaireId]);

  const loadMoreQuestions = async (newPage: number) => {
    try {
      const response = await questionsResultQueryData.query({ page: newPage });
      if (response) {
        const { items = [], permissions, total } = response;
        setQuestions((prevQuestions) => [...prevQuestions, ...items]);
        setTotalQuestions(total);
        dispatch(
          questionActions.setQuestionsInfo({
            total_number_of_questions: total,
            resultId: "",
            questions: [...questions, ...items],
            permissions: permissions,
          }),
        );
      }
    } catch (e) {
      console.error("Failed to load more questions", e);
      toastError(e as ICustomError);
    }
  };

  useEffect(() => {
    const currentIndex = Number(questionIndex);
    if (currentIndex > questions.length && currentIndex <= totalQuestions) {
      const newPage = Math.floor((currentIndex - 1) / pageSize);
      if (newPage > page) {
        setPage(newPage);
        loadMoreQuestions(newPage);
      }
    }
  }, [questionIndex, questions.length, totalQuestions]);

  return {
    questions,
    questionsResultQueryData,
    fetchPathInfo,
  };
};
export default QuestionsContainer;
