import axios, { AxiosRequestConfig } from "axios";
import { TId } from "@/types";

export const info = {
  getList(
    {
      spaceId,
      assessmentKitId,
      size,
      page,
    }: {
      spaceId: string | undefined;
      assessmentKitId?: TId;
      size: number;
      page: number;
    },
    config?: AxiosRequestConfig<any>,
  ) {
    return axios.get(`/api/v1/space-assessments/`, {
      ...(config ?? {}),
      params: {
        page,
        size,
        spaceId,
        ...(assessmentKitId && { assessment_kit_id: assessmentKitId }),
      },
    });
  },

  getById(
    { assessmentId }: { assessmentId?: TId },
    config?: AxiosRequestConfig<any>,
  ) {
    return axios.get(`/api/v1/assessments/${assessmentId}`, {
      ...(config ?? {}),
    });
  },

  getProgress(
    { assessmentId }: { assessmentId: TId },
    config?: AxiosRequestConfig<any>,
  ) {
    return axios.get(`/api/v2/assessments/${assessmentId}/progress/`, config);
  },

  create({ data }: { data: any }, config?: AxiosRequestConfig<any>) {
    return axios.post(`/api/v2/assessments/`, data, config);
  },

  update(
    { id, data }: { id: any; data: any },
    config?: AxiosRequestConfig<any>,
  ) {
    return axios.put(`/api/v2/assessments/${id}/`, data, config);
  },

  remove({ id }: { id: any }, config?: AxiosRequestConfig<any>) {
    return axios.delete(`/api/v1/assessments/${id}/`, config);
  },

  migrateKitVersion(
    { assessmentId }: { assessmentId: TId },
    config?: AxiosRequestConfig<any>,
  ) {
    return axios.post(
      `/api/v1/assessments/${assessmentId}/migrate-kit-version/`,
      {
        ...config,
      },
    );
  },

  calculateMaturity(
    { assessmentId }: { assessmentId: TId },
    config?: AxiosRequestConfig<any>,
  ) {
    return axios.post(`/api/v1/assessments/${assessmentId}/calculate/`, config);
  },

  calculateConfidence(
    { assessmentId }: { assessmentId: TId },
    config?: AxiosRequestConfig<any>,
  ) {
    return axios.post(
      `/api/v1/assessments/${assessmentId}/calculate-confidence/`,
      config,
    );
  },

  getPermissions(
    { assessmentId }: { assessmentId: TId },
    config?: AxiosRequestConfig<any>,
  ) {
    return axios.get(
      `/api/v1/assessments/${assessmentId}/permissions/`,
      config,
    );
  },

  getDashboard(
    { assessmentId }: { assessmentId: TId },
    config?: AxiosRequestConfig<any>,
  ) {
    return axios.get(`/api/v1/assessments/${assessmentId}/dashboard/`, config);
  },

  assignKitCustomization(
    { assessmentId, customData }: { assessmentId: TId; customData: any },
    config?: AxiosRequestConfig<any>,
  ) {
    return axios.post(
      `/api/v1/assessments/${assessmentId}/assign-kit-custom/`,
      customData,
      config,
    );
  },

  updateAssessmentMode(
    { id, data }: { id: any; data: any },
    config?: AxiosRequestConfig<any>,
  ) {
    return axios.put(`/api/v1/assessments/${id}/mode/`, data, config);
  },
  getTargetSpaces(
    { assessmentId }: { assessmentId: TId },
    config?: AxiosRequestConfig<any>,
  ) {
    return axios.get(
      `/api/v1/assessments/${assessmentId}/move-targets`,
      config,
    );
  },
};
