import axios, { AxiosRequestConfig } from "axios";

export const report = {
  updateMetadata(
    args: { assessmentId: string; reportData: any },
    config?: AxiosRequestConfig<any>,
  ) {
    const { assessmentId, reportData } = args;
    return axios.patch(
      `/api/v1/assessments/${assessmentId}/report-metadata/`,
      reportData,
      config,
    );
  },

  getMetadata(
    args: { assessmentId: string },
    config?: AxiosRequestConfig<any>,
  ) {
    const { assessmentId } = args;
    return axios.get(
      `/api/v1/assessments/${assessmentId}/report-metadata/`,
      config,
    );
  },

  updatePublishStatus(
    args: { assessmentId: string; data: any },
    config?: AxiosRequestConfig<any>,
  ) {
    const { assessmentId, data } = args;
    return axios.put(
      `/api/v1/assessments/${assessmentId}/report-publish-status/`,
      data,
      config,
    );
  },

  getGraphical(
    args: { assessmentId: string },
    config?: AxiosRequestConfig<any>,
  ) {
    return axios.get(
      `/api/v1/assessments/${args.assessmentId}/graphical-report/`,
      config,
    );
  },
};
