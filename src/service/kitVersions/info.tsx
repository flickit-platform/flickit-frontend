import axios, { AxiosRequestConfig } from "axios";
import { TId } from "@/types";

export const info = {
  getById(
    { kitVersionId }: { kitVersionId: TId },
    config?: AxiosRequestConfig<any>,
  ) {
    return axios.get(`/api/v1/kit-versions/${kitVersionId}/`, config);
  },

  validate(
    { kitVersionId }: { kitVersionId: TId },
    config?: AxiosRequestConfig<any>,
  ) {
    return axios.get(`/api/v1/kit-versions/${kitVersionId}/validate/`, config);
  },

  activate(
    { kitVersionId }: { kitVersionId: TId },
    data: any,
    config?: AxiosRequestConfig<any>,
  ) {
    return axios.post(
      `/api/v1/kit-versions/${kitVersionId}/activate/`,
      data,
      config,
    );
  },

  remove(
    { kitVersionId }: { kitVersionId: string },
    config?: AxiosRequestConfig<any>,
  ) {
    return axios.delete(`/api/v1/kit-versions/${kitVersionId}/`, config);
  },
};
