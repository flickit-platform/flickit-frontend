import axios, { AxiosRequestConfig } from "axios";
import { TId } from "@/types";

export const maturityLevel = {
  create(
    { kitVersionId }: { kitVersionId: TId },
    data: any,
    config?: AxiosRequestConfig<any>,
  ) {
    return axios.post(
      `/api/v1/kit-versions/${kitVersionId}/maturity-levels/`,
      data,
      config,
    );
  },

  update(
    {
      kitVersionId,
      maturityLevelId,
    }: { kitVersionId: TId; maturityLevelId: TId },
    data: any,
    config?: AxiosRequestConfig<any>,
  ) {
    return axios.put(
      `/api/v1/kit-versions/${kitVersionId}/maturity-levels/${maturityLevelId}/`,
      data,
      config,
    );
  },

  remove(
    {
      kitVersionId,
      maturityLevelId,
    }: { kitVersionId: TId; maturityLevelId: TId },
    config?: AxiosRequestConfig<any>,
  ) {
    return axios.delete(
      `/api/v1/kit-versions/${kitVersionId}/maturity-levels/${maturityLevelId}`,
      config,
    );
  },

  getAll(
    { kitVersionId }: { kitVersionId: TId },
    config?: AxiosRequestConfig<any>,
  ) {
    return axios.get(
      `/api/v1/kit-versions/${kitVersionId}/maturity-levels`,
      config,
    );
  },

  changeOrder(
    { kitVersionId }: { kitVersionId: TId },
    data: any,
    config?: AxiosRequestConfig<any>,
  ) {
    return axios.put(
      `/api/v1/kit-versions/${kitVersionId}/maturity-levels-change-order/`,
      data,
      config,
    );
  },
};
