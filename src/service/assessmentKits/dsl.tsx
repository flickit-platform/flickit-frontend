import axios, { AxiosRequestConfig } from "axios";
import { TId } from "@/types";

export const dsl = {
  getDownloadUrl(
    { assessmentKitId }: { assessmentKitId: TId },
    config?: AxiosRequestConfig,
  ) {
    return axios.get(
      `/api/v1/assessment-kits/${assessmentKitId}/dsl-download-link/`,
      { ...(config ?? {}) },
    );
  },

  getExportUrl(
    { assessmentKitId }: { assessmentKitId: TId },
    config?: AxiosRequestConfig,
  ) {
    return axios.get(`/api/v1/assessment-kits/${assessmentKitId}/export-dsl/`, {
      ...config,
      responseType: "blob",
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  uploadFile(
    { file, expertGroupId }: { file: any; expertGroupId?: TId },
    config?: AxiosRequestConfig,
  ) {
    return axios.post(
      `/api/v1/assessment-kits/upload-dsl/`,
      { dslFile: file, expertGroupId },
      {
        ...config,
        headers: { "Content-Type": "multipart/form-data" },
      },
    );
  },

  convertExcelToDsl({ file }: { file: any }, config?: AxiosRequestConfig) {
    return axios.post(
      `/api/v1/assessment-kits/excel-to-dsl/`,
      { file },
      {
        ...config,
        responseType: "blob",
        headers: { "Content-Type": "multipart/form-data" },
      },
    );
  },

  getExcelSample(args: any, config?: AxiosRequestConfig) {
    return axios.get(`/api/v1/assessment-kits/excel-to-dsl/sample/`, {
      ...config,
    });
  },

  createKitFromDsl({ data }: { data: any }, config?: AxiosRequestConfig) {
    return axios.post(`/api/v1/assessment-kits/create-by-dsl/`, data, config);
  },

  updateKitFromDsl(
    { assessmentKitId, data }: { assessmentKitId?: TId; data: any },
    config?: AxiosRequestConfig,
  ) {
    return axios.put(
      `/api/v1/assessment-kits/${assessmentKitId}/update-by-dsl/`,
      data,
      config,
    );
  },
  deleteLegacyDslFile({ id }: { id: TId }, config?: AxiosRequestConfig) {
    return axios.delete(`/baseinfo/dsl/${id}/`, config);
  },
};
