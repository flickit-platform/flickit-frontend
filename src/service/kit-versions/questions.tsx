import axios, { AxiosRequestConfig } from "axios";
import { TId } from "@/types";

export const questions = {
  reorder(
    { kitVersionId }: { kitVersionId: TId },
    data: any,
    config?: AxiosRequestConfig<any>,
  ) {
    return axios.put(
      `/api/v1/kit-versions/${kitVersionId}/questions-change-order/`,
      data,
      config,
    );
  },

  create(
    { kitVersionId, data }: { kitVersionId: TId; data: any },
    config?: AxiosRequestConfig<any>,
  ) {
    return axios.post(
      `/api/v1/kit-versions/${kitVersionId}/questions/`,
      data,
      config,
    );
  },

  update(
    {
      kitVersionId,
      questionId,
      data,
    }: { kitVersionId: TId; questionId: TId; data: any },
    config?: AxiosRequestConfig<any>,
  ) {
    return axios.put(
      `/api/v1/kit-versions/${kitVersionId}/questions/${questionId}/`,
      data,
      config,
    );
  },

  remove(
    { kitVersionId, questionId }: { kitVersionId: TId; questionId: TId },
    config?: AxiosRequestConfig<any>,
  ) {
    return axios.delete(
      `/api/v1/kit-versions/${kitVersionId}/questions/${questionId}`,
      config,
    );
  },

  getImpacts(
    { kitVersionId, questionId }: { kitVersionId: TId; questionId: any },
    config?: AxiosRequestConfig<any>,
  ) {
    return axios.get(
      `/api/v1/kit-versions/${kitVersionId}/questions/${questionId}/impacts/`,
      {
        ...(config ?? {}),
        params: {
          page: 0,
          size: 50,
        },
      },
    );
  },

  getOptions(
    { kitVersionId, questionId }: { kitVersionId: TId; questionId: any },
    config?: AxiosRequestConfig<any>,
  ) {
    return axios.get(
      `/api/v1/kit-versions/${kitVersionId}/questions/${questionId}/options/`,
      {
        ...(config ?? {}),
        params: {
          page: 0,
          size: 50,
        },
      },
    );
  },
};
