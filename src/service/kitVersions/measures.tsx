import axios, { AxiosRequestConfig } from "axios";
import { TId } from "@/types";

export const measures = {
  getAll(
    { kitVersionId }: { kitVersionId: TId },
    config?: AxiosRequestConfig<any>,
  ) {
    return axios.get(`/api/v1/kit-versions/${kitVersionId}/measures/`, config);
  },

  create(
    { kitVersionId, data }: { kitVersionId: TId; data: any },
    config?: AxiosRequestConfig<any>,
  ) {
    return axios.post(
      `/api/v1/kit-versions/${kitVersionId}/measures/`,
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
      `/api/v1/kit-versions/${kitVersionId}/measures-change-order/`,
      data,
      config,
    );
  },
  
  update(
    {
      kitVersionId,
      measureId,
      data,
    }: { kitVersionId: TId; measureId: TId; data: any },
    config?: AxiosRequestConfig<any>,
  ) {
    return axios.put(
      `/api/v1/kit-versions/${kitVersionId}/measures/${measureId}/`,
      data,
      config,
    );
  },
};
