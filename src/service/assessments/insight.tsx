import axios, { AxiosRequestConfig } from "axios";
import { TId } from "@/types";

export const insight = {
  getList(
    { assessmentId }: { assessmentId: string },
    config?: AxiosRequestConfig<any>,
  ) {
    return axios.get(`/api/v1/assessments/${assessmentId}/insights/`, config);
  },

  getOverall(
    { assessmentId }: { assessmentId: string },
    config?: AxiosRequestConfig<any>,
  ) {
    return axios.get(`/api/v1/assessments/${assessmentId}/overall-insight/`, {
      ...(config ?? {}),
    });
  },

  initOverall(
    { assessmentId }: { assessmentId: string },
    config?: AxiosRequestConfig<any>,
  ) {
    return axios.post(
      `/api/v1/assessments/${assessmentId}/init-overall-insight/`,
      config,
    );
  },

  approveOverall(
    { assessmentId }: { assessmentId: string },
    config?: AxiosRequestConfig<any>,
  ) {
    return axios.put(
      `/api/v1/assessments/${assessmentId}/approve-overall-insight/`,
      config,
    );
  },

  updateOverall(
    { assessmentId, data }: { assessmentId: string; data: any },
    config?: AxiosRequestConfig<any>,
  ) {
    return axios.post(
      `/api/v1/assessments/${assessmentId}/overall-insight/`,
      data,
      {
        ...(config ?? {}),
      },
    );
  },

  approveAll(
    { assessmentId }: { assessmentId: TId },
    config?: AxiosRequestConfig<any>,
  ) {
    return axios.put(`/api/v1/assessments/${assessmentId}/approve-insights/`, {
      ...config,
    });
  },

  generateAll(
    { assessmentId }: { assessmentId: TId },
    config?: AxiosRequestConfig<any>,
  ) {
    return axios.put(`/api/v1/assessments/${assessmentId}/generate-insights/`, {
      ...config,
    });
  },

  regenerateExpired(
    { assessmentId }: { assessmentId: TId },
    config?: AxiosRequestConfig<any>,
  ) {
    return axios.put(
      `/api/v1/assessments/${assessmentId}/regenerate-expired-insights/`,
      { ...config },
    );
  },

  approveExpired(
    { assessmentId }: { assessmentId: TId },
    config?: AxiosRequestConfig<any>,
  ) {
    return axios.put(
      `/api/v1/assessments/${assessmentId}/approve-expired-insights/`,
      { ...config },
    );
  },

  getIssues(
    { assessmentId }: { assessmentId: string },
    config?: AxiosRequestConfig<any>,
  ) {
    return axios.get(
      `/api/v1/assessments/${assessmentId}/insights-issues/`,
      config,
    );
  },
};
