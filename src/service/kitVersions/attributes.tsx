import axios, { AxiosRequestConfig } from "axios";
import { TId } from "@/types";

export const attributes = {
  getAll(
    { kitVersionId }: { kitVersionId: TId },
    config?: AxiosRequestConfig<any>,
  ) {
    return axios.get(
      `/api/v1/kit-versions/${kitVersionId}/attributes/`,
      config,
    );
  },

  create(
    { kitVersionId, data }: { kitVersionId: TId; data: any },
    config?: AxiosRequestConfig<any>,
  ) {
    return axios.post(
      `/api/v1/kit-versions/${kitVersionId}/attributes/`,
      data,
      config,
    );
  },

  update(
    {
      kitVersionId,
      attributeId,
      data,
    }: { kitVersionId: TId; attributeId: TId; data: any },
    config?: AxiosRequestConfig<any>,
  ) {
    return axios.put(
      `/api/v1/kit-versions/${kitVersionId}/attributes/${attributeId}/`,
      data,
      config,
    );
  },

  remove(
    { kitVersionId, attributeId }: { kitVersionId: TId; attributeId: TId },
    config?: AxiosRequestConfig<any>,
  ) {
    return axios.delete(
      `/api/v1/kit-versions/${kitVersionId}/attributes/${attributeId}/`,
      config,
    );
  },

  reorder(
    { kitVersionId }: { kitVersionId: TId },
    data: any,
    config?: AxiosRequestConfig<any>,
  ) {
    return axios.put(
      `/api/v1/kit-versions/${kitVersionId}/attributes-change-order/`,
      data,
      config,
    );
  },
};
