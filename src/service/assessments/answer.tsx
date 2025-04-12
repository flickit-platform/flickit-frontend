import axios, { AxiosRequestConfig } from "axios";
import { TId } from "@/types";

export const answer = {
  submit(
    { assessmentId, data }: { assessmentId: TId | undefined; data: any },
    config: AxiosRequestConfig<any> | undefined = {},
  ) {
    return axios.put(
      `/api/v2/assessments/${assessmentId ?? ""}/answer-question/`,
      data,
      { ...config },
    );
  },

  getHistory(
    {
      questionId,
      assessmentId,
      page,
      size,
    }: {
      questionId: TId;
      assessmentId: TId;
      size: number;
      page: number;
    },
    config?: AxiosRequestConfig<any>,
  ) {
    return axios.get(
      `/api/v1/assessments/${assessmentId}/questions/${questionId}/answer-history/`,
      {
        ...(config ?? {}),
        params: {
          page: page - 1,
          size,
        },
      },
    );
  },

  approve(
    { assessmentId, data }: { assessmentId: TId; data: any },
    config?: AxiosRequestConfig<any>,
  ) {
    return axios.put(
      `/api/v1/assessments/${assessmentId}/approve-answer/`,
      data,
      config,
    );
  },

  approveAll(
    { assessmentId }: { assessmentId: TId },
    config?: AxiosRequestConfig<any>,
  ) {
    return axios.put(`/api/v1/assessments/${assessmentId}/approve-answers/`, {
      ...config,
    });
  },
};
