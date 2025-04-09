import axios, { AxiosRequestConfig } from "axios";
import { TId } from "@/types";

export const questionImpacts = {
  create(
    { kitVersionId, data }: { kitVersionId: TId; data: any },
    config?: AxiosRequestConfig<any>,
  ) {
    return axios.post(
      `/api/v1/kit-versions/${kitVersionId}/question-impacts/`,
      data,
      config,
    );
  },

  update(
    {
      kitVersionId,
      questionImpactId,
      data,
    }: { kitVersionId: TId; questionImpactId: TId; data: any },
    config?: AxiosRequestConfig<any>,
  ) {
    return axios.put(
      `/api/v1/kit-versions/${kitVersionId}/question-impacts/${questionImpactId}/`,
      data,
      config,
    );
  },

  remove(
    {
      kitVersionId,
      questionImpactId,
    }: { kitVersionId: TId; questionImpactId: TId },
    config?: AxiosRequestConfig<any>,
  ) {
    return axios.delete(
      `/api/v1/kit-versions/${kitVersionId}/question-impacts/${questionImpactId}/`,
      config,
    );
  },
};
