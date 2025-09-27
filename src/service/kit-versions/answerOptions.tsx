import axios, { AxiosRequestConfig } from "axios";
import { TId } from "@/types";

export const answerOptions = {
  createOption(
    {
      kitVersionId,
      data,
    }: {
      kitVersionId: TId;
      data?: { questionId: number; index: number; title: string };
    },
    config?: AxiosRequestConfig<any>,
  ) {
    return axios.post(
      `/api/v1/kit-versions/${kitVersionId}/answer-options/`,
      data,
      config,
    );
  },

  updateOption(
    {
      kitVersionId,
      answerOptionId,
      data,
    }: { kitVersionId: TId; answerOptionId: TId; data: any },
    config?: AxiosRequestConfig<any>,
  ) {
    return axios.put(
      `/api/v1/kit-versions/${kitVersionId}/answer-options/${answerOptionId}/`,
      data,
      config,
    );
  },

  createRangeOption(
    { kitVersionId, data }: { kitVersionId: TId; data: any },
    config?: AxiosRequestConfig<any>,
  ) {
    return axios.post(
      `/api/v1/kit-versions/${kitVersionId}/answer-range-options/`,
      data,
      config,
    );
  },
};
