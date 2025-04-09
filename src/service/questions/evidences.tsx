import axios, { AxiosRequestConfig } from "axios";
import { TId } from "@/types";

export const evidences = {
  save(
    args: {
      description: string;
      questionId: TId;
      assessmentId: TId;
      type: string;
      id?: TId;
    },
    config?: AxiosRequestConfig<any>,
  ) {
    const { description, questionId, assessmentId, type, id } = args ?? {};
    return id
      ? axios.put(`/api/v1/evidences/${id}/`, { description, type })
      : axios.post(`/api/v1/evidences/`, {
          assessmentId,
          questionId,
          type,
          description,
        });
  },

  remove(args: { id: TId }, config?: AxiosRequestConfig<any>) {
    const { id } = args ?? {};
    return axios.delete(`/api/v1/evidences/${id}/`, config);
  },

  getAll(
    args: { questionId: TId; assessmentId: TId; page: number; size: number },
    config?: AxiosRequestConfig<any>,
  ) {
    const { questionId, assessmentId, page, size } = args ?? {};
    return axios.get(`/api/v1/evidences/`, {
      ...(config ?? {}),
      params: {
        questionId,
        assessmentId,
        page: page - 1,
        size,
      },
    });
  },

  getAttachments(
    args: { evidence_id: string },
    config?: AxiosRequestConfig<any>,
  ) {
    const { evidence_id } = args ?? {};
    return axios.get(`/api/v1/evidences/${evidence_id}/attachments/`, config);
  },

  addAttachment(
    args: { evidenceId: string; data: {} },
    config?: AxiosRequestConfig<any>,
  ) {
    const { evidenceId, data } = args ?? {};
    return axios.post(`/api/v1/evidences/${evidenceId}/attachments/`, data, {
      ...(config ?? {}),
      responseType: "blob",
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  removeAttachment(
    args: { evidenceId: string; attachmentId: string },
    config?: AxiosRequestConfig<any>,
  ) {
    const { evidenceId, attachmentId } = args ?? {};
    return axios.delete(
      `/api/v1/evidences/${evidenceId}/attachments/${attachmentId}/`,
      config,
    );
  },
};
