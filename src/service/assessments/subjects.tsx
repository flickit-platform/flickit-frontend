import axios, { AxiosRequestConfig } from "axios";

export const subjects = {
  getInsight(
    { assessmentId, subjectId }: { assessmentId: string; subjectId: any },
    config?: AxiosRequestConfig<any>,
  ) {
    return axios.get(
      `/api/v1/assessments/${assessmentId}/subjects/${subjectId}/insight`,
      config,
    );
  },

  approveInsight(
    { assessmentId, subjectId }: { assessmentId: string; subjectId: any },
    config?: AxiosRequestConfig<any>,
  ) {
    return axios.put(
      `/api/v1/assessments/${assessmentId}/subjects/${subjectId}/approve-insight/`,
      config,
    );
  },

  initInsight(
    { assessmentId, subjectId }: { assessmentId: string; subjectId: any },
    config?: AxiosRequestConfig<any>,
  ) {
    return axios.post(
      `/api/v1/assessments/${assessmentId}/subjects/${subjectId}/init-insight/`,
      config,
    );
  },

  updateInsight(
    {
      assessmentId,
      data,
      subjectId,
    }: { assessmentId: string; data: any; subjectId: any },
    config?: AxiosRequestConfig<any>,
  ) {
    return axios.post(
      `/api/v1/assessments/${assessmentId}/subjects/${subjectId}/insight/`,
      data,
      config,
    );
  },
};
