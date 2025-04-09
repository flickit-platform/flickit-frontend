import axios, { AxiosRequestConfig } from "axios";
import { TId } from "@/types";

export const questionnaires = {
  getAll(
    { kitVersionId }: { kitVersionId: TId },
    config?: AxiosRequestConfig<any>,
  ) {
    return axios.get(
      `/api/v1/kit-versions/${kitVersionId}/questionnaires/`,
      config,
    );
  },

  create(
    { kitVersionId, data }: { kitVersionId: TId; data: any },
    config?: AxiosRequestConfig<any>,
  ) {
    return axios.post(
      `/api/v1/kit-versions/${kitVersionId}/questionnaires/`,
      data,
      config,
    );
  },

  update(
    {
      kitVersionId,
      questionnaireId,
      data,
    }: { kitVersionId: TId; questionnaireId: TId; data: any },
    config?: AxiosRequestConfig<any>,
  ) {
    return axios.put(
      `/api/v1/kit-versions/${kitVersionId}/questionnaires/${questionnaireId}/`,
      data,
      config,
    );
  },

  remove(
    {
      kitVersionId,
      questionnaireId,
    }: { kitVersionId: TId; questionnaireId: TId },
    config?: AxiosRequestConfig<any>,
  ) {
    return axios.delete(
      `/api/v1/kit-versions/${kitVersionId}/questionnaires/${questionnaireId}/`,
      config,
    );
  },

  reorder(
    { kitVersionId }: { kitVersionId: TId },
    data: any,
    config?: AxiosRequestConfig<any>,
  ) {
    return axios.put(
      `/api/v1/kit-versions/${kitVersionId}/questionnaires-change-order/`,
      data,
      config,
    );
  },

  getQuestions(
    {
      kitVersionId,
      questionnaireId,
    }: { kitVersionId: TId; questionnaireId: TId },
    config?: AxiosRequestConfig<any>,
  ) {
    return axios.get(
      `/api/v1/kit-versions/${kitVersionId}/questionnaires/${questionnaireId}/questions/`,
      {
        ...(config ?? {}),
        params: {
          page: 0,
          size: 100,
        },
      },
    );
  },
};
