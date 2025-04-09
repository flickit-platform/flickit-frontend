import axios, { AxiosRequestConfig } from "axios";
import { TId } from "@/types";

export const subjects = {
  getAll(
    { kitVersionId }: { kitVersionId: TId },
    config?: AxiosRequestConfig<any>,
  ) {
    return axios.get(`/api/v1/kit-versions/${kitVersionId}/subjects/`, config);
  },

  create(
    { kitVersionId, data }: { kitVersionId: TId; data: any },
    config?: AxiosRequestConfig<any>,
  ) {
    return axios.post(
      `/api/v1/kit-versions/${kitVersionId}/subjects/`,
      data,
      config,
    );
  },

  reorder(
    { kitVersionId }: { kitVersionId: TId },
    data: any,
    config?: AxiosRequestConfig<any>,
  ) {
    return axios.put(
      `/api/v1/kit-versions/${kitVersionId}/subjects-change-order/`,
      data,
      config,
    );
  },

  remove(
    { kitVersionId, subjectId }: { kitVersionId: TId; subjectId: TId },
    config?: AxiosRequestConfig<any>,
  ) {
    return axios.delete(
      `/api/v1/kit-versions/${kitVersionId}/subjects/${subjectId}/`,
      config,
    );
  },

  update(
    {
      kitVersionId,
      subjectId,
      data,
    }: { kitVersionId: TId; subjectId: TId; data: any },
    config?: AxiosRequestConfig<any>,
  ) {
    return axios.put(
      `/api/v1/kit-versions/${kitVersionId}/subjects/${subjectId}/`,
      data,
      config,
    );
  },
};
