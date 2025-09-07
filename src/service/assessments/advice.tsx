import axios, { AxiosRequestConfig } from "axios";

export const advice = {
  getNarration(
    { assessmentId }: { assessmentId: string },
    config?: AxiosRequestConfig<any>,
  ) {
    return axios.get(`/api/v1/assessments/${assessmentId}/advice-narration/`, {
      ...(config ?? {}),
    });
  },

  updateNarration(
    { assessmentId, data }: { assessmentId: string; data: any },
    config?: AxiosRequestConfig<any>,
  ) {
    return axios.post(
      `/api/v1/assessments/${assessmentId}/advice-narration/`,
      data,
      { ...(config ?? {}) },
    );
  },

  getPreInfo(
    { assessmentId }: { assessmentId: string },
    config?: AxiosRequestConfig<any>,
  ) {
    return axios.get(
      `/api/v1/assessments/${assessmentId}/pre-advice-info/`,
      config,
    );
  },

  create(
    {
      assessmentId,
      attributeLevelTargets,
    }: { assessmentId: string; attributeLevelTargets: any },
    config: AxiosRequestConfig<any> | undefined = {},
  ) {
    return axios.post(
      `/api/v1/assessments/${assessmentId}/advice/`,
      { attributeLevelTargets },
      config,
    );
  },

  createAI(
    {
      assessmentId,
      attributeLevelTargets,
      adviceListItems,
    }: {
      assessmentId: string;
      attributeLevelTargets: any;
      adviceListItems: any;
    },
    config: AxiosRequestConfig<any> | undefined = {},
  ) {
    return axios.post(
      `/api/v1/assessments/${assessmentId}/advice-narration-ai/`,
      { attributeLevelTargets, adviceListItems },
      config,
    );
  },

  approveAI(
    { assessmentId }: { assessmentId: string },
    config?: AxiosRequestConfig<any>,
  ) {
    return axios.put(
      `/api/v1/assessments/${assessmentId}/approve-advice-narration/`,
      { ...(config ?? {}) },
    );
  },
};
