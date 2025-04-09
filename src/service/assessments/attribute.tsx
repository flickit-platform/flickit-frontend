import axios, { AxiosRequestConfig } from "axios";
import { TId } from "@/types";

export const attribute = {
  getAffectedQuestions(
    args: {
      assessmentId: TId;
      attributeId: TId;
      levelId: TId;
      sort: any;
      order: any;
      page?: any;
      size?: any;
    },
    config?: AxiosRequestConfig<any>,
  ) {
    const { assessmentId, attributeId, levelId, sort, order, page, size } =
      args ?? {};
    return axios.get(
      `/api/v1/assessments/${assessmentId}/report/attributes/${attributeId}/`,
      {
        ...(config ?? {}),
        params: {
          maturityLevelId: levelId,
          sort,
          order,
          page,
          size,
        },
      },
    );
  },

  getAttributeInsight(
    { assessmentId, attributeId }: { assessmentId: string; attributeId: TId },
    config?: AxiosRequestConfig<any>,
  ) {
    return axios.get(
      `/api/v1/assessments/${assessmentId}/attributes/${attributeId}/insight/`,
      config,
    );
  },

  generateAIInsight(
    { assessmentId, attributeId }: { assessmentId: string; attributeId: TId },
    config?: AxiosRequestConfig<any>,
  ) {
    return axios.post(
      `/api/v1/assessments/${assessmentId}/attributes/${attributeId}/ai-insight/`,
      config,
    );
  },

  getScoreState(
    args: {
      assessmentId: TId;
      attributeId: TId;
      levelId: TId;
    },
    config?: AxiosRequestConfig<any>,
  ) {
    const { assessmentId, attributeId, levelId } = args ?? {};
    return axios.get(
      `/api/v1/assessments/${assessmentId}/report/attributes/${attributeId}/stats/`,
      {
        ...(config ?? {}),
        params: { maturityLevelId: levelId },
      },
    );
  },

  getMeasures(
    args: {
      assessmentId: TId;
      attributeId: TId;
      sort: any;
      order: any;
    },
    config?: AxiosRequestConfig<any>,
  ) {
    const { assessmentId, attributeId, sort, order } = args ?? {};
    return axios.get(
      `/api/v1/assessments/${assessmentId}/attributes/${attributeId}/measures/`,
      {
        ...(config ?? {}),
        params: { sort, order },
      },
    );
  },

  approveAIInsight(
    args: {
      assessmentId: TId;
      attributeId: TId;
    },
    config?: AxiosRequestConfig<any>,
  ) {
    const { assessmentId, attributeId } = args ?? {};
    return axios.put(
      `/api/v1/assessments/${assessmentId}/attributes/${attributeId}/approve-insight/`,
      config,
    );
  },

  createAttributeInsight(
    {
      data,
      assessmentId,
      attributeId,
    }: { data: any; assessmentId: string; attributeId: TId },
    config?: AxiosRequestConfig<any>,
  ) {
    return axios.post(
      `/api/v1/assessments/${assessmentId}/attributes/${attributeId}/insight/`,
      data,
      config,
    );
  },
};
