import axios, { AxiosRequestConfig } from "axios";
import { TId } from "@/types";

export const questionnaire = {
  getAll(args: { assessmentId: TId }, config?: AxiosRequestConfig<any>) {
    return axios.get(
      `/api/v2/assessments/${args.assessmentId}/questionnaires/`,
      {
        ...config,
      },
    );
  },

  getQuestionnaireAnswers(
    args: {
      questionnaireId: TId;
      assessmentId: TId;
      size: number;
      page: number;
    },
    config?: AxiosRequestConfig<any>,
  ) {
    const { assessmentId, questionnaireId, size, page } = args;
    return axios.get(
      `/api/v1/assessments/${assessmentId}/questionnaires/${questionnaireId}/`,
      {
        ...(config ?? {}),
        params: {
          page,
          size,
        },
      },
    );
  },

  getNext(
    args: {
      questionnaireId: TId;
      assessmentId: TId;
      size: number;
      page: number;
    },
    config?: AxiosRequestConfig<any>,
  ) {
    const { assessmentId, questionnaireId } = args;
    return axios.get(
      `/api/v1/assessments/${assessmentId}/questionnaires/${questionnaireId}/next`,
      {
        ...(config ?? {}),
      },
    );
  },

  getQuestionIssues(
    args: { assessmentId: TId; questionId: TId },
    config?: AxiosRequestConfig<any>,
  ) {
    return axios.get(
      `/api/v1/assessments/${args.assessmentId}/questions/${args.questionId}/issues`,
      {
        ...(config ?? {}),
      },
    );
  },

  resolveAllComments(
    args: { assessmentId: TId },
    config?: AxiosRequestConfig<any>,
  ) {
    return axios.put(
      `/api/v1/assessments/${args.assessmentId}/resolve-comments/`,
      {
        ...config,
      },
    );
  },
};
