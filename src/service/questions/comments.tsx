import axios, { AxiosRequestConfig } from "axios";
import { TId } from "@/types";

export const comments = {
  resolve(
    args: { id: TId },
    config?: AxiosRequestConfig<any>,
  ) {
    const { id } = args ?? {};
    return axios.put(`/api/v1/evidences/${id}/resolve/`, config);
  },

  getAll(
    args: { questionId: TId; assessmentId: TId; page: number; size: number },
    config?: AxiosRequestConfig<any>,
  ) {
    const { questionId, assessmentId, page, size } = args ?? {};

    return axios.get(`/api/v1/comments/`, {
      ...(config ?? {}),
      params: {
        questionId,
        assessmentId,
        page: page - 1,
        size,
      },
    });
  },
};
