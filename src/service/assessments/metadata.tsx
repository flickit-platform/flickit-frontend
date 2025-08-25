import axios, { AxiosRequestConfig } from "axios";

export const metadata = {
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
};
