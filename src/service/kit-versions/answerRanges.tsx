import axios, { AxiosRequestConfig } from "axios";
import { TId } from "@/types";

export const answerRanges = {
  getAll(
    { kitVersionId }: { kitVersionId: TId },
    config?: AxiosRequestConfig<any>,
  ) {
    return axios.get(`/api/v1/kit-versions/${kitVersionId}/answer-ranges/`, {
      ...(config ?? {}),
      params: {
        page: 0,
        size: 50,
      },
    });
  },

  create(
    { kitVersionId, data }: { kitVersionId: TId; data: any },
    config?: AxiosRequestConfig<any>,
  ) {
    return axios.post(
      `/api/v1/kit-versions/${kitVersionId}/answer-ranges/`,
      data,
      config,
    );
  },

  update(
    {
      kitVersionId,
      answerRangeId,
      data,
    }: { kitVersionId: TId; answerRangeId: TId; data: any },
    config?: AxiosRequestConfig<any>,
  ) {
    return axios.put(
      `/api/v1/kit-versions/${kitVersionId}/answer-ranges/${answerRangeId}/`,
      data,
      config,
    );
  },

  remove(
    {
      kitVersionId,
      answerRangeId,
    }: { kitVersionId: TId; answerRangeId: TId; data: any },
    config?: AxiosRequestConfig<any>,
  ) {
    return axios.delete(
      `/api/v1/kit-versions/${kitVersionId}/answer-ranges/${answerRangeId}/`,
      config,
    );
  },
};
