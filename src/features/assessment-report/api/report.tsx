import axios, { AxiosRequestConfig } from "axios";

export const report = {
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

  getPublicGraphicalReport(
    args: { linkHash: string },
    config?: AxiosRequestConfig<any>,
  ) {
    return axios.get(`/api/v1/public/graphical-report/${args.linkHash}/`, {
      skipAuth: true,
      ...config,
    });
  },

  updateVisibilityStatus(
    args: { assessmentId: string; data: any },
    config?: AxiosRequestConfig<any>,
  ) {
    const { assessmentId, data } = args;
    return axios.put(
      `/api/v1/assessments/${assessmentId}/report-visibility-status/`,
      data,
      config,
    );
  },

  grantReportAccess(
    args: { assessmentId: any; email: any },
    config?: AxiosRequestConfig<any>,
  ) {
    return axios.post(
      `/api/v1/assessments/${args.assessmentId}/grant-report-access/`,
      { email: args.email },
      config,
    );
  },

  getReportAccessUsers(
    { assessmentId }: { assessmentId: string },
    config?: AxiosRequestConfig<any>,
  ) {
    return axios.get(
      `/api/v1/assessments/${assessmentId}/users-with-report-access/`,
      config,
    );
  },
};
