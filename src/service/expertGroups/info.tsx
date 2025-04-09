import axios, { AxiosRequestConfig } from "axios";
import { TId } from "@/types";

export const info = {
  list(args: { page: number; size: number }, config?: AxiosRequestConfig<any>) {
    const { page = 1, size = 20 } = args ?? {};
    return axios.get(`/api/v1/expert-groups/`, {
      ...(config ?? {}),
      params: { size, page: page - 1 },
    });
  },

  getById(args: { id: TId }, config?: AxiosRequestConfig<any>) {
    return axios.get(`/api/v1/expert-groups/${args.id}/`, config);
  },

  removeMember(
    args: { id: TId; userId: TId },
    config?: AxiosRequestConfig<any>,
  ) {
    return axios.delete(
      `/api/v1/expert-groups/${args.id}/members/${args.userId}/`,
      config,
    );
  },

  create(args: { data: any }, config?: AxiosRequestConfig<any>) {
    return axios.post(`/api/v1/expert-groups/`, args.data, {
      ...(config ?? {}),
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  update(args: { id: TId; data: any }, config?: AxiosRequestConfig<any>) {
    return axios.put(`/api/v1/expert-groups/${args.id}/`, args.data, {
      ...(config ?? {}),
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  markAsSeen(args: { id: TId }, config?: AxiosRequestConfig<any>) {
    return axios.put(`/api/v1/expert-groups/${args.id}/seen/`, config);
  },

  remove(args: { id: TId }, config?: AxiosRequestConfig<any>) {
    return axios.delete(`/api/v1/expert-groups/${args.id}/`, config);
  },

  getAssessmentKits(
    args: { id: TId; size: number; page: number },
    config?: AxiosRequestConfig<any>,
  ) {
    const { id, size, page } = args ?? {};
    return axios.get(`/api/v1/expert-groups/${id}/assessment-kits/`, {
      ...(config ?? {}),
      params: { size, page: page - 1 },
    });
  },
};
